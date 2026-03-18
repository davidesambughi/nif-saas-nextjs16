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
    DATABASE_URL: z.string().url(),
    SUPABASE_SERVICE_ROLE_KEY: z.string().min(1),
    STRIPE_SECRET_KEY: z.string().startsWith("sk_"),
    STRIPE_WEBHOOK_SECRET: z.string().startsWith("whsec_"),
    STRIPE_PRICE_ID_STANDARD: z.string().startsWith("price_"),
    STRIPE_PRICE_ID_EXPRESS: z.string().startsWith("price_"),
    RESEND_API_KEY: z.string().startsWith("re_"),
    RESEND_FROM_EMAIL: z.string().email(),
    RESEND_FROM_NAME: z.string().default("GetNIFPortugal"),
  },

  /**
   * Client-side environment variables — safe to expose to the browser.
   * Must be prefixed with NEXT_PUBLIC_.
   */
  client: {
    NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
    NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1),
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: z.string().startsWith("pk_"),
    NEXT_PUBLIC_APP_URL: z.string().url().default("http://localhost:3000"),
    NEXT_PUBLIC_APP_NAME: z.string().default("GetNIFPortugal"),
  },

  /**
   * Destructure all vars from process.env so t3-env can validate them.
   */
  runtimeEnv: {
    DATABASE_URL: process.env.DATABASE_URL,
    SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
    STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
    STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET,
    STRIPE_PRICE_ID_STANDARD: process.env.STRIPE_PRICE_ID_STANDARD,
    STRIPE_PRICE_ID_EXPRESS: process.env.STRIPE_PRICE_ID_EXPRESS,
    RESEND_API_KEY: process.env.RESEND_API_KEY,
    RESEND_FROM_EMAIL: process.env.RESEND_FROM_EMAIL,
    RESEND_FROM_NAME: process.env.RESEND_FROM_NAME,
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY:
      process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    NEXT_PUBLIC_APP_NAME: process.env.NEXT_PUBLIC_APP_NAME,
  },
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
});
