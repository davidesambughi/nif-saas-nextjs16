import { type NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import createMiddleware from "next-intl/middleware";
import { routing } from "./src/i18n/routing";

/**
 * proxy.ts — Next.js 16 network proxy layer.
 *
 * Replaces the old middleware.ts and clarifies network responsibilities:
 *   1. Handle locale detection and routing (next-intl)
 *   2. Refresh Supabase auth session cookie on every request (appending to intl response)
 *   3. Guard protected routes — redirect unauthenticated users to /login
 *
 * This file MUST NOT contain business logic. Keep it thin.
 */

const intlMiddleware = createMiddleware(routing);

const PROTECTED_PATHS = ["/dashboard", "/order", "/admin"];

export async function proxy(request: NextRequest) {
  // --- Step 1: Apply next-intl locale routing ---
  // Let next-intl generate the base response with localized rewrites
  const intlResponse = intlMiddleware(request);

  // --- Step 2: Refresh Supabase session ---
  // Create the client and append any refreshed session cookies to BOTH the request
  // (so getUser sees them) and the intlResponse (so the browser saves them).
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          cookiesToSet.forEach(({ name, value, options }) =>
            intlResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // IMPORTANT: call getUser() — not getSession() — to validate the JWT server-side
  // This call may trigger the setAll callback above if the session is refreshed.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // --- Step 3: Check protected routes ---
  // Determine current locale and clean pathname safely using routing config
  const pathname = request.nextUrl.pathname;
  
  // Find which supported locale the pathname starts with
  const locale = routing.locales.find((l) =>
    pathname === `/${l}` || pathname.startsWith(`/${l}/`)
  ) || routing.defaultLocale;

  // Strip the locale to get the "internal" pathname
  const pathnameWithoutLocale = pathname.startsWith(`/${locale}`)
    ? pathname.substring(locale.length + 1) || "/"
    : pathname;

  const isProtected = PROTECTED_PATHS.some((p) =>
    pathnameWithoutLocale.startsWith(p)
  );

  if (isProtected && !user) {
    const loginUrl = new URL(`/${locale}/login`, request.url);
    loginUrl.searchParams.set("redirectTo", request.nextUrl.pathname);
    
    // Create a new redirect response but copy the cookies we might have just refreshed
    const redirectResponse = NextResponse.redirect(loginUrl);
    intlResponse.cookies.getAll().forEach((cookie) => {
      redirectResponse.cookies.set(cookie.name, cookie.value);
    });
    return redirectResponse;
  }

  // Redirect logged-in users away from auth pages
  const isAuthPage = ["/login", "/signup"].some((p) =>
    pathnameWithoutLocale.startsWith(p)
  );

  if (isAuthPage && user) {
    const dashboardUrl = new URL(`/${locale}/dashboard`, request.url);
    
    const redirectResponse = NextResponse.redirect(dashboardUrl);
    intlResponse.cookies.getAll().forEach((cookie) => {
      redirectResponse.cookies.set(cookie.name, cookie.value);
    });
    return redirectResponse;
  }

  // Return the intlResponse which now contains both routing data and auth cookies
  return intlResponse;
}

export const config = {
  matcher: [
    // Match all paths except API, static files and Next.js internals
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
