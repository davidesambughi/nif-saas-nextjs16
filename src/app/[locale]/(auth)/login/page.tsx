"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useTranslations, useLocale } from "next-intl";
import { signIn } from "@/modules/auth/actions";

export default function LoginPage() {
  const t = useTranslations("auth");
  const locale = useLocale();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirectTo") ?? `/${locale}/dashboard`;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const result = await signIn(email, password);

    if (!result.success) {
      setError(result.error);
      setLoading(false);
      return;
    }

    router.push(redirectTo);
    router.refresh();
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
            {t("loginTitle")}
          </h1>
          <p className="text-sm mt-1" style={{ color: "var(--color-ink-muted)" }}>
            {t("loginSubtitle")}
          </p>
        </div>

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
          <div>
            <label htmlFor="password" className="label">{t("password")}</label>
            <input
              id="password"
              type="password"
              required
              autoComplete="current-password"
              className="input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {error && (
            <p className="error-text text-center">{error}</p>
          )}

          <button
            id="login-submit"
            type="submit"
            disabled={loading}
            className="btn btn-primary w-full"
            style={{ opacity: loading ? 0.7 : 1 }}
          >
            {loading ? "Signing in…" : t("loginButton")}
          </button>
        </form>

        <p className="text-center text-sm mt-6" style={{ color: "var(--color-ink-muted)" }}>
          {t("noAccount")}{" "}
          <Link
            href={`/${locale}/signup`}
            className="font-semibold"
            style={{ color: "var(--color-brand-green)" }}
          >
            {t("signupLink")}
          </Link>
        </p>
      </div>
    </div>
  );
}
