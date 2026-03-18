"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Globe, ChevronDown } from "lucide-react";
import LocaleSwitcher from "@/components/shared/LocaleSwitcher";

export default function Navbar() {
  const t = useTranslations("nav");
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const locale = useLocale();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { href: `/${locale}/#how-it-works`, label: t("howItWorks") },
    { href: `/${locale}/#pricing`, label: t("pricing") },
  ];

  return (
    <header
      className="fixed inset-x-0 top-0 z-50 transition-all duration-300"
      style={{
        background: isScrolled
          ? "rgba(248, 247, 244, 0.92)"
          : "transparent",
        backdropFilter: isScrolled ? "blur(16px)" : "none",
        borderBottom: isScrolled ? "1px solid var(--color-border)" : "none",
        boxShadow: isScrolled
          ? "0 1px 12px rgba(0,0,0,0.06)"
          : "none",
      }}
    >
      <nav className="container-site flex h-16 items-center justify-between">
        {/* Logo */}
        <Link
          href={`/${locale}`}
          className="flex items-center gap-2 font-bold text-xl tracking-tight"
          style={{ color: "var(--color-brand-green)" }}
        >
          <span
            className="flex h-8 w-8 items-center justify-center rounded-lg text-white text-sm font-bold"
            style={{ background: "var(--color-brand-green)" }}
          >
            NIF
          </span>
          <span className="hidden sm:block">GetNIFPortugal</span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium transition-colors hover:text-green-700"
              style={{ color: "var(--color-ink-muted)" }}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-3">
          <LocaleSwitcher />
          <Link href={`/${locale}/login`} className="btn btn-secondary btn-sm">
            {t("login")}
          </Link>
          <Link
            href={`/${locale}/order`}
            className="btn btn-primary btn-sm"
            style={{ background: "var(--color-brand-green)" }}
          >
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
          <motion.div
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
                  className="text-sm font-medium py-2 px-3 rounded-lg hover:bg-gray-50 transition-colors"
                  style={{ color: "var(--color-ink)" }}
                >
                  {link.label}
                </Link>
              ))}
              <hr style={{ borderColor: "var(--color-border)" }} />
              <Link
                href={`/${locale}/login`}
                onClick={() => setIsMobileOpen(false)}
                className="btn btn-secondary btn-sm w-full"
              >
                {t("login")}
              </Link>
              <Link
                href={`/${locale}/order`}
                onClick={() => setIsMobileOpen(false)}
                className="btn btn-primary btn-sm w-full"
              >
                {t("getStarted")}
              </Link>
              <div className="flex justify-center pt-1">
                <LocaleSwitcher />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
