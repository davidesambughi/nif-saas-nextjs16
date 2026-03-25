"use client";

import { useState } from "react";
import { useRouter } from "@/i18n/navigation";
import { adminUpdateOrderStatusAction } from "@/modules/admin/actions";
import type { OrderStatus } from "@/db/schema";

const ALL_STATUSES: OrderStatus[] = [
  "pending_payment",
  "payment_received",
  "documents_required",
  "documents_under_review",
  "nif_processing",
  "nif_issued",
  "cancelled",
];

const STATUS_LABELS: Record<OrderStatus, string> = {
  pending_payment:        "Pending Payment",
  payment_received:       "Payment Received",
  documents_required:     "Documents Required",
  documents_under_review: "Documents Under Review",
  nif_processing:         "NIF Processing",
  nif_issued:             "NIF Issued",
  cancelled:              "Cancelled",
};

export default function StatusUpdateForm({
  orderId,
  currentStatus,
  locale,
}: {
  orderId: string;
  currentStatus: OrderStatus;
  locale: string;
}) {
  const router = useRouter();
  const [status, setStatus] = useState<OrderStatus>(currentStatus);
  const [nifNumber, setNifNumber] = useState("");
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    const result = await adminUpdateOrderStatusAction(
      orderId,
      status,
      note,
      status === "nif_issued" ? nifNumber : undefined
    );

    setLoading(false);

    if (!result.success) {
      setError(result.error);
      return;
    }

    setSuccess(true);
    setNote("");
    router.refresh();
  }

  const isNifIssued = status === "nif_issued";
  const unchanged = status === currentStatus;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

        {/* Status selector */}
        <div>
          <label className="label text-xs" htmlFor="status-select">
            New Status
          </label>
          <select
            id="status-select"
            className="input"
            value={status}
            onChange={(e) => setStatus(e.target.value as OrderStatus)}
          >
            {ALL_STATUSES.map((s) => (
              <option key={s} value={s}>
                {STATUS_LABELS[s]}
              </option>
            ))}
          </select>
        </div>

        {/* NIF number — only shown when nif_issued is selected */}
        {isNifIssued && (
          <div>
            <label className="label text-xs" htmlFor="nif-number">
              NIF Number <span style={{ color: "red" }}>*</span>
            </label>
            <input
              id="nif-number"
              type="text"
              className="input font-mono"
              placeholder="e.g. 123456789"
              value={nifNumber}
              onChange={(e) => setNifNumber(e.target.value)}
              required
            />
          </div>
        )}
      </div>

      {/* Note */}
      <div>
        <label className="label text-xs" htmlFor="admin-note">
          Internal note (optional)
        </label>
        <input
          id="admin-note"
          type="text"
          className="input"
          placeholder="e.g. Documents verified, submitted to Finanças"
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />
      </div>

      {error && (
        <p className="text-sm font-medium" style={{ color: "#dc2626" }}>
          {error}
        </p>
      )}

      {success && (
        <p className="text-sm font-medium" style={{ color: "var(--color-brand-green)" }}>
          ✓ Status updated successfully
        </p>
      )}

      <button
        type="submit"
        disabled={loading || unchanged || (isNifIssued && !nifNumber.trim())}
        className="btn btn-primary"
        style={{ opacity: loading || unchanged ? 0.6 : 1 }}
      >
        {loading ? "Updating…" : unchanged ? "No changes" : "Update Status"}
      </button>
    </form>
  );
}
