"use client";

import { useState, useRef } from "react";
import { useLocale } from "next-intl";
import { useRouter, usePathname } from "@/i18n/navigation";
import { Globe } from "lucide-react";
import { m, AnimatePresence } from "framer-motion";

const LOCALES = [
  { code: "en", label: "English" },
  { code: "pt", label: "Português" },
  { code: "fr", label: "Français" },
];

interface LocaleSwitcherProps {
  dark?: boolean;
}

export default function LocaleSwitcher({ dark = false }: LocaleSwitcherProps) {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const handleSwitch = (code: string) => {
    setIsOpen(false);
    router.replace(pathname, { locale: code });
    router.refresh();
  };

  const borderColor = dark ? "var(--color-white-alpha-8)" : "var(--color-border)";

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-1.5 h-9 px-2.5 rounded-lg transition-colors border ${
          dark
            ? "text-[#9ca3af] bg-white/[0.06] border-white/10"
            : "text-ink-muted bg-surface-elevated border-border"
        }`}
        aria-expanded={isOpen}
        aria-label="Switch language"
        style={{ borderColor }}
      >
        <Globe size={16} className="text-green shrink-0" />
        <span className="text-[0.8rem] font-semibold uppercase tracking-[0.04em]">
          {locale}
        </span>
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
              background: dark ? "var(--color-surface-dark)" : "var(--color-surface-elevated)",
              border: `1px solid ${borderColor}`,
              boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
            }}
          >
            {LOCALES.map((l) => (
              <button
                key={l.code}
                onClick={() => handleSwitch(l.code)}
                className={`flex w-full items-center px-4 py-2.5 text-sm transition-colors text-left ${
                  dark ? "hover:bg-white/10" : "hover:bg-black/[0.04]"
                } ${
                  l.code === locale
                    ? dark
                      ? "text-white font-semibold"
                      : "text-green font-semibold"
                    : dark
                    ? "text-[#9ca3af]"
                    : "text-ink-muted"
                }`}
              >
                {l.label}
              </button>
            ))}
          </m.div>
        )}
      </AnimatePresence>
    </div>
  );
}
