import type Stripe from "stripe";
import { stripe } from "@/lib/stripe";
import { env } from "@/lib/env";
import type { ServiceTier } from "@/db/schema";
import {
  getOrderById,
  updateOrderStripeInfo,
  updateOrderStatus,
} from "@/repositories/order.repository";
import { claimWebhookEvent } from "@/repositories/webhook-events.repository";
import { sendOrderConfirmation } from "@/services/email.service";

// =============================================================================
// Price configuration
// =============================================================================

/**
 * Maps each service tier to its Stripe Price ID.
 * Used when creating Checkout Sessions.
 */
const PRICE_ID_MAP: Record<ServiceTier, string> = {
  essential: env.STRIPE_PRICE_ID_ESSENTIAL,
  standard: env.STRIPE_PRICE_ID_STANDARD,
  premium: env.STRIPE_PRICE_ID_PREMIUM,
};

/**
 * Maps each service tier to its expected payment amount in euro cents.
 *
 * SECURITY RATIONALE:
 * We cross-check this against `session.amount_total` reported by Stripe in
 * the webhook. Although a customer cannot directly manipulate a server-side
 * Checkout Session, this validation catches two real failure modes:
 *   1. Misconfiguration — a Stripe Price object was accidentally set to the
 *      wrong amount (e.g. €7.90 instead of €79.00).
 *   2. Code bug — `PRICE_ID_MAP` points to the wrong Price for a given tier.
 *
 * If the amounts diverge we log a CRITICAL error and halt — the order stays
 * in `pending_payment` so the operations team can investigate and manually
 * correct it. We never silently accept an unexpected amount.
 */
const EXPECTED_AMOUNT_CENTS: Record<ServiceTier, number> = {
  essential: 7_900, //  €79.00
  standard: 12_900, // €129.00
  premium: 19_900, //  €199.00
};

/** Type guard: ensures a raw metadata string is a valid ServiceTier. */
function isServiceTier(value: unknown): value is ServiceTier {
  return (
    typeof value === "string" &&
    Object.keys(EXPECTED_AMOUNT_CENTS).includes(value)
  );
}

// =============================================================================
// Checkout session creation
// =============================================================================

export async function createCheckoutSession({
  orderId,
  userId,
  customerEmail,
  serviceTier,
  successUrl,
  cancelUrl,
}: {
  orderId: string;
  userId: string;
  customerEmail: string;
  serviceTier: ServiceTier;
  successUrl: string;
  cancelUrl: string;
}): Promise<{ url: string }> {
  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    line_items: [
      {
        price: PRICE_ID_MAP[serviceTier],
        quantity: 1,
      },
    ],
    customer_email: customerEmail,
    metadata: {
      // These fields are read back in the webhook handler.
      // Keep them in sync with processSuccessfulCheckout().
      orderId,
      userId,
      serviceTier,
    },
    success_url: successUrl,
    cancel_url: cancelUrl,
    payment_intent_data: {
      // Duplicated on the PaymentIntent so payment_intent.payment_failed
      // events can also be mapped back to an order.
      metadata: { orderId, userId },
    },
    invoice_creation: {
      enabled: true,
    },
  });

  if (!session.url) {
    throw new Error("Stripe did not return a checkout URL");
  }

  return { url: session.url };
}

// =============================================================================
// Webhook dispatcher
// =============================================================================

/**
 * Main entry point for all Stripe webhook events.
 *
 * IDEMPOTENCY — TWO-LAYER DEFENCE IN DEPTH:
 *
 * ┌─────────────────────────────────────────────────────────────────────────┐
 * │  Layer 1 — Event-level dedup (this function)                            │
 * │                                                                         │
 * │  claimWebhookEvent() executes:                                          │
 * │    INSERT INTO processed_webhook_events ... ON CONFLICT DO NOTHING      │
 * │    RETURNING stripe_event_id                                            │
 * │                                                                         │
 * │  PostgreSQL evaluates the INSERT atomically. If two Vercel workers race │
 * │  on the same event_id, exactly one INSERT succeeds; the other sees 0   │
 * │  rows returned and exits immediately. No mutex required.                │
 * │                                                                         │
 * │  This is the PRIMARY guard. It stops duplicates before any business     │
 * │  logic runs.                                                            │
 * └─────────────────────────────────────────────────────────────────────────┘
 * ┌─────────────────────────────────────────────────────────────────────────┐
 * │  Layer 2 — Order-state guard (processSuccessfulCheckout)                │
 * │                                                                         │
 * │  Even if Layer 1 fails (e.g. the processed_webhook_events table was    │
 * │  accidentally truncated), the order status check                        │
 * │  (order.status !== 'pending_payment') prevents double-processing.      │
 * │  Belt-and-suspenders: independent of Layer 1's DB table.               │
 * └─────────────────────────────────────────────────────────────────────────┘
 */
