import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest): Promise<NextResponse> {
  const { searchParams, origin } = request.nextUrl;
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/en/dashboard";

  // Prevent open redirect — only allow relative paths
  const safeNext = next.startsWith("/") ? next : "/en/dashboard";

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      return NextResponse.redirect(`${origin}${safeNext}`);
    }

    console.error("[Auth Callback] Code exchange failed:", error.message);
  }

  return NextResponse.redirect(`${origin}/en/login?error=auth_callback_error`);
}
