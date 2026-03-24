"use server";

import { db } from "@/db";
import { processedWebhookEvents } from "@/db/schema";

/**
 * Webhook Events Repository.
 *
 * Single responsibility: provide the atomic "claim" operation that prevents
 * duplicate Stripe webhook processing.
 *
 * This repository intentionally has no update/delete operations — the log
 * is append-only by design (records are only cleaned up by scheduled TTL
 * maintenance, never by application logic).
 */

/**
 * Attempts to atomically claim a Stripe event for processing.
 *
 * HOW IT WORKS:
 *   Executes a single SQL statement:
 *     INSERT INTO processed_webhook_events (stripe_event_id, event_type)
 *     VALUES ($1, $2)
 *     ON CONFLICT (stripe_event_id) DO NOTHING
 *     RETURNING stripe_event_id;
 *
 *   PostgreSQL evaluates the INSERT and the conflict check atomically within
 *   its own transaction. If two Vercel invocations race on the same event_id:
 *   - Worker A: INSERT succeeds → returns 1 row → proceeds with processing
 *   - Worker B: INSERT hits PK conflict → DO NOTHING → returns 0 rows → exits
 *
 *   There is no window between the two outcomes. No application mutex needed.
 *
 * @param stripeEventId  The Stripe event ID (e.g. "evt_1ABC...").
 * @param eventType      The Stripe event type (e.g. "checkout.session.completed").
 * @returns              true  → this is a new event, caller should process it
 *                       false → duplicate event, caller must exit immediately
 */
export async function claimWebhookEvent(
  stripeEventId: string,
  eventType: string
): Promise<boolean> {
  const inserted = await db
    .insert(processedWebhookEvents)
    .values({ stripeEventId, eventType })
    .onConflictDoNothing()
    .returning({
      // We only need to know IF a row was returned, not its value.
      // Selecting the PK column is the minimal viable RETURNING payload.
      stripeEventId: processedWebhookEvents.stripeEventId,
    });

  // 1 row → INSERT succeeded → new event → caller proceeds
  // 0 rows → PK conflict (DO NOTHING) → duplicate → caller exits
  return inserted.length > 0;
}
