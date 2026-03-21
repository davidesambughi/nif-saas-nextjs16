import { Link } from "@/i18n/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { XCircle } from "lucide-react";

export default async function OrderCancelPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("order");

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 py-16"
      style={{ background: "var(--color-surface)" }}
    >
      <div className="card p-10 max-w-md w-full text-center">
        <div
          className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full"
          style={{ background: "rgba(220,38,38,0.08)" }}
        >
          <XCircle size={32} style={{ color: "#dc2626" }} />
        </div>
        <h1 className="text-2xl font-bold mb-3" style={{ color: "var(--color-ink)" }}>
          {t("cancelTitle")}
        </h1>
        <p className="text-sm leading-relaxed mb-8" style={{ color: "var(--color-ink-muted)" }}>
          {t("cancelDesc")}
        </p>
        <div className="flex gap-3">
          <Link
            href="/order"
            id="cancel-retry"
            className="btn btn-primary flex-1"
          >
            {t("retryPayment")}
          </Link>
          <Link
            href="/dashboard"
            className="btn btn-secondary flex-1"
          >
            Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
