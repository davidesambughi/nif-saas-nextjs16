import { type NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import createMiddleware from "next-intl/middleware";
import { routing } from "./src/i18n/routing";

/**
 * proxy.ts — Next.js 16 network proxy layer.
 *
 * Replaces the old middleware.ts and clarifies network responsibilities:
 *   1. Refresh Supabase auth session cookie on every request
 *   2. Handle locale detection and routing (next-intl)
 *   3. Guard protected routes — redirect unauthenticated users to /login
 *
 * This file MUST NOT contain business logic. Keep it thin.
 */

const intlMiddleware = createMiddleware(routing);

const PROTECTED_PATHS = ["/dashboard", "/order"];

export async function proxy(request: NextRequest) {
  // --- Step 1: Refresh Supabase session ---
  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // IMPORTANT: call getUser() — not getSession() — to validate the JWT server-side
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // --- Step 2: Check protected routes ---
  const pathname = request.nextUrl.pathname;

  // Strip locale prefix (e.g. /en/dashboard → /dashboard)
  const pathnameWithoutLocale = pathname.replace(/^\/[a-z]{2}(?=\/|$)/, "");

  const isProtected = PROTECTED_PATHS.some((p) =>
    pathnameWithoutLocale.startsWith(p)
  );

  if (isProtected && !user) {
    // Determine current locale from URL or default to "en"
    const locale = pathname.split("/")[1] || "en";
    const loginUrl = new URL(`/${locale}/login`, request.url);
    loginUrl.searchParams.set("redirectTo", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Redirect logged-in users away from auth pages
  const isAuthPage = ["/login", "/signup"].some((p) =>
    pathnameWithoutLocale.startsWith(p)
  );

  if (isAuthPage && user) {
    const locale = pathname.split("/")[1] || "en";
    return NextResponse.redirect(new URL(`/${locale}/dashboard`, request.url));
  }

  // --- Step 3: Apply next-intl locale routing ---
  const intlResponse = intlMiddleware(request);

  // If intl wants to redirect (locale detection), honour that
  if (intlResponse.status !== 200) {
    return intlResponse;
  }

  return response;
}

export const config = {
  matcher: [
    // Match all paths except static files and Next.js internals
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
