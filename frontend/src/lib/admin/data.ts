/**
 * Admin-side reads (service-role, bypasses RLS so drafts are visible). Used
 * only by the Clerk-gated /admin routes. Never import into public pages.
 */

import { getSupabaseAdmin } from "@/lib/supabase/admin";
import type { Block, SEO } from "@/types/blocks";

export interface AdminPageRow {
  slug: string;
  title: string;
  meta_description: string | null;
  seo: SEO | null;
  sections: Block[];
  updated_at: string;
}

export interface AdminBlogRow {
  id: string;
  slug: string;
  title: string;
  status: "draft" | "published";
  excerpt: string | null;
  card_image: { src: string; alt: string } | null;
  hero_image: { src: string; alt: string } | null;
  body: string[];
  sections: { heading: string; paragraphs: string[] }[];
  seo: SEO | null;
  sort_order: number;
  published_label: string | null;
  date: string | null;
  updated_at: string;
}

export interface AdminSettingsRow {
  banner: { text: string; href?: string; enabled?: boolean } | null;
  logo: { src: string; alt: string } | null;
  nav: unknown[];
  footer_links: unknown[];
  socials: unknown[];
  disclaimers: string[];
  legal_text: string | null;
}

export interface AdminLegalRow {
  slug: string;
  title: string;
  meta_description: string | null;
  body: string;
  effective_date: string | null;
}

export interface AdminMediaRow {
  id: string;
  path: string;
  url: string;
  alt: string | null;
  content_type: string | null;
  size: number | null;
  created_at: string;
}

export async function listAdminPages(): Promise<
  Pick<AdminPageRow, "slug" | "title" | "updated_at">[]
> {
  const { data } = await getSupabaseAdmin()
    .from("pages")
    .select("slug, title, updated_at")
    .order("slug", { ascending: true });
  return (data as Pick<AdminPageRow, "slug" | "title" | "updated_at">[]) ?? [];
}

export async function getAdminPage(slug: string): Promise<AdminPageRow | null> {
  const { data } = await getSupabaseAdmin()
    .from("pages")
    .select("slug, title, meta_description, seo, sections, updated_at")
    .eq("slug", slug)
    .maybeSingle<AdminPageRow>();
  return data ?? null;
}

export async function listAdminBlogPosts(): Promise<AdminBlogRow[]> {
  const { data } = await getSupabaseAdmin()
    .from("blog_posts")
    .select(
      "id, slug, title, status, excerpt, card_image, hero_image, body, sections, seo, sort_order, published_label, date, updated_at",
    )
    .order("sort_order", { ascending: true });
  return (data as AdminBlogRow[]) ?? [];
}

export async function getAdminBlogPost(
  id: string,
): Promise<AdminBlogRow | null> {
  const { data } = await getSupabaseAdmin()
    .from("blog_posts")
    .select(
      "id, slug, title, status, excerpt, card_image, hero_image, body, sections, seo, sort_order, published_label, date, updated_at",
    )
    .eq("id", id)
    .maybeSingle<AdminBlogRow>();
  return data ?? null;
}

export async function getAdminSettings(): Promise<AdminSettingsRow | null> {
  const { data } = await getSupabaseAdmin()
    .from("global_settings")
    .select("banner, logo, nav, footer_links, socials, disclaimers, legal_text")
    .eq("id", 1)
    .maybeSingle<AdminSettingsRow>();
  return data ?? null;
}

export async function listAdminLegalPages(): Promise<AdminLegalRow[]> {
  const { data } = await getSupabaseAdmin()
    .from("legal_pages")
    .select("slug, title, meta_description, body, effective_date")
    .order("slug", { ascending: true });
  return (data as AdminLegalRow[]) ?? [];
}

export async function getAdminLegalPage(
  slug: string,
): Promise<AdminLegalRow | null> {
  const { data } = await getSupabaseAdmin()
    .from("legal_pages")
    .select("slug, title, meta_description, body, effective_date")
    .eq("slug", slug)
    .maybeSingle<AdminLegalRow>();
  return data ?? null;
}

export async function listMedia(): Promise<AdminMediaRow[]> {
  const { data } = await getSupabaseAdmin()
    .from("media")
    .select("id, path, url, alt, content_type, size, created_at")
    .order("created_at", { ascending: false });
  return (data as AdminMediaRow[]) ?? [];
}
