import { Link } from "@/i18n/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { getUserOrdersAction } from "@/modules/orders/actions";
import RealtimeDashboard from "@/modules/orders/components/RealtimeDashboard";
import ChangePasswordForm from "@/modules/auth/components/ChangePasswordForm";

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
  setRequestLocale(locale);

  const t = await getTranslations("dashboard");

  // Call Module (Server Action) instead of Repository directly
  const result = await getUserOrdersAction();

  // If unauthorized, the action returns success: false
  if (!result.success) {
    if (result.code === "UNAUTHORIZED") return null;
    return (
      <div className="p-8 text-center text-red-500">
        {result.error || "Failed to load orders"}
      </div>
    );
  }

  const orders = result.data;

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
            href="/order"
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
              href="/order"
              className="btn btn-primary btn-sm inline-flex"
            >
              {t("startApplication")}
            </Link>
          </div>
        ) : (
          <RealtimeDashboard initialOrders={orders} locale={locale} />
        )}
        {/* Account section */}
        <div className="mt-12">
          <h2 className="text-base font-semibold mb-4" style={{ color: "var(--color-ink)" }}>
            Account
          </h2>
          <div className="card p-6 max-w-sm">
            <p className="text-sm font-medium mb-4" style={{ color: "var(--color-ink)" }}>
              Change password
            </p>
            <ChangePasswordForm />
          </div>
        </div>
      </div>
    </div>
  );
}
