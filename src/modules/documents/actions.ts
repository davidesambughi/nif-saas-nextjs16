"use server";

import { createClient } from "@/lib/supabase/server";
import { createDocument } from "@/repositories/document.repository";
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
