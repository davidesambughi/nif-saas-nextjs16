import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { stripe } from "@/lib/stripe";
import { env } from "@/lib/env";
import {
  updateOrderStatus,
  updateOrderStripeInfo,
  getOrderById,
} from "@/repositories/order.repository";
import { sendOrderConfirmation } from "@/services/email.service";
import type Stripe from "stripe";

/**
 * Stripe Webhook Route Handler.
 * Uses a Route Handler (not Server Action) because Stripe requires raw body access
 * for signature verification — Server Actions transform the body.
 *
 * Stripe sends: checkout.session.completed → update order status + send confirmation email.
 */
export async function POST(request: NextRequest): Promise<NextResponse> {
  const body = await request.text();
  const headersList = await headers();
  const signature = headersList.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error("[Stripe Webhook] Signature verification failed:", err);
    return NextResponse.json(
      { error: "Webhook signature verification failed" },
      { status: 400 }
    );
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const orderId = session.metadata?.orderId;

        if (!orderId) {
          console.error("[Stripe Webhook] No orderId in session metadata");
          break;
        }

        const order = await getOrderById(orderId);

        if (!order) {
          console.error(`[Stripe Webhook] Order ${orderId} not found`);
          break;
        }

        // Update Stripe payment references
        await updateOrderStripeInfo(orderId, {
          stripeSessionId: session.id,
          stripePaymentIntentId:
            typeof session.payment_intent === "string"
              ? session.payment_intent
              : null,
          amountPaid: session.amount_total ?? 0,
          currency: session.currency ?? "eur",
        });

        // Transition order status
        await updateOrderStatus(
          orderId,
          "payment_received",
          "Payment received via Stripe",
          false
        );

        // Send confirmation email
        if (session.customer_email) {
          await sendOrderConfirmation({
            to: session.customer_email,
            customerName: order.fullName,
            orderId,
            serviceTier: order.serviceTier,
            amountPaid: session.amount_total ?? 0,
          });
        }

        console.info(`[Stripe Webhook] Order ${orderId} → payment_received`);
        break;
      }

      default:
        // Unhandled event — no-op (acknowledge receipt)
        console.info(`[Stripe Webhook] Unhandled event: ${event.type}`);
    }
  } catch (err) {
    console.error("[Stripe Webhook] Handler error:", err);
    return NextResponse.json(
      { error: "Webhook handler failed" },
      { status: 500 }
    );
  }

  return NextResponse.json({ received: true });
}
