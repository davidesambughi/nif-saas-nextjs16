import { setRequestLocale } from "next-intl/server";
import { redirect } from "@/i18n/navigation";
import { Link } from "@/i18n/navigation";
import { getOrderDetailAction } from "@/modules/admin/actions";
import type { OrderStatus } from "@/db/schema";
import StatusUpdateForm from "./StatusUpdateForm";

export default async function AdminOrderDetailPage({
  params,
}: {
  params: Promise<{ locale: string; orderId: string }>;
}) {
  const { locale, orderId } = await params;
  setRequestLocale(locale);

  const result = await getOrderDetailAction(orderId);

  if (!result.success) {
    if (result.code === "UNAUTHORIZED") redirect({ href: "/login", locale });
    if (result.code === "FORBIDDEN") redirect({ href: "/dashboard", locale });
    return <div className="p-8 text-center text-red-500">{result.error}</div>;
  }

  const { statusHistory, documents, ...order } = result.data;

  return (
    <div className="min-h-screen py-10 px-4" style={{ background: "var(--color-surface)" }}>
      <div className="max-w-4xl mx-auto space-y-6">

        {/* Back link */}
        <Link
          href="/admin"
          locale={locale}
          className="text-sm font-medium"
          style={{ color: "var(--color-brand-green)" }}
        >
          ← Back to all orders
        </Link>

        {/* Header */}
        <div className="card p-6">
          <div className="flex items-start justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-xl font-bold" style={{ color: "var(--color-ink)" }}>
                Order #{order.id.slice(0, 8).toUpperCase()}
              </h1>
              <p className="text-sm mt-1" style={{ color: "var(--color-ink-muted)" }}>
                Created {new Date(order.createdAt).toLocaleString("en-GB")}
              </p>
            </div>
            <StatusBadgeLarge status={order.status} />
          </div>
        </div>

        {/* Two-column layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Customer details */}
          <div className="card p-6 space-y-3">
            <h2 className="font-semibold text-sm uppercase tracking-wide" style={{ color: "var(--color-ink-muted)" }}>
              Customer
            </h2>
            <DetailRow label="Name" value={order.fullName} />
            <DetailRow label="Email" value={order.userEmail} />
            <DetailRow label="Nationality" value={order.nationality} />
            <DetailRow label="Passport" value={order.passportNumber} />
            <DetailRow label="Date of birth" value={order.dateOfBirth} />
            <DetailRow label="Address" value={order.address} />
          </div>

          {/* Order details */}
          <div className="card p-6 space-y-3">
            <h2 className="font-semibold text-sm uppercase tracking-wide" style={{ color: "var(--color-ink-muted)" }}>
              Order
            </h2>
            <DetailRow label="Tier" value={order.serviceTier} />
            <DetailRow
              label="Amount paid"
              value={order.amountPaid ? `€${(order.amountPaid / 100).toFixed(2)}` : "—"}
            />
            <DetailRow label="Locale" value={order.locale} />
            <DetailRow
              label="Deadline"
              value={order.deadlineAt ? new Date(order.deadlineAt).toLocaleDateString("en-GB") : "—"}
            />
            {order.nifNumber && (
              <DetailRow label="NIF issued" value={order.nifNumber} highlight />
            )}
          </div>
        </div>

        {/* Documents */}
        <div className="card p-6">
          <h2 className="font-semibold text-sm uppercase tracking-wide mb-4" style={{ color: "var(--color-ink-muted)" }}>
            Documents ({documents.length})
          </h2>
          {documents.length === 0 ? (
            <p className="text-sm" style={{ color: "var(--color-ink-muted)" }}>No documents uploaded yet.</p>
          ) : (
            <div className="space-y-3">
              {documents.map((doc) => (
                <div
                  key={doc.id}
                  className="rounded-lg px-4 py-3 space-y-2"
                  style={{ background: "var(--color-surface-2)", border: "1px solid var(--color-border)" }}
                >
                  {/* Row 1: doc type, filename, view button */}
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="font-medium text-sm capitalize shrink-0" style={{ color: "var(--color-ink)" }}>
                        {doc.documentType.replace("_", " ")}
                      </span>
                      <span className="text-xs truncate" style={{ color: "var(--color-ink-muted)" }}>
                        {doc.fileName}
                      </span>
                    </div>
                    {doc.signedUrl ? (
                      <a
                        href={doc.signedUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-sm shrink-0"
                        style={{ fontSize: "0.75rem", padding: "0.25rem 0.75rem" }}
                      >
                        View ↗
                      </a>
                    ) : (
                      <span className="text-xs shrink-0" style={{ color: "var(--color-ink-muted)" }}>
                        URL unavailable
                      </span>
                    )}
                  </div>

                  {/* Row 2: AI review badge + findings */}
                  <AiReviewPanel
                    status={doc.aiReviewStatus}
                    notes={doc.aiReviewNotes}
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Status update */}
        <div className="card p-6">
          <h2 className="font-semibold text-sm uppercase tracking-wide mb-4" style={{ color: "var(--color-ink-muted)" }}>
            Update Status
          </h2>
          <StatusUpdateForm orderId={order.id} currentStatus={order.status} locale={locale} />
        </div>

        {/* Status history */}
        <div className="card p-6">
          <h2 className="font-semibold text-sm uppercase tracking-wide mb-4" style={{ color: "var(--color-ink-muted)" }}>
            Status History
          </h2>
          <div className="space-y-2">
            {statusHistory.map((entry) => (
              <div
                key={entry.id}
                className="flex items-start justify-between text-sm"
                style={{ borderBottom: "1px solid var(--color-border)", paddingBottom: "0.5rem" }}
              >
                <div>
                  <span className="font-medium capitalize" style={{ color: "var(--color-ink)" }}>
                    {entry.status.replace(/_/g, " ")}
                  </span>
                  {entry.note && (
                    <span className="ml-2" style={{ color: "var(--color-ink-muted)" }}>
                      — {entry.note}
                    </span>
                  )}
                  {entry.isAdminAction && (
                    <span className="ml-2 text-xs font-semibold" style={{ color: "var(--color-brand-green)" }}>
                      [admin]
                    </span>
                  )}
                </div>
                <span className="text-xs ml-4 shrink-0" style={{ color: "var(--color-ink-subtle)" }}>
                  {new Date(entry.createdAt).toLocaleString("en-GB")}
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

function DetailRow({
  label,
  value,
  highlight,
  mono,
}: {
  label: string;
  value: string;
  highlight?: boolean;
  mono?: boolean;
}) {
  return (
    <div className="flex justify-between text-sm gap-4">
      <span style={{ color: "var(--color-ink-muted)" }}>{label}</span>
      <span
        className={mono ? "font-mono text-xs" : "font-medium text-right"}
        style={{ color: highlight ? "var(--color-brand-green)" : "var(--color-ink)" }}
      >
        {value}
      </span>
    </div>
  );
}

const STATUS_STYLES: Record<OrderStatus, { bg: string; text: string; label: string }> = {
  pending_payment:        { bg: "#f1f5f9", text: "#64748b", label: "Pending Payment" },
  payment_received:       { bg: "#dbeafe", text: "#1d4ed8", label: "Payment Received" },
  documents_required:     { bg: "#fef3c7", text: "#b45309", label: "Docs Required" },
  documents_under_review: { bg: "#fde68a", text: "#92400e", label: "Under Review" },
  nif_processing:         { bg: "#ede9fe", text: "#6d28d9", label: "NIF Processing" },
  nif_issued:             { bg: "#d1fae5", text: "#065f46", label: "NIF Issued ✓" },
  cancelled:              { bg: "#fee2e2", text: "#991b1b", label: "Cancelled" },
};

// ─── AI Review Panel ──────────────────────────────────────────────────────────

/**
 * Displays the AI review result for one document.
 * A Server Component — no interactivity needed, just reads and renders data.
 */
function AiReviewPanel({
  status,
  notes,
}: {
  status: string;
  notes: string | null;
}) {
  // Badge config for each possible AI verdict
  const BADGE: Record<string, { label: string; bg: string; text: string }> = {
    pending:  { label: "⏳ AI: Pending",  bg: "#f1f5f9", text: "#64748b" },
    approved: { label: "✅ AI: Approved", bg: "#d1fae5", text: "#065f46" },
    flagged:  { label: "⚠️ AI: Flagged",  bg: "#fef3c7", text: "#92400e" },
    error:    { label: "❌ AI: Error",    bg: "#fee2e2", text: "#991b1b" },
  };

  const badge = BADGE[status] ?? BADGE.error;

  // Parse the notes JSON — wrap in try/catch since it came from an AI
  let parsed: Record<string, unknown> | null = null;
  if (notes) {
    try { parsed = JSON.parse(notes); } catch { /* malformed JSON — show raw */ }
  }

  return (
    <div className="flex flex-wrap items-start gap-3">
      {/* Status badge */}
      <span
        className="inline-block rounded-full px-2 py-0.5 text-xs font-semibold shrink-0"
        style={{ background: badge.bg, color: badge.text }}
      >
        {badge.label}
      </span>

      {/* Findings — only shown when there's something useful to say */}
      {parsed && (
        <div className="text-xs space-y-0.5" style={{ color: "var(--color-ink-muted)" }}>

          {/* Error message (when AI call itself failed) */}
          {typeof parsed.error === "string" && (
            <p style={{ color: "#991b1b" }}>{parsed.error}</p>
          )}

          {/* Issues list (flagged documents) */}
          {Array.isArray(parsed.issues) && parsed.issues.length > 0 && (
            <ul className="list-disc list-inside space-y-0.5">
              {(parsed.issues as string[]).map((issue, i) => (
                <li key={i} style={{ color: "#92400e" }}>{issue}</li>
              ))}
            </ul>
          )}

          {/* Key findings row (name, date, confidence) */}
          {(typeof parsed.nameFound === "string" || typeof parsed.expiryOrIssueDate === "string" || typeof parsed.confidence === "string") && (
            <p className="flex flex-wrap gap-x-3">
              {typeof parsed.nameFound === "string" && (
                <span>Name on doc: <strong>{parsed.nameFound}</strong></span>
              )}
              {typeof parsed.expiryOrIssueDate === "string" && (
                <span>Date: <strong>{parsed.expiryOrIssueDate}</strong></span>
              )}
              {typeof parsed.confidence === "string" && (
                <span>Confidence: <strong>{parsed.confidence}</strong></span>
              )}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

function StatusBadgeLarge({ status }: { status: OrderStatus }) {
  const s = STATUS_STYLES[status];
  return (
    <span
      className="inline-block rounded-full px-3 py-1 text-sm font-semibold"
      style={{ background: s.bg, color: s.text }}
    >
      {s.label}
    </span>
  );
}
