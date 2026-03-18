import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { createClient } from "@/lib/supabase/server";
import { getOrdersByUserId } from "@/repositories/order.repository";
import RealtimeDashboard from "@/modules/orders/components/RealtimeDashboard";
import type { Order } from "@/db/schema";

/**
 * Dashboard — Server Component.
 * Fetches initial orders server-side (no loading flash).
 * Passes data to RealtimeDashboard (Client Component) for live updates.
 */
export default async function DashboardPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations("dashboard");

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // proxy.ts guarantees user is authenticated — this is a safety net
  if (!user) return null;

  const orders = await getOrdersByUserId(user.id);

  return (
    <div
      className="min-h-screen py-12 px-4"
      style={{ background: "var(--color-surface)" }}
    >
      <div className="container-site max-w-4xl">
        <div className="mb-10 flex items-center justify-between">
          <div>
            <h1
              className="text-heading-xl"
              style={{ color: "var(--color-ink)" }}
            >
              {t("title")}
            </h1>
            <p className="text-sm mt-1" style={{ color: "var(--color-ink-muted)" }}>
              {t("subtitle")}
            </p>
          </div>
          <Link
            href={`/${locale}/order`}
            id="dashboard-new-order"
            className="btn btn-primary btn-sm"
          >
            + New Application
          </Link>
        </div>

        {orders.length === 0 ? (
          <div className="card p-16 text-center">
            <p className="text-4xl mb-4">📋</p>
            <h2
              className="text-lg font-semibold mb-2"
              style={{ color: "var(--color-ink)" }}
            >
              {t("noOrders")}
            </h2>
            <p
              className="text-sm mb-6"
              style={{ color: "var(--color-ink-muted)" }}
            >
              {t("noOrdersDesc")}
            </p>
            <Link
              href={`/${locale}/order`}
              className="btn btn-primary btn-sm inline-flex"
            >
              {t("startApplication")}
            </Link>
          </div>
        ) : (
          <RealtimeDashboard initialOrders={orders} locale={locale} />
        )}
      </div>
    </div>
  );
}
