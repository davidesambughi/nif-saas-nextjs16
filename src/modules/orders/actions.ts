"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createOrder, getOrdersByUserId } from "@/repositories/order.repository";
import { orderSchema } from "@/lib/validators/order";
import type { ActionResult } from "@/types/api.types";
import type { Order } from "@/db/schema";

/**
 * Order Server Actions.
 * Orchestration layer: validate → authenticate → call repository → revalidate cache.
 * Business logic stays in services/; DB calls stay in repositories/.
 */

export async function createOrderAction(
  formData: unknown,
  locale = "en"
): Promise<ActionResult<{ orderId: string }>> {
  // 1. Authenticate
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Not authenticated", code: "UNAUTHORIZED" };
  }

  // 2. Validate input
  const parsed = orderSchema.safeParse(formData);

  if (!parsed.success) {
    return {
      success: false,
      error: "Invalid form data",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const { fullName, nationality, passportNumber, dateOfBirth, address, serviceTier } =
    parsed.data;

  // 3. Create order record
  const order = await createOrder({
    userId: user.id,
    fullName,
    nationality,
    passportNumber,
    dateOfBirth,
    address,
    serviceTier,
    locale,
    status: "pending_payment",
  });

  // 4. Revalidate dashboard cache
  revalidatePath("/dashboard");

  return { success: true, data: { orderId: order.id } };
}

export async function getUserOrdersAction(): Promise<ActionResult<Order[]>> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Not authenticated", code: "UNAUTHORIZED" };
  }

  const orders = await getOrdersByUserId(user.id);
  return { success: true, data: orders };
}
