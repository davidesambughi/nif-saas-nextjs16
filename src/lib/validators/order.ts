import { z } from "zod";
import { COUNTRIES } from "@/lib/countries";

/**
 * Zod schemas for order form validation.
 * Used by both React Hook Form (client) and Server Actions (server) — single source of truth.
 */

export const personalInfoSchema = z.object({
  fullName: z
    .string()
    .min(2, "Full name must be at least 2 characters")
    .max(100, "Full name is too long")
    .regex(/^[a-zA-ZÀ-ÖØ-öø-ÿ\s'\-]+$/, "Full name can only contain letters, spaces, hyphens and apostrophes"),

  nationality: z
    .string()
    .refine((val) => (COUNTRIES as readonly string[]).includes(val), {
      message: "Please select a valid nationality",
    }),

  passportNumber: z
    .string()
    .min(5, "Passport number must be at least 5 characters")
    .max(20, "Passport number is too long")
    .regex(/^[A-Z0-9\-]+$/i, "Passport number can only contain letters, numbers and hyphens"),

  dateOfBirth: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format")
    .refine((val) => {
      const date = new Date(val);
      if (isNaN(date.getTime())) return false;
      const today = new Date();
      const age = today.getFullYear() - date.getFullYear();
      const monthDiff = today.getMonth() - date.getMonth();
      const actualAge = monthDiff < 0 || (monthDiff === 0 && today.getDate() < date.getDate())
        ? age - 1
        : age;
      return actualAge >= 18 && actualAge <= 120;
    }, "You must be at least 18 years old"),

  address: z
    .string()
    .min(10, "Please enter your full address (street, city, country)")
    .max(500, "Address is too long"),
});

export const serviceTierSchema = z.object({
  serviceTier: z.enum(["essential", "standard", "premium"], {
    error: "Please select a service tier",
  }),
});

export const orderSchema = personalInfoSchema.merge(serviceTierSchema);

export type PersonalInfoInput = z.infer<typeof personalInfoSchema>;
export type ServiceTierInput = z.infer<typeof serviceTierSchema>;
export type OrderInput = z.infer<typeof orderSchema>;
