"use client";

import { useState, useEffect } from "react";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { m, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import LocaleSwitcher from "@/components/shared/LocaleSwitcher";

export default function Navbar() {
  const t = useTranslations("nav");
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const totalHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      setIsScrolled(scrollY > 20);
      setScrollProgress(totalHeight > 0 ? (scrollY / totalHeight) * 100 : 0);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { href: "/#how-it-works", label: t("howItWorks") },
    { href: "/#pricing", label: t("pricing") },
  ];

  return (
    <header
      className="fixed inset-x-0 top-0 z-50 transition-all duration-300"
      style={{
        background: isScrolled
          ? "oklch(98.5% 0.008 90 / 0.94)"
          : "transparent",
        backdropFilter: isScrolled ? "blur(16px)" : "none",
        borderBottom: isScrolled ? "1px solid var(--color-border)" : "none",
        boxShadow: isScrolled ? "0 1px 12px rgba(0,0,0,0.06)" : "none",
      }}
    >
      {/* Scroll progress bar */}
      <div
        className="absolute top-0 left-0 h-[2.5px] transition-all duration-75"
        style={{
          width: `${scrollProgress}%`,
          background: "var(--color-green)",
          opacity: scrollProgress > 1 ? 1 : 0,
        }}
      />

      <nav className="container-full flex h-16 items-center justify-between">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 font-bold text-xl tracking-tight"
          style={{ color: "var(--color-green)", fontFamily: "var(--font-display)" }}
        >
          <span
            className="relative flex h-9 w-9 items-center justify-center rounded-lg text-white text-xs font-bold"
            style={{ background: "var(--color-green)", fontFamily: "var(--font-sans)" }}
          >
            NIF
            <span
              className="absolute bottom-0 right-0 w-2.5 h-2.5 pointer-events-none"
              style={{
                background: "var(--color-terracotta)",
                borderRadius: "50% 0 0 0",
              }}
            />
          </span>
          <span className="hidden sm:block">GetNIFPortugal</span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium transition-colors"
              style={{ color: "var(--color-ink-muted)" }}
              onMouseEnter={(e) =>
                ((e.currentTarget as HTMLElement).style.color =
                  "var(--color-green)")
              }
              onMouseLeave={(e) =>
                ((e.currentTarget as HTMLElement).style.color =
                  "var(--color-ink-muted)")
              }
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-3">
          <LocaleSwitcher />
          <Link href="/login" className="btn btn-secondary btn-sm">
            {t("login")}
          </Link>
          <Link href="/login?redirectTo=/order" className="btn btn-primary btn-sm">
            {t("getStarted")}
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden p-2 rounded-lg"
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          aria-label="Toggle menu"
          style={{ color: "var(--color-ink)" }}
        >
          {isMobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileOpen && (
          <m.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18 }}
            className="md:hidden glass-card mx-4 mb-2 rounded-xl overflow-hidden"
          >
            <div className="flex flex-col p-4 gap-3">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMobileOpen(false)}
                  className="text-sm font-medium py-2 px-3 rounded-lg transition-colors"
                  style={{ color: "var(--color-ink)" }}
                >
                  {link.label}
                </Link>
              ))}
              <hr style={{ borderColor: "var(--color-border)" }} />
              <Link
                href="/login"
                onClick={() => setIsMobileOpen(false)}
                className="btn btn-secondary btn-sm w-full"
              >
                {t("login")}
              </Link>
              <Link
                href="/login?redirectTo=/order"
                onClick={() => setIsMobileOpen(false)}
                className="btn btn-primary btn-sm w-full"
              >
                {t("getStarted")}
              </Link>
              <div className="flex justify-center pt-1">
                <LocaleSwitcher />
              </div>
            </div>
          </m.div>
        )}
      </AnimatePresence>
    </header>
  );
}
