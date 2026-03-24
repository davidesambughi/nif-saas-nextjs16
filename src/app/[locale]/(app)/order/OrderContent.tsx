"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { useTranslations, useLocale } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { createOrderAction } from "@/modules/orders/actions";
import { createCheckoutSessionAction } from "@/modules/payments/actions";
import { getSignedUploadUrl, saveDocumentRecord } from "@/modules/documents/actions";
import { personalInfoSchema } from "@/lib/validators/order";
import type { PersonalInfoInput } from "@/lib/validators/order";
import { Upload, CheckCircle, User, FileText } from "lucide-react";

type Step = 1 | 2 | 3;

interface OrderState {
  personalInfo: Partial<PersonalInfoInput>;
  serviceTier: "essential" | "standard" | "premium";
  files: { passport: File | null; address: File | null };
}

const initialState: OrderState = {
  personalInfo: {},
  serviceTier: "essential",
  files: { passport: null, address: null },
};

const STEP_ICONS = [User, Upload, CheckCircle];

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

export default function OrderContent() {
  const t = useTranslations("order");
  const locale = useLocale();
  const searchParams = useSearchParams();

  const [step, setStep] = useState<Step>(1);
  const [state, setState] = useState<OrderState>({
    ...initialState,
    serviceTier: (searchParams.get("tier") as "essential" | "standard" | "premium") ?? "essential",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  // Step 1 fields
  const [form, setForm] = useState({
    fullName: "",
    nationality: "",
    passportNumber: "",
    dateOfBirth: "",
    address: "",
  });

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
    setState((s) => ({ ...s, personalInfo: parsed.data }));
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
      // 1. Create order — pass locale so async processes (webhooks, admin)
      // can build locale-correct deep-links in emails.
      const orderResult = await createOrderAction({
        ...state.personalInfo,
        serviceTier: state.serviceTier,
      }, locale);
      if (!orderResult.success) throw new Error(orderResult.error);
      const { orderId } = orderResult.data;

      // 2. Upload documents if present
      if (state.files.passport) {
        await uploadDocument(state.files.passport, orderId, "passport");
      }
      if (state.files.address) {
        await uploadDocument(state.files.address, orderId, "proof_of_address");
      }

      // 3. Start checkout — redirect() throws internally on success
      await createCheckoutSessionAction(orderId, locale);
    } catch (err) {
      // Next.js redirect() throws a special error that must propagate
      // Check if it's a redirect by examining the error digest
      if (err && typeof err === 'object' && 'digest' in err && 
          typeof err.digest === 'string' && err.digest.startsWith('NEXT_REDIRECT')) {
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
    <div
      className="min-h-screen py-12 px-4"
      style={{ background: "var(--color-surface)" }}
    >
      <div className="container-site max-w-lg">
        <h1
          className="text-heading-lg mb-8 text-center"
          style={{ color: "var(--color-ink)" }}
        >
          {t("title")}
        </h1>

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
                      background: isDone || isActive
                        ? "var(--color-brand-green)"
                        : "var(--color-border)",
                      color: isDone || isActive ? "#ffffff" : "var(--color-ink-muted)",
                    }}
                  >
                    <Icon size={16} />
                  </div>
                  <span
                    className="text-xs font-medium text-center hidden sm:block"
                    style={{
                      color: isActive
                        ? "var(--color-brand-green)"
                        : "var(--color-ink-muted)",
                    }}
                  >
                    {label}
                  </span>
                </div>
                {i < 2 && (
                  <div
                    className="flex-1 h-px mx-2 mt-px transition-all duration-500"
                    style={{
                      background: step > stepNum
                        ? "var(--color-brand-green)"
                        : "var(--color-border)",
                    }}
                  />
                )}
              </div>
            );
          })}
        </div>

        {/* Step panels */}
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.25 }}
            >
              <form onSubmit={handleStep1Submit} className="card p-8 space-y-5">
                {(["fullName", "nationality", "passportNumber", "dateOfBirth", "address"] as const).map((field) => (
                  <div key={field}>
                    <label htmlFor={field} className="label">{t(field as "fullName")}</label>
                    <input
                      id={field}
                      type={field === "dateOfBirth" ? "date" : "text"}
                      className={`input ${errors[field] ? "error" : ""}`}
                      value={form[field]}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, [field]: e.target.value }))
                      }
                    />
                    {errors[field] && (
                      <p className="error-text">{errors[field]}</p>
                    )}
                  </div>
                ))}
                <button type="submit" className="btn btn-primary w-full">
                  {t("next")}
                </button>
              </form>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.25 }}
            >
              <form onSubmit={handleStep2Submit} className="card p-8 space-y-6">
                <DocumentUploadSlot
                  label="Passport / National ID"
                  hint="PDF, JPG or PNG — max 10MB"
                  file={state.files.passport}
                  onFileSelect={(file) =>
                    setState((s) => ({ ...s, files: { ...s.files, passport: file } }))
                  }
                />
                <DocumentUploadSlot
                  label="Proof of Address"
                  hint="Utility bill or bank statement — max 3 months old"
                  file={state.files.address}
                  onFileSelect={(file) =>
                    setState((s) => ({ ...s, files: { ...s.files, address: file } }))
                  }
                />
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="btn btn-secondary flex-1"
                  >
                    {t("back")}
                  </button>
                  <button type="submit" className="btn btn-primary flex-1">
                    {t("next")}
                  </button>
                </div>
              </form>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.25 }}
            >
              <form onSubmit={handleStep3Submit} className="card p-8 space-y-6">
                {/* Review summary */}
                <div>
                  <h3 className="text-base font-semibold mb-3" style={{ color: "var(--color-ink)" }}>
                    Personal Information
                  </h3>
                  <div className="rounded-lg p-4 space-y-2" style={{ background: "var(--color-surface)", border: "1px solid var(--color-border)" }}>
                    {Object.entries(state.personalInfo).map(([k, v]) => (
                      <div key={k} className="flex justify-between text-sm">
                        <span style={{ color: "var(--color-ink-muted)", textTransform: "capitalize" }}>
                          {k.replace(/([A-Z])/g, " $1")}
                        </span>
                        <span className="font-medium" style={{ color: "var(--color-ink)" }}>{v as string}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Service tier selector */}
                <div>
                  <h3 className="text-base font-semibold mb-3" style={{ color: "var(--color-ink)" }}>
                    Service
                  </h3>
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
                          onClick={() => setState((s) => ({ ...s, serviceTier: tier }))}
                          className="rounded-xl p-4 text-left border-2 transition-all"
                          style={{
                            borderColor: state.serviceTier === tier
                              ? "var(--color-brand-green)"
                              : "var(--color-border)",
                            background: state.serviceTier === tier
                              ? "rgba(0,102,0,0.05)"
                              : "var(--color-surface-elevated)",
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

                {errors.submit && (
                  <p className="error-text text-center">{errors.submit}</p>
                )}

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="btn btn-secondary flex-1"
                    disabled={loading}
                  >
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

// Inline DocumentUploadSlot for the order form
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
          borderColor: file
            ? "var(--color-brand-green)"
            : "var(--color-border)",
          background: file
            ? "rgba(0,102,0,0.04)"
            : "var(--color-surface-elevated)",
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
            <p className="text-sm font-medium mb-1" style={{ color: "var(--color-ink)" }}>
              Drop file here or
            </p>
            <label
              className="cursor-pointer text-sm font-semibold"
              style={{ color: "var(--color-brand-green)" }}
            >
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
