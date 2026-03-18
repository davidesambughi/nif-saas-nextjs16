"use client";

import { useState } from "react";
import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";
import { signUp } from "@/modules/auth/actions";
import { env } from "@/lib/env";

export default function SignupPage() {
  const t = useTranslations("auth");
  const locale = useLocale();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const redirectTo = `${env.NEXT_PUBLIC_APP_URL}/${locale}/dashboard`;
    const result = await signUp(email, password, fullName, redirectTo);

    if (!result.success) {
      setError(result.error);
      setLoading(false);
      return;
    }

    setDone(true);
  }

  if (done) {
    return (
      <div className="w-full max-w-sm">
        <div className="card p-8 text-center">
          <div className="text-5xl mb-4">📬</div>
          <h2 className="text-xl font-bold mb-2" style={{ color: "var(--color-ink)" }}>
            {t("checkEmail")}
          </h2>
          <p className="text-sm" style={{ color: "var(--color-ink-muted)" }}>
            {t("checkEmailDesc")}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-sm">
      <div className="card p-8">
        <div className="text-center mb-8">
          <div
            className="inline-flex h-12 w-12 items-center justify-center rounded-xl text-white font-bold text-lg mb-4"
            style={{ background: "var(--color-brand-green)" }}
          >
            NIF
          </div>
          <h1 className="text-2xl font-bold" style={{ color: "var(--color-ink)" }}>
            {t("signupTitle")}
          </h1>
          <p className="text-sm mt-1" style={{ color: "var(--color-ink-muted)" }}>
            {t("signupSubtitle")}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="fullName" className="label">{t("fullName")}</label>
            <input
              id="fullName"
              type="text"
              required
              autoComplete="name"
              className="input"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
          </div>
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
              minLength={8}
              autoComplete="new-password"
              className="input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {error && <p className="error-text text-center">{error}</p>}

          <button
            id="signup-submit"
            type="submit"
            disabled={loading}
            className="btn btn-primary w-full"
            style={{ opacity: loading ? 0.7 : 1 }}
          >
            {loading ? "Creating account…" : t("signupButton")}
          </button>
        </form>

        <p className="text-center text-sm mt-6" style={{ color: "var(--color-ink-muted)" }}>
          {t("hasAccount")}{" "}
          <Link
            href={`/${locale}/login`}
            className="font-semibold"
            style={{ color: "var(--color-brand-green)" }}
          >
            {t("loginLink")}
          </Link>
        </p>
      </div>
    </div>
  );
}