export async function handleWebhook(event: Stripe.Event): Promise<void> {
  console.info(`[Payment] Received ${event.type} (${event.id})`);

  // Layer 1: atomic event-level idempotency check.
  // Must run BEFORE any business logic — if this returns false, exit immediately.
  const isNew = await claimWebhookEvent(event.id, event.type);

  if (!isNew) {
    // This is a Stripe retry or a duplicate delivery. Safe to acknowledge
    // with 200 (the route handler returns { received: true } regardless).
    console.info(`[Payment] Duplicate event ${event.id} — already processed, skipping`);
    return;
  }

  switch (event.type) {
    case "checkout.session.completed":
      await processSuccessfulCheckout(
        event.data.object as Stripe.Checkout.Session
      );
      break;

    case "payment_intent.payment_failed":
      await processFailedPayment(
        event.data.object as Stripe.PaymentIntent
      );
      break;

    default:
      // Unhandled events are acknowledged without processing.
      // Stripe stops retrying once it receives a 200.
      console.info(`[Payment] Unhandled event type: ${event.type}`);
  }
}

// =============================================================================
// Event handlers (private)
// =============================================================================

/**
 * Handles `checkout.session.completed`.
 *
 * Called only after Layer 1 idempotency has already passed. Still performs
 * a Layer 2 order-state check as independent defence-in-depth.
 *
 * Sequence:
 *   1. Validate metadata fields are present
 *   2. Confirm order exists in DB
 *   3. Layer 2: order-state guard
 *   4. Validate amount paid matches expected tier price  ← NEW
 *   5. Persist Stripe references (session ID, payment intent ID, amount)
 *   6. Transition order status + append audit log
 *   7. Send confirmation email (non-fatal on failure)
 */
