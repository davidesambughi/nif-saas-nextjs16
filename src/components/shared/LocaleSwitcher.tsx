"use client";

import { useState, useRef } from "react";
import { useLocale } from "next-intl";
import { useRouter, usePathname } from "@/i18n/navigation";
import { Globe, ChevronDown } from "lucide-react";
import { m, AnimatePresence } from "framer-motion";

const LOCALES = [
  { code: "en", label: "English", flag: "🇬🇧" },
  { code: "pt", label: "Português", flag: "🇵🇹" },
  { code: "fr", label: "Français", flag: "🇫🇷" },
];

interface LocaleSwitcherProps {
  dark?: boolean;
}

export default function LocaleSwitcher({ dark = false }: LocaleSwitcherProps) {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const current = LOCALES.find((l) => l.code === locale) ?? LOCALES[0];

  const handleSwitch = (code: string) => {
    setIsOpen(false);
    router.replace(pathname, { locale: code });
  };

  const textColor = dark ? "#9ca3af" : "var(--color-ink-muted)";
  const bgColor = dark
    ? "rgba(255,255,255,0.06)"
    : "var(--color-surface-elevated)";
  const borderColor = dark ? "rgba(255,255,255,0.1)" : "var(--color-border)";
  const hoverBg = dark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.04)";

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors"
        style={{
          color: textColor,
          background: bgColor,
          border: `1px solid ${borderColor}`,
        }}
        aria-expanded={isOpen}
        aria-label="Switch language"
      >
        <Globe size={14} />
        <span>{current.flag} {current.label}</span>
        <ChevronDown size={12} className={`transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <m.div
            initial={{ opacity: 0, y: 4, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.96 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-full mt-2 min-w-[140px] overflow-hidden rounded-xl z-50"
            style={{
              background: dark ? "#1a2e1a" : "var(--color-surface-elevated)",
              border: `1px solid ${borderColor}`,
              boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
            }}
          >
            {LOCALES.map((l) => (
              <button
                key={l.code}
                onClick={() => handleSwitch(l.code)}
                className="flex w-full items-center gap-2 px-4 py-2.5 text-sm transition-colors text-left"
                style={{
                  color: l.code === locale
                    ? dark ? "#ffffff" : "var(--color-brand-green)"
                    : textColor,
                  fontWeight: l.code === locale ? "600" : "400",
                }}
                onMouseEnter={(e) =>
                  ((e.currentTarget as HTMLElement).style.background = hoverBg)
                }
                onMouseLeave={(e) =>
                  ((e.currentTarget as HTMLElement).style.background = "transparent")
                }
              >
                <span>{l.flag}</span>
                <span>{l.label}</span>
              </button>
            ))}
          </m.div>
        )}
      </AnimatePresence>
    </div>
  );
}
