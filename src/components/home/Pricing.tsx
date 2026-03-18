"use client";

import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { useRef, useState } from "react";
import { Check, Star, Minus } from "lucide-react";

interface PlanConfig {
  key: "essential" | "standard" | "premium";
  tier: string;
  included: string[];
  excluded: string[];
  featured?: boolean;
  goldBorder?: boolean;
}

const PLANS: PlanConfig[] = [
  {
    key: "essential",
    tier: "essential",
    included: ["feature1", "feature2", "feature3"],
    excluded: ["feature4", "feature5", "feature6"],
  },
  {
    key: "standard",
    tier: "standard",
    included: ["feature1", "feature2", "feature3", "feature4"],
    excluded: ["feature5", "feature6"],
    featured: true,
  },
  {
    key: "premium",
    tier: "premium",
    included: ["feature1", "feature2", "feature3", "feature4", "feature5", "feature6"],
    excluded: [],
    goldBorder: true,
  },
];

type FeatureKey =
  | "feature1"
  | "feature2"
  | "feature3"
  | "feature4"
  | "feature5"
  | "feature6";

type PlanKey = "essential" | "standard" | "premium";

export default function Pricing() {
  const t = useTranslations("pricing");
  const locale = useLocale();
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });
  const [selected, setSelected] = useState<PlanKey>("standard");

  return (
    <section
      id="pricing"
      className="section-pad"
      style={{ background: "var(--color-surface)" }}
    >
      <div className="container-site">
        <div className="text-center mb-14">
          <p
            className="text-xs font-bold uppercase tracking-widest mb-3"
            style={{ color: "var(--color-green)" }}
          >
            {t("eyebrow")}
          </p>
          <h2
            className="text-heading-xl mb-4"
            style={{ color: "var(--color-ink)" }}
          >
            {t("title")}
          </h2>
          <p
            className="text-base max-w-md mx-auto"
            style={{ color: "var(--color-ink-muted)" }}
          >
            {t("subtitle")}
          </p>
        </div>

        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.55 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto items-start"
        >
          {PLANS.map(({ key, tier, included, excluded, featured, goldBorder }) => {
            const isPremium = key === "premium";
            const isSelected = selected === key;

            /* ── accent colours per plan ── */
            const accentColor = isPremium
              ? "var(--color-gold)"
              : "var(--color-green)";
            const accentShadow = isPremium
              ? "oklch(64% 0.12 75 / 0.22)"
              : "oklch(42% 0.12 152 / 0.18)";

            /* ── border for non-featured cards ── */
            const borderStyle = featured
              ? "none"
              : isSelected
              ? `2px solid ${accentColor}`
              : goldBorder
              ? "2px solid var(--color-gold)"
              : "1px solid var(--color-border)";

            /* ── shadow ── */
            const shadowStyle = featured
              ? isSelected
                ? `0 24px 72px oklch(42% 0.12 152 / 0.40), 0 4px 16px oklch(42% 0.12 152 / 0.25), 0 0 0 3px oklch(42% 0.12 152 / 0.25)`
                : "0 20px 60px oklch(42% 0.12 152 / 0.30), 0 4px 16px oklch(42% 0.12 152 / 0.20)"
              : isSelected
              ? `0 12px 40px ${accentShadow}, 0 2px 8px rgba(0,0,0,0.06)`
              : "0 2px 8px rgba(0,0,0,0.04)";

            /* ── bg tint for non-featured selected ── */
            const bgStyle = featured
              ? "var(--color-green)"
              : isSelected
              ? isPremium
                ? "oklch(98% 0.012 75)"
                : "oklch(98.5% 0.012 152)"
              : "var(--color-surface-2)";

            /* ── selection badge colours ── */
            const badgeBg = featured
              ? "rgba(255,255,255,0.18)"
              : isPremium
              ? "oklch(64% 0.12 75 / 0.12)"
              : "oklch(42% 0.12 152 / 0.1)";
            const badgeColor = featured
              ? "#ffffff"
              : accentColor;

            return (
              <div key={key} className="relative">
                {/* Most Popular badge */}
                {featured && (
                  <div
                    className="absolute -top-3.5 left-1/2 -translate-x-1/2 z-10 flex items-center gap-1 rounded-full px-3 py-1 text-xs font-bold whitespace-nowrap"
                    style={{
                      background: "var(--color-gold)",
                      color: "oklch(15% 0 0)",
                    }}
                  >
                    <Star size={10} fill="oklch(15% 0 0)" />
                    {t("popular")}
                  </div>
                )}

                <motion.div
                  onClick={() => setSelected(key)}
                  animate={{
                    y: isSelected && !featured ? -4 : 0,
                    scale: featured ? (isSelected ? 1.04 : 1.03) : isSelected ? 1.01 : 1,
                  }}
                  transition={{ type: "spring", stiffness: 320, damping: 28 }}
                  className="relative rounded-2xl p-8 overflow-hidden flex flex-col h-full cursor-pointer"
                  style={{
                    background: bgStyle,
                    border: borderStyle,
                    boxShadow: shadowStyle,
                    zIndex: featured ? 1 : isSelected ? 2 : 0,
                    transition: "background 0.25s ease, box-shadow 0.25s ease",
                  }}
                >
                  {/* ── Selection badge ── */}
                  <AnimatePresence>
                    {isSelected && (
                      <motion.span
                        key="selected-badge"
                        initial={{ opacity: 0, scale: 0.75, y: -4 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.75, y: -4 }}
                        transition={{ duration: 0.2 }}
                        className="absolute top-4 right-4 flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold"
                        style={{ background: badgeBg, color: badgeColor }}
                      >
                        <Check size={10} strokeWidth={3} />
                        Selected
                      </motion.span>
                    )}
                  </AnimatePresence>

                  {/* Plan name */}
                  <p
                    className="text-sm font-semibold mb-2 uppercase tracking-wider"
                    style={{
                      color: featured
                        ? "rgba(255,255,255,0.75)"
                        : isPremium
                        ? "var(--color-gold)"
                        : "var(--color-ink-muted)",
                    }}
                  >
                    {t(key)}
                  </p>

                  {/* Price */}
                  <p
                    className="mb-1"
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: "3.25rem",
                      fontWeight: "800",
                      lineHeight: 1,
                      letterSpacing: "-0.03em",
                      color: featured ? "#ffffff" : "var(--color-ink)",
                    }}
                  >
                    {t(`${key}Price` as "essentialPrice")}
                  </p>
                  <p
                    className="text-sm mb-8"
                    style={{
                      color: featured
                        ? "rgba(255,255,255,0.65)"
                        : "var(--color-ink-muted)",
                    }}
                  >
                    {t(`${key}Duration` as "essentialDuration")}
                  </p>

                  {/* Feature list — included */}
                  <ul className="space-y-3 mb-4 flex-1">
                    {included.map((f) => (
                      <li key={f} className="flex items-start gap-3 text-sm">
                        <Check
                          size={16}
                          className="shrink-0 mt-0.5"
                          style={{
                            color: featured
                              ? "var(--color-gold-light)"
                              : "var(--color-green)",
                          }}
                        />
                        <span
                          style={{
                            color: featured
                              ? "rgba(255,255,255,0.9)"
                              : "var(--color-ink)",
                          }}
                        >
                          {t(f as FeatureKey)}
                        </span>
                      </li>
                    ))}

                    {/* Feature list — excluded */}
                    {excluded.map((f) => (
                      <li key={f} className="flex items-start gap-3 text-sm">
                        <Minus
                          size={16}
                          className="shrink-0 mt-0.5"
                          style={{
                            color: featured
                              ? "rgba(255,255,255,0.25)"
                              : "var(--color-ink-subtle)",
                          }}
                        />
                        <span
                          style={{
                            color: featured
                              ? "rgba(255,255,255,0.35)"
                              : "var(--color-ink-subtle)",
                          }}
                        >
                          {t(f as FeatureKey)}
                        </span>
                      </li>
                    ))}
                  </ul>

                  {/* CTA — goes primary when selected */}
                  {featured ? (
                    <Link
                      href={`/${locale}/order?tier=${tier}`}
                      id={`pricing-${tier}-cta`}
                      className="btn btn-ivory w-full mt-2 text-center"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {t("cta")}
                    </Link>
                  ) : isSelected ? (
                    <Link
                      href={`/${locale}/order?tier=${tier}`}
                      id={`pricing-${tier}-cta`}
                      className="btn btn-primary w-full mt-2 text-center"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {t("cta")}
                    </Link>
                  ) : (
                    <Link
                      href={`/${locale}/order?tier=${tier}`}
                      id={`pricing-${tier}-cta`}
                      className="btn btn-secondary w-full mt-2 text-center"
                      onClick={(e) => e.stopPropagation()}
                      style={{
                        borderColor: isPremium
                          ? "var(--color-gold)"
                          : "var(--color-green)",
                        color: isPremium
                          ? "var(--color-gold)"
                          : "var(--color-green)",
                      }}
                    >
                      {t("cta")}
                    </Link>
                  )}
                </motion.div>
              </div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
