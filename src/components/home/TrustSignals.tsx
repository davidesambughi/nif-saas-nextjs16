"use client";

import { useTranslations } from "next-intl";
import { m, useInView } from "framer-motion";
import { useRef } from "react";
import { Star } from "lucide-react";
import CountUp from "@/components/shared/CountUp";
import { AZULEJO_SVG_WHITE } from "@/lib/constants/assets";

// Typed key arrays — no unsafe casts needed
const REVIEW_KEYS = ["review1", "review2", "review3"] as const;
type ReviewKey = (typeof REVIEW_KEYS)[number];
type ReviewAuthorKey = `${ReviewKey}Author`;

interface StatItem {
  to: number;
  suffix?: string;
  accent: string;
  label: string;
  duration: number;
}

const STATS: StatItem[] = [
  { to: 2, accent: "K+", label: "NIFs Issued", duration: 1.0 },
  { to: 45, accent: "+", label: "Countries", duration: 1.4 },
  { to: 4, suffix: ".", accent: "9★", label: "Rating", duration: 0.8 },
  { to: 3, accent: "yr", label: "In Business", duration: 0.8 },
];

export default function TrustSignals() {
  const t = useTranslations("trust");
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section
      className="section-pad relative overflow-hidden"
      style={{ background: "var(--color-ink)" }}
    >
      {/* Azulejo pattern */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage: `url("${AZULEJO_SVG_WHITE}")`,
          backgroundRepeat: "repeat",
          opacity: 0.04,
        }}
      />

      <div className="container-site relative z-10" ref={ref}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 lg:gap-24 items-start">

          {/* LEFT: stats + title + subtitle */}
          <m.div
            initial={{ opacity: 0, y: 24 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.55 }}
          >
            <p
              className="text-xs font-bold uppercase tracking-widest mb-6 text-gold"
            >
              {t("eyebrow")}
            </p>

            <div className="grid grid-cols-2 gap-8">
              {STATS.map(({ to, suffix, accent, label, duration }) => (
                <div key={label}>
                  <p className="text-4xl font-black font-display leading-none mb-1.5 text-surface-elevated">
                    <CountUp to={to} suffix={suffix ?? ""} duration={duration} />
                    <span className="text-gold">{accent}</span>
                  </p>
                  <p
                    className="text-xs uppercase tracking-wider"
                    style={{ color: "var(--color-surface-dark-muted)" }}
                  >
                    {label}
                  </p>
                </div>
              ))}
            </div>

            <h2
              className="text-heading-xl mt-12 mb-3 text-surface-elevated"
            >
              {t("title")}
            </h2>
            <p style={{ color: "var(--color-surface-dark-muted)" }}>{t("subtitle")}</p>
          </m.div>

          {/* RIGHT: reviews */}
          <div className="space-y-4">
            {REVIEW_KEYS.map((key, i) => (
              <m.div
                key={key}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: i * 0.12, duration: 0.45 }}
                className="rounded-2xl p-6"
                style={{
                  background: "var(--color-surface-dark)",
                  border: "1px solid var(--color-surface-dark-border)",
                }}
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, s) => (
                    <Star
                      key={s}
                      size={13}
                      fill="var(--color-gold)"
                      className="text-gold"
                    />
                  ))}
                </div>
                <p
                  className="text-sm leading-relaxed mb-4 italic"
                  style={{ color: "var(--color-surface-dark-text)" }}
                >
                  &ldquo;{t(key)}&rdquo;
                </p>
                <p className="text-xs font-semibold text-gold">
                  — {t(`${key}Author` as ReviewAuthorKey)}
                </p>
              </m.div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}
