import { getSupabaseServer } from "@/lib/supabase/server";
import { supabaseUrl } from "@/lib/supabase/env";

/** Quick diagnostic: is the site able to read content from Supabase? */
export async function GET() {
  const url = supabaseUrl();
  if (!url) {
    return Response.json(
      {
        ok: false,
        configured: false,
        hint: "Set SUPABASE_URL (or NEXT_PUBLIC_SUPABASE_URL) and the anon key.",
      },
      { status: 200 },
    );
  }

  try {
    const { count, error } = await getSupabaseServer()
      .from("pages")
      .select("slug", { count: "exact", head: true });
    if (error) {
      return Response.json(
        { ok: false, configured: true, error: error.message },
        { status: 200 },
      );
    }
    return Response.json({
      ok: true,
      configured: true,
      source: "supabase",
      pages: count ?? 0,
    });
  } catch (err) {
    return Response.json(
      {
        ok: false,
        configured: true,
        error: err instanceof Error ? err.message : "unknown",
      },
      { status: 200 },
    );
  }
}
