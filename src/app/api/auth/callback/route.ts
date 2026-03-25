import { NextRequest, NextResponse } from "next/server";
import type { EmailOtpType } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";
import { routing } from "@/i18n/routing";

// Email OTP types that can arrive via token_hash (Supabase non-PKCE flow).
// Excludes SMS types which use a different verification path.
const EMAIL_OTP_TYPES = new Set<EmailOtpType>([
  "signup", "invite", "magiclink", "recovery", "email_change", "email",
]);

export async function GET(request: NextRequest): Promise<NextResponse> {
  const { searchParams, origin } = request.nextUrl;
  const code      = searchParams.get("code");
  const tokenHash = searchParams.get("token_hash");
  const type      = searchParams.get("type");
  const next      = searchParams.get("next") ?? `/${routing.defaultLocale}/dashboard`;

  // Prevent open redirect — only allow relative paths
  const safeNext = next.startsWith("/") ? next : `/${routing.defaultLocale}/dashboard`;

  // Extract locale from the 'next' path (e.g., /fr/dashboard -> fr)
  const segments = safeNext.split("/");
  const locale = routing.locales.includes(segments[1] as any)
    ? segments[1]
    : routing.defaultLocale;

  const supabase = await createClient();

  // Path A — PKCE code flow (standard OAuth / magic link)
  // The browser client stores the code verifier in localStorage; the server
  // exchanges the code for a session using that verifier.
  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(`${origin}${safeNext}`);
    }
    console.error("[Auth Callback] Code exchange failed:", error.message);
  }

  // Path B — token_hash flow (email OTP / password recovery in some Supabase configs)
  // No PKCE verifier required — Supabase verifies the hash directly.
  if (tokenHash && type && EMAIL_OTP_TYPES.has(type as EmailOtpType)) {
    const { error } = await supabase.auth.verifyOtp({
      token_hash: tokenHash,
      type: type as EmailOtpType,
    });
    if (!error) {
      return NextResponse.redirect(`${origin}${safeNext}`);
    }
    console.error("[Auth Callback] Token hash verification failed:", error.message);
  }

  return NextResponse.redirect(`${origin}/${locale}/login?error=auth_callback_error`);
}