async function processSuccessfulCheckout(
  session: Stripe.Checkout.Session
): Promise<void> {
  // ── 1. Validate required metadata ────────────────────────────────────────
  const { orderId, serviceTier: rawTier } = session.metadata ?? {};

  if (!orderId) {
    // This should never happen if createCheckoutSession() is always used.
    // If it does, it's a code bug — log loudly so it surfaces in error tracking.
    console.error("[Payment] CRITICAL: No orderId in session metadata", {
      sessionId: session.id,
    });
    return;
  }

  if (!isServiceTier(rawTier)) {
    console.error("[Payment] CRITICAL: Invalid or missing serviceTier in metadata", {
      sessionId: session.id,
      rawTier,
    });
    return;
  }

  const serviceTier: ServiceTier = rawTier;

  // ── 2. Confirm order exists ───────────────────────────────────────────────
  const order = await getOrderById(orderId);

  if (!order) {
    console.error(`[Payment] Order ${orderId} not found in DB`, {
      sessionId: session.id,
    });
    return;
  }

  // ── 3. Layer 2: order-state guard ────────────────────────────────────────
  // Independent of the event-log table. Prevents double-processing if
  // processed_webhook_events is unavailable or the table was truncated.
  if (order.status !== "pending_payment") {
    console.warn(
      `[Payment] Layer 2 guard fired for order ${orderId} (status: ${order.status}). ` +
        `Layer 1 passed but order is already beyond pending_payment. ` +
        `Check processed_webhook_events table integrity.`
    );
    return;
  }

  // ── 4. Amount validation ─────────────────────────────────────────────────
  //
  // We verify that what Stripe charged matches what we expected for this tier.
  //
  // IMPORTANT: `session.amount_total` is the amount Stripe actually collected,
  // expressed in the smallest currency unit (euro cents). We compare it against
  // EXPECTED_AMOUNT_CENTS[serviceTier] which is our source of truth.
  //
  // On mismatch: halt processing and leave the order in pending_payment.
  // The operations team can manually investigate and correct the order.
  // We NEVER silently accept an unexpected amount.
  const amountPaid = session.amount_total ?? 0;
  const expectedAmount = EXPECTED_AMOUNT_CENTS[serviceTier];

  if (amountPaid !== expectedAmount) {
    console.error(
      `[Payment] CRITICAL: Amount mismatch for order ${orderId}. ` +
        `Tier: ${serviceTier}. ` +
        `Expected: ${expectedAmount} cents (€${(expectedAmount / 100).toFixed(2)}). ` +
        `Received: ${amountPaid} cents (€${(amountPaid / 100).toFixed(2)}). ` +
        `Stripe session: ${session.id}. ` +
        `Order left in pending_payment — manual review required.`
      // TODO Sprint 3: fire an alert to Slack / PagerDuty here
    );
    return;
  }

  // ── 5. Persist Stripe references ─────────────────────────────────────────
  // Written first so Stripe data is available even if the status update fails.
  await updateOrderStripeInfo(orderId, {
    stripeSessionId: session.id,
    stripePaymentIntentId:
      typeof session.payment_intent === "string"
        ? session.payment_intent
        : null,
    amountPaid,
    currency: session.currency ?? "eur",
  });

  // ── 6. Transition order status ────────────────────────────────────────────
  // Atomic transaction: updates orders.status AND inserts a status_updates row.
  // The status_updates INSERT triggers the Supabase Realtime subscription
  // that pushes a live update to the customer's dashboard.
  await updateOrderStatus(
    orderId,
    "payment_received",
    `Payment of €${(amountPaid / 100).toFixed(2)} confirmed via Stripe`,
    false
  );

  // ── 7. Send confirmation email ────────────────────────────────────────────
  // Non-fatal: a Resend outage must not fail the webhook and trigger Stripe
  // retries (which would attempt to re-process an already-completed order).
  // TODO Sprint 2: persist failed emails to email_log for scheduled retry.
  if (session.customer_email) {
    try {
      await sendOrderConfirmation({
        to: session.customer_email,
        customerName: order.fullName,
        orderId,
        serviceTier: order.serviceTier,
        amountPaid,
      });
      console.info(
        `[Payment] Confirmation email sent to ${session.customer_email}`
      );
    } catch (emailError) {
      console.error("[Payment] Failed to send confirmation email:", emailError);
    }
  }

  console.info(
    `[Payment] Order ${orderId} → payment_received ✓ ` +
      `(€${(amountPaid / 100).toFixed(2)}, tier: ${serviceTier})`
  );
}

/**
 * Handles `payment_intent.payment_failed`.
 *
 * This fires when a customer's payment is declined (wrong CVC, insufficient
 * funds, fraud block, etc.). Stripe Checkout keeps the session open so the
 * customer can retry with a different card — the order correctly stays in
 * `pending_payment`.
 *
 * We log structured data for operational visibility. Patterns here (e.g. a
 * BIN that fails repeatedly) may indicate fraud attempts worth investigating.
 *
 * Order status: UNCHANGED (customer can retry)
 * TODO Sprint 2:
 *   - Persist to a `payment_attempts` table for analytics
 *   - If N consecutive failures → send a "need help?" email to the customer
 */
async function processFailedPayment(
  paymentIntent: Stripe.PaymentIntent
): Promise<void> {
  const orderId = paymentIntent.metadata?.orderId ?? null;
  const errorCode = paymentIntent.last_payment_error?.code ?? "unknown";
  const errorMessage =
    paymentIntent.last_payment_error?.message ?? "No message provided";
  const declineCode =
    paymentIntent.last_payment_error?.decline_code ?? null;

  // Structured log — pick this up in Vercel runtime logs or Sentry (Sprint 3)
  console.warn("[Payment] Payment attempt failed", {
    orderId,
    paymentIntentId: paymentIntent.id,
    errorCode,
    declineCode,
    errorMessage,
  });

  // No order status update needed — the customer can retry.
  // The order remains in pending_payment until checkout.session.completed
  // fires (successful retry) or the session expires (typically 24h).
}
