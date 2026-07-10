/**
 * One-time Supabase seed. Transforms the existing fixtures into rows in the
 * custom CMS tables. Idempotent (upsert on unique slug), so it can be re-run.
 *
 * Usage (from frontend/):
 *   npx tsx scripts/seed-supabase.ts
 *
 * Requires NEXT_PUBLIC_SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY (auto-loaded
 * from frontend/.env.local if not already in the environment).
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createClient } from "@supabase/supabase-js";

import { PAGE_FIXTURES, GLOBAL_SETTINGS } from "../src/lib/fixtures";
import { EDUCATION_ARTICLES } from "../src/lib/education";
import { LEGAL_FIXTURES } from "../src/lib/legal-fixtures";

/* ---- env ---- */

function loadEnvFiles() {
  const dir = path.dirname(fileURLToPath(import.meta.url));
  // Vercel `vercel env pull` writes .env.development.local; Clerk writes .env.local.
  const files = [".env.development.local", ".env.local", ".env"];
  for (const file of files) {
    const envPath = path.join(dir, "..", file);
    if (!fs.existsSync(envPath)) continue;
    for (const line of fs.readFileSync(envPath, "utf8").split("\n")) {
      const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
      if (!m) continue;
      const key = m[1];
      let val = m[2].trim();
      if (
        (val.startsWith('"') && val.endsWith('"')) ||
        (val.startsWith("'") && val.endsWith("'"))
      ) {
        val = val.slice(1, -1);
      }
      if (!process.env[key]) process.env[key] = val;
    }
  }
}

loadEnvFiles();

const url =
  process.env.NEXT_PUBLIC_SUPABASE_URL ?? process.env.SUPABASE_URL;
const key =
  process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.SUPABASE_SERVICE_KEY;
if (!url || !key) {
  console.error(
    "Missing Supabase URL or service-role key. Provide SUPABASE_URL (or " +
      "NEXT_PUBLIC_SUPABASE_URL) and SUPABASE_SERVICE_ROLE_KEY via " +
      "frontend/.env.local or `vercel env pull`.",
  );
  process.exit(1);
}

const db = createClient(url, key, { auth: { persistSession: false } });

function toIso(dateStr: string | undefined): string | null {
  if (!dateStr) return null;
  const t = Date.parse(dateStr);
  return Number.isNaN(t) ? null : new Date(t).toISOString();
}

/* ---- seed ---- */

async function seedPages() {
  const rows = Object.entries(PAGE_FIXTURES).map(([slug, page]) => ({
    slug,
    title: page.title ?? "",
    meta_description: page.metaDescription ?? null,
    seo: page.seo ?? {},
    sections: page.sections,
    updated_at: new Date().toISOString(),
  }));
  const { error } = await db.from("pages").upsert(rows, { onConflict: "slug" });
  if (error) throw new Error(`pages: ${error.message}`);
  console.log(`  ✓ pages: ${rows.length}`);
}

async function seedGlobalSettings() {
  const g = GLOBAL_SETTINGS;
  const { error } = await db.from("global_settings").upsert(
    {
      id: 1,
      banner: g.banner ? { ...g.banner, enabled: true } : null,
      logo: g.logo ?? null,
      nav: g.nav,
      footer_links: g.footerLinks,
      socials: g.socials,
      disclaimers: g.disclaimers,
      legal_text: g.legalText,
      copyright: g.legalText,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "id" },
  );
  if (error) throw new Error(`global_settings: ${error.message}`);
  console.log("  ✓ global_settings: 1");
}

async function seedBlogPosts() {
  const rows = EDUCATION_ARTICLES.map((a, i) => ({
    slug: a.slug,
    title: a.title,
    status: "published",
    published_at: toIso(a.date),
    excerpt: a.body?.[0] ?? null,
    card_image: a.image ?? null,
    hero_image: a.heroImage ?? null,
    body: a.body ?? [],
    sections: a.sections ?? [],
    seo: {},
    sort_order: i,
    published_label: a.publishedLabel ?? null,
    date: a.date ?? null,
    updated_at: new Date().toISOString(),
  }));
  const { error } = await db
    .from("blog_posts")
    .upsert(rows, { onConflict: "slug" });
  if (error) throw new Error(`blog_posts: ${error.message}`);
  console.log(`  ✓ blog_posts: ${rows.length}`);
}

async function seedLegalPages() {
  const rows = Object.entries(LEGAL_FIXTURES).map(([slug, p]) => ({
    slug,
    title: p.title ?? "",
    meta_description: p.metaDescription ?? null,
    body: p.body,
    effective_date: p.effectiveDate ?? null,
    seo: {},
    updated_at: new Date().toISOString(),
  }));
  const { error } = await db
    .from("legal_pages")
    .upsert(rows, { onConflict: "slug" });
  if (error) throw new Error(`legal_pages: ${error.message}`);
  console.log(`  ✓ legal_pages: ${rows.length}`);
}

async function main() {
  console.log("Seeding Supabase from fixtures…");
  await seedPages();
  await seedGlobalSettings();
  await seedBlogPosts();
  await seedLegalPages();
  console.log("Done.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
