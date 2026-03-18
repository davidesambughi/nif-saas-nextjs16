import { z } from "zod";

/**
 * Zod schemas for order form validation.
 * Used by both React Hook Form (client) and Server Actions (server) — single source of truth.
 */

export const personalInfoSchema = z.object({
  fullName: z
    .string()
    .min(2, "Full name must be at least 2 characters")
    .max(100),
  nationality: z.string().min(2, "Please select your nationality"),
  passportNumber: z
    .string()
    .min(5, "Passport number must be at least 5 characters")
    .max(20),
  dateOfBirth: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format (YYYY-MM-DD)"),
  address: z.string().min(10, "Please enter your full address").max(500),
});

export const serviceTierSchema = z.object({
  serviceTier: z.enum(["standard", "express"], {
    error: "Please select a service tier",
  }),
});

export const orderSchema = personalInfoSchema.merge(serviceTierSchema);

export type PersonalInfoInput = z.infer<typeof personalInfoSchema>;
export type ServiceTierInput = z.infer<typeof serviceTierSchema>;
export type OrderInput = z.infer<typeof orderSchema>;
