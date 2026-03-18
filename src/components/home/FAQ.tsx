"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { m, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

const FAQ_KEYS = ["q1", "q2", "q3", "q4", "q5"] as const;

export default function FAQ() {
  const t = useTranslations("faq");
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section
      className="section-pad"
      style={{ background: "var(--color-surface)" }}
    >
      <div className="container-site max-w-3xl">
        <div className="text-center mb-14">
          <h2
            className="text-heading-xl mb-4"
            style={{ color: "var(--color-ink)" }}
          >
            {t("title")}
          </h2>
        </div>

        <div
          style={{ borderTop: "1px solid var(--color-border)" }}
        >
          {FAQ_KEYS.map((key, i) => (
            <div
              key={key}
              style={{ borderBottom: "1px solid var(--color-border)" }}
            >
              <button
                className="flex items-center gap-6 w-full py-6 text-left"
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                aria-expanded={openIndex === i}
              >
                {/* Decorative number */}
                <span
                  className="text-3xl font-black shrink-0 tabular-nums w-12 transition-colors duration-200"
                  style={{
                    color:
                      openIndex === i
                        ? "var(--color-green)"
                        : "var(--color-border)",
                    fontFamily: "var(--font-display)",
                  }}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>

                <span
                  className="flex-1 text-base font-semibold"
                  style={{ color: "var(--color-ink)" }}
                >
                  {t(key as "q1")}
                </span>

                <ChevronDown
                  size={18}
                  className="shrink-0 transition-transform duration-300"
                  style={{
                    color: "var(--color-ink-muted)",
                    transform:
                      openIndex === i ? "rotate(180deg)" : "rotate(0deg)",
                  }}
                />
              </button>

              <AnimatePresence initial={false}>
                {openIndex === i && (
                  <m.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.28, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <div
                      className="pb-7 text-sm leading-relaxed"
                      style={{
                        color: "var(--color-ink-muted)",
                        paddingLeft: "calc(3rem + 1.5rem)",
                        paddingRight: "2.5rem",
                      }}
                    >
                      {t(`a${i + 1}` as "a1")}
                    </div>
                  </m.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
