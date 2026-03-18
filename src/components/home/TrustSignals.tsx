"use client";

import { useTranslations } from "next-intl";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Star } from "lucide-react";

const REVIEWS = [1, 2, 3] as const;

const STATS = [
  { value: "2", accent: "K+", label: "NIFs Issued" },
  { value: "45", accent: "+", label: "Countries" },
  { value: "4.", accent: "9★", label: "Rating" },
  { value: "3", accent: "yr", label: "In Business" },
] as const;

const AZULEJO_SVG =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='60'%3E%3Cpath d='M30 2L58 30L30 58L2 30Z' fill='none' stroke='%23ffffff' stroke-width='1.2'/%3E%3Cpath d='M30 18L42 30L30 42L18 30Z' fill='none' stroke='%23ffffff' stroke-width='0.8'/%3E%3C/svg%3E";

export default function TrustSignals() {
  const t = useTranslations("trust");
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section
      className="section-pad relative overflow-hidden"
      style={{ background: "var(--color-forest)" }}
    >
      {/* Azulejo pattern */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage: `url("${AZULEJO_SVG}")`,
          backgroundRepeat: "repeat",
          opacity: 0.04,
        }}
      />

      <div className="container-site relative z-10" ref={ref}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 lg:gap-24 items-start">

          {/* LEFT: stats + title + subtitle */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.55 }}
          >
            <p
              className="text-xs font-bold uppercase tracking-widest mb-6"
              style={{ color: "var(--color-gold)" }}
            >
              {t("eyebrow")}
            </p>

            <div className="grid grid-cols-2 gap-8">
              {STATS.map(({ value, accent, label }) => (
                <div key={label}>
                  <p
                    className="text-4xl font-black leading-none mb-1.5"
                    style={{
                      color: "#ffffff",
                      fontFamily: "var(--font-display)",
                    }}
                  >
                    {value}
                    <span style={{ color: "var(--color-gold)" }}>{accent}</span>
                  </p>
                  <p
                    className="text-xs uppercase tracking-wider"
                    style={{ color: "oklch(70% 0.04 152)" }}
                  >
                    {label}
                  </p>
                </div>
              ))}
            </div>

            <h2
              className="text-heading-xl mt-12 mb-3"
              style={{ color: "#ffffff" }}
            >
              {t("title")}
            </h2>
            <p style={{ color: "oklch(68% 0.04 152)" }}>{t("subtitle")}</p>
          </motion.div>

          {/* RIGHT: reviews */}
          <div className="space-y-4">
            {REVIEWS.map((n, i) => (
              <motion.div
                key={n}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: i * 0.12, duration: 0.45 }}
                className="rounded-2xl p-6"
                style={{
                  background: "oklch(24% 0.045 152)",
                  border: "1px solid oklch(29% 0.04 152)",
                }}
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, s) => (
                    <Star
                      key={s}
                      size={13}
                      fill="var(--color-gold)"
                      style={{ color: "var(--color-gold)" }}
                    />
                  ))}
                </div>
                <p
                  className="text-sm leading-relaxed mb-4 italic"
                  style={{ color: "oklch(88% 0.02 152)" }}
                >
                  &ldquo;{t(`review${n}` as "review1")}&rdquo;
                </p>
                <p
                  className="text-xs font-semibold"
                  style={{ color: "var(--color-gold)" }}
                >
                  — {t(`review${n}Author` as "review1Author")}
                </p>
              </motion.div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}
