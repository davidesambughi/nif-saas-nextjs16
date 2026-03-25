"use client";

import { useState } from "react";
import { Upload, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { getSignedUploadUrl, saveDocumentRecord, submitDocumentsAction } from "@/modules/documents/actions";
import type { Order } from "@/db/schema";

interface DocumentUploadSectionProps {
  order: Pick<Order, "id" | "deadlineAt">;
}

type DocKey = "passport" | "proof_of_address";

const DOC_LABELS: Record<DocKey, { label: string; hint: string }> = {
  passport: { label: "Passport / National ID", hint: "PDF, JPG or PNG — max 10MB" },
  proof_of_address: { label: "Proof of Address", hint: "Utility bill or bank statement — max 3 months old" },
};

async function uploadDocument(file: File, orderId: string, documentType: DocKey): Promise<void> {
  const urlResult = await getSignedUploadUrl(orderId, file.name, file.type, file.size);
  if (!urlResult.success) throw new Error(urlResult.error);

  const res = await fetch(urlResult.data.signedUrl, {
    method: "PUT",
    body: file,
    headers: { "Content-Type": file.type },
  });
  if (!res.ok) throw new Error("Upload to storage failed");

  const saveResult = await saveDocumentRecord({
    orderId,
    documentType,
    fileName: file.name,
    storagePath: urlResult.data.storagePath,
    mimeType: file.type,
  });
  if (!saveResult.success) throw new Error(saveResult.error);
}

export default function DocumentUploadSection({ order }: DocumentUploadSectionProps) {
  const [files, setFiles] = useState<Record<DocKey, File | null>>({
    passport: null,
    proof_of_address: null,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const deadline = order.deadlineAt ? new Date(order.deadlineAt) : null;
  const daysLeft = deadline
    ? Math.ceil((deadline.getTime() - Date.now()) / (1000 * 60 * 60 * 24))
    : null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!files.passport || !files.proof_of_address) {
      setError("Please upload both documents before submitting.");
      return;
    }
    setLoading(true);
    setError(null);

    try {
      await uploadDocument(files.passport, order.id, "passport");
      await uploadDocument(files.proof_of_address, order.id, "proof_of_address");

      const result = await submitDocumentsAction(order.id);
      if (!result.success) throw new Error(result.error);
      // Realtime subscription will update the UI automatically
    } catch (err) {
      setLoading(false);
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    }
  }

  return (
    <div
      className="mt-6 rounded-xl p-5 space-y-4"
      style={{ background: "rgba(180,83,9,0.05)", border: "1px solid rgba(180,83,9,0.2)" }}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold" style={{ color: "var(--color-ink)" }}>
            Documents required
          </p>
          <p className="text-xs mt-0.5" style={{ color: "var(--color-ink-muted)" }}>
            Upload your passport and proof of address to continue.
          </p>
        </div>
        {deadline && daysLeft !== null && (
          <span
            className="shrink-0 text-xs font-semibold rounded-full px-2.5 py-1"
            style={{
              background: daysLeft <= 2 ? "rgba(220,38,38,0.1)" : "rgba(180,83,9,0.1)",
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
            file={files[key]}
            onFileSelect={(file) => setFiles((f) => ({ ...f, [key]: file }))}
            disabled={loading}
          />
        ))}

        {error && (
          <div
            className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm"
            style={{ background: "rgba(220,38,38,0.08)", color: "#dc2626" }}
          >
            <AlertCircle size={14} />
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading || !files.passport || !files.proof_of_address}
          className="btn btn-primary w-full"
          style={{ opacity: loading || !files.passport || !files.proof_of_address ? 0.6 : 1 }}
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <Loader2 size={15} className="animate-spin" /> Uploading…
            </span>
          ) : (
            "Submit Documents"
          )}
        </button>
      </form>
    </div>
  );
}

function UploadSlot({
  label, hint, file, onFileSelect, disabled,
}: {
  label: string;
  hint: string;
  file: File | null;
  onFileSelect: (f: File) => void;
  disabled: boolean;
}) {
  return (
    <div>
      <p className="text-xs font-medium mb-1.5" style={{ color: "var(--color-ink-muted)" }}>{label}</p>
      <div
        className="rounded-lg border-2 border-dashed px-4 py-3 text-center transition-all"
        style={{
          borderColor: file ? "var(--color-brand-green)" : "var(--color-border)",
          background: file ? "rgba(0,102,0,0.04)" : "var(--color-surface-elevated)",
          opacity: disabled ? 0.7 : 1,
        }}
      >
        {file ? (
          <div className="flex items-center justify-center gap-2" style={{ color: "var(--color-brand-green)" }}>
            <CheckCircle size={14} />
            <span className="text-xs font-medium">{file.name}</span>
            <span className="text-xs" style={{ color: "var(--color-ink-muted)" }}>
              ({(file.size / 1024 / 1024).toFixed(1)} MB)
            </span>
          </div>
        ) : (
          <label className="cursor-pointer flex items-center justify-center gap-2">
            <Upload size={14} style={{ color: "var(--color-ink-subtle)" }} />
            <span className="text-xs font-semibold" style={{ color: "var(--color-brand-green)" }}>
              Choose file
            </span>
            <span className="text-xs" style={{ color: "var(--color-ink-subtle)" }}>{hint}</span>
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
      </div>
    </div>
  );
}
