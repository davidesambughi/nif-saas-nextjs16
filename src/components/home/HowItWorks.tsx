"use client";

import { useTranslations } from "next-intl";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { ClipboardList, Upload, Mail } from "lucide-react";

const STEPS = [
  { Icon: ClipboardList, key: "step1" },
  { Icon: Upload, key: "step2" },
  { Icon: Mail, key: "step3" },
] as const;

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.14 } },
};
const item = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function HowItWorks() {
  const t = useTranslations("howItWorks");
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section
      id="how-it-works"
      className="section-pad"
      style={{ background: "var(--color-surface-2)" }}
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
            className="text-base max-w-xl mx-auto"
            style={{ color: "var(--color-ink-muted)" }}
          >
            {t("subtitle")}
          </p>
        </div>

        <motion.div
          ref={ref}
          variants={container}
          initial="hidden"
          animate={isInView ? "show" : "hidden"}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 relative"
        >
          {STEPS.map(({ Icon, key }, index) => (
            <motion.div
              key={key}
              variants={item}
              className="card p-8 relative overflow-hidden"
            >
              {/* Large decorative number */}
              <div
                className="pointer-events-none select-none absolute -right-2 -top-4 text-8xl font-black leading-none"
                style={{
                  color: "oklch(42% 0.12 152 / 0.06)",
                  fontFamily: "var(--font-display)",
                }}
              >
                {String(index + 1).padStart(2, "0")}
              </div>

              {/* Step circle */}
              <div
                className="mb-5 flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold text-white"
                style={{ background: "var(--color-green)" }}
              >
                {index + 1}
              </div>

              {/* Icon */}
              <div
                className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl"
                style={{ background: "oklch(42% 0.12 152 / 0.08)" }}
              >
                <Icon size={22} style={{ color: "var(--color-green)" }} />
              </div>

              <h3
                className="text-lg font-semibold mb-3"
                style={{
                  color: "var(--color-ink)",
                  fontFamily: "var(--font-display)",
                }}
              >
                {t(`${key}Title` as "step1Title")}
              </h3>
              <p
                className="text-sm leading-relaxed"
                style={{ color: "var(--color-ink-muted)" }}
              >
                {t(`${key}Desc` as "step1Desc")}
              </p>

              {/* Dashed connector (not last card) */}
              {index < 2 && (
                <div
                  className="hidden md:block absolute top-10 left-full w-6 z-10 pointer-events-none"
                  style={{
                    borderTop: "2px dashed oklch(42% 0.12 152 / 0.2)",
                    transform: "translateX(-50%)",
                  }}
                />
              )}
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
