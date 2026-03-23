"use client";

import { useState } from "react";
import { Link, useRouter } from "@/i18n/navigation";
import { useLocale, useTranslations } from "next-intl";
import { resetPassword } from "@/modules/auth/actions";

export default function ForgotPasswordForm() {
  const t = useTranslations("auth");
  const locale = useLocale();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? window.location.origin;
    const redirectTo = `${appUrl}/api/auth/callback?next=/${locale}/reset-password`;

    const result = await resetPassword(email, redirectTo);

    if (!result.success) {
      setError(result.error);
      setLoading(false);
      return;
    }

    setSent(true);
    setLoading(false);
  }

  return (
    <div className="w-full max-w-sm">
      <div className="card p-8">
        {/* Logo */}
        <div className="text-center mb-8">
          <div
            className="inline-flex h-12 w-12 items-center justify-center rounded-xl text-white font-bold text-lg mb-4"
            style={{ background: "var(--color-brand-green)" }}
          >
            NIF
          </div>
          <h1 className="text-2xl font-bold" style={{ color: "var(--color-ink)" }}>
            {t("forgotPasswordTitle")}
          </h1>
          <p className="text-sm mt-1" style={{ color: "var(--color-ink-muted)" }}>
            {t("forgotPasswordSubtitle")}
          </p>
        </div>

        {sent ? (
          <div className="text-center space-y-4">
            <p className="text-2xl">📬</p>
            <p className="text-sm" style={{ color: "var(--color-ink-muted)" }}>
              {t("forgotPasswordSent")}
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="label">{t("email")}</label>
              <input
                id="email"
                type="email"
                required
                autoComplete="email"
                className="input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            {error && (
              <p className="error-text text-center">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary w-full"
              style={{ opacity: loading ? 0.7 : 1 }}
            >
              {loading ? "…" : t("forgotPasswordButton")}
            </button>
          </form>
        )}

        <p className="text-center text-sm mt-6" style={{ color: "var(--color-ink-muted)" }}>
          <Link
            href="/login"
            className="font-semibold"
            style={{ color: "var(--color-brand-green)" }}
          >
            {t("backToLogin")}
          </Link>
        </p>
      </div>
    </div>
  );
}
