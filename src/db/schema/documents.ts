import { pgTable, uuid, text, timestamp } from "drizzle-orm/pg-core";
import { orders } from "./orders";
import { documentTypeEnum, aiReviewStatusEnum } from "./enums";

/**
 * Documents uploaded by customers (stored in Supabase Storage).
 * storage_path is the Supabase Storage object key for signed URL generation.
 */
export const orderDocuments = pgTable("order_documents", {
  id: uuid("id").primaryKey().defaultRandom(),
  orderId: uuid("order_id")
    .notNull()
    .references(() => orders.id, { onDelete: "cascade" }),
  documentType: documentTypeEnum("document_type").notNull(),
  fileName: text("file_name").notNull(),
  storagePath: text("storage_path").notNull(), // e.g. "orders/uuid/passport.pdf"
  mimeType: text("mime_type").notNull(),
  uploadedAt: timestamp("uploaded_at", { withTimezone: true })
    .notNull()
    .defaultNow(),

  /**
   * AI review verdict for this specific document.
   * Defaults to "pending" — every uploaded document starts unreviewed.
   *
   * WHY .default("pending") instead of .notNull() with no default?
   * We insert document rows BEFORE the AI runs (the upload happens first,
   * the AI review is async). Without a default, every INSERT would need to
   * explicitly pass the status. A default makes the column self-managing.
   */
  aiReviewStatus: aiReviewStatusEnum("ai_review_status")
    .notNull()
    .default("pending"),

  /**
   * JSON string containing the AI's full findings: name match result,
   * expiry date found, issues list, etc.
   * Nullable — stays null until the AI has run.
   *
   * WHY text and not jsonb (native Postgres JSON)?
   * We never need to query inside this field from SQL — we only read the
   * whole blob and display it. jsonb would add query power we don't need.
   * If we ever needed to filter orders by "nameMatch === false", jsonb
   * would be the upgrade.
   */
  aiReviewNotes: text("ai_review_notes"),
});

export type OrderDocument = typeof orderDocuments.$inferSelect;
export type NewOrderDocument = typeof orderDocuments.$inferInsert;
