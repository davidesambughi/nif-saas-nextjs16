"use server";

import { db } from "@/db";
import { orders, statusUpdates, users } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import type { NewOrder, Order, OrderStatus } from "@/db/schema";

export type OrderWithUserEmail = Order & { userEmail: string };

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

/**
 * Persists the document submission deadline on an order.
 * Called only in the documents_required path of the payment webhook.
 */
export async function updateOrderDeadline(
  orderId: string,
  deadlineAt: Date
): Promise<void> {
  await db
    .update(orders)
    .set({ deadlineAt, updatedAt: new Date() })
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

/**
 * Looks up an order by its Stripe PaymentIntent ID.
 *
 * Used by the `charge.refunded` webhook handler to map a Stripe refund
 * back to the correct order. `stripePaymentIntentId` is populated during
 * `checkout.session.completed` processing — it is null for orders that
 * never reached payment_received, so this function may return null.
 */
export async function getOrderByPaymentIntentId(
  paymentIntentId: string
): Promise<Order | null> {
  const [order] = await db
    .select()
    .from(orders)
    .where(eq(orders.stripePaymentIntentId, paymentIntentId));
  return order ?? null;
}

export async function getStatusUpdatesByOrderId(orderId: string) {
  return db
    .select()
    .from(statusUpdates)
    .where(eq(statusUpdates.orderId, orderId))
    .orderBy(desc(statusUpdates.createdAt));
}

/**
 * Returns all orders joined with the customer's email — for the admin panel.
 * Sorted newest first.
 */
export async function getAllOrders(): Promise<OrderWithUserEmail[]> {
  const rows = await db
    .select({
      id: orders.id,
      userId: orders.userId,
      fullName: orders.fullName,
      nationality: orders.nationality,
      passportNumber: orders.passportNumber,
      dateOfBirth: orders.dateOfBirth,
      address: orders.address,
      serviceTier: orders.serviceTier,
      status: orders.status,
      amountPaid: orders.amountPaid,
      currency: orders.currency,
      stripeSessionId: orders.stripeSessionId,
      stripePaymentIntentId: orders.stripePaymentIntentId,
      locale: orders.locale,
      deadlineAt: orders.deadlineAt,
      nifNumber: orders.nifNumber,
      createdAt: orders.createdAt,
      updatedAt: orders.updatedAt,
      userEmail: users.email,
    })
    .from(orders)
    .leftJoin(users, eq(orders.userId, users.id))
    .orderBy(desc(orders.createdAt));

  return rows.map((r) => ({ ...r, userEmail: r.userEmail ?? "" }));
}

/**
 * Returns a single order joined with the customer's email — for the admin detail page.
 */
export async function getOrderWithUserEmail(
  orderId: string
): Promise<OrderWithUserEmail | null> {
  const [row] = await db
    .select({
      id: orders.id,
      userId: orders.userId,
      fullName: orders.fullName,
      nationality: orders.nationality,
      passportNumber: orders.passportNumber,
      dateOfBirth: orders.dateOfBirth,
      address: orders.address,
      serviceTier: orders.serviceTier,
      status: orders.status,
      amountPaid: orders.amountPaid,
      currency: orders.currency,
      stripeSessionId: orders.stripeSessionId,
      stripePaymentIntentId: orders.stripePaymentIntentId,
      locale: orders.locale,
      deadlineAt: orders.deadlineAt,
      nifNumber: orders.nifNumber,
      createdAt: orders.createdAt,
      updatedAt: orders.updatedAt,
      userEmail: users.email,
    })
    .from(orders)
    .leftJoin(users, eq(orders.userId, users.id))
    .where(eq(orders.id, orderId));

  if (!row) return null;
  return { ...row, userEmail: row.userEmail ?? "" };
}
