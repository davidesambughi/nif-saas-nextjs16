export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 py-16"
      style={{ background: "var(--color-surface)" }}
    >
      {children}
    </div>
  );
}
