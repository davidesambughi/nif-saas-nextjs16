import { Link } from "@/i18n/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { CheckCircle, Check, AlertTriangle, Clock } from "lucide-react";

export default async function OrderSuccessPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("orderSuccess");

  const nextSteps = [
    {
      key: "step1",
      title: t("step1Title"),
      desc: t("step1Desc"),
      warning: t("step1Warning"),
    },
    {
      key: "step2",
      title: t("step2Title"),
      desc: t("step2Desc"),
    },
    {
      key: "step3",
      title: t("step3Title"),
      desc: t("step3Desc"),
    },
    {
      key: "step4",
      title: t("step4Title"),
      desc: t("step4Desc"),
      warning: t("step4Warning"),
    },
  ];

  const upsells = [
    {
      key: "fiscal",
      title: t("upsellFiscalTitle"),
      desc: t("upsellFiscalDesc"),
    },
    {
      key: "niss",
      title: t("upsellNissTitle"),
      desc: t("upsellNissDesc"),
    },
    {
      key: "bank",
      title: t("upsellBankTitle"),
      desc: t("upsellBankDesc"),
    },
  ];

  return (
    <div
      className="min-h-screen py-16 px-4"
      style={{ background: "var(--color-surface)" }}
    >
      <div className="max-w-2xl mx-auto space-y-8">

        {/* ── Hero confirmation strip ── */}
        <div className="card p-10 text-center">
          <div
            className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full"
            style={{ background: "rgba(0,102,0,0.1)" }}
          >
            <CheckCircle size={32} style={{ color: "var(--color-brand-green)" }} />
          </div>
          <h1 className="text-2xl font-bold mb-3" style={{ color: "var(--color-ink)" }}>
            {t("stepComplete")}
          </h1>
          <p className="text-sm leading-relaxed" style={{ color: "var(--color-ink-muted)" }}>
            {t("subtitle")}
          </p>
        </div>

        {/* ── Compliance Roadmap ── */}
        <div className="card p-8">
          <h2 className="text-lg font-bold mb-6" style={{ color: "var(--color-ink)" }}>
            {t("whatsNextTitle")}
          </h2>

          {/* Vertical timeline */}
          <div className="relative">
            {/* Connector line */}
            <div
              className="absolute top-6 bottom-6 w-px"
              style={{
                left: 23,
                background: "linear-gradient(to bottom, var(--color-brand-green), var(--color-border))",
                opacity: 0.3,
              }}
            />

            <div className="space-y-6">
              {/* Step 0 — done */}
              <div className="relative flex gap-5">
                <div
                  className="relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-sm font-bold"
                  style={{
                    background: "var(--color-brand-green)",
                    color: "white",
                    boxShadow: "0 0 0 4px oklch(42% 0.12 152 / 0.12)",
                  }}
                >
                  <Check size={18} />
                </div>
                <div className="flex-1 pt-2.5">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <h3 className="text-base font-semibold" style={{ color: "var(--color-ink)" }}>
                      {t("step0Title")}
                    </h3>
                    <span
                      className="rounded-full px-2.5 py-0.5 text-xs font-bold"
                      style={{
                        background: "oklch(42% 0.12 152 / 0.1)",
                        color: "var(--color-brand-green)",
                        border: "1px solid oklch(42% 0.12 152 / 0.2)",
                      }}
                    >
                      {t("step0Status")}
                    </span>
                  </div>
                </div>
              </div>

              {/* Steps 1–4 — upcoming */}
              {nextSteps.map((step, i) => (
                <div key={step.key} className="relative flex gap-5">
                  <div
                    className="relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-sm font-bold"
                    style={{
                      background: "var(--color-surface)",
                      border: "1.5px solid var(--color-border)",
                      color: "var(--color-ink-muted)",
                    }}
                  >
                    {i + 1}
                  </div>
                  <div className="flex-1 pt-2.5">
                    <h3 className="text-base font-semibold mb-1" style={{ color: "var(--color-ink)" }}>
                      {step.title}
                    </h3>
                    <p className="text-sm leading-relaxed mb-2" style={{ color: "var(--color-ink-muted)" }}>
                      {step.desc}
                    </p>
                    {"warning" in step && step.warning && (
                      <div
                        className="inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-semibold"
                        style={{
                          background: "oklch(75% 0.15 75 / 0.1)",
                          color: "var(--color-gold)",
                          border: "1px solid oklch(75% 0.15 75 / 0.2)",
                        }}
                      >
                        <AlertTriangle size={12} />
                        {step.warning}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>


        </div>

        {/* ── IFICI urgency callout ── */}
        <div
          className="rounded-xl p-5 flex gap-3"
          style={{
            background: "oklch(75% 0.15 75 / 0.08)",
            border: "1px solid oklch(75% 0.15 75 / 0.25)",
          }}
        >
          <AlertTriangle
            size={20}
            className="shrink-0 mt-0.5"
            style={{ color: "var(--color-gold)" }}
          />
          <div>
            <p className="text-sm font-bold mb-1" style={{ color: "var(--color-gold)" }}>
              {t("ificiAlertTitle")}
            </p>
            <p className="text-sm leading-relaxed mb-2" style={{ color: "var(--color-ink-muted)" }}>
              {t("ificiAlertBody")}
            </p>
            <Link
              href="/guide/eu-citizen-portugal-checklist#ifici"
              className="text-xs font-semibold"
              style={{ color: "var(--color-gold)" }}
            >
              {t("ificiGuideLink")}
            </Link>
          </div>
        </div>

        {/* ── Upsell strip ── */}
        <div className="card p-8">
          <h2 className="text-base font-bold mb-5" style={{ color: "var(--color-ink)" }}>
            {t("upsellTitle")}
          </h2>
          <div className="grid gap-4 sm:grid-cols-3">
            {upsells.map((u) => (
              <div
                key={u.key}
                className="rounded-lg p-4 relative"
                style={{
                  background: "var(--color-surface)",
                  border: "1px solid var(--color-border)",
                }}
              >
                <span
                  className="absolute top-3 right-3 rounded-full px-2 py-0.5 text-xs font-bold"
                  style={{
                    background: "var(--color-surface-elevated)",
                    color: "var(--color-ink-muted)",
                    border: "1px solid var(--color-border)",
                  }}
                >
                  {t("upsellComingSoon")}
                </span>
                <Clock size={16} className="mb-2" style={{ color: "var(--color-ink-muted)" }} />
                <p className="text-sm font-semibold mb-1" style={{ color: "var(--color-ink)" }}>
                  {u.title}
                </p>
                <p className="text-xs leading-relaxed" style={{ color: "var(--color-ink-muted)" }}>
                  {u.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* ── Dashboard CTA ── */}
        <Link
          href="/dashboard"
          id="success-go-dashboard"
          className="btn btn-primary w-full text-center block"
        >
          {t("dashboardCta")}
        </Link>

      </div>
    </div>
  );
}
