"use server";

import { createClient } from "@/lib/supabase/server";
import type { ActionResult } from "@/types/api.types";

/**
 * Auth Server Actions.
 * Thin wrappers around Supabase Auth — validation handled by Supabase.
 * All password/session logic stays server-side.
 */

export async function signUp(
  email: string,
  password: string,
  fullName: string,
  redirectTo: string
): Promise<ActionResult<{ userId: string }>> {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name: fullName },
      emailRedirectTo: redirectTo,
    },
  });

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true, data: { userId: data.user!.id } };
}

export async function signIn(
  email: string,
  password: string
): Promise<ActionResult> {
  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true, data: undefined };
}

export async function signOut(): Promise<ActionResult> {
  const supabase = await createClient();
  const { error } = await supabase.auth.signOut();

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true, data: undefined };
}

export async function getAuthUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

export async function resetPassword(
  email: string,
  redirectTo: string
): Promise<ActionResult> {
  const supabase = await createClient();
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo,
  });

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true, data: undefined };
}

export async function updatePassword(
  newPassword: string
): Promise<ActionResult> {
  const supabase = await createClient();
  const { error } = await supabase.auth.updateUser({ password: newPassword });

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true, data: undefined };
}
