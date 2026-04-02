"use server";

import { db } from "@/db";
import { orderDocuments } from "@/db/schema";
import { eq } from "drizzle-orm";
import type { NewOrderDocument, OrderDocument } from "@/db/schema";

/**
 * Document repository — all Drizzle queries for order_documents.
 */

export async function createDocument(
  data: NewOrderDocument
): Promise<OrderDocument> {
  const [doc] = await db.insert(orderDocuments).values(data).returning();
  return doc;
}

export async function getDocumentsByOrderId(
  orderId: string
): Promise<OrderDocument[]> {
  return db
    .select()
    .from(orderDocuments)
    .where(eq(orderDocuments.orderId, orderId));
}

/**
 * Persists the AI review result for a single document.
 * Called by the AI service after Gemini returns a verdict.
 *
 * WHY a dedicated function instead of a generic updateDocument()?
 * Following the repository pattern: each function has one clear purpose.
 * A generic update would accept any partial, making it easy to accidentally
 * overwrite fields like storagePath or documentType.
 */
export async function updateDocumentAiReview(
  docId: string,
  status: "approved" | "flagged" | "error",
  notes: string
): Promise<void> {
  await db
    .update(orderDocuments)
    .set({ aiReviewStatus: status, aiReviewNotes: notes })
    .where(eq(orderDocuments.id, docId));
}
