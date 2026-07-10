/**
 * Content read layer — Supabase-backed, replaces the Strapi data layer.
 *
 * Content is stored already in the frontend's `Block` shape (seeded from the
 * former fixtures), so reads are a thin row→type mapping. Every function is
 * fail-safe: on a missing/unreachable Supabase it returns null/empty rather
 * than crashing the render.
 *
 * ISR: pages revalidate every 60s; admin writes call `revalidatePath` for
 * immediate updates.
 */

import type {
  Block,
  FooterLink,
  GlobalSettings,
  NavItem,
  PageData,
  SEO,
  SocialLink,
} from "@/types/blocks";
import type { EducationArticle } from "@/lib/education";
import type { LegalPageData } from "@/types/legal";
import { getSupabaseServer } from "@/lib/supabase/server";

export const REVALIDATE_SECONDS = 60;

const EMPTY_SETTINGS: GlobalSettings = {
  banner: null,
  logo: null,
  nav: [],
  footerLinks: [],
  socials: [],
  disclaimers: [],
  legalText: "",
};

/** Normalize any slug to the canonical stored form ("/", "/vision", …). */
function normalizeSlug(slug: string): string {
  if (slug === "" || slug === "/") return "/";
  return slug.startsWith("/") ? slug : `/${slug}`;
}

/* ------------------------------------------------------------------ */
/* Pages                                                               */
/* ------------------------------------------------------------------ */

interface PageRow {
  slug: string;
  title: string | null;
  meta_description: string | null;
  seo: SEO | null;
  sections: Block[] | null;
}

/** One marketing page by slug. Sections are stored ready-to-render. */
export async function getPage(slug: string): Promise<PageData | null> {
  const normalized = normalizeSlug(slug);
  try {
    const { data, error } = await getSupabaseServer()
      .from("pages")
      .select("slug, title, meta_description, seo, sections")
      .eq("slug", normalized)
      .maybeSingle<PageRow>();
    if (error || !data) return null;
    return {
      slug: normalized,
      title: data.title ?? "PWRL",
      metaDescription: data.meta_description ?? undefined,
      seo: data.seo ?? undefined,
      sections: Array.isArray(data.sections) ? data.sections : [],
    };
  } catch {
    return null;
  }
}

/** All page slugs for static generation. */
export async function getAllPageSlugs(): Promise<string[]> {
  try {
    const { data, error } = await getSupabaseServer()
      .from("pages")
      .select("slug");
    if (error || !data) return [];
    return (data as { slug: string }[]).map((p) => p.slug);
  } catch {
    return [];
  }
}

/* ------------------------------------------------------------------ */
/* Global settings                                                     */
/* ------------------------------------------------------------------ */

interface SettingsRow {
  banner: { text: string; href?: string; enabled?: boolean } | null;
  logo: { src: string; alt: string } | null;
  nav: NavItem[] | null;
  footer_links: FooterLink[] | null;
  socials: SocialLink[] | null;
  disclaimers: string[] | null;
  legal_text: string | null;
}

export async function getGlobalSettings(): Promise<GlobalSettings> {
  try {
    const { data, error } = await getSupabaseServer()
      .from("global_settings")
      .select("banner, logo, nav, footer_links, socials, disclaimers, legal_text")
      .eq("id", 1)
      .maybeSingle<SettingsRow>();
    if (error || !data) return EMPTY_SETTINGS;
    const bannerEnabled = data.banner?.enabled !== false;
    const bannerText = data.banner?.text?.trim();
    return {
      banner:
        bannerEnabled && bannerText
          ? { text: bannerText, href: data.banner?.href || undefined }
          : null,
      logo: data.logo ?? null,
      nav: data.nav ?? [],
      footerLinks: data.footer_links ?? [],
      socials: data.socials ?? [],
      disclaimers: data.disclaimers ?? [],
      legalText: data.legal_text ?? "",
    };
  } catch {
    return EMPTY_SETTINGS;
  }
}

/* ------------------------------------------------------------------ */
/* Blog / Learn articles                                               */
/* ------------------------------------------------------------------ */

interface BlogRow {
  slug: string;
  title: string | null;
  date: string | null;
  published_label: string | null;
  excerpt: string | null;
  card_image: { src: string; alt: string } | null;
  hero_image: { src: string; alt: string } | null;
  body: string[] | null;
  sections: { heading: string; paragraphs: string[] }[] | null;
}

function blogRowToArticle(row: BlogRow): EducationArticle {
  return {
    slug: row.slug,
    title: row.title ?? row.slug,
    date: row.date ?? "",
    publishedLabel: row.published_label ?? "",
    image: row.card_image ?? { src: "", alt: row.title ?? "" },
    heroImage: row.hero_image ?? row.card_image ?? undefined,
    body: Array.isArray(row.body) ? row.body : [],
    sections: Array.isArray(row.sections) ? row.sections : undefined,
  };
}

const BLOG_COLUMNS =
  "slug, title, date, published_label, excerpt, card_image, hero_image, body, sections";

/** All published Learn articles, ordered by sort_order. */
export async function getEducationArticles(): Promise<EducationArticle[]> {
  try {
    const { data, error } = await getSupabaseServer()
      .from("blog_posts")
      .select(BLOG_COLUMNS)
      .eq("status", "published")
      .order("sort_order", { ascending: true });
    if (error || !data) return [];
    return (data as BlogRow[]).map(blogRowToArticle);
  } catch {
    return [];
  }
}

/** One published Learn article by slug. */
export async function getEducationArticleCms(
  slug: string,
): Promise<EducationArticle | null> {
  try {
    const { data, error } = await getSupabaseServer()
      .from("blog_posts")
      .select(BLOG_COLUMNS)
      .eq("slug", slug)
      .eq("status", "published")
      .maybeSingle<BlogRow>();
    if (error || !data) return null;
    return blogRowToArticle(data);
  } catch {
    return null;
  }
}

/** Prev/next articles by sort order (published only). */
export async function getAdjacentArticles(slug: string): Promise<{
  prev: EducationArticle | null;
  next: EducationArticle | null;
}> {
  const articles = await getEducationArticles();
  const i = articles.findIndex((a) => a.slug === slug);
  if (i < 0) return { prev: null, next: null };
  return {
    prev: i > 0 ? articles[i - 1]! : null,
    next: i < articles.length - 1 ? articles[i + 1]! : null,
  };
}

/* ------------------------------------------------------------------ */
/* Legal pages                                                         */
/* ------------------------------------------------------------------ */

interface LegalRow {
  slug: string;
  title: string | null;
  meta_description: string | null;
  body: string | null;
  effective_date: string | null;
}

/** Legal page by slug ("legal" | "terms"). */
export async function getLegalPage(
  slug: string,
): Promise<LegalPageData | null> {
  const key = slug.replace(/^\//, "");
  try {
    const { data, error } = await getSupabaseServer()
      .from("legal_pages")
      .select("slug, title, meta_description, body, effective_date")
      .eq("slug", key)
      .maybeSingle<LegalRow>();
    if (error || !data?.body) return null;
    return {
      slug: `/${key}`,
      title: data.title ?? "PWRL",
      metaDescription: data.meta_description ?? undefined,
      body: data.body,
      effectiveDate: data.effective_date ?? undefined,
    };
  } catch {
    return null;
  }
}
