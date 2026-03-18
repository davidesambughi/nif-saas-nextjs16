"use client";

import { createBrowserClient } from "@supabase/ssr";
import { env } from "@/lib/env";

/**
 * Singleton Supabase browser client.
 * Use in Client Components for auth state, Realtime subscriptions, and storage uploads.
 *
 * Usage:
 *   const supabase = createClient();
 *   const { data } = await supabase.storage.from('documents').upload(...)
 */
export function createClient() {
  return createBrowserClient(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}
