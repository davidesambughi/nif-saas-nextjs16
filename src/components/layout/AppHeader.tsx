import { Link } from "@/i18n/navigation";
import { getAuthUser } from "@/modules/auth/actions";
import { env } from "@/lib/env";
import LogoutButton from "./LogoutButton";

/**
 * AppHeader — minimal header for authenticated app pages.
 * Server Component: reads user server-side (no flash, no auth checks on client).
 * Shows: Logo → /dashboard | user email | logout
 */
export default async function AppHeader() {
  const user = await getAuthUser();

  return (
    <header
      className="fixed inset-x-0 top-0 z-50"
      style={{
        background: "oklch(98.5% 0.008 90 / 0.94)",
        backdropFilter: "blur(16px)",
        borderBottom: "1px solid var(--color-border)",
        boxShadow: "0 1px 12px rgba(0,0,0,0.06)",
      }}
    >
      <div className="container-full flex h-16 items-center justify-between">
        {/* Logo */}
        <Link
          href="/dashboard"
          className="flex items-center gap-2 font-bold text-xl tracking-tight"
          style={{ color: "var(--color-green)", fontFamily: "var(--font-display)" }}
        >
          <span
            className="relative flex h-9 w-9 items-center justify-center rounded-lg text-white text-xs font-bold"
            style={{ background: "var(--color-green)", fontFamily: "var(--font-sans)" }}
          >
            NIF
            <span
              className="absolute bottom-0 right-0 w-2.5 h-2.5 pointer-events-none"
              style={{
                background: "var(--color-terracotta)",
                borderRadius: "50% 0 0 0",
              }}
            />
          </span>
          <span className="hidden sm:block">GetNIFPortugal</span>
        </Link>

        {/* Right side */}
        <div className="flex items-center gap-5">
          {user?.email && (
            <span
              className="hidden sm:block text-sm"
              style={{ color: "var(--color-ink-subtle)" }}
            >
              {user.email}
            </span>
          )}
          {env.ADMIN_EMAIL && user?.email === env.ADMIN_EMAIL && (
            <Link
              href="/admin"
              className="text-sm font-semibold"
              style={{ color: "var(--color-brand-green)" }}
            >
              Admin
            </Link>
          )}
          <LogoutButton />
        </div>
      </div>
    </header>
  );
}
