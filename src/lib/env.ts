import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

/**
 * Type-safe environment validation.
 * Throws a build-time error if any required variable is missing.
 * Eliminates all `process.env.FOO!` casts throughout the codebase.
 */
export const env = createEnv({
  /**
   * Server-side environment variables — never exposed to the client.
   */
  server: {
    DATABASE_URL: z.string(),
    SUPABASE_SECRET_KEY: z.string().min(1),
    ADMIN_EMAIL: z.string().email().optional(),
    STRIPE_SECRET_KEY: z.string().startsWith("sk_"),
    STRIPE_WEBHOOK_SECRET: z.string().startsWith("whsec_"),
    STRIPE_PRICE_ID_ESSENTIAL: z.string().startsWith("price_"),
    STRIPE_PRICE_ID_STANDARD: z.string().startsWith("price_"),
    STRIPE_PRICE_ID_PREMIUM: z.string().startsWith("price_"),
    RESEND_API_KEY: z.string().startsWith("re_"),
    RESEND_FROM_EMAIL: z.string(),
    RESEND_FROM_NAME: z.string().default("GetNIFPortugal"),
  },

  /**
   * Client-side environment variables — safe to expose to the browser.
   * Must be prefixed with NEXT_PUBLIC_.
   */
  client: {
    NEXT_PUBLIC_SUPABASE_URL: z.string(),
    NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: z.string().min(1),
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: z.string().startsWith("pk_"),
    NEXT_PUBLIC_APP_URL: z.string().default("http://localhost:3000"),
    NEXT_PUBLIC_APP_NAME: z.string().default("GetNIFPortugal"),
  },

  /**
   * Destructure all vars from process.env so t3-env can validate them.
   */
  runtimeEnv: {
    DATABASE_URL: process.env.DATABASE_URL,
    SUPABASE_SECRET_KEY: process.env.SUPABASE_SECRET_KEY,
    ADMIN_EMAIL: process.env.ADMIN_EMAIL,
    STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
    STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET,
    STRIPE_PRICE_ID_ESSENTIAL: process.env.STRIPE_PRICE_ID_ESSENTIAL,
    STRIPE_PRICE_ID_STANDARD: process.env.STRIPE_PRICE_ID_STANDARD,
    STRIPE_PRICE_ID_PREMIUM: process.env.STRIPE_PRICE_ID_PREMIUM,
    RESEND_API_KEY: process.env.RESEND_API_KEY,
    RESEND_FROM_EMAIL: process.env.RESEND_FROM_EMAIL,
    RESEND_FROM_NAME: process.env.RESEND_FROM_NAME,
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY:
      process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    NEXT_PUBLIC_APP_NAME: process.env.NEXT_PUBLIC_APP_NAME,
  },
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
});
