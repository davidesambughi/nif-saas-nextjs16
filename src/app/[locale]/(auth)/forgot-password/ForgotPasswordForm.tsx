"use client";

import { useState } from "react";
import { Link, useRouter } from "@/i18n/navigation";
import { useLocale, useTranslations } from "next-intl";
import { createClient } from "@/lib/supabase/client";

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

    // Use the browser client directly so Supabase can store the PKCE code
    // verifier in browser localStorage. Calling resetPasswordForEmail from
    // a Server Action uses the server-side client whose cookie writes are
    // silently swallowed, causing exchangeCodeForSession to fail in the callback.
    const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? window.location.origin;
    const redirectTo = `${appUrl}/api/auth/callback?next=/${locale}/reset-password`;

    const supabase = createClient();
    const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo });

    if (error) {
      setError(error.message);
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
          <div className="text-center space-y-6">
            <p className="text-4xl">📬</p>
            <p className="text-sm" style={{ color: "var(--color-ink-muted)" }}>
              {t("forgotPasswordSent")}
            </p>
            <Link
              href="/login"
              className="btn btn-primary block w-full"
            >
              {t("backToLogin")}
            </Link>
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

        {!sent && (
          <p className="text-center text-sm mt-6" style={{ color: "var(--color-ink-muted)" }}>
            <Link
              href="/login"
              className="font-semibold"
              style={{ color: "var(--color-brand-green)" }}
            >
              {t("backToLogin")}
            </Link>
          </p>
        )}
      </div>
    </div>
  );
}
