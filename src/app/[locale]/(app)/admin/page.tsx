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
          href={`/admin/orders/${order.id}` as string}
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

const STATUS_CLASS: Record<OrderStatus, string> = {
  pending_payment:        "badge badge-gray",
  payment_received:       "badge badge-blue",
  documents_required:     "badge badge-amber",
  documents_under_review: "badge badge-amber",
  nif_processing:         "badge badge-purple",
  nif_issued:             "badge badge-green",
  cancelled:              "badge badge-red",
};

const STATUS_LABEL: Record<OrderStatus, string> = {
  pending_payment:        "Pending Payment",
  payment_received:       "Payment Received",
  documents_required:     "Docs Required",
  documents_under_review: "Under Review",
  nif_processing:         "NIF Processing",
  nif_issued:             "NIF Issued ✓",
  cancelled:              "Cancelled",
};

function StatusBadge({ status }: { status: OrderStatus }) {
  return (
    <span className={STATUS_CLASS[status]}>
      {STATUS_LABEL[status]}
    </span>
  );
}

const TIER_CLASS: Record<string, string> = {
  essential: "badge badge-gray",
  standard:  "badge badge-blue",
  premium:   "badge badge-amber",
};

function TierBadge({ tier }: { tier: string }) {
  return (
    <span className={`${TIER_CLASS[tier] ?? "badge badge-gray"} capitalize`}>
      {tier}
    </span>
  );
}
