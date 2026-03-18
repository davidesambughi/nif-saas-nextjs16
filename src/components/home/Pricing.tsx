"use client";

import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";
import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Check, Star } from "lucide-react";

const PLAN_FEATURES = {
  essential: ["feature1", "feature2", "feature3"],
  standard: ["feature1", "feature2", "feature3", "feature4"],
  premium: ["feature1", "feature2", "feature3", "feature4", "feature5", "feature6"],
};

export default function Pricing() {
  const t = useTranslations("pricing");
  const locale = useLocale();
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section
      id="pricing"
      className="section-pad"
      style={{ background: "var(--color-surface)" }}
    >
      <div className="container-site">
        <div className="text-center mb-14">
          <h2 className="text-heading-xl mb-4" style={{ color: "var(--color-ink)" }}>
            {t("title")}
          </h2>
          <p className="text-base max-w-md mx-auto" style={{ color: "var(--color-ink-muted)" }}>
            {t("subtitle")}
          </p>
        </div>

        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.55 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto"
        >
          {/* Essential */}
          <div className="card p-8">
            <p className="text-sm font-medium mb-2" style={{ color: "var(--color-ink-muted)" }}>
              {t("essential")}
            </p>
            <p className="text-5xl font-extrabold mb-1" style={{ color: "var(--color-ink)" }}>
              {t("essentialPrice")}
            </p>
            <p className="text-sm mb-8" style={{ color: "var(--color-ink-muted)" }}>
              {t("essentialDuration")}
            </p>
            <ul className="space-y-3 mb-8">
              {PLAN_FEATURES.essential.map((f) => (
                <li key={f} className="flex items-center gap-3 text-sm">
                  <Check size={16} style={{ color: "var(--color-brand-green)", flexShrink: 0 }} />
                  <span style={{ color: "var(--color-ink)" }}>{t(f as "feature1")}</span>
                </li>
              ))}
            </ul>
            <Link
              href={`/${locale}/order?tier=essential`}
              id="pricing-essential-cta"
              className="btn btn-secondary w-full"
              style={{ borderColor: "var(--color-brand-green)", color: "var(--color-brand-green)" }}
            >
              {t("cta")}
            </Link>
          </div>

          {/* Standard — highlighted */}
          <div
            className="relative rounded-xl p-8 text-white overflow-hidden"
            style={{ background: "var(--color-brand-green)" }}
          >
            <div
              className="absolute top-4 right-4 rounded-full px-3 py-1 text-xs font-bold flex items-center gap-1"
              style={{ background: "var(--color-brand-gold)", color: "#1a1a1a" }}
            >
              <Star size={10} fill="#1a1a1a" />
              {t("popular")}
            </div>
            <p className="text-sm font-medium mb-2" style={{ color: "rgba(255,255,255,0.8)" }}>
              {t("standard")}
            </p>
            <p className="text-5xl font-extrabold mb-1">{t("standardPrice")}</p>
            <p className="text-sm mb-8" style={{ color: "rgba(255,255,255,0.75)" }}>
              {t("standardDuration")}
            </p>
            <ul className="space-y-3 mb-8">
              {PLAN_FEATURES.standard.map((f) => (
                <li key={f} className="flex items-center gap-3 text-sm">
                  <Check size={16} style={{ color: "var(--color-brand-gold-light)", flexShrink: 0 }} />
                  <span style={{ color: "rgba(255,255,255,0.9)" }}>{t(f as "feature1")}</span>
                </li>
              ))}
            </ul>
            <Link
              href={`/${locale}/order?tier=standard`}
              id="pricing-standard-cta"
              className="btn w-full font-semibold rounded-lg py-3"
              style={{ background: "#ffffff", color: "var(--color-brand-green)" }}
            >
              {t("cta")}
            </Link>
          </div>

          {/* Premium */}
          <div className="card p-8">
            <p className="text-sm font-medium mb-2" style={{ color: "var(--color-ink-muted)" }}>
              {t("premium")}
            </p>
            <p className="text-5xl font-extrabold mb-1" style={{ color: "var(--color-ink)" }}>
              {t("premiumPrice")}
            </p>
            <p className="text-sm mb-8" style={{ color: "var(--color-ink-muted)" }}>
              {t("premiumDuration")}
            </p>
            <ul className="space-y-3 mb-8">
              {PLAN_FEATURES.premium.map((f) => (
                <li key={f} className="flex items-center gap-3 text-sm">
                  <Check size={16} style={{ color: "var(--color-brand-green)", flexShrink: 0 }} />
                  <span style={{ color: "var(--color-ink)" }}>{t(f as "feature1")}</span>
                </li>
              ))}
            </ul>
            <Link
              href={`/${locale}/order?tier=premium`}
              id="pricing-premium-cta"
              className="btn btn-secondary w-full"
              style={{ borderColor: "var(--color-brand-green)", color: "var(--color-brand-green)" }}
            >
              {t("cta")}
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
