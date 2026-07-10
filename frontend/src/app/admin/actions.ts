"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@clerk/nextjs/server";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import type { Block, SEO } from "@/types/blocks";

async function requireUser() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");
  return userId;
}

function nowIso() {
  return new Date().toISOString();
}

/* ------------------------------ pages ------------------------------ */

export async function savePage(input: {
  slug: string;
  title: string;
  meta_description: string | null;
  seo: SEO;
  sections: Block[];
}) {
  await requireUser();
  const { error } = await getSupabaseAdmin()
    .from("pages")
    .update({
      title: input.title,
      meta_description: input.meta_description,
      seo: input.seo,
      sections: input.sections,
      updated_at: nowIso(),
    })
    .eq("slug", input.slug);
  if (error) return { ok: false as const, error: error.message };

  revalidatePath(input.slug);
  if (input.slug !== "/") revalidatePath("/");
  return { ok: true as const };
}

/* ---------------------------- settings ----------------------------- */

export async function saveSettings(input: {
  banner: { text: string; href?: string; enabled?: boolean } | null;
  logo: { src: string; alt: string } | null;
  nav: unknown[];
  footer_links: unknown[];
  socials: unknown[];
  disclaimers: string[];
  legal_text: string | null;
}) {
  await requireUser();
  const { error } = await getSupabaseAdmin()
    .from("global_settings")
    .update({
      banner: input.banner,
      logo: input.logo,
      nav: input.nav,
      footer_links: input.footer_links,
      socials: input.socials,
      disclaimers: input.disclaimers,
      legal_text: input.legal_text,
      copyright: input.legal_text,
      updated_at: nowIso(),
    })
    .eq("id", 1);
  if (error) return { ok: false as const, error: error.message };
  // Header/footer are in the root layout — revalidate the whole tree.
  revalidatePath("/", "layout");
  return { ok: true as const };
}

/* ------------------------------ legal ------------------------------ */

export async function saveLegalPage(input: {
  slug: string;
  title: string;
  meta_description: string | null;
  body: string;
  effective_date: string | null;
}) {
  await requireUser();
  const { error } = await getSupabaseAdmin()
    .from("legal_pages")
    .update({
      title: input.title,
      meta_description: input.meta_description,
      body: input.body,
      effective_date: input.effective_date,
      updated_at: nowIso(),
    })
    .eq("slug", input.slug);
  if (error) return { ok: false as const, error: error.message };
  revalidatePath(`/${input.slug}`);
  return { ok: true as const };
}

/* ------------------------------ blog ------------------------------- */

interface BlogInput {
  id?: string;
  slug: string;
  title: string;
  status: "draft" | "published";
  excerpt: string | null;
  card_image: { src: string; alt: string } | null;
  hero_image: { src: string; alt: string } | null;
  body: string[];
  sections: { heading: string; paragraphs: string[] }[];
  seo: SEO;
  published_label: string | null;
  date: string | null;
}

function revalidateBlog(slug: string) {
  revalidatePath("/learn");
  revalidatePath(`/learn/${slug}`);
  revalidatePath("/investor-relations");
}

export async function saveBlogPost(input: BlogInput) {
  await requireUser();
  const db = getSupabaseAdmin();
  const row = {
    slug: input.slug,
    title: input.title,
    status: input.status,
    excerpt: input.excerpt,
    card_image: input.card_image,
    hero_image: input.hero_image,
    body: input.body,
    sections: input.sections,
    seo: input.seo,
    published_label: input.published_label,
    date: input.date,
    published_at: input.status === "published" ? nowIso() : null,
    updated_at: nowIso(),
  };
  if (input.id) {
    const { error } = await db.from("blog_posts").update(row).eq("id", input.id);
    if (error) return { ok: false as const, error: error.message };
  } else {
    const { data: maxRow } = await db
      .from("blog_posts")
      .select("sort_order")
      .order("sort_order", { ascending: false })
      .limit(1)
      .maybeSingle<{ sort_order: number }>();
    const { data, error } = await db
      .from("blog_posts")
      .insert({ ...row, sort_order: (maxRow?.sort_order ?? -1) + 1 })
      .select("id")
      .single<{ id: string }>();
    if (error) return { ok: false as const, error: error.message };
    revalidateBlog(input.slug);
    return { ok: true as const, id: data.id };
  }
  revalidateBlog(input.slug);
  return { ok: true as const, id: input.id };
}

export async function deleteBlogPost(id: string, slug: string) {
  await requireUser();
  const { error } = await getSupabaseAdmin()
    .from("blog_posts")
    .delete()
    .eq("id", id);
  if (error) return { ok: false as const, error: error.message };
  revalidateBlog(slug);
  return { ok: true as const };
}

/* ------------------------------ media ------------------------------ */

function slugifyFilename(name: string) {
  const dot = name.lastIndexOf(".");
  const ext = dot >= 0 ? name.slice(dot).toLowerCase() : "";
  const base = (dot >= 0 ? name.slice(0, dot) : name)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
  return `${base || "file"}${ext}`;
}

export async function uploadMedia(formData: FormData) {
  await requireUser();
  const file = formData.get("file");
  if (!(file instanceof File)) {
    return { ok: false as const, error: "No file provided" };
  }
  const alt = String(formData.get("alt") ?? "");
  const db = getSupabaseAdmin();
  const path = `uploads/${Date.now()}-${slugifyFilename(file.name)}`;
  const bytes = new Uint8Array(await file.arrayBuffer());

  const { error: upErr } = await db.storage
    .from("media")
    .upload(path, bytes, {
      contentType: file.type || "application/octet-stream",
      upsert: false,
    });
  if (upErr) return { ok: false as const, error: upErr.message };

  const { data: pub } = db.storage.from("media").getPublicUrl(path);
  const url = pub.publicUrl;

  await db.from("media").insert({
    path,
    url,
    alt: alt || null,
    content_type: file.type || null,
    size: file.size,
  });

  revalidatePath("/admin/media");
  return { ok: true as const, url, path };
}

export async function deleteMedia(id: string, path: string) {
  await requireUser();
  const db = getSupabaseAdmin();
  await db.storage.from("media").remove([path]);
  const { error } = await db.from("media").delete().eq("id", id);
  if (error) return { ok: false as const, error: error.message };
  revalidatePath("/admin/media");
  return { ok: true as const };
}
