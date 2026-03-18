"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createCheckoutSession } from "@/services/payment.service";
import { getOrderById } from "@/repositories/order.repository";
import { env } from "@/lib/env";
import type { ActionResult } from "@/types/api.types";

/**
 * Payment Server Actions.
 * Creates a Stripe Checkout Session and redirects the user.
 * Note: redirect() throws internally — do not wrap in try/catch.
 */

export async function createCheckoutSessionAction(
  orderId: string,
  locale: string
): Promise<ActionResult> {
  // Authenticate
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Not authenticated", code: "UNAUTHORIZED" };
  }

  // Verify order belongs to this user
  const order = await getOrderById(orderId);

  if (!order || order.userId !== user.id) {
    return { success: false, error: "Order not found", code: "NOT_FOUND" };
  }

  if (order.status !== "pending_payment") {
    return {
      success: false,
      error: "Order has already been paid",
      code: "ALREADY_PAID",
    };
  }

  const baseUrl = env.NEXT_PUBLIC_APP_URL;

  const { url } = await createCheckoutSession({
    orderId,
    userId: user.id,
    customerEmail: user.email!,
    serviceTier: order.serviceTier,
    successUrl: `${baseUrl}/${locale}/order/success?session_id={CHECKOUT_SESSION_ID}&order_id=${orderId}`,
    cancelUrl: `${baseUrl}/${locale}/order/cancel?order_id=${orderId}`,
  });

  // Redirect to Stripe Checkout — throws internally (Next.js redirect)
  redirect(url);
}
