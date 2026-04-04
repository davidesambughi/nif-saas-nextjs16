"use client";

import { useState, useEffect } from "react";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { m, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import LocaleSwitcher from "@/components/shared/LocaleSwitcher";
import { AZULEJO_SVG_GREEN } from "@/lib/constants/assets";

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
    { href: "/guide/eu-citizen-portugal-checklist", label: t("guide") },
  ];

  return (
    <header
      className="fixed inset-x-0 top-0 z-50 transition-all duration-300"
      style={{
        background: isScrolled ? "var(--color-surface-frosted)" : "transparent",
        backdropFilter: isScrolled ? "blur(16px)" : "none",
        borderBottom: isScrolled ? "1px solid var(--color-border)" : "none",
        boxShadow: isScrolled ? "0 1px 12px rgba(0,0,0,0.06)" : "none",
      }}
    >
      {/* Scroll progress bar */}
      <div
        className="absolute top-0 left-0 h-[2.5px] transition-all duration-75 bg-green"
        style={{
          width: `${scrollProgress}%`,
          opacity: scrollProgress > 1 ? 1 : 0,
        }}
      />

      <nav className="container-full flex h-16 items-center justify-between">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 font-bold text-xl tracking-tight font-display text-green"
        >
          <span
            className="relative flex h-9 w-9 items-center justify-center rounded-lg text-white text-xs font-bold font-sans bg-green"
          >
            NIF
            <span
              className="absolute bottom-0 right-0 w-2.5 h-2.5 pointer-events-none bg-amber"
              style={{ borderRadius: "50% 0 0 0" }}
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
              className="text-sm font-medium transition-colors text-ink-muted hover:text-green"
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
          className="md:hidden p-2 rounded-lg text-ink"
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          aria-label="Toggle menu"
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
                  className="text-sm font-medium py-2 px-3 rounded-lg transition-colors text-ink hover:text-green"
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
