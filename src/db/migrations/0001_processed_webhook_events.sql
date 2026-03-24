-- =============================================================================
-- Migration: 0001_processed_webhook_events
-- Purpose:   Stripe webhook idempotency — prevents duplicate event processing
-- =============================================================================
--
-- PROBLEM BEING SOLVED:
-- Stripe guarantees "at-least-once" delivery. The same event (e.g.
-- checkout.session.completed) can arrive multiple times due to:
--   • Stripe retrying after a 5xx response
--   • Network timeouts before our 200 reply reaches Stripe
--   • Vercel spinning up concurrent invocations for the same request
--
-- A status-based guard alone ("is order already paid?") is NOT race-safe:
-- two concurrent workers can BOTH read status='pending_payment' before
-- either of them commits the UPDATE. Result: the order is processed twice.
--
-- SOLUTION:
-- This table acts as a distributed lock using PostgreSQL's atomicity.
-- We attempt INSERT on every incoming event. The PRIMARY KEY constraint
-- makes a duplicate INSERT raise a conflict — PostgreSQL resolves it with
-- ON CONFLICT DO NOTHING, returning 0 rows. Only the first worker to INSERT
-- proceeds; all subsequent invocations for the same event_id exit early.
-- This is atomic at the DB level — no application-level mutex needed.
--
-- MAINTENANCE:
-- Stripe stores events for 30 days. Records older than 90 days are safe
-- to prune (e.g. via a scheduled DELETE or pg_partman TTL). The index on
-- processed_at enables efficient range deletes.
-- =============================================================================

CREATE TABLE IF NOT EXISTS processed_webhook_events (

  -- Stripe event IDs are globally unique strings ("evt_1ABC...").
  -- PRIMARY KEY implicitly creates a B-Tree unique index.
  stripe_event_id  TEXT        PRIMARY KEY,

  -- The Stripe event type (e.g. "checkout.session.completed").
  -- Stored for operational visibility: we can query how many events of each
  -- type we processed without touching the business tables.
  event_type       TEXT        NOT NULL,

  -- UTC timestamp of first successful processing.
  -- Used for TTL-based cleanup and audit queries.
  processed_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()

);

-- Index for time-range queries and efficient TTL cleanup:
--   DELETE FROM processed_webhook_events WHERE processed_at < NOW() - INTERVAL '90 days';
CREATE INDEX IF NOT EXISTS idx_processed_webhook_events_processed_at
  ON processed_webhook_events (processed_at DESC);

-- Human-readable table/column documentation (visible in Supabase Studio)
COMMENT ON TABLE processed_webhook_events IS
  'Idempotency log for Stripe webhook events. '
  'PRIMARY KEY on stripe_event_id guarantees each event is processed exactly once, '
  'even under concurrent Lambda/Edge invocations. Safe to prune after 90 days.';

COMMENT ON COLUMN processed_webhook_events.stripe_event_id IS
  'Globally unique Stripe event identifier (e.g. evt_xxx). '
  'Inserting a duplicate raises a PK conflict → DO NOTHING → caller skips processing.';

COMMENT ON COLUMN processed_webhook_events.event_type IS
  'Stripe event type string (e.g. checkout.session.completed, payment_intent.payment_failed). '
  'Stored for observability — does not affect deduplication logic.';

COMMENT ON COLUMN processed_webhook_events.processed_at IS
  'Timestamp of the first (and only) successful processing of this event. '
  'Records older than 90 days can be safely deleted — Stripe event retention is 30 days.';
