"use client";

import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import LocaleSwitcher from "@/components/shared/LocaleSwitcher";

export default function Footer() {
  const t = useTranslations("footer");

  return (
    <footer
      className="border-t"
      style={{
        background: "var(--color-ink-deep)",
        borderColor: "var(--color-white-alpha-8)",
        color: "var(--color-surface-dark-muted)",
      }}
    >
      <div className="container-full py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-10">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 font-bold text-xl mb-4 text-white">
              <span
                className="flex h-8 w-8 items-center justify-center rounded-lg text-white text-sm font-bold bg-green"
              >
                NIF
              </span>
              GetNIFPortugal
            </div>
            <p className="text-sm leading-relaxed max-w-xs">{t("tagline")}</p>
            <div className="mt-4">
              <LocaleSwitcher dark />
            </div>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-sm font-semibold mb-4 text-white">
              {t("legal")}
            </h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/privacy"
                  className="text-sm hover:text-white transition-colors"
                >
                  {t("privacy")}
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="text-sm hover:text-white transition-colors"
                >
                  {t("terms")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-sm font-semibold mb-4 text-white">
              {t("company")}
            </h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/about"
                  className="text-sm hover:text-white transition-colors"
                >
                  {t("about")}
                </Link>
              </li>
              <li>
                <a
                  href="mailto:support@getnifportugal.com"
                  className="text-sm hover:text-white transition-colors"
                >
                  {t("contact")}
                </a>
              </li>
              <li>
                <Link
                  href="/guide/eu-citizen-portugal-checklist"
                  className="text-sm hover:text-white transition-colors"
                >
                  {t("guideLink")}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div
          className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4"
          style={{ borderTop: "1px solid var(--color-white-alpha-8)" }}
        >
          <p className="text-xs">{t("copyright")}</p>
          <div className="flex items-center gap-2">
            <span
              className="inline-flex h-5 w-5 items-center justify-center rounded-full text-xs font-bold text-white bg-green"
              aria-label="Portugal flag color"
            >
              🇵🇹
            </span>
            <span className="text-xs">
              Registered fiscal representative in Portugal
            </span>
          </div>
        </div>

        {/* Legal disclaimer */}
        <div
          className="mt-6 pt-6 text-center"
          style={{ borderTop: "1px solid var(--color-white-alpha-8)" }}
        >
          <p
            className="text-[0.7rem] leading-relaxed max-w-3xl mx-auto"
            style={{ color: "oklch(50% 0.02 154)" }}
          >
            <strong className="font-semibold" style={{ color: "oklch(60% 0.02 154)" }}>
              Disclaimer:
            </strong>{" "}
            GetNIFPortugal is an independent administrative assistance service and is not a law firm,
            tax advisory firm, or licensed fiscal advisor. We help individuals navigate the NIF
            registration process and act as a registered fiscal representative for administrative
            purposes only. Nothing on this website constitutes legal, tax, or financial advice.
            For advice specific to your personal situation, please consult a qualified professional.
          </p>
        </div>
      </div>
    </footer>

  );
}
