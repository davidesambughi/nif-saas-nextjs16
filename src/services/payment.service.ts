import { stripe } from "@/lib/stripe";
import { env } from "@/lib/env";
import type { ServiceTier } from "@/db/schema";

/**
 * Payment service — builds Stripe Checkout Sessions.
 * No Next.js imports — purely composable, testable in isolation.
 */

const PRICE_MAP: Record<ServiceTier, string> = {
  essential: env.STRIPE_PRICE_ID_ESSENTIAL,
  standard: env.STRIPE_PRICE_ID_STANDARD,
  premium: env.STRIPE_PRICE_ID_PREMIUM,
};

const TIER_LABELS: Record<ServiceTier, string> = {
  essential: "NIF Essential — 7 business days",
  standard: "NIF Standard — 1yr fiscal representation",
  premium: "NIF Premium — 2yr fiscal rep + 48h express",
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
