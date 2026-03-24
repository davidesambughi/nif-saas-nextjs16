import { pgTable, text, timestamp } from "drizzle-orm/pg-core";

/**
 * Drizzle schema for the Stripe webhook idempotency log.
 *
 * Mirrors `processed_webhook_events` created in migration 0001.
 * See the migration file for the full rationale behind this table.
 *
 * KEY OPERATION (in webhook-events.repository.ts):
 *
 *   INSERT INTO processed_webhook_events (stripe_event_id, event_type)
 *   VALUES ($1, $2)
 *   ON CONFLICT (stripe_event_id) DO NOTHING
 *   RETURNING stripe_event_id;
 *
 *   → 1 row returned: event is new, proceed with business logic
 *   → 0 rows returned: duplicate event, exit immediately
 */
export const processedWebhookEvents = pgTable("processed_webhook_events", {
  // Stripe event IDs are globally unique (e.g. "evt_1ABC...").
  // Primary key → implicit unique B-Tree index → atomic conflict detection.
  stripeEventId: text("stripe_event_id").primaryKey(),

  // Stored for observability dashboards and operational queries.
  // Does not affect deduplication logic.
  eventType: text("event_type").notNull(),

  // UTC timestamp for TTL-based cleanup (safe to prune after 90 days).
  processedAt: timestamp("processed_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export type ProcessedWebhookEvent =
  typeof processedWebhookEvents.$inferSelect;
