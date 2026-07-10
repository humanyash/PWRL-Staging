import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { supabaseServiceKey, supabaseUrl } from "@/lib/supabase/env";

/**
 * Service-role Supabase client. SERVER ONLY — used exclusively inside
 * Clerk-authenticated server actions and the seed script. Bypasses RLS, so it
 * must never be imported into client components.
 */
export function getSupabaseAdmin(): SupabaseClient {
  const url = supabaseUrl();
  const key = supabaseServiceKey();
  if (!url || !key) {
    throw new Error(
      "Supabase admin not configured: set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.",
    );
  }
  return createClient(url, key, { auth: { persistSession: false } });
}
