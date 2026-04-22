import { pgTable, uuid, text, timestamp, boolean } from "drizzle-orm/pg-core";
import { orders } from "./orders";
import { users } from "./users";
import { orderStatusEnum } from "./enums";

/**
 * Immutable audit log of all status transitions for an order.
 * Drives the Realtime status dashboard — subscribed to by useRealtimeOrder hook.
 */
export const statusUpdates = pgTable("status_updates", {
  id: uuid("id").primaryKey().defaultRandom(),
  orderId: uuid("order_id")
    .notNull()
    .references(() => orders.id, { onDelete: "cascade" }),
  // Denormalized from orders.user_id — required for Supabase Realtime RLS.
  // Realtime cannot evaluate cross-table (subquery) RLS policies; a direct
  // column reference (auth.uid() = user_id) is required for event delivery.
  userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }),
  status: orderStatusEnum("status").notNull(),
  note: text("note"), // Optional message for the customer
  isAdminAction: boolean("is_admin_action").notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export type StatusUpdate = typeof statusUpdates.$inferSelect;
export type NewStatusUpdate = typeof statusUpdates.$inferInsert;
