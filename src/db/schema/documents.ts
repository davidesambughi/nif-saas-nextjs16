import { pgTable, uuid, text, timestamp } from "drizzle-orm/pg-core";
import { orders } from "./orders";
import { documentTypeEnum } from "./enums";

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
});

export type OrderDocument = typeof orderDocuments.$inferSelect;
export type NewOrderDocument = typeof orderDocuments.$inferInsert;
