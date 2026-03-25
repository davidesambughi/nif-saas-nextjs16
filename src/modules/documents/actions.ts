"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createDocument, getDocumentsByOrderId } from "@/repositories/document.repository";
import { getOrderById, updateOrderStatus } from "@/repositories/order.repository";
import { sendDocumentsUnderReview } from "@/services/email.service";
import type { ActionResult } from "@/types/api.types";
import type { OrderDocument } from "@/db/schema";

const ALLOWED_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "application/pdf",
];

const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB

/**
 * Document Server Actions.
 * Signs upload URLs and saves document metadata.
 */

export async function getSignedUploadUrl(
  orderId: string,
  fileName: string,
  mimeType: string,
  fileSizeBytes: number
): Promise<ActionResult<{ signedUrl: string; storagePath: string }>> {
  // Authenticate
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Not authenticated", code: "UNAUTHORIZED" };
  }

  // Validate file constraints server-side
  if (!ALLOWED_MIME_TYPES.includes(mimeType)) {
    return {
      success: false,
      error: "Invalid file type. Allowed: JPEG, PNG, PDF",
      code: "INVALID_FILE_TYPE",
    };
  }

  if (fileSizeBytes > MAX_FILE_SIZE_BYTES) {
    return {
      success: false,
      error: "File too large. Maximum size is 10MB",
      code: "FILE_TOO_LARGE",
    };
  }

  const storagePath = `orders/${orderId}/${Date.now()}_${fileName}`;

  const { data, error } = await supabase.storage
    .from("documents")
    .createSignedUploadUrl(storagePath);

  if (error || !data) {
    return { success: false, error: "Failed to create upload URL" };
  }

  return { success: true, data: { signedUrl: data.signedUrl, storagePath } };
}

export async function saveDocumentRecord(
  input: Pick<OrderDocument, "orderId" | "documentType" | "fileName" | "storagePath" | "mimeType">
): Promise<ActionResult<OrderDocument>> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Not authenticated", code: "UNAUTHORIZED" };
  }

  const doc = await createDocument(input);
  return { success: true, data: doc };
}

/**
 * Called when a customer submits their documents from the dashboard.
 * Verifies all required documents are present, then transitions the order
 * from `documents_required` → `documents_under_review` and sends a confirmation email.
 */
export async function submitDocumentsAction(orderId: string): Promise<ActionResult> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { success: false, error: "Not authenticated", code: "UNAUTHORIZED" };

  // Verify order exists and belongs to this user
  const order = await getOrderById(orderId);
  if (!order) return { success: false, error: "Order not found" };
  if (order.userId !== user.id) return { success: false, error: "Forbidden", code: "FORBIDDEN" };
  if (order.status !== "documents_required") {
    return { success: false, error: "Documents can only be submitted when status is documents_required" };
  }

  // Verify all required documents have been uploaded
  const documents = await getDocumentsByOrderId(orderId);
  const hasPassport = documents.some((d) => d.documentType === "passport");
  const hasAddress = documents.some((d) => d.documentType === "proof_of_address");

  if (!hasPassport || !hasAddress) {
    const missing = [...(!hasPassport ? ["passport"] : []), ...(!hasAddress ? ["proof of address"] : [])];
    return { success: false, error: `Please upload the missing documents: ${missing.join(", ")}` };
  }

  // Transition to documents_under_review
  await updateOrderStatus(orderId, "documents_under_review", "All documents submitted by customer");

  // Send confirmation email — non-fatal
  try {
    await sendDocumentsUnderReview({
      to: user.email!,
      customerName: order.fullName,
      orderId: order.id,
      locale: order.locale,
      serviceTier: order.serviceTier,
    });
  } catch (err) {
    console.error("[Documents] Failed to send documents_under_review email:", err);
  }

  revalidatePath("/dashboard");
  return { success: true, data: undefined };
}
