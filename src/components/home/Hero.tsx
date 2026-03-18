"use client";

import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle } from "lucide-react";

const STATS = [
  { value: "2,000+", key: "statsNifs" },
  { value: "45+", key: "statsCountries" },
  { value: "5.2", key: "statsDays" },
  { value: "4.9★", key: "statsRating" },
];

export default function Hero() {
  const t = useTranslations("hero");
  const locale = useLocale();

  return (
    <section
      className="relative overflow-hidden pt-28 pb-20"
      style={{ background: "var(--color-surface)" }}
    >
      {/* Decorative background blobs */}
      <div
        className="pointer-events-none absolute -top-40 -right-40 h-[600px] w-[600px] rounded-full opacity-10"
        style={{
          background:
            "radial-gradient(circle, var(--color-brand-green) 0%, transparent 70%)",
        }}
      />
      <div
        className="pointer-events-none absolute top-60 -left-20 h-[400px] w-[400px] rounded-full opacity-6"
        style={{
          background:
            "radial-gradient(circle, var(--color-brand-gold) 0%, transparent 70%)",
        }}
      />

      <div className="container-site relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          {/* Trust badge */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-6 inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium"
            style={{
              background: "rgba(0,102,0,0.08)",
              color: "var(--color-brand-green-dark)",
              border: "1px solid rgba(0,102,0,0.15)",
            }}
          >
            <CheckCircle size={15} />
            {t("badge")}
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.08 }}
            className="text-display mb-6"
            style={{ color: "var(--color-ink)" }}
          >
            {t("headline")}
            <br />
            <span className="text-gradient-brand">{t("headlineAccent")}</span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.15 }}
            className="text-lg leading-relaxed mb-10 max-w-xl mx-auto"
            style={{ color: "var(--color-ink-muted)" }}
          >
            {t("subheadline")}
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.22 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link
              href={`/${locale}/order`}
              id="hero-cta-primary"
              className="btn btn-primary btn-lg"
            >
              {t("ctaPrimary")}
              <ArrowRight size={18} />
            </Link>
            <a
              href="#how-it-works"
              id="hero-cta-secondary"
              className="btn btn-secondary btn-lg"
            >
              {t("ctaSecondary")}
            </a>
          </motion.div>
        </div>

        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.35 }}
          className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-6"
        >
          {STATS.map(({ value, key }, i) => (
            <div
              key={key}
              className="card text-center py-6 px-4"
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              <p
                className="text-3xl font-bold mb-1"
                style={{ color: "var(--color-brand-green)" }}
              >
                {value}
              </p>
              <p
                className="text-xs font-medium uppercase tracking-wider"
                style={{ color: "var(--color-ink-muted)" }}
              >
                {t(key as "statsNifs")}
              </p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
