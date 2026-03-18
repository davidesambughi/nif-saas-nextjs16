"use client";

import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";
import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Check, Zap, Clock } from "lucide-react";

const PLAN_FEATURES = {
  standard: ["feature1", "feature2", "feature3"],
  express: ["feature1", "feature2", "feature3", "feature4", "feature5"],
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
          className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto"
        >
          {/* Standard */}
          <div className="card p-8">
            <div className="flex items-center gap-2 mb-2">
              <Clock size={18} style={{ color: "var(--color-ink-muted)" }} />
              <span className="text-sm font-medium" style={{ color: "var(--color-ink-muted)" }}>
                {t("standard")}
              </span>
            </div>
            <p className="text-5xl font-extrabold mb-1" style={{ color: "var(--color-ink)" }}>
              {t("standardPrice")}
            </p>
            <p className="text-sm mb-8" style={{ color: "var(--color-ink-muted)" }}>
              {t("standardDuration")}
            </p>
            <ul className="space-y-3 mb-8">
              {PLAN_FEATURES.standard.map((f) => (
                <li key={f} className="flex items-center gap-3 text-sm">
                  <Check size={16} style={{ color: "var(--color-brand-green)", flexShrink: 0 }} />
                  <span style={{ color: "var(--color-ink)" }}>{t(f as "feature1")}</span>
                </li>
              ))}
            </ul>
            <Link
              href={`/${locale}/order?tier=standard`}
              id="pricing-standard-cta"
              className="btn btn-secondary w-full"
              style={{ borderColor: "var(--color-brand-green)", color: "var(--color-brand-green)" }}
            >
              {t("cta")}
            </Link>
          </div>

          {/* Express — highlighted */}
          <div
            className="relative rounded-xl p-8 text-white overflow-hidden"
            style={{ background: "var(--color-brand-green)" }}
          >
            {/* Popular badge */}
            <div
              className="absolute top-4 right-4 rounded-full px-3 py-1 text-xs font-bold"
              style={{ background: "var(--color-brand-gold)", color: "#1a1a1a" }}
            >
              {t("popular")}
            </div>

            <div className="flex items-center gap-2 mb-2">
              <Zap size={18} style={{ color: "rgba(255,255,255,0.7)" }} />
              <span className="text-sm font-medium" style={{ color: "rgba(255,255,255,0.8)" }}>
                {t("express")}
              </span>
            </div>
            <p className="text-5xl font-extrabold mb-1">{t("expressPrice")}</p>
            <p className="text-sm mb-8" style={{ color: "rgba(255,255,255,0.75)" }}>
              {t("expressDuration")}
            </p>
            <ul className="space-y-3 mb-8">
              {PLAN_FEATURES.express.map((f) => (
                <li key={f} className="flex items-center gap-3 text-sm">
                  <Check size={16} style={{ color: "var(--color-brand-gold-light)", flexShrink: 0 }} />
                  <span style={{ color: "rgba(255,255,255,0.9)" }}>{t(f as "feature1")}</span>
                </li>
              ))}
            </ul>
            <Link
              href={`/${locale}/order?tier=express`}
              id="pricing-express-cta"
              className="btn w-full font-semibold rounded-lg py-3"
              style={{ background: "#ffffff", color: "var(--color-brand-green)" }}
            >
              {t("cta")}
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
