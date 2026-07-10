import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { supabaseAnonKey, supabaseUrl } from "@/lib/supabase/env";

/**
 * Anonymous, read-only Supabase client for Server Components. Relies on RLS
 * policies that expose only published content. Never carries a user session.
 */
export function getSupabaseServer(): SupabaseClient {
  const url = supabaseUrl();
  const key = supabaseAnonKey();
  if (!url || !key) {
    throw new Error(
      "Supabase not configured: set SUPABASE_URL/NEXT_PUBLIC_SUPABASE_URL and the anon key.",
    );
  }
  return createClient(url, key, { auth: { persistSession: false } });
}
