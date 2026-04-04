"use client";

import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { m } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { AZULEJO_SVG_GREEN } from "@/lib/constants/assets";

export default function Hero() {
  const t = useTranslations("hero");

  return (
    <section
      className="relative overflow-hidden pt-24 pb-16 md:pt-32 md:pb-28 bg-surface"
    >
      {/* Azulejo tile pattern */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage: `url("${AZULEJO_SVG_GREEN}")`,
          backgroundRepeat: "repeat",
          opacity: 0.14,
        }}
      />

      {/* Soft radial backdrop */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            `radial-gradient(ellipse 70% 60% at 5% 0%, var(--color-green-alpha-6) 0%, transparent 65%), ` +
            `radial-gradient(ellipse 50% 40% at 95% 100%, var(--color-gold-alpha-5) 0%, transparent 60%)`,
        }}
      />

      <div className="container-site relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-12 lg:gap-16 items-start min-h-[calc(100vh-8rem)] lg:min-h-0">

          {/* ── LEFT: Content ── */}
          <div>
            {/* Badge */}
            <m.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-6 inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium text-green-dark"
              style={{
                background: "var(--color-green-alpha-8)",
                border: "1px solid var(--color-green-alpha-15)",
              }}
            >
              {t("badge")}
            </m.div>

            {/* Headline */}
            <m.h1
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.08 }}
              className="text-display mb-6 text-ink"
            >
              {t("headline")}
              <br />
              <span className="text-gradient-brand">{t("headlineAccent")}</span>
            </m.h1>

            {/* Subheadline */}
            <m.p
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.15 }}
              className="text-lg leading-relaxed mb-4 max-w-lg text-ink-muted"
            >
              {t("subheadline")}
            </m.p>

            {/* Prerequisite note */}
            <m.div
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.19 }}
              className="mb-10 inline-flex items-center gap-2 text-sm rounded-lg px-3 py-2 max-w-lg text-ink-muted"
              style={{
                background: "var(--color-green-alpha-6)",
                border: "1px solid var(--color-green-alpha-15)",
              }}
            >
              <span className="text-green font-bold">→</span>
              {t("prerequisiteNote")}
            </m.div>

            {/* CTAs */}
            <m.div
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.22 }}
              className="flex flex-col sm:flex-row items-start gap-4 mb-12"
            >
              <Link
                href="/login?redirectTo=/order"
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
            </m.div>

            {/* Flags row */}
            <m.div
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
              <span className="text-sm ml-1 text-ink-muted">
                {t("flagsText")}
              </span>
            </m.div>
          </div>

          {/* ── RIGHT: Status tracker card ── */}
          <m.div
            initial={{ opacity: 0, x: 28 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.65, delay: 0.25 }}
            className="hidden lg:block lg:mt-14"
          >
            <m.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
              className="rounded-2xl p-7 bg-surface-elevated"
              style={{
                border: "1px solid var(--color-border)",
                boxShadow:
                  "0 24px 64px var(--color-green-alpha-12), 0 4px 16px var(--color-green-alpha-7)",
              }}
            >
              {/* Card header */}
              <div
                className="flex items-center justify-between pb-4 mb-2"
                style={{ borderBottom: "1px solid var(--color-border)" }}
              >
                <p className="text-sm font-bold text-ink">Your NIF Application</p>
                <span
                  className="rounded-full px-2.5 py-1 text-xs font-bold uppercase tracking-wide text-green"
                  style={{ background: "var(--color-green-alpha-10)" }}
                >
                  In Progress
                </span>
              </div>

              {/* Steps */}
              <div>
                {/* Step 1 — done */}
                <div className="relative flex items-start gap-3 py-3.5">
                  <span
                    className="pointer-events-none absolute"
                    style={{
                      left: 17, top: 44, width: 1, height: "calc(100% - 10px)",
                      background: "linear-gradient(to bottom, var(--color-green), transparent)",
                      opacity: 0.3,
                    }}
                  />
                  <span className="flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-full text-sm font-bold text-white bg-green">✓</span>
                  <div className="flex-1 pt-0.5">
                    <p className="text-sm font-semibold text-ink">Payment Received</p>
                    <p className="text-xs mt-0.5 text-ink-muted">€129 · Standard Plan</p>
                  </div>
                  <span className="text-xs font-semibold pt-0.5 text-green">Done</span>
                </div>

                {/* Step 2 — active */}
                <div className="relative flex items-start gap-3 py-3.5">
                  <span
                    className="pointer-events-none absolute"
                    style={{
                      left: 17, top: 44, width: 1, height: "calc(100% - 10px)",
                      background: "linear-gradient(to bottom, var(--color-green), transparent)",
                      opacity: 0.3,
                    }}
                  />
                  <span
                    className="flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-full text-sm font-bold text-green"
                    style={{
                      background: "var(--color-green-alpha-12)",
                      border: "1.5px solid var(--color-green)",
                    }}
                  >2</span>
                  <div className="flex-1 pt-0.5">
                    <p className="text-sm font-semibold text-ink">Documents Under Review</p>
                    <p className="text-xs mt-0.5 text-ink-muted">Passport · Proof of address</p>
                  </div>
                  <span className="text-xs font-semibold pt-0.5 text-gold">Reviewing…</span>
                </div>

                {/* Step 3 — done */}
                <div className="relative flex items-start gap-3 py-3.5">
                  <span
                    className="pointer-events-none absolute"
                    style={{
                      left: 17, top: 44, width: 1, height: "calc(100% - 10px)",
                      background: "linear-gradient(to bottom, var(--color-green), transparent)",
                      opacity: 0.3,
                    }}
                  />
                  <span className="flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-full text-sm font-bold text-white bg-green">✓</span>
                  <div className="flex-1 pt-0.5">
                    <p className="text-sm font-semibold text-ink">Submitted to Finanças</p>
                    <p className="text-xs mt-0.5 text-ink-muted">By licensed fiscal rep</p>
                  </div>
                  <span className="text-xs font-semibold pt-0.5 text-green">Done</span>
                </div>

                {/* Step 4 — pending */}
                <div className="relative flex items-start gap-3 py-3.5">
                  <span
                    className="flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-full text-sm font-bold bg-border text-ink-subtle"
                  >4</span>
                  <div className="flex-1 pt-0.5">
                    <p className="text-sm font-semibold text-ink-muted">NIF Issued</p>
                    <p className="text-xs mt-0.5 text-ink-subtle">Delivered by email + dashboard</p>
                  </div>
                  <span className="text-xs pt-0.5 text-ink-subtle">Est. 3 days</span>
                </div>
              </div>

              {/* Footer */}
              <div
                className="flex items-center justify-between pt-5 mt-1"
                style={{ borderTop: "1px solid var(--color-border)" }}
              >
                <span className="text-xs text-ink-muted">🔒 256-bit encrypted</span>
                <span className="text-xs font-semibold text-green">4.9★ rated service</span>
              </div>
            </m.div>
          </m.div>

        </div>
      </div>
    </section>
  );
}
