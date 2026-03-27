"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useTranslations, useLocale } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useRouter } from "@/i18n/navigation";
import { createOrderAction, getLastOrderAction } from "@/modules/orders/actions";
import { createCheckoutSessionAction } from "@/modules/payments/actions";
import { getSignedUploadUrl, saveDocumentRecord } from "@/modules/documents/actions";
import { personalInfoSchema } from "@/lib/validators/order";
import { COUNTRIES } from "@/lib/countries";
import type { PersonalInfoInput } from "@/lib/validators/order";
import { Upload, CheckCircle, User, FileText, Save } from "lucide-react";

type Step = 1 | 2 | 3;

interface OrderState {
  personalInfo: Partial<PersonalInfoInput>;
  serviceTier: "essential" | "standard" | "premium";
  files: { passport: File | null; address: File | null };
}

const initialForm = {
  fullName: "",
  nationality: "",
  passportNumber: "",
  dateOfBirth: "",
  address: "",
};

const STEP_ICONS = [User, Upload, FileText];

async function uploadDocument(
  file: File,
  orderId: string,
  documentType: "passport" | "proof_of_address"
): Promise<void> {
  const urlResult = await getSignedUploadUrl(orderId, file.name, file.type, file.size);
  if (!urlResult.success) throw new Error(urlResult.error);

  const res = await fetch(urlResult.data.signedUrl, {
    method: "PUT",
    body: file,
    headers: { "Content-Type": file.type },
  });
  if (!res.ok) throw new Error("Upload failed");

  const saveResult = await saveDocumentRecord({
    orderId,
    documentType,
    fileName: file.name,
    storagePath: urlResult.data.storagePath,
    mimeType: file.type,
  });
  if (!saveResult.success) throw new Error(saveResult.error);
}

