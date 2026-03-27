"use client";

import { useState } from "react";
import { Link, useRouter } from "@/i18n/navigation";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { signIn } from "@/modules/auth/actions";

export default function LoginForm() {
  const t = useTranslations("auth");
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirectTo") ?? "/dashboard";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  function mapAuthError(msg: string): string {
    const m = msg.toLowerCase();
    if (m.includes("invalid login") || m.includes("invalid credentials") || m.includes("wrong password")) {
      return "Incorrect email or password. Please try again.";
    }
    if (m.includes("rate limit") || m.includes("too many") || m.includes("after")) {
      return "Too many login attempts. Please wait a few minutes before trying again.";
    }
    if (m.includes("email not confirmed")) {
      return "Please confirm your email address before signing in. Check your inbox.";
    }
    return "Something went wrong. Please try again.";
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const result = await signIn(email, password);

    if (!result.success) {
      setError(mapAuthError(result.error ?? ""));
      setLoading(false);
      return;
    }

    router.push(redirectTo);
    router.refresh();
  }

  return (
    <div className="w-full max-w-sm">
      <div className="mb-4">
        <Link href="/" className="inline-flex items-center gap-1 text-sm" style={{ color: "var(--color-ink-muted)" }}>
          ← Back to home
        </Link>
      </div>
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

        {redirectTo.includes("/order") && (
          <div
            className="rounded-lg px-4 py-3 mb-2 text-sm text-center"
            style={{ background: "oklch(42% 0.12 152 / 0.08)", color: "var(--color-green-dark)", border: "1px solid oklch(42% 0.12 152 / 0.15)" }}
          >
            Sign in or{" "}
            <Link href={`/signup?redirectTo=${encodeURIComponent(redirectTo)}`} className="font-semibold underline">
              create an account
            </Link>{" "}
            to continue with your NIF application.
          </div>
        )}

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
            <div className="flex items-center justify-between mb-1">
              <label htmlFor="password" className="label" style={{ margin: 0 }}>{t("password")}</label>
              <Link
                href="/forgot-password"
                className="text-xs"
                style={{ color: "var(--color-brand-green)" }}
              >
                {t("forgotPassword")}
              </Link>
            </div>
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
            href="/signup"
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
