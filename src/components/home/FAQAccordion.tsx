"use client";

import { useState } from "react";
import { m, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

interface FAQItem {
  question: string;
  answer: string;
}

export default function FAQAccordion({ items }: { items: FAQItem[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="border-t border-border">
      {items.map(({ question, answer }, i) => (
        <div
          key={question}
          className="border-b border-border"
        >
          <button
            className="group flex items-center gap-6 w-full py-6 text-left focus-visible:outline-2 focus-visible:outline-green focus-visible:outline-offset-2"
            onClick={() => setOpenIndex(openIndex === i ? null : i)}
            aria-expanded={openIndex === i}
            aria-controls={`faq-answer-${i}`}
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

            {/* Question text — CSS handles hover via group, no inline color override */}
            <span className="flex-1 text-base font-semibold text-ink transition-colors duration-200 group-hover:text-green">
              {question}
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
                id={`faq-answer-${i}`}
                role="region"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.28, ease: "easeInOut" }}
                className="overflow-hidden"
              >
                <div
                  className="pb-7 text-sm leading-relaxed text-ink-muted"
                  style={{
                    paddingLeft: "calc(3rem + 1.5rem)",
                    paddingRight: "2.5rem",
                  }}
                >
                  {answer}
                </div>
              </m.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  );
}
