"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

const FAQ_KEYS = ["q1", "q2", "q3", "q4", "q5"] as const;

export default function FAQ() {
  const t = useTranslations("faq");
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="section-pad" style={{ background: "var(--color-surface)" }}>
      <div className="container-site max-w-3xl">
        <div className="text-center mb-12">
          <h2 className="text-heading-xl mb-4" style={{ color: "var(--color-ink)" }}>
            {t("title")}
          </h2>
        </div>

        <div className="space-y-3">
          {FAQ_KEYS.map((key, i) => (
            <div
              key={key}
              className="card overflow-hidden cursor-pointer"
              onClick={() => setOpenIndex(openIndex === i ? null : i)}
            >
              <div className="flex items-center justify-between p-6 gap-4">
                <h3 className="text-base font-semibold" style={{ color: "var(--color-ink)" }}>
                  {t(key as "q1")}
                </h3>
                <ChevronDown
                  size={18}
                  className="shrink-0 transition-transform duration-300"
                  style={{
                    color: "var(--color-ink-muted)",
                    transform: openIndex === i ? "rotate(180deg)" : "rotate(0deg)",
                  }}
                />
              </div>
              <AnimatePresence initial={false}>
                {openIndex === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.28, ease: "easeInOut" }}
                  >
                    <div
                      className="px-6 pb-6 text-sm leading-relaxed"
                      style={{
                        color: "var(--color-ink-muted)",
                        borderTop: "1px solid var(--color-border)",
                        paddingTop: "1rem",
                      }}
                    >
                      {t((`a${i + 1}`) as "a1")}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
