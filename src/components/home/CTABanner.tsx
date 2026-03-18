"use client";

import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";
import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { ArrowRight } from "lucide-react";

export default function CTABanner() {
  const t = useTranslations("cta");
  const locale = useLocale();
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });

  return (
    <section className="section-pad">
      <div className="container-site">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, scale: 0.98 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.5 }}
          className="relative overflow-hidden rounded-2xl px-8 py-14 text-center text-white"
          style={{ background: "var(--color-brand-green)" }}
        >
          {/* Azulejo tile pattern */}
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              backgroundImage:
                "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='60'%3E%3Cpath d='M30 2L58 30L30 58L2 30Z' fill='none' stroke='%23ffffff' stroke-width='1.2'/%3E%3Cpath d='M30 18L42 30L30 42L18 30Z' fill='none' stroke='%23ffffff' stroke-width='0.8'/%3E%3C/svg%3E\")",
              backgroundRepeat: "repeat",
              opacity: 0.08,
            }}
          />

          {/* Background decoration */}
          <div
            className="pointer-events-none absolute inset-0 opacity-10"
            style={{
              backgroundImage: "radial-gradient(circle at 20% 20%, #ffffff 0%, transparent 50%), radial-gradient(circle at 80% 80%, var(--color-brand-gold) 0%, transparent 50%)",
            }}
          />

          <h2 className="text-heading-xl mb-4 relative z-10">{t("title")}</h2>
          <p className="text-lg mb-8 relative z-10" style={{ color: "rgba(255,255,255,0.8)" }}>
            {t("subtitle")}
          </p>
          <Link
            href={`/${locale}/order`}
            id="cta-banner-button"
            className="btn btn-lg relative z-10 inline-flex"
            style={{ background: "#ffffff", color: "var(--color-brand-green)", fontWeight: 700 }}
          >
            {t("button")}
            <ArrowRight size={18} />
          </Link>
          <p
            className="relative z-10 text-xs mt-5"
            style={{ color: "rgba(255,255,255,0.5)" }}
          >
            {t("microcopy")}
          </p>
        </motion.div>
      </div>
    </section>
  );
}
