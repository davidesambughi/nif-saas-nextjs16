import AppHeader from "@/components/layout/AppHeader";

/**
 * Protected app layout — wraps dashboard, order, and other authenticated pages.
 * Auth guard is handled at the network level by proxy.ts (unauthenticated users
 * are redirected to /login before they reach this layout).
 */
export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <AppHeader />
      <main className="min-h-screen pt-16">{children}</main>
    </>
  );
}
