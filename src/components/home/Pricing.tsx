"use client";

import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Check, Star, Minus } from "lucide-react";

/**
 * Features matrix per plan.
 * "included" = shown with ✓ green checkmark
 * "excluded" = shown with — muted dash
 */
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
            const isEssential = key === "essential";
            const isPremium = key === "premium";

            return (
              <div key={key} className="relative">
                {/* Most Popular badge — floats above the card */}
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

              <div
                className="relative rounded-2xl p-8 overflow-hidden flex flex-col h-full"
                style={{
                  background: featured
                    ? "var(--color-green)"
                    : "var(--color-surface-2)",
                  border: featured
                    ? "none"
                    : goldBorder
                    ? "2px solid var(--color-gold)"
                    : "1px solid var(--color-border)",
                  boxShadow: featured
                    ? "0 20px 60px oklch(42% 0.12 152 / 0.30), 0 4px 16px oklch(42% 0.12 152 / 0.20)"
                    : "0 2px 8px rgba(0,0,0,0.04)",
                  transform: featured ? "scale(1.03)" : "scale(1)",
                  zIndex: featured ? 1 : 0,
                }}
              >

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

                {/* CTA */}
                {featured ? (
                  <Link
                    href={`/${locale}/order?tier=${tier}`}
                    id={`pricing-${tier}-cta`}
                    className="btn btn-ivory w-full mt-2 text-center"
                  >
                    {t("cta")}
                  </Link>
                ) : (
                  <Link
                    href={`/${locale}/order?tier=${tier}`}
                    id={`pricing-${tier}-cta`}
                    className="btn btn-secondary w-full mt-2 text-center"
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
              </div>
              </div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
