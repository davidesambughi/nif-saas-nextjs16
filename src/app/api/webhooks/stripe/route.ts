import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { stripe } from "@/lib/stripe";
import { env } from "@/lib/env";
import { handleWebhook } from "@/services/payment.service";
import type Stripe from "stripe";

/**
 * Stripe Webhook Route Handler.
 * Slimmed down: verification → dispatch to payment service → response.
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
    // Dispatch to service layer
    await handleWebhook(event);
  } catch (err) {
    console.error("[Stripe Webhook] Handler error:", err);
    return NextResponse.json(
      { error: "Webhook handler failed" },
      { status: 500 }
    );
  }

  return NextResponse.json({ received: true });
}
