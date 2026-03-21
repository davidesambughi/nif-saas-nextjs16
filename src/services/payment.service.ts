import type Stripe from "stripe";
import { stripe } from "@/lib/stripe";
import { env } from "@/lib/env";
import type { ServiceTier } from "@/db/schema";
import {
  getOrderById,
  updateOrderStripeInfo,
  updateOrderStatus,
} from "@/repositories/order.repository";
import { sendOrderConfirmation } from "@/services/email.service";

/**
 * Payment service — builds Stripe Checkout Sessions and handles webhooks.
 * Business logic for payments lives here.
 */

const PRICE_MAP: Record<ServiceTier, string> = {
  essential: env.STRIPE_PRICE_ID_ESSENTIAL,
  standard: env.STRIPE_PRICE_ID_STANDARD,
  premium: env.STRIPE_PRICE_ID_PREMIUM,
};

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
        price: PRICE_MAP[serviceTier],
        quantity: 1,
      },
    ],
    customer_email: customerEmail,
    metadata: {
      orderId,
      userId,
      serviceTier,
    },
    success_url: successUrl,
    cancel_url: cancelUrl,
    payment_intent_data: {
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

/**
 * Main entry point for Stripe webhooks.
 * Dispatches to specific handlers based on event type.
 */
export async function handleWebhook(event: Stripe.Event): Promise<void> {
  console.info(`[Payment Service] Handling webhook event: ${event.type}`);

  switch (event.type) {
    case "checkout.session.completed":
      await processSuccessfulCheckout(event.data.object as Stripe.Checkout.Session);
      break;

    default:
      console.info(`[Payment Service] Unhandled event type: ${event.type}`);
  }
}

/**
 * Logic for checkout.session.completed.
 * Includes idempotency check to prevent duplicate processing.
 */
async function processSuccessfulCheckout(
  session: Stripe.Checkout.Session
): Promise<void> {
  const orderId = session.metadata?.orderId;

  if (!orderId) {
    console.error("[Payment Service] No orderId in session metadata");
    return;
  }

  const order = await getOrderById(orderId);

  if (!order) {
    console.error(`[Payment Service] Order ${orderId} not found`);
    return;
  }

  // IDEMPOTENCY: If order is already processed, skip everything
  if (order.status !== "pending_payment") {
    console.info(
      `[Payment Service] Order ${orderId} already processed (status: ${order.status}). Skipping.`
    );
    return;
  }

  // 1. Update Stripe references
  await updateOrderStripeInfo(orderId, {
    stripeSessionId: session.id,
    stripePaymentIntentId:
      typeof session.payment_intent === "string"
        ? session.payment_intent
        : null,
    amountPaid: session.amount_total ?? 0,
    currency: session.currency ?? "eur",
  });

  // 2. Transition order status
  await updateOrderStatus(
    orderId,
    "payment_received",
    "Payment received via Stripe (Webhook)",
    false
  );

  // 3. Send confirmation email
  if (session.customer_email) {
    try {
      await sendOrderConfirmation({
        to: session.customer_email,
        customerName: order.fullName,
        orderId,
        serviceTier: order.serviceTier,
        amountPaid: session.amount_total ?? 0,
      });
      console.info(`[Payment Service] Confirmation email sent to ${session.customer_email}`);
    } catch (emailError) {
      // Log email error but don't fail the webhook processing
      console.error("[Payment Service] Failed to send confirmation email:", emailError);
    }
  }

  console.info(`[Payment Service] Order ${orderId} successfully transitioned to payment_received`);
}
