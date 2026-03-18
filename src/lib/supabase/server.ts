import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { env } from "@/lib/env";

/**
 * Creates a Supabase client for use in Server Components, Server Actions,
 * and Route Handlers. Reads/writes session cookies server-side via next/headers.
 *
 * Usage:
 *   const supabase = await createClient();
 *   const { data: { user } } = await supabase.auth.getUser();
 */
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // setAll called from a Server Component — cookies cannot be set.
            // Session refresh in proxy.ts will handle this instead.
          }
        },
      },
    }
  );
}

/**
 * Admin client with service role key — bypasses RLS.
 * Use ONLY in trusted server-side contexts (webhooks, admin actions).
 * NEVER expose this to the client.
 */
export async function createAdminClient() {
  const cookieStore = await cookies();

  return createServerClient(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.SUPABASE_SERVICE_ROLE_KEY,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // intentionally empty — same reason as above
          }
        },
      },
    }
  );
}
