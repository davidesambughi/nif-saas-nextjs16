"use server";

import { revalidatePath } from "next/cache";
import { createClient, createAdminClient } from "@/lib/supabase/server";
import {
  createDocument,
  getDocumentsByOrderId,
  updateDocumentAiReview,
} from "@/repositories/document.repository";
import { getOrderById, updateOrderStatus } from "@/repositories/order.repository";
import { sendDocumentsUnderReview } from "@/services/email.service";
import { analyzeDocument } from "@/services/document-ai.service";
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

  // AI analysis now runs per-document at upload time (see analyzeUploadedDocumentAction).
  // No need for after() here — results are already in the DB when the user submits.

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

/**
 * Analyzes a single already-uploaded document with Gemini and saves the result.
 * Called client-side immediately after each file upload so users get instant feedback.
 *
 * WHY a separate action from submitDocumentsAction?
 * The UX goal is per-document feedback at upload time, not at submit time.
 * Keeping it separate means the upload → analyze → show result cycle is
 * independent for each document slot.
 */
export async function analyzeUploadedDocumentAction(
  docId: string,
  orderId: string
): Promise<ActionResult<{ aiStatus: string; issues: string[] }>> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: "Not authenticated", code: "UNAUTHORIZED" };

  // Verify the order belongs to this user (never trust client-supplied IDs)
  const order = await getOrderById(orderId);
  if (!order || order.userId !== user.id) {
    return { success: false, error: "Forbidden", code: "FORBIDDEN" };
  }

  // Find the specific document within this order
  const documents = await getDocumentsByOrderId(orderId);
  const doc = documents.find((d) => d.id === docId);
  if (!doc) return { success: false, error: "Document not found" };

  // Generate a short-lived URL to download the file for Gemini
  // WHY createAdminClient? The regular client respects RLS (row-level security).
  // Storage RLS might block server-side reads of a user's file depending on policy.
  // The admin client uses the secret key and bypasses RLS — safe here since we've
  // already verified the order belongs to the authenticated user above.
  const supabaseAdmin = await createAdminClient();
  const { data: urlData } = await supabaseAdmin.storage
    .from("documents")
    .createSignedUrl(doc.storagePath, 120);

  if (!urlData?.signedUrl) {
    return { success: false, error: "Could not generate download URL" };
  }

  // Run the analysis (this takes 2–8 seconds — the client shows a spinner)
  const result = await analyzeDocument(doc, urlData.signedUrl, order.fullName);
  await updateDocumentAiReview(doc.id, result.status, result.notes);

  // Parse the issues list to return to the client for display
  let issues: string[] = [];
  try {
    const parsed = JSON.parse(result.notes);
    issues = Array.isArray(parsed.issues) ? parsed.issues : [];
    if (parsed.error) issues = [parsed.error];
  } catch { /* malformed notes — return empty */ }

  return { success: true, data: { aiStatus: result.status, issues } };
}
