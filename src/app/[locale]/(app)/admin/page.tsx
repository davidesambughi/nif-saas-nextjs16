import { setRequestLocale } from "next-intl/server";
import { redirect } from "@/i18n/navigation";
import { getAllOrdersAction } from "@/modules/admin/actions";
import type { OrderWithUserEmail } from "@/repositories/order.repository";
import type { OrderStatus } from "@/db/schema";
import { Link } from "@/i18n/navigation";

export default async function AdminPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const result = await getAllOrdersAction();

  if (!result.success) {
    if (result.code === "UNAUTHORIZED") redirect({ href: "/login", locale });
    if (result.code === "FORBIDDEN") redirect({ href: "/dashboard", locale });
    return <div className="p-8 text-center text-red-500">{result.error}</div>;
  }

  const orders = result.data;

  return (
    <div className="min-h-screen py-10 px-4" style={{ background: "var(--color-surface)" }}>
      <div className="max-w-6xl mx-auto">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-heading-xl" style={{ color: "var(--color-ink)" }}>
              Admin — Orders
            </h1>
            <p className="text-sm mt-1" style={{ color: "var(--color-ink-muted)" }}>
              {orders.length} total orders
            </p>
          </div>
        </div>

        {orders.length === 0 ? (
          <div className="card p-16 text-center">
            <p className="text-4xl mb-4">📭</p>
            <p style={{ color: "var(--color-ink-muted)" }}>No orders yet.</p>
          </div>
        ) : (
          <div className="card overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ borderBottom: "1px solid var(--color-border)" }}>
                  {["ID", "Customer", "Tier", "Status", "Paid", "Created", "Deadline", ""].map(
                    (h) => (
                      <th
                        key={h}
                        className="px-4 py-3 text-left font-semibold"
                        style={{ color: "var(--color-ink-muted)", background: "var(--color-surface-2)" }}
                      >
                        {h}
                      </th>
                    )
                  )}
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <AdminOrderRow key={order.id} order={order} locale={locale} />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

function AdminOrderRow({
  order,
  locale,
}: {
  order: OrderWithUserEmail;
  locale: string;
}) {
  return (
    <tr
      style={{ borderBottom: "1px solid var(--color-border)" }}
      className="hover:bg-[var(--color-surface-2)] transition-colors"
    >
      <td className="px-4 py-3 font-mono text-xs" style={{ color: "var(--color-ink-muted)" }}>
        {order.id.slice(0, 8).toUpperCase()}
      </td>
      <td className="px-4 py-3">
        <div className="font-medium" style={{ color: "var(--color-ink)" }}>
          {order.fullName}
        </div>
        <div className="text-xs" style={{ color: "var(--color-ink-muted)" }}>
          {order.userEmail}
        </div>
      </td>
      <td className="px-4 py-3">
        <TierBadge tier={order.serviceTier} />
      </td>
      <td className="px-4 py-3">
        <StatusBadge status={order.status} />
      </td>
      <td className="px-4 py-3" style={{ color: "var(--color-ink)" }}>
        {order.amountPaid ? `€${(order.amountPaid / 100).toFixed(2)}` : "—"}
      </td>
      <td className="px-4 py-3 text-xs" style={{ color: "var(--color-ink-muted)" }}>
        {new Date(order.createdAt).toLocaleDateString("en-GB")}
      </td>
      <td className="px-4 py-3 text-xs" style={{ color: "var(--color-ink-muted)" }}>
        {order.deadlineAt
          ? new Date(order.deadlineAt).toLocaleDateString("en-GB")
          : "—"}
      </td>
      <td className="px-4 py-3">
        <Link
          href={`/admin/orders/${order.id}` as any}
          locale={locale}
          className="btn btn-sm"
          style={{ fontSize: "0.75rem", padding: "0.25rem 0.75rem" }}
        >
          View →
        </Link>
      </td>
    </tr>
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

function StatusBadge({ status }: { status: OrderStatus }) {
  const s = STATUS_STYLES[status];
  return (
    <span
      className="inline-block rounded-full px-2 py-0.5 text-xs font-semibold"
      style={{ background: s.bg, color: s.text }}
    >
      {s.label}
    </span>
  );
}

const TIER_STYLES: Record<string, { bg: string; text: string }> = {
  essential: { bg: "#f1f5f9", text: "#334155" },
  standard:  { bg: "#dbeafe", text: "#1e40af" },
  premium:   { bg: "#fef3c7", text: "#92400e" },
};

function TierBadge({ tier }: { tier: string }) {
  const s = TIER_STYLES[tier] ?? { bg: "#f1f5f9", text: "#334155" };
  return (
    <span
      className="inline-block rounded-full px-2 py-0.5 text-xs font-semibold capitalize"
      style={{ background: s.bg, color: s.text }}
    >
      {tier}
    </span>
  );
}
