import {
  pgTable,
  uuid,
  text,
  integer,
  timestamp,
} from "drizzle-orm/pg-core";
import { orderStatusEnum, serviceTierEnum } from "./enums";
import { users } from "./users";

/**
 * Core orders table.
 * Each row represents one NIF application.
 * Status transitions are tracked in status_updates — orders only stores current state.
 */
export const orders = pgTable("orders", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),

  // Customer personal information (captured from order form)
  fullName: text("full_name").notNull(),
  nationality: text("nationality").notNull(),
  passportNumber: text("passport_number").notNull(),
  dateOfBirth: text("date_of_birth").notNull(), // ISO-8601 string
  address: text("address").notNull(),

  // Service & payment
  serviceTier: serviceTierEnum("service_tier").notNull().default("standard"),
  status: orderStatusEnum("status").notNull().default("pending_payment"),
  amountPaid: integer("amount_paid"), // in cents
  currency: text("currency").default("eur"),

  // Stripe references — populated by webhook
  stripeSessionId: text("stripe_session_id"),
  stripePaymentIntentId: text("stripe_payment_intent_id"),

  // UI locale at order creation time — persisted so async processes
  // (webhooks, admin actions) can build locale-correct deep-links in emails.
  // Defaults to 'en' for backwards-compatibility with any existing rows.
  locale: text("locale").notNull().default("en"),

  // Document submission deadline — set at payment time in the documents_required
  // path only. Null for orders where documents were submitted before payment
  // (documents_under_review path) or orders not yet paid.
  deadlineAt: timestamp("deadline_at", { withTimezone: true }),

  // NIF result — populated by admin when issued
  nifNumber: text("nif_number"),

  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export type Order = typeof orders.$inferSelect;
export type NewOrder = typeof orders.$inferInsert;
export type OrderStatus = (typeof orderStatusEnum.enumValues)[number];
export type ServiceTier = (typeof serviceTierEnum.enumValues)[number];
