"use client";

import { useState } from "react";
import { Upload, CheckCircle, AlertCircle, Loader2, TriangleAlert } from "lucide-react";
import {
  getSignedUploadUrl,
  saveDocumentRecord,
  submitDocumentsAction,
  analyzeUploadedDocumentAction,
} from "@/modules/documents/actions";
import type { Order } from "@/db/schema";

interface DocumentUploadSectionProps {
  order: Pick<Order, "id" | "deadlineAt">;
}

type DocKey = "passport" | "proof_of_address";

const DOC_LABELS: Record<DocKey, { label: string; hint: string }> = {
  passport: {
    label: "Passport / National ID",
    hint: "PDF, JPG or PNG — max 10MB",
  },
  proof_of_address: {
    label: "Proof of Address",
    hint: "Utility bill or bank statement — max 3 months old",
  },
};

/**
 * State machine for a single upload slot.
 *
 * idle       → user hasn't selected a file yet
 * uploading  → file is being sent to Supabase Storage
 * checking   → AI is analyzing the document (Gemini call in progress)
 * approved   → AI found no issues
 * flagged    → AI found something suspicious (but user can still proceed)
 * error      → upload or AI call failed
 *
 * WHY a discriminated union instead of multiple booleans?
 * Booleans like isUploading + isChecking + hasError can conflict and create
 * impossible states (e.g., isUploading=true AND hasError=true). A union type
 * makes only one state valid at a time — the compiler enforces it.
 */
type SlotState =
  | { phase: "idle" }
  | { phase: "uploading" | "checking" }
  | {
      phase: "approved" | "flagged" | "error";
      fileName: string;
      issues: string[];
    };

