"use server";

import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";

/**
 * User repository — read-only queries on the public.users table.
 *
 * public.users is a mirror of auth.users, populated by a Supabase DB trigger
 * on signup. It exists so application code can join/query user data without
 * calling the Supabase Auth Admin API on every request.
 */

/**
 * Returns the user row for a given ID, or null if not found.
 * Used by async processes (e.g. webhook handlers) that have a userId but
 * no access to the HTTP session.
 */
export async function getUserById(
  userId: string
): Promise<{ id: string; email: string; fullName: string | null } | null> {
  const [user] = await db
    .select({
      id: users.id,
      email: users.email,
      fullName: users.fullName,
    })
    .from(users)
    .where(eq(users.id, userId));
  return user ?? null;
}
