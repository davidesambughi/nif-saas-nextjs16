"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Star } from "lucide-react";

const REVIEWS = [1, 2, 3] as const;

export default function TrustSignals() {
  const t = useTranslations("trust");
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section
      className="section-pad"
      style={{ background: "#f0f7f0" }}
    >
      <div className="container-site">
        <div className="text-center mb-12">
          <h2 className="text-heading-xl mb-4" style={{ color: "var(--color-ink)" }}>
            {t("title")}
          </h2>
          <p className="text-base" style={{ color: "var(--color-ink-muted)" }}>
            {t("subtitle")}
          </p>
        </div>

        <motion.div
          ref={ref}
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {REVIEWS.map((n, i) => (
            <motion.div
              key={n}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.12, duration: 0.45 }}
              className="card p-6"
            >
              {/* Stars */}
              <div className="flex gap-1 mb-3">
                {[...Array(5)].map((_, s) => (
                  <Star
                    key={s}
                    size={14}
                    fill="var(--color-brand-gold)"
                    style={{ color: "var(--color-brand-gold)" }}
                  />
                ))}
              </div>
              <p
                className="text-sm leading-relaxed mb-4 italic"
                style={{ color: "var(--color-ink)" }}
              >
                &ldquo;{t(`review${n}` as "review1")}&rdquo;
              </p>
              <p className="text-xs font-semibold" style={{ color: "var(--color-ink-muted)" }}>
                — {t(`review${n}Author` as "review1Author")}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