export default function DocumentUploadSection({
  order,
}: DocumentUploadSectionProps) {
  const [slots, setSlots] = useState<Record<DocKey, SlotState>>({
    passport: { phase: "idle" },
    proof_of_address: { phase: "idle" },
  });
  const [submitLoading, setSubmitLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const deadline = order.deadlineAt ? new Date(order.deadlineAt) : null;
  const daysLeft = deadline
    ? Math.ceil((deadline.getTime() - Date.now()) / (1000 * 60 * 60 * 24))
    : null;

  // A slot is "done" (ready to submit) once it has a final verdict
  const isDone = (s: SlotState) =>
    s.phase === "approved" || s.phase === "flagged" || s.phase === "error";

  const bothDone =
    isDone(slots.passport) && isDone(slots.proof_of_address);

  const anyFlagged =
    slots.passport.phase === "flagged" ||
    slots.proof_of_address.phase === "flagged";

  const anyError =
    slots.passport.phase === "error" ||
    slots.proof_of_address.phase === "error";

  /**
   * Handles the full lifecycle for one document slot:
   * upload to storage → save record → AI analysis → update slot state.
   *
   * WHY handle each slot independently (not batched on submit)?
   * Users get immediate feedback per document. If their passport is flagged,
   * they see it right away — not after uploading both files and waiting.
   */
  async function handleFileSelect(docKey: DocKey, file: File) {
    setSlots((s) => ({ ...s, [docKey]: { phase: "uploading" } }));

    try {
      // Step 1: get a pre-signed upload URL from our server
      const urlResult = await getSignedUploadUrl(
        order.id,
        file.name,
        file.type,
        file.size
      );
      if (!urlResult.success) throw new Error(urlResult.error);

      // Step 2: PUT the file directly to Supabase Storage (bypasses our server)
      // WHY direct PUT instead of through our API?
      // Large files (up to 10MB) would time out or hit memory limits if routed
      // through a serverless function. Supabase signed URLs let the browser
      // upload directly to storage — our server only handles metadata.
      const uploadRes = await fetch(urlResult.data.signedUrl, {
        method: "PUT",
        body: file,
        headers: { "Content-Type": file.type },
      });
      if (!uploadRes.ok) throw new Error("Upload to storage failed");

      // Step 3: save the document record to our DB
      const saveResult = await saveDocumentRecord({
        orderId: order.id,
        documentType: docKey,
        fileName: file.name,
        storagePath: urlResult.data.storagePath,
        mimeType: file.type,
      });
      if (!saveResult.success) throw new Error(saveResult.error);

      // Step 4: run AI analysis — show a "checking" spinner while Gemini works
      setSlots((s) => ({ ...s, [docKey]: { phase: "checking" } }));

      const analysisResult = await analyzeUploadedDocumentAction(
        saveResult.data.id,
        order.id
      );

      if (!analysisResult.success) {
        // Analysis infrastructure failed (not a document problem) — still allow submit
        setSlots((s) => ({
          ...s,
          [docKey]: {
            phase: "error",
            fileName: file.name,
            issues: ["Automatic verification unavailable — a human will review"],
          },
        }));
        return;
      }

      const { aiStatus, issues } = analysisResult.data;
      setSlots((s) => ({
        ...s,
        [docKey]: {
          phase: aiStatus === "approved" ? "approved" : aiStatus === "flagged" ? "flagged" : "error",
          fileName: file.name,
          issues,
        },
      }));
    } catch (err) {
      // Revert to idle so the user can try again
      setSlots((s) => ({ ...s, [docKey]: { phase: "idle" } }));
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!bothDone) return;

    setSubmitLoading(true);
    setSubmitError(null);

    const result = await submitDocumentsAction(order.id);
    if (!result.success) {
      setSubmitLoading(false);
      setSubmitError(result.error ?? "Something went wrong. Please try again.");
    }
    // On success: Realtime subscription in the dashboard updates the UI automatically
  }

  return (
    <div
      className="mt-6 rounded-xl p-5 space-y-4"
      style={{
        background: "rgba(180,83,9,0.05)",
        border: "1px solid rgba(180,83,9,0.2)",
      }}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <p
            className="text-sm font-semibold"
            style={{ color: "var(--color-ink)" }}
          >
            Documents required
          </p>
          <p
            className="text-xs mt-0.5"
            style={{ color: "var(--color-ink-muted)" }}
          >
            Upload your passport and proof of address to continue.
          </p>
        </div>
        {deadline && daysLeft !== null && (
          <span
            className="shrink-0 text-xs font-semibold rounded-full px-2.5 py-1"
            style={{
              background:
                daysLeft <= 2
                  ? "rgba(220,38,38,0.1)"
                  : "rgba(180,83,9,0.1)",
              color: daysLeft <= 2 ? "#dc2626" : "#b45309",
            }}
          >
            {daysLeft > 0 ? `${daysLeft}d left` : "Overdue"}
          </span>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        {(Object.keys(DOC_LABELS) as DocKey[]).map((key) => (
          <UploadSlot
            key={key}
            label={DOC_LABELS[key].label}
            hint={DOC_LABELS[key].hint}
            state={slots[key]}
            onFileSelect={(file) => handleFileSelect(key, file)}
            disabled={submitLoading}
          />
        ))}

        {/* Warning banner — AI flagged something suspicious */}
        {anyFlagged && bothDone && (
          <div
            className="flex items-start gap-2 rounded-lg px-3 py-2.5 text-xs"
            style={{
              background: "rgba(180,83,9,0.08)",
              border: "1px solid rgba(180,83,9,0.2)",
              color: "#b45309",
            }}
          >
            <TriangleAlert size={13} className="mt-0.5 shrink-0" />
            <span>
              Our system flagged one or more documents. You can still submit —
              a human reviewer will verify everything before your NIF is processed.
            </span>
          </div>
        )}

        {/* Info banner — AI unavailable, human will review */}
        {anyError && !anyFlagged && bothDone && (
          <div
            className="flex items-start gap-2 rounded-lg px-3 py-2.5 text-xs"
            style={{
              background: "var(--color-surface-elevated)",
              border: "1px solid var(--color-border)",
              color: "var(--color-ink-muted)",
            }}
          >
            <AlertCircle size={13} className="mt-0.5 shrink-0" />
            <span>
              Automatic verification is temporarily unavailable. Your documents
              will be reviewed manually — no action needed on your end.
            </span>
          </div>
        )}

        {submitError && (
          <div
            className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm"
            style={{ background: "rgba(220,38,38,0.08)", color: "#dc2626" }}
          >
            <AlertCircle size={14} />
            {submitError}
          </div>
        )}

        <button
          type="submit"
          disabled={submitLoading || !bothDone}
          className="btn btn-primary w-full"
          style={{
            opacity: submitLoading || !bothDone ? 0.6 : 1,
          }}
        >
          {submitLoading ? (
            <span className="flex items-center justify-center gap-2">
              <Loader2 size={15} className="animate-spin" /> Submitting…
            </span>
          ) : !bothDone ? (
            "Upload both documents to continue"
          ) : anyFlagged ? (
            "Submit anyway →"
          ) : (
            "Submit Documents →"
          )}

        </button>
      </form>
    </div>
  );
}

// ─── UploadSlot ───────────────────────────────────────────────────────────────

function UploadSlot({
  label,
  hint,
  state,
  onFileSelect,
  disabled,
}: {
  label: string;
  hint: string;
  state: SlotState;
  onFileSelect: (f: File) => void;
  disabled: boolean;
}) {
  const isActive = state.phase === "uploading" || state.phase === "checking";

  return (
    <div>
      <p
        className="text-xs font-medium mb-1.5"
        style={{ color: "var(--color-ink-muted)" }}
      >
        {label}
      </p>
      <div
        className="rounded-lg border-2 border-dashed px-4 py-3 transition-all"
        style={{
          borderColor:
            state.phase === "approved"
              ? "var(--color-brand-green)"
              : state.phase === "flagged"
              ? "#d97706"
              : "var(--color-border)",
          background:
            state.phase === "approved"
              ? "rgba(0,102,0,0.04)"
              : state.phase === "flagged"
              ? "rgba(180,83,9,0.04)"
              : "var(--color-surface-elevated)",
          opacity: disabled && !isActive ? 0.7 : 1,
        }}
      >
        {/* Idle — show file picker */}
        {state.phase === "idle" && (
          <label className="cursor-pointer flex items-center justify-center gap-2">
            <Upload size={14} style={{ color: "var(--color-ink-subtle)" }} />
            <span
              className="text-xs font-semibold"
              style={{ color: "var(--color-brand-green)" }}
            >
              Choose file
            </span>
            <span
              className="text-xs"
              style={{ color: "var(--color-ink-subtle)" }}
            >
              {hint}
            </span>
            <input
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              className="sr-only"
              disabled={disabled}
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) onFileSelect(f);
              }}
            />
          </label>
        )}

        {/* Uploading / Checking — spinner with context-aware label */}
        {(state.phase === "uploading" || state.phase === "checking") && (
          <div
            className="flex items-center justify-center gap-2 text-xs"
            style={{ color: "var(--color-ink-muted)" }}
          >
            <Loader2 size={13} className="animate-spin" />
            {state.phase === "uploading" ? "Uploading…" : "Checking document…"}
          </div>
        )}

        {/* Approved */}
        {state.phase === "approved" && (
          <div className="flex items-center gap-2">
            <CheckCircle
              size={14}
              style={{ color: "var(--color-brand-green)", flexShrink: 0 }}
            />
            <span
              className="text-xs font-medium truncate"
              style={{ color: "var(--color-ink)" }}
            >
              {state.fileName}
            </span>
            <span
              className="text-xs ml-auto shrink-0"
              style={{ color: "var(--color-brand-green)" }}
            >
              Verified ✓
            </span>
          </div>
        )}

        {/* Flagged — show issues */}
        {state.phase === "flagged" && (
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <TriangleAlert
                size={13}
                style={{ color: "#d97706", flexShrink: 0 }}
              />
              <span
                className="text-xs font-medium truncate"
                style={{ color: "var(--color-ink)" }}
              >
                {state.fileName}
              </span>
              <label
                className="ml-auto shrink-0 text-xs cursor-pointer"
                style={{ color: "#d97706", textDecoration: "underline" }}
              >
                Change file
                <input
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  className="sr-only"
                  disabled={disabled}
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) onFileSelect(f);
                  }}
                />
              </label>
            </div>
            {state.issues.length > 0 && (
              <ul className="space-y-0.5 pl-5">
                {state.issues.map((issue, i) => (
                  <li key={i} className="text-xs" style={{ color: "#b45309" }}>
                    {issue}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        {/* Error — upload or AI failure */}
        {state.phase === "error" && (
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <AlertCircle
                size={13}
                style={{ color: "var(--color-ink-subtle)", flexShrink: 0 }}
              />
              <span
                className="text-xs font-medium truncate"
                style={{ color: "var(--color-ink)" }}
              >
                {state.fileName}
              </span>
              <label
                className="ml-auto shrink-0 text-xs cursor-pointer"
                style={{ color: "var(--color-ink-muted)", textDecoration: "underline" }}
              >
                Change file
                <input
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  className="sr-only"
                  disabled={disabled}
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) onFileSelect(f);
                  }}
                />
              </label>
            </div>
            {state.issues.length > 0 && (
              <p className="text-xs pl-5" style={{ color: "var(--color-ink-muted)" }}>
                {state.issues[0]}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
