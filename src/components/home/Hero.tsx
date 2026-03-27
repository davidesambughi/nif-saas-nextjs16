"use client";

import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { m } from "framer-motion";
import { ArrowRight } from "lucide-react";

const AZULEJO_SVG =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='60'%3E%3Cpath d='M30 2L58 30L30 58L2 30Z' fill='none' stroke='%232d6a4f' stroke-width='1.2'/%3E%3Cpath d='M30 18L42 30L30 42L18 30Z' fill='none' stroke='%232d6a4f' stroke-width='0.8'/%3E%3C/svg%3E";

export default function Hero() {
  const t = useTranslations("hero");

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
            <m.div
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
            </m.div>

            {/* Headline */}
            <m.h1
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.08 }}
              className="text-display mb-6"
              style={{ color: "var(--color-ink)" }}
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
              className="text-lg leading-relaxed mb-4 max-w-lg"
              style={{ color: "var(--color-ink-muted)" }}
            >
              {t("subheadline")}
            </m.p>

            {/* Prerequisite note — GEO anchor: NIF is required before CRUE/NISS/IFICI */}
            <m.div
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.19 }}
              className="mb-10 inline-flex items-center gap-2 text-sm rounded-lg px-3 py-2 max-w-lg"
              style={{
                background: "oklch(42% 0.12 152 / 0.06)",
                border: "1px solid oklch(42% 0.12 152 / 0.15)",
                color: "var(--color-ink-muted)",
              }}
            >
              <span style={{ color: "var(--color-green)", fontWeight: 700 }}>→</span>
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
              <span
                className="text-sm ml-1"
                style={{ color: "var(--color-ink-muted)" }}
              >
                {t("flagsText")}
              </span>
            </m.div>
          </div>

          {/* ── RIGHT: Status tracker card ── */}
          <m.div
            initial={{ opacity: 0, x: 28 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.65, delay: 0.25 }}
            className="hidden lg:block"
          >
            <m.div
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
              {/* Card header — with divider line */}
              <div
                className="flex items-center justify-between pb-4 mb-2"
                style={{ borderBottom: "1px solid var(--color-border)" }}
              >
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

              {/* Steps — 3-col: circle | content | status */}
              <div>
                {/* Step 1 — done */}
                <div className="relative flex items-start gap-3 py-3.5">
                  {/* vertical connector to next step */}
                  <span
                    className="pointer-events-none absolute"
                    style={{
                      left: 17,
                      top: 44,
                      width: 1,
                      height: "calc(100% - 10px)",
                      background: "linear-gradient(to bottom, var(--color-green), transparent)",
                      opacity: 0.3,
                    }}
                  />
                  <span
                    className="flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-full text-sm font-bold text-white"
                    style={{ background: "var(--color-green)" }}
                  >
                    ✓
                  </span>
                  <div className="flex-1 pt-0.5">
                    <p className="text-sm font-semibold" style={{ color: "var(--color-ink)" }}>Payment Received</p>
                    <p className="text-xs mt-0.5" style={{ color: "var(--color-ink-muted)" }}>€129 · Standard Plan</p>
                  </div>
                  <span className="text-xs font-semibold pt-0.5" style={{ color: "var(--color-green)" }}>Done</span>
                </div>

                {/* Step 2 — active */}
                <div className="relative flex items-start gap-3 py-3.5">
                  <span
                    className="pointer-events-none absolute"
                    style={{
                      left: 17,
                      top: 44,
                      width: 1,
                      height: "calc(100% - 10px)",
                      background: "linear-gradient(to bottom, var(--color-green), transparent)",
                      opacity: 0.3,
                    }}
                  />
                  <span
                    className="flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-full text-sm font-bold"
                    style={{
                      background: "oklch(42% 0.12 152 / 0.12)",
                      color: "var(--color-green)",
                      border: "1.5px solid var(--color-green)",
                    }}
                  >
                    2
                  </span>
                  <div className="flex-1 pt-0.5">
                    <p className="text-sm font-semibold" style={{ color: "var(--color-ink)" }}>Documents Under Review</p>
                    <p className="text-xs mt-0.5" style={{ color: "var(--color-ink-muted)" }}>Passport · Proof of address</p>
                  </div>
                  <span className="text-xs font-semibold pt-0.5" style={{ color: "var(--color-gold)" }}>Reviewing…</span>
                </div>

                {/* Step 3 — done */}
                <div className="relative flex items-start gap-3 py-3.5">
                  <span
                    className="pointer-events-none absolute"
                    style={{
                      left: 17,
                      top: 44,
                      width: 1,
                      height: "calc(100% - 10px)",
                      background: "linear-gradient(to bottom, var(--color-green), transparent)",
                      opacity: 0.3,
                    }}
                  />
                  <span
                    className="flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-full text-sm font-bold text-white"
                    style={{ background: "var(--color-green)" }}
                  >
                    ✓
                  </span>
                  <div className="flex-1 pt-0.5">
                    <p className="text-sm font-semibold" style={{ color: "var(--color-ink)" }}>Submitted to Finanças</p>
                    <p className="text-xs mt-0.5" style={{ color: "var(--color-ink-muted)" }}>By licensed fiscal rep</p>
                  </div>
                  <span className="text-xs font-semibold pt-0.5" style={{ color: "var(--color-green)" }}>Done</span>
                </div>

                {/* Step 4 — pending (no connector after last step) */}
                <div className="relative flex items-start gap-3 py-3.5">
                  <span
                    className="flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-full text-sm font-bold"
                    style={{
                      background: "var(--color-border)",
                      color: "var(--color-ink-subtle)",
                    }}
                  >
                    4
                  </span>
                  <div className="flex-1 pt-0.5">
                    <p className="text-sm font-semibold" style={{ color: "var(--color-ink-muted)" }}>NIF Issued</p>
                    <p className="text-xs mt-0.5" style={{ color: "var(--color-ink-subtle)" }}>Delivered by email + dashboard</p>
                  </div>
                  <span className="text-xs pt-0.5" style={{ color: "var(--color-ink-subtle)" }}>Est. 3 days</span>
                </div>
              </div>

              {/* Footer — border-top separator */}
              <div
                className="flex items-center justify-between pt-5 mt-1"
                style={{ borderTop: "1px solid var(--color-border)" }}
              >
                <span className="text-xs" style={{ color: "var(--color-ink-muted)" }}>
                  🔒 256-bit encrypted
                </span>
                <span className="text-xs font-semibold" style={{ color: "var(--color-green)" }}>
                  4.9★ rated service
                </span>
              </div>
            </m.div>
          </m.div>

        </div>
      </div>
    </section>
  );
}
