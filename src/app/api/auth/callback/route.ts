import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { routing } from "@/i18n/routing";

export async function GET(request: NextRequest): Promise<NextResponse> {
  const { searchParams, origin } = request.nextUrl;
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? `/${routing.defaultLocale}/dashboard`;

  // Prevent open redirect — only allow relative paths
  const safeNext = next.startsWith("/") ? next : `/${routing.defaultLocale}/dashboard`;

  // Extract locale from the 'next' path (e.g., /fr/dashboard -> fr)
  const segments = safeNext.split("/");
  const locale = routing.locales.includes(segments[1] as any) 
    ? segments[1] 
    : routing.defaultLocale;

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      return NextResponse.redirect(`${origin}${safeNext}`);
    }

    console.error("[Auth Callback] Code exchange failed:", error.message);
  }

  return NextResponse.redirect(`${origin}/${locale}/login?error=auth_callback_error`);
}
