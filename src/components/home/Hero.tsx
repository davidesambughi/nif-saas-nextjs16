"use client";

import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

const AZULEJO_SVG =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='60'%3E%3Cpath d='M30 2L58 30L30 58L2 30Z' fill='none' stroke='%232d6a4f' stroke-width='1.2'/%3E%3Cpath d='M30 18L42 30L30 42L18 30Z' fill='none' stroke='%232d6a4f' stroke-width='0.8'/%3E%3C/svg%3E";

export default function Hero() {
  const t = useTranslations("hero");
  const locale = useLocale();

  return (
    <section
      className="relative overflow-hidden pt-24 pb-16 md:pt-32 md:pb-28"
      style={{ background: "var(--color-surface)" }}
    >
      {/* Azulejo tile pattern */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage: `url("${AZULEJO_SVG}")`,
          backgroundRepeat: "repeat",
          opacity: 0.14,
        }}
      />

      {/* Soft radial backdrop */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 70% 60% at 5% 0%, oklch(42% 0.12 152 / 0.06) 0%, transparent 65%), " +
            "radial-gradient(ellipse 50% 40% at 95% 100%, oklch(64% 0.12 75 / 0.05) 0%, transparent 60%)",
        }}
      />

      <div className="container-site relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-12 lg:gap-16 items-center min-h-[calc(100vh-8rem)] lg:min-h-0">

          {/* ── LEFT: Content ── */}
          <div>
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-6 inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium"
              style={{
                background: "oklch(42% 0.12 152 / 0.08)",
                color: "var(--color-green-dark)",
                border: "1px solid oklch(42% 0.12 152 / 0.15)",
              }}
            >
              {t("badge")}
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 22 }}
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
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.15 }}
              className="text-lg leading-relaxed mb-10 max-w-lg"
              style={{ color: "var(--color-ink-muted)" }}
            >
              {t("subheadline")}
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.22 }}
              className="flex flex-col sm:flex-row items-start gap-4 mb-12"
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

            {/* Flags row */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.38 }}
              className="flex items-center gap-2 flex-wrap"
            >
              <span className="text-xl leading-none">🇺🇸</span>
              <span className="text-xl leading-none">🇬🇧</span>
              <span className="text-xl leading-none">🇩🇪</span>
              <span className="text-xl leading-none">🇫🇷</span>
              <span className="text-xl leading-none">🇯🇵</span>
              <span
                className="text-sm ml-1"
                style={{ color: "var(--color-ink-muted)" }}
              >
                {t("flagsText")}
              </span>
            </motion.div>
          </div>

          {/* ── RIGHT: Status tracker card ── */}
          <motion.div
            initial={{ opacity: 0, x: 28 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.65, delay: 0.25 }}
            className="hidden lg:block"
          >
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
              className="rounded-2xl p-7"
              style={{
                background: "var(--color-surface-elevated)",
                border: "1px solid var(--color-border)",
                boxShadow:
                  "0 24px 64px oklch(42% 0.12 152 / 0.12), 0 4px 16px oklch(42% 0.12 152 / 0.07)",
              }}
            >
              {/* Card header */}
              <div className="flex items-center justify-between mb-6">
                <p
                  className="text-sm font-bold"
                  style={{ color: "var(--color-ink)" }}
                >
                  Your NIF Application
                </p>
                <span
                  className="rounded-full px-2.5 py-1 text-xs font-bold uppercase tracking-wide"
                  style={{
                    background: "oklch(42% 0.12 152 / 0.1)",
                    color: "var(--color-green)",
                  }}
                >
                  In Progress
                </span>
              </div>

              {/* Steps */}
              <div className="space-y-4">
                {/* Step 1 — done */}
                <div className="flex items-start gap-3">
                  <span
                    className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white"
                    style={{ background: "var(--color-green)" }}
                  >
                    ✓
                  </span>
                  <div>
                    <p
                      className="text-sm font-semibold"
                      style={{ color: "var(--color-ink)" }}
                    >
                      Payment Received
                    </p>
                    <p
                      className="text-xs"
                      style={{ color: "var(--color-ink-muted)" }}
                    >
                      €129 · Standard Plan
                    </p>
                  </div>
                </div>

                {/* Step 2 — active */}
                <div className="flex items-start gap-3">
                  <span
                    className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full"
                    style={{
                      background: "var(--color-gold)",
                      border: "2px solid var(--color-gold)",
                    }}
                  >
                    <span className="h-2 w-2 rounded-full bg-white" />
                  </span>
                  <div>
                    <p
                      className="text-sm font-semibold"
                      style={{ color: "var(--color-ink)" }}
                    >
                      Documents Under Review
                    </p>
                    <p
                      className="text-xs"
                      style={{ color: "var(--color-ink-muted)" }}
                    >
                      Reviewing…
                    </p>
                  </div>
                </div>

                {/* Step 3 — done */}
                <div className="flex items-start gap-3">
                  <span
                    className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white"
                    style={{ background: "var(--color-green)" }}
                  >
                    ✓
                  </span>
                  <div>
                    <p
                      className="text-sm font-semibold"
                      style={{ color: "var(--color-ink)" }}
                    >
                      Submitted to Finanças
                    </p>
                    <p
                      className="text-xs"
                      style={{ color: "var(--color-ink-muted)" }}
                    >
                      By licensed fiscal rep
                    </p>
                  </div>
                </div>

                {/* Step 4 — pending */}
                <div className="flex items-start gap-3">
                  <span
                    className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full"
                    style={{ border: "2px solid var(--color-border)" }}
                  />
                  <div>
                    <p
                      className="text-sm font-semibold"
                      style={{ color: "var(--color-ink-muted)" }}
                    >
                      NIF Issued
                    </p>
                    <p
                      className="text-xs"
                      style={{ color: "var(--color-ink-subtle)" }}
                    >
                      Est. 3 days
                    </p>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div
                className="mt-6 flex items-center justify-between rounded-xl px-4 py-3"
                style={{ background: "oklch(42% 0.12 152 / 0.06)" }}
              >
                <span
                  className="text-xs font-medium"
                  style={{ color: "var(--color-green-dark)" }}
                >
                  🔒 256-bit encrypted
                </span>
                <span
                  className="text-xs font-medium"
                  style={{ color: "var(--color-green-dark)" }}
                >
                  4.9★ rated service
                </span>
              </div>
            </motion.div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
