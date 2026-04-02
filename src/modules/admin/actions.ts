"use server";

import { revalidatePath } from "next/cache";
import { createClient, createAdminClient } from "@/lib/supabase/server";
import { env } from "@/lib/env";
import {
  getAllOrders,
  getOrderWithUserEmail,
  getStatusUpdatesByOrderId,
  updateOrderStatus,
  updateOrderNif,
  type OrderWithUserEmail,
} from "@/repositories/order.repository";
import { getDocumentsByOrderId } from "@/repositories/document.repository";
import { sendNIFIssued, sendNIFProcessing } from "@/services/email.service";
import type { ActionResult } from "@/types/api.types";
import type { OrderStatus, OrderDocument } from "@/db/schema";

// ─── Auth helper ─────────────────────────────────────────────────────────────

type AdminGuardError = { success: false; error: string; code: string };

async function requireAdmin(): Promise<
  { ok: true } | { ok: false; error: AdminGuardError }
> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      ok: false,
      error: { success: false, error: "Not authenticated", code: "UNAUTHORIZED" },
    };
  }

  if (!env.ADMIN_EMAIL || user.email !== env.ADMIN_EMAIL) {
    return {
      ok: false,
      error: { success: false, error: "Forbidden", code: "FORBIDDEN" },
    };
  }

  return { ok: true };
}

// ─── Actions ─────────────────────────────────────────────────────────────────

export async function getAllOrdersAction(): Promise<
  ActionResult<OrderWithUserEmail[]>
> {
  const auth = await requireAdmin();
  if (!auth.ok) return auth.error;

  const orders = await getAllOrders();
  return { success: true, data: orders };
}

export type OrderDetail = OrderWithUserEmail & {
  statusHistory: Awaited<ReturnType<typeof getStatusUpdatesByOrderId>>;
  documents: Array<OrderDocument & { signedUrl: string | null }>;
};

export async function getOrderDetailAction(
  orderId: string
): Promise<ActionResult<OrderDetail>> {
  const auth = await requireAdmin();
  if (!auth.ok) return auth.error;

  const order = await getOrderWithUserEmail(orderId);
  if (!order) {
    return { success: false, error: "Order not found" };
  }

  const [statusHistory, documents] = await Promise.all([
    getStatusUpdatesByOrderId(orderId),
    getDocumentsByOrderId(orderId),
  ]);

  // Generate short-lived signed URLs (1 hour) via admin client (bypasses Storage RLS)
  const supabase = await createAdminClient();
  const documentsWithUrls = await Promise.all(
    documents.map(async (doc) => {
      const { data } = await supabase.storage
        .from("documents")
        .createSignedUrl(doc.storagePath, 3600);
      return { ...doc, signedUrl: data?.signedUrl ?? null };
    })
  );

  return {
    success: true,
    data: { ...order, statusHistory, documents: documentsWithUrls },
  };
}

export async function adminUpdateOrderStatusAction(
  orderId: string,
  newStatus: OrderStatus,
  note: string,
  nifNumber?: string
): Promise<ActionResult> {
  const auth = await requireAdmin();
  if (!auth.ok) return auth.error;

  const order = await getOrderWithUserEmail(orderId);
  if (!order) {
    return { success: false, error: "Order not found" };
  }

  // NIF number is required when issuing the NIF
  if (newStatus === "nif_issued") {
    if (!nifNumber?.trim()) {
      return { success: false, error: "NIF number is required to mark as nif_issued" };
    }
    await updateOrderNif(orderId, nifNumber.trim());
  }

  await updateOrderStatus(orderId, newStatus, note || `Status updated by admin`, true);

  // Send status-specific emails — non-fatal so a Resend outage doesn't block the admin action
  if (newStatus === "nif_issued" && nifNumber) {
    try {
      await sendNIFIssued({
        to: order.userEmail,
        customerName: order.fullName,
        nifNumber: nifNumber.trim(),
        orderId: order.id,
        locale: order.locale,
      });
    } catch (err) {
      console.error("[Admin] Failed to send nif_issued email:", err);
    }
  }

  if (newStatus === "nif_processing") {
    try {
      await sendNIFProcessing({
        to: order.userEmail,
        customerName: order.fullName,
        orderId: order.id,
        locale: order.locale,
        serviceTier: order.serviceTier,
      });
    } catch (err) {
      console.error("[Admin] Failed to send nif_processing email:", err);
    }
  }

  revalidatePath("/admin");
  revalidatePath(`/admin/orders/${orderId}`);

  return { success: true, data: undefined };
}
