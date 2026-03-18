import Stripe from "stripe";
import { env } from "@/lib/env";

/**
 * Stripe SDK singleton.
 * Import this instance wherever Stripe API calls are needed — never instantiate inline.
 */
export const stripe = new Stripe(env.STRIPE_SECRET_KEY, {
  apiVersion: "2026-02-25.clover",
  typescript: true,
});
