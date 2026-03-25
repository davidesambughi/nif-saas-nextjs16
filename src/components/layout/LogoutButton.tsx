"use client";

import { useRouter } from "@/i18n/navigation";
import { signOut } from "@/modules/auth/actions";
import { LogOut } from "lucide-react";
import { useState } from "react";

export default function LogoutButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleLogout() {
    setLoading(true);
    await signOut();
    router.push("/");
  }

  return (
    <button
      onClick={handleLogout}
      disabled={loading}
      className="flex items-center gap-2 text-sm font-medium transition-colors"
      style={{ color: "var(--color-ink-muted)" }}
      onMouseEnter={(e) =>
        ((e.currentTarget as HTMLElement).style.color = "var(--color-ink)")
      }
      onMouseLeave={(e) =>
        ((e.currentTarget as HTMLElement).style.color =
          "var(--color-ink-muted)")
      }
    >
      <LogOut size={15} />
      {loading ? "…" : "Sign out"}
    </button>
  );
}
