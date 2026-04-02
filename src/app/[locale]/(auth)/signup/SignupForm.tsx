"use client";

import { useState } from "react";
import { Link } from "@/i18n/navigation";
import { useTranslations, useLocale } from "next-intl";
import { createClient } from "@/lib/supabase/client";
import { env } from "@/lib/env";

export default function SignupForm() {
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

    // Use browser client directly — NOT a Server Action.
    // Server-side Supabase client cannot write the PKCE code verifier to the
    // browser (setAll fails silently in server context). Without the verifier,
    // the confirmation link in the email would fail at /api/auth/callback.
    const supabase = createClient();
    const redirectTo = `${env.NEXT_PUBLIC_APP_URL}/api/auth/callback?next=/${locale}/dashboard`;
    const { error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName }, emailRedirectTo: redirectTo },
    });

    if (signUpError) {
      const msg = signUpError.message.toLowerCase();
      // Password validation errors should be surfaced directly
      if (msg.includes("password")) {
        setError("Password must be at least 8 characters.");
        setLoading(false);
      } else {
        // All other errors (email already exists, SMTP failures, etc.) are
        // treated as success — show the "check email" screen.
        // This prevents leaking whether an email is registered (enumeration).
        setDone(true);
      }
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
            We sent a confirmation link to{" "}
            <span className="font-semibold" style={{ color: "var(--color-ink)" }}>
              {email}
            </span>
            . Click it to activate your account.
          </p>
          <div
            className="mt-5 rounded-lg px-4 py-3 text-xs space-y-2 text-left"
            style={{
              background: "var(--color-surface-elevated)",
              border: "1px solid var(--color-border)",
              color: "var(--color-ink-muted)",
            }}
          >
            <p className="font-semibold" style={{ color: "var(--color-ink)" }}>
              Didn't receive anything?
            </p>
            <p>
              If <span className="font-medium">{email}</span> is already registered,{" "}
              <Link href="/login" className="font-semibold" style={{ color: "var(--color-brand-green)" }}>
                sign in instead
              </Link>{" "}
              or{" "}
              <Link href="/forgot-password" className="font-semibold" style={{ color: "var(--color-brand-green)" }}>
                reset your password
              </Link>
              .
            </p>
            <p>Otherwise, check your spam folder.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-sm">
      <div className="mb-4">
        <Link href="/" className="inline-flex items-center gap-1 text-sm" style={{ color: "var(--color-ink-muted)" }}>
          ← Back to home
        </Link>
      </div>
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
            href="/login"
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
