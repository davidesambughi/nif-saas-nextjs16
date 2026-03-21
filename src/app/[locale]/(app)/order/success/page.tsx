import { Link } from "@/i18n/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { CheckCircle } from "lucide-react";

export default async function OrderSuccessPage({
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
          style={{ background: "rgba(0,102,0,0.1)" }}
        >
          <CheckCircle size={32} style={{ color: "var(--color-brand-green)" }} />
        </div>
        <h1 className="text-2xl font-bold mb-3" style={{ color: "var(--color-ink)" }}>
          {t("successTitle")}
        </h1>
        <p className="text-sm leading-relaxed mb-8" style={{ color: "var(--color-ink-muted)" }}>
          {t("successDesc")}
        </p>
        <Link
          href="/dashboard"
          id="success-go-dashboard"
          className="btn btn-primary w-full"
        >
          Go to Dashboard →
        </Link>
      </div>
    </div>
  );
}
