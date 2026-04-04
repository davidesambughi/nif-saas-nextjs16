"use client";

import { useTranslations } from "next-intl";
import { m } from "framer-motion";
import { Check, AlertTriangle } from "lucide-react";

export default function ComplianceRoadmap() {
  const t = useTranslations("complianceRoadmap");

  const steps = [
    {
      key: "step0",
      title: t("step0Title"),
      desc: t("step0Desc"),
      badge: t("step0Label"),
      isOurs: true,
    },
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
  ] as const;

  return (
    <section
      id="compliance-roadmap"
      className="section-pad"
      style={{ background: "var(--color-surface-elevated)" }}
    >
      <div className="container-site">
        {/* Header */}
        <div className="text-center mb-16">
          <p className="text-xs font-bold uppercase tracking-widest mb-3 text-green">
            {t("eyebrow")}
          </p>
          <h2 className="text-heading-xl mb-4 text-ink">
            {t("title")}
          </h2>
          <p className="text-lg max-w-2xl mx-auto leading-relaxed text-ink-muted">
            {t("subtitle")}
          </p>
        </div>

        {/* Timeline */}
        <div className="relative max-w-2xl mx-auto">
          {/* Vertical connector line */}
          <div
            className="absolute top-6 bottom-6 w-px"
            style={{
              left: 23,
              background: "linear-gradient(to bottom, var(--color-green), var(--color-border))",
              opacity: 0.3,
            }}
          />

          <div>
            {steps.map((step, i) => (
              <m.div
                key={step.key}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="relative flex gap-5 pb-10 last:pb-0"
              >
                {/* Step circle */}
                <div
                  className="relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-sm font-bold"
                  style={
                    "isOurs" in step
                      ? {
                          background: "var(--color-green)",
                          color: "white",
                          boxShadow: "0 0 0 4px var(--color-green-alpha-12)",
                        }
                      : {
                          background: "var(--color-surface)",
                          border: "1.5px solid var(--color-border)",
                          color: "var(--color-ink-muted)",
                        }
                  }
                >
                  {"isOurs" in step ? <Check size={18} /> : i}
                </div>

                {/* Content */}
                <div className="flex-1 pt-2.5">
                  <div className="flex flex-wrap items-center gap-2 mb-1.5">
                    <h3 className="text-base font-semibold text-ink">
                      {step.title}
                    </h3>
                    {"badge" in step && step.badge && (
                      <span
                        className="rounded-full px-2.5 py-0.5 text-xs font-bold"
                        style={{
                          background: "var(--color-green-alpha-10)",
                          color: "var(--color-green)",
                          border: "1px solid var(--color-green-alpha-20)",
                        }}
                      >
                        {step.badge}
                      </span>
                    )}
                  </div>

                  <p className="text-sm leading-relaxed mb-2 text-ink-muted">
                    {step.desc}
                  </p>

                  {"warning" in step && step.warning && (
                    <div
                      className="inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-semibold"
                      style={{
                        background: "var(--color-gold-warm-alpha-10)",
                        color: "var(--color-gold)",
                        border: "1px solid var(--color-gold-warm-alpha-20)",
                      }}
                    >
                      <AlertTriangle size={12} />
                      {step.warning}
                    </div>
                  )}
                </div>
              </m.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
