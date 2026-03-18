"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { ClipboardList, Upload, Mail } from "lucide-react";

const STEPS = [
  { iconComp: ClipboardList, key: "step1" },
  { iconComp: Upload, key: "step2" },
  { iconComp: Mail, key: "step3" },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.15 } },
};
const item = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function HowItWorks() {
  const t = useTranslations("howItWorks");
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="how-it-works" className="section-pad" style={{ background: "#f0f7f0" }}>
      <div className="container-site">
        <div className="text-center mb-14">
          <h2 className="text-heading-xl mb-4" style={{ color: "var(--color-ink)" }}>
            {t("title")}
          </h2>
          <p className="text-base max-w-xl mx-auto" style={{ color: "var(--color-ink-muted)" }}>
            {t("subtitle")}
          </p>
        </div>

        <motion.div
          ref={ref}
          variants={container}
          initial="hidden"
          animate={isInView ? "show" : "hidden"}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 relative"
        >
          {STEPS.map(({ iconComp: Icon, key }, index) => (
            <motion.div key={key} variants={item} className="card p-8 relative">
              {/* Step number */}
              <div
                className="absolute -top-4 left-8 flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold text-white"
                style={{ background: "var(--color-brand-green)" }}
              >
                {index + 1}
              </div>

              {/* Icon */}
              <div
                className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl"
                style={{ background: "rgba(0,102,0,0.08)" }}
              >
                <Icon size={26} style={{ color: "var(--color-brand-green)" }} />
              </div>

              <h3
                className="text-lg font-semibold mb-3"
                style={{ color: "var(--color-ink)" }}
              >
                {t(`${key}Title` as "step1Title")}
              </h3>
              <p className="text-sm leading-relaxed" style={{ color: "var(--color-ink-muted)" }}>
                {t(`${key}Desc` as "step1Desc")}
              </p>

              {/* Connector line (not last) */}
              {index < 2 && (
                <div
                  className="hidden md:block absolute top-10 left-full w-8 h-px z-10"
                  style={{
                    background: "linear-gradient(to right, var(--color-brand-green), transparent)",
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
