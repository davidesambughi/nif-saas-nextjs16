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
  "standard",
  "express",
]);

export const documentTypeEnum = pgEnum("document_type", [
  "passport",
  "proof_of_address",
  "other",
]);