export default function OrderContent({ userId }: { userId: string }) {
  const DRAFT_KEY = `nif_order_draft_${userId}`;
  const t = useTranslations("order");
  const locale = useLocale();
  const searchParams = useSearchParams();

  const router = useRouter();
  const [step, setStep] = useState<Step>(1);
  const [serviceTier, setServiceTier] = useState<OrderState["serviceTier"]>(
    (searchParams.get("tier") as OrderState["serviceTier"]) ?? "essential"
  );
  const [files, setFiles] = useState<OrderState["files"]>({ passport: null, address: null });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [draftSaved, setDraftSaved] = useState(false);

  const [form, setForm] = useState(initialForm);

  // Restore draft from localStorage on mount, then try to pre-fill from last order
  useEffect(() => {
    const draft = localStorage.getItem(DRAFT_KEY);
    if (draft) {
      try {
        const parsed = JSON.parse(draft);
        setForm((f) => ({ ...f, ...parsed }));
        setDraftSaved(true);
        return; // draft takes priority over last order
      } catch {
        localStorage.removeItem(DRAFT_KEY);
      }
    }

    // No draft — pre-fill from last order
    getLastOrderAction().then((result) => {
      if (result.success && result.data) {
        setForm((f) => ({ ...f, ...result.data }));
      }
    });
  }, []);

  // Auto-save draft to localStorage on every form change
  useEffect(() => {
    const hasData = Object.values(form).some((v) => v.trim() !== "");
    if (hasData) {
      localStorage.setItem(DRAFT_KEY, JSON.stringify(form));
    }
  }, [form]);

  function handleFormChange(field: keyof typeof form, value: string) {
    setForm((f) => ({ ...f, [field]: value }));
    setDraftSaved(false);
  }

  function clearDraft() {
    localStorage.removeItem(DRAFT_KEY);
  }

  async function handleStep1Submit(e: React.FormEvent) {
    e.preventDefault();
    const parsed = personalInfoSchema.safeParse(form);
    if (!parsed.success) {
      const errs: Record<string, string> = {};
      parsed.error.issues.forEach((i) => {
        if (i.path[0]) errs[i.path[0] as string] = i.message;
      });
      setErrors(errs);
      return;
    }
    setErrors({});
    setStep(2);
  }

  async function handleStep2Submit(e: React.FormEvent) {
    e.preventDefault();
    setStep(3);
  }

  async function handleStep3Submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    try {
      const orderResult = await createOrderAction({
        ...form,
        serviceTier,
      }, locale);
      if (!orderResult.success) {
        if (orderResult.code === "UNAUTHORIZED") {
          setLoading(false);
          router.push(`/login?redirectTo=/order`);
          return;
        }
        throw new Error(orderResult.error);
      }
      const { orderId } = orderResult.data;

      if (files.passport) await uploadDocument(files.passport, orderId, "passport");
      if (files.address) await uploadDocument(files.address, orderId, "proof_of_address");

      clearDraft();
      await createCheckoutSessionAction(orderId, locale);
    } catch (err) {
      if (err && typeof err === "object" && "digest" in err &&
        typeof err.digest === "string" && err.digest.startsWith("NEXT_REDIRECT")) {
        throw err;
      }
      setLoading(false);
      setErrors({
        submit: err instanceof Error ? err.message : "Something went wrong. Please try again.",
      });
    }
  }

  const steps = [t("step1"), t("step2"), t("step3")];

  return (
    <div className="min-h-screen py-12 px-4" style={{ background: "var(--color-surface)" }}>
      <div className="container-site max-w-lg">
        <h1 className="text-heading-lg mb-8 text-center" style={{ color: "var(--color-ink)" }}>
          {t("title")}
        </h1>

        {/* Draft restored banner */}
        {draftSaved && (
          <div
            className="flex items-center gap-2 rounded-lg px-4 py-2 mb-6 text-sm"
            style={{ background: "rgba(0,102,0,0.08)", color: "var(--color-brand-green)" }}
          >
            <Save size={14} />
            Draft restored — your previous progress has been loaded.
          </div>
        )}

        {/* Progress stepper */}
        <div className="flex items-center justify-between mb-10">
          {steps.map((label, i) => {
            const stepNum = (i + 1) as Step;
            const Icon = STEP_ICONS[i];
            const isDone = step > stepNum;
            const isActive = step === stepNum;

            return (
              <div key={i} className="flex items-center flex-1">
                <div className="flex flex-col items-center gap-1">
                  <div
                    className="flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold transition-all duration-300"
                    style={{
                      background: isDone || isActive ? "var(--color-brand-green)" : "var(--color-border)",
                      color: isDone || isActive ? "#ffffff" : "var(--color-ink-muted)",
                    }}
                  >
                    <Icon size={16} />
                  </div>
                  <span
                    className="text-xs font-medium text-center hidden sm:block"
                    style={{ color: isActive ? "var(--color-brand-green)" : "var(--color-ink-muted)" }}
                  >
                    {label}
                  </span>
                </div>
                {i < 2 && (
                  <div
                    className="flex-1 h-px mx-2 mt-px transition-all duration-500"
                    style={{ background: step > stepNum ? "var(--color-brand-green)" : "var(--color-border)" }}
                  />
                )}
              </div>
            );
          })}
        </div>

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.25 }}>
              <form onSubmit={handleStep1Submit} className="card p-8 space-y-5">

                {/* Full name */}
                <div>
                  <label htmlFor="fullName" className="label">{t("fullName")}</label>
                  <input
                    id="fullName"
                    type="text"
                    className={`input ${errors.fullName ? "error" : ""}`}
                    value={form.fullName}
                    onChange={(e) => handleFormChange("fullName", e.target.value)}
                    placeholder="As it appears on your passport"
                  />
                  {errors.fullName && <p className="error-text">{errors.fullName}</p>}
                </div>

                {/* Nationality */}
                <div>
                  <label htmlFor="nationality" className="label">{t("nationality")}</label>
                  <select
                    id="nationality"
                    className={`input ${errors.nationality ? "error" : ""}`}
                    value={form.nationality}
                    onChange={(e) => handleFormChange("nationality", e.target.value)}
                  >
                    <option value="">Select your nationality…</option>
                    {COUNTRIES.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                  {errors.nationality && <p className="error-text">{errors.nationality}</p>}
                </div>

                {/* Passport number */}
                <div>
                  <label htmlFor="passportNumber" className="label">{t("passportNumber")}</label>
                  <input
                    id="passportNumber"
                    type="text"
                    className={`input ${errors.passportNumber ? "error" : ""}`}
                    value={form.passportNumber}
                    onChange={(e) => handleFormChange("passportNumber", e.target.value.toUpperCase())}
                    placeholder="e.g. AA123456"
                  />
                  {errors.passportNumber && <p className="error-text">{errors.passportNumber}</p>}
                </div>

                {/* Date of birth */}
                <div>
                  <label htmlFor="dateOfBirth" className="label">{t("dateOfBirth")}</label>
                  <input
                    id="dateOfBirth"
                    type="date"
                    className={`input ${errors.dateOfBirth ? "error" : ""}`}
                    value={form.dateOfBirth}
                    onChange={(e) => handleFormChange("dateOfBirth", e.target.value)}
                    max={new Date(new Date().setFullYear(new Date().getFullYear() - 18)).toISOString().split("T")[0]}
                  />
                  {errors.dateOfBirth && <p className="error-text">{errors.dateOfBirth}</p>}
                </div>

                {/* Address */}
                <div>
                  <label htmlFor="address" className="label">{t("address")}</label>
                  <textarea
                    id="address"
                    rows={3}
                    className={`input ${errors.address ? "error" : ""}`}
                    value={form.address}
                    onChange={(e) => handleFormChange("address", e.target.value)}
                    placeholder="Street, city, country"
                  />
                  {errors.address && <p className="error-text">{errors.address}</p>}
                </div>

                {/* Auto-save note */}
                <p className="text-xs text-center" style={{ color: "var(--color-ink-subtle)" }}>
                  Your progress is saved automatically. You can close this page and return later.
                </p>

                <button type="submit" className="btn btn-primary w-full">{t("next")}</button>
              </form>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.25 }}>
              <form onSubmit={handleStep2Submit} className="card p-8 space-y-6">
                <DocumentUploadSlot
                  label="Passport / National ID"
                  hint="PDF, JPG or PNG — max 10MB"
                  file={files.passport}
                  onFileSelect={(file) => setFiles((f) => ({ ...f, passport: file }))}
                />
                <DocumentUploadSlot
                  label="Proof of Address"
                  hint="Utility bill or bank statement — max 3 months old"
                  file={files.address}
                  onFileSelect={(file) => setFiles((f) => ({ ...f, address: file }))}
                />
                <p className="text-xs text-center" style={{ color: "var(--color-ink-subtle)" }}>
                  Documents are optional here — you can upload them after payment too.
                </p>
                <div className="flex gap-3">
                  <button type="button" onClick={() => setStep(1)} className="btn btn-secondary flex-1">{t("back")}</button>
                  <button type="submit" className="btn btn-primary flex-1">{t("next")}</button>
                </div>
              </form>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.25 }}>
              <form onSubmit={handleStep3Submit} className="card p-8 space-y-6">
                {/* Review summary */}
                <div>
                  <h3 className="text-base font-semibold mb-3" style={{ color: "var(--color-ink)" }}>
                    Personal Information
                  </h3>
                  <div className="rounded-lg p-4 space-y-2" style={{ background: "var(--color-surface)", border: "1px solid var(--color-border)" }}>
                    {(Object.entries(form) as [string, string][]).map(([k, v]) => (
                      <div key={k} className="flex justify-between text-sm gap-4">
                        <span style={{ color: "var(--color-ink-muted)", textTransform: "capitalize" }}>
                          {k.replace(/([A-Z])/g, " $1")}
                        </span>
                        <span className="font-medium text-right" style={{ color: "var(--color-ink)" }}>{v}</span>
                      </div>
                    ))}
                  </div>
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="text-xs mt-2"
                    style={{ color: "var(--color-brand-green)" }}
                  >
                    Edit information
                  </button>
                </div>

                {/* Service tier selector */}
                <div>
                  <h3 className="text-base font-semibold mb-3" style={{ color: "var(--color-ink)" }}>Service</h3>
                  <div className="grid grid-cols-1 gap-3">
                    {(["essential", "standard", "premium"] as const).map((tier) => {
                      const info = {
                        essential: { price: "€79", desc: "NIF only — 7 business days" },
                        standard: { price: "€129", desc: "NIF + 1yr fiscal representation" },
                        premium: { price: "€199", desc: "NIF + 2yr fiscal rep + 48h express" },
                      }[tier];
                      return (
                        <button
                          key={tier}
                          type="button"
                          onClick={() => setServiceTier(tier)}
                          className="rounded-xl p-4 text-left border-2 transition-all"
                          style={{
                            borderColor: serviceTier === tier ? "var(--color-brand-green)" : "var(--color-border)",
                            background: serviceTier === tier ? "rgba(0,102,0,0.05)" : "var(--color-surface-elevated)",
                          }}
                        >
                          <div className="flex justify-between items-center">
                            <p className="font-semibold capitalize" style={{ color: "var(--color-ink)" }}>{tier}</p>
                            <p className="font-bold" style={{ color: "var(--color-brand-green)" }}>{info.price}</p>
                          </div>
                          <p className="text-xs mt-1" style={{ color: "var(--color-ink-muted)" }}>{info.desc}</p>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {errors.submit && <p className="error-text text-center">{errors.submit}</p>}

                <div className="flex gap-3">
                  <button type="button" onClick={() => setStep(2)} className="btn btn-secondary flex-1" disabled={loading}>
                    {t("back")}
                  </button>
                  <button
                    id="order-pay-now"
                    type="submit"
                    disabled={loading}
                    className="btn btn-primary flex-1"
                    style={{ opacity: loading ? 0.7 : 1 }}
                  >
                    {loading ? "Redirecting…" : t("payNow")}
                  </button>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

interface DocumentUploadSlotProps {
  label: string;
  hint: string;
  file: File | null;
  onFileSelect: (file: File) => void;
}

function DocumentUploadSlot({ label, hint, file, onFileSelect }: DocumentUploadSlotProps) {
  return (
    <div>
      <label className="label">{label}</label>
      <div
        className="rounded-xl border-2 border-dashed p-6 text-center transition-all"
        style={{
          borderColor: file ? "var(--color-brand-green)" : "var(--color-border)",
          background: file ? "rgba(0,102,0,0.04)" : "var(--color-surface-elevated)",
        }}
      >
        {file ? (
          <div className="flex flex-col items-center gap-1" style={{ color: "var(--color-brand-green)" }}>
            <CheckCircle size={18} />
            <span className="text-sm font-medium">{file.name}</span>
            <span className="text-xs" style={{ color: "var(--color-ink-muted)" }}>
              {(file.size / 1024 / 1024).toFixed(2)} MB
            </span>
          </div>
        ) : (
          <>
            <Upload size={24} className="mx-auto mb-2" style={{ color: "var(--color-ink-subtle)" }} />
            <p className="text-sm font-medium mb-1" style={{ color: "var(--color-ink)" }}>Drop file here or</p>
            <label className="cursor-pointer text-sm font-semibold" style={{ color: "var(--color-brand-green)" }}>
              Browse
              <input
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                className="sr-only"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) onFileSelect(f);
                }}
              />
            </label>
            <p className="text-xs mt-2" style={{ color: "var(--color-ink-subtle)" }}>{hint}</p>
          </>
        )}
      </div>
    </div>
  );
}
