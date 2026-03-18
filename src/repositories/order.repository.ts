"use server";

import { db } from "@/db";
import { orders, statusUpdates } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import type { NewOrder, Order, OrderStatus } from "@/db/schema";

/**
 * Order repository — all Drizzle queries for orders and status updates.
 * Server Actions call these functions; they are never called from the client.
 * This isolation means DB logic can be tested independently of Next.js.
 */

export async function createOrder(data: NewOrder): Promise<Order> {
  const [order] = await db.insert(orders).values(data).returning();
  return order;
}

export async function getOrderById(id: string): Promise<Order | null> {
  const [order] = await db.select().from(orders).where(eq(orders.id, id));
  return order ?? null;
}

export async function getOrdersByUserId(userId: string): Promise<Order[]> {
  return db
    .select()
    .from(orders)
    .where(eq(orders.userId, userId))
    .orderBy(desc(orders.createdAt));
}

export async function updateOrderStatus(
  orderId: string,
  status: OrderStatus,
  note?: string,
  isAdminAction = false
): Promise<void> {
  await db.transaction(async (tx) => {
    // Update the order's current status
    await tx
      .update(orders)
      .set({ status, updatedAt: new Date() })
      .where(eq(orders.id, orderId));

    // Append an immutable audit log entry (drives Realtime subscription)
    await tx.insert(statusUpdates).values({
      orderId,
      status,
      note,
      isAdminAction,
    });
  });
}

export async function updateOrderStripeInfo(
  orderId: string,
  data: {
    stripeSessionId: string;
    stripePaymentIntentId: string | null;
    amountPaid: number;
    currency: string;
  }
): Promise<void> {
  await db
    .update(orders)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(orders.id, orderId));
}

export async function updateOrderNif(
  orderId: string,
  nifNumber: string
): Promise<void> {
  await db
    .update(orders)
    .set({ nifNumber, updatedAt: new Date() })
    .where(eq(orders.id, orderId));
}

export async function getStatusUpdatesByOrderId(orderId: string) {
  return db
    .select()
    .from(statusUpdates)
    .where(eq(statusUpdates.orderId, orderId))
    .orderBy(desc(statusUpdates.createdAt));
}
