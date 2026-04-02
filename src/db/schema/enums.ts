import { pgEnum } from "drizzle-orm/pg-core";

/**
 * PostgreSQL ENUM for order lifecycle status.
 * Ordered to match the customer-facing progress stepper.
 */
export const orderStatusEnum = pgEnum("order_status", [
  "pending_payment",
  "payment_received",
  "documents_required",
  "documents_under_review",
  "nif_processing",
  "nif_issued",
  "cancelled",
]);

export const serviceTierEnum = pgEnum("service_tier", [
  "essential",
  "standard",
  "premium",
]);

export const documentTypeEnum = pgEnum("document_type", [
  "passport",
  "proof_of_address",
  "other",
]);

/**
 * AI review verdict for a single uploaded document.
 * - pending: AI hasn't run yet (default on upload)
 * - approved: AI found no issues
 * - flagged: AI found something suspicious (expired, name mismatch, wrong type…)
 * - error: AI call failed — admin must review manually
 *
 * WHY a pgEnum instead of plain text?
 * PostgreSQL enforces valid values at the DB level — you can never accidentally
 * insert "APPROVED" (wrong case) or "ok" (wrong value). It's a contract between
 * the app and the database. The trade-off: adding a new status requires a migration.
 */
export const aiReviewStatusEnum = pgEnum("ai_review_status", [
  "pending",
  "approved",
  "flagged",
  "error",
]);
