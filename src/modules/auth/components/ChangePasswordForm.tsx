"use client";

import { useState } from "react";
import { Loader2, CheckCircle } from "lucide-react";
import { updatePassword } from "@/modules/auth/actions";

export default function ChangePasswordForm() {
  const [newPassword, setNewPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (newPassword !== confirm) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    const result = await updatePassword(newPassword);
    setLoading(false);

    if (!result.success) {
      setError(result.error ?? "Something went wrong. Please try again.");
      return;
    }

    setDone(true);
    setNewPassword("");
    setConfirm("");
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div>
        <label htmlFor="new-password" className="label">New password</label>
        <input
          id="new-password"
          type="password"
          required
          minLength={8}
          autoComplete="new-password"
          className="input"
          value={newPassword}
          onChange={(e) => { setNewPassword(e.target.value); setDone(false); }}
          placeholder="At least 8 characters"
        />
      </div>
      <div>
        <label htmlFor="confirm-password" className="label">Confirm new password</label>
        <input
          id="confirm-password"
          type="password"
          required
          minLength={8}
          autoComplete="new-password"
          className="input"
          value={confirm}
          onChange={(e) => { setConfirm(e.target.value); setDone(false); }}
          placeholder="Repeat your new password"
        />
      </div>

      {error && (
        <p className="error-text">{error}</p>
      )}

      {done && (
        <div
          className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm"
          style={{ background: "rgba(0,102,0,0.08)", color: "var(--color-brand-green)" }}
        >
          <CheckCircle size={14} />
          Password updated successfully.
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="btn btn-secondary"
        style={{ opacity: loading ? 0.7 : 1 }}
      >
        {loading ? (
          <span className="flex items-center gap-2">
            <Loader2 size={14} className="animate-spin" /> Updating…
          </span>
        ) : (
          "Update password"
        )}
      </button>
    </form>
  );
}
