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
