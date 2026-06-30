/**
 * Transforms the frontend fixtures (verbatim site content) into Strapi REST
 * payloads, matched to the ACTUAL backend schema (field names verified
 * against backend/src/api/* + components).
 */
import { readFileSync, readdirSync, existsSync } from "node:fs";
import { join } from "node:path";
import { PAGE_FIXTURES, GLOBAL_SETTINGS } from "../src/lib/fixtures";
import { LEGAL_FIXTURES } from "../src/lib/legal-fixtures";
import type { Block, PersonCard } from "../src/types/blocks";

type Payload = Record<string, unknown>;

/* ---- backend component schemas → allowed scalar keys per section ---- */
const COMPONENTS_DIR = join(import.meta.dirname, "../../backend/src/components");

interface AttrDef {
  type: string;
  component?: string;
}

function loadAttrDefs(): Map<string, Map<string, AttrDef>> {
  const map = new Map<string, Map<string, AttrDef>>();
  for (const cat of ["sections", "shared"]) {
    const dir = join(COMPONENTS_DIR, cat);
    if (!existsSync(dir)) continue;
    for (const f of readdirSync(dir)) {
      if (!f.endsWith(".json")) continue;
      const schema = JSON.parse(readFileSync(join(dir, f), "utf8"));
      const uid = `${cat}.${f.replace(/\.json$/, "")}`;
      const attrs = new Map<string, AttrDef>();
      for (const [attr, def] of Object.entries<any>(schema.attributes ?? {})) {
        // skip media + relations (those need upload/document ids)
        if (def.type === "media" || def.type === "relation") continue;
        attrs.set(attr, { type: def.type, component: def.component });
      }
      map.set(uid, attrs);
    }
  }
  return map;
}
const ATTR_DEFS = loadAttrDefs();
const STRINGISH = new Set(["string", "text", "richtext", "email", "uid"]);

/** Recursively keep only schema-known, non-media, non-relation keys. */
function sanitizeByComponent(value: unknown, componentUid: string): unknown {
  const attrs = ATTR_DEFS.get(componentUid);
  if (!attrs || typeof value !== "object" || value === null) return value;
  const sanitizeOne = (obj: Record<string, unknown>) => {
    const out: Payload = {};
    for (const [k, v] of Object.entries(obj)) {
      if (!attrs.has(k)) continue;
      const def = attrs.get(k)!;
      if (Array.isArray(v) && STRINGISH.has(def.type)) {
        out[k] = v.join("\n\n"); // prose arrays → one richtext string
      } else if (def.type === "component" && def.component) {
        out[k] = sanitizeByComponent(v, def.component);
      } else {
        out[k] = v;
      }
    }
    return out;
  };
  if (Array.isArray(value)) return value.map((item) => sanitizeOne(item as Record<string, unknown>));
  return sanitizeOne(value as Record<string, unknown>);
}

function sanitizeSection(block: Block): Payload | null {
  if (!ATTR_DEFS.has(block.__component)) return null; // unknown component
  const { __component, ...rest } = block as Record<string, unknown> & { __component: string };
  return {
    __component,
    ...(sanitizeByComponent(rest, __component) as Payload),
  };
}

function findBlocks<T extends Block["__component"]>(component: T) {
  const hits: Extract<Block, { __component: T }>[] = [];
  for (const page of Object.values(PAGE_FIXTURES)) {
    for (const s of page.sections) {
      if (s.__component === component) hits.push(s as Extract<Block, { __component: T }>);
    }
  }
  return hits;
}

const bulletsToProse = (p: PersonCard) =>
  p.bio ?? (p.bioBullets ? p.bioBullets.map((b) => `- ${b}`).join("\n") : "");

/* ---- helpers for the extended ingest (PDFs, news, forms, legal) ---- */

interface DocumentLink {
  label: string;
  href: string;
}

// fund-document.kind enum (backend schema):
// prospectus | factsheet | annual-report | semi-annual-report | shareholder-report | other
function classifyFundDocKind(label: string): string {
  const l = label.toLowerCase();
  if (/prospectus/.test(l)) return "prospectus";
  if (/factsheet|fact sheet/.test(l)) return "factsheet";
  if (/semi.?annual/.test(l)) return "semi-annual-report";
  if (/annual report/.test(l)) return "annual-report";
  if (/shareholder/.test(l)) return "shareholder-report";
  return "other";
}

// Extract the most-recent YYYY-MM-DD from a label or filename. Returns null if
// no parseable date is present.
function extractEffectiveDate(label: string, href: string): string | null {
  // labels like "(03.31.26)" or "06.04.26" — MM.DD.YY
  const dotted = `${label} ${href}`.match(/(\d{2})\.(\d{2})\.(\d{2,4})/);
  if (dotted) {
    const [, mm, dd, yyRaw] = dotted;
    const yyyy = yyRaw.length === 2 ? `20${yyRaw}` : yyRaw;
    return `${yyyy}-${mm}-${dd}`;
  }
  // dashed dates in filenames: portfolio-schedule-05.13.2026.pdf
  const dashed = href.match(/(\d{2})\.(\d{2})\.(\d{4})/);
  if (dashed) return `${dashed[3]}-${dashed[1]}-${dashed[2]}`;
  return null;
}

function findDocList(kind: "fund-docs" | "filings") {
  for (const page of Object.values(PAGE_FIXTURES)) {
    for (const s of page.sections) {
      if (s.__component === "sections.document-list" && (s as any).kind === kind) {
        return (s as any).documents as DocumentLink[];
      }
    }
  }
  return [] as DocumentLink[];
}

interface NewsItemInput {
  date: string;
  title: string;
  href: string;
  source?: string;
}

function collectNewsItems(): NewsItemInput[] {
  const seen = new Map<string, NewsItemInput>();
  for (const page of Object.values(PAGE_FIXTURES)) {
    for (const s of page.sections) {
      if (s.__component !== "sections.news-list") continue;
      for (const it of (s as any).items as NewsItemInput[]) {
        if (!seen.has(it.href)) seen.set(it.href, it);
      }
    }
  }
  return Array.from(seen.values());
}

interface FormInput {
  identifier: string;
  portalId: string;
  formId: string;
  theme?: string | null;
}

// Friendly identifiers for the known HubSpot forms. Falls back to the formId
// itself when a new form is added. Schema theme enum only allows light/dark,
// so anything else (e.g. the "deep" cosmetic variant on /vision) collapses to
// the closest valid value.
const FORM_IDENTIFIER_BY_FORM_ID: Record<string, string> = {
  "ce5f73ec-b4cd-4529-805f-6e7bdb03960a": "nav-signup",
  "2b83c383-c728-4cc1-b08c-70545c64d73c": "contact",
};
const VALID_FORM_THEMES = new Set(["light", "dark"]);

function collectForms(): FormInput[] {
  const byFormId = new Map<string, FormInput>();
  for (const page of Object.values(PAGE_FIXTURES)) {
    for (const s of page.sections) {
      if (s.__component !== "sections.form-block") continue;
      const b = s as any;
      if (!b.portalId || !b.formId) continue;
      if (byFormId.has(b.formId)) continue; // dedupe — same form referenced on multiple pages
      const rawTheme = (b.theme ?? "light") as string;
      byFormId.set(b.formId, {
        identifier: FORM_IDENTIFIER_BY_FORM_ID[b.formId] ?? `form-${b.formId.slice(0, 8)}`,
        portalId: String(b.portalId),
        formId: String(b.formId),
        theme: VALID_FORM_THEMES.has(rawTheme) ? rawTheme : "dark",
      });
    }
  }
  return Array.from(byFormId.values());
}

// Convert YYYY-MM-DD style dates from prose ("June 9, 2026") into ISO. Returns
// null when unparseable so the ingest can skip the item.
function parseLongDate(value: string): string | null {
  const t = Date.parse(value);
  if (Number.isNaN(t)) return null;
  return new Date(t).toISOString().slice(0, 10);
}

export function buildPayloads() {
  const teamGrid = findBlocks("sections.team-grid")[0];
  const boardGrid = findBlocks("sections.board-grid")[0];
  const faqBlock = findBlocks("sections.faq-block")[0];
  const portfolioBlock = findBlocks("sections.portfolio-block")[0];

  return {
    // team-member: name, role, headshot(media), bioFormat, bioProse, bioBullets, order
    teamMembers: (teamGrid?.members ?? []).map((p, i) => ({
      imagePath: p.image?.src ?? null,
      data: {
        name: p.name,
        role: p.role,
        bioFormat: p.bioFormat ?? "prose",
        bioProse: p.bio ?? null,
        bioBullets: p.bioBullets ?? null,
        order: i + 1,
      },
    })),
    // board-director: name, role, headshot(media), bio, independent, order
    boardDirectors: (boardGrid?.directors ?? []).map((p, i) => ({
      imagePath: p.image?.src ?? null,
      data: {
        name: p.name,
        role: p.role,
        bio: bulletsToProse(p),
        independent: /independent/i.test(p.role),
        order: i + 1,
      },
    })),
    // faq single: heading, items[{question, answer}]
    faq: {
      heading: faqBlock?.heading ?? "Frequently Asked Questions.",
      items: (faqBlock?.faqs ?? []).map((f) => ({ question: f.q, answer: f.a })),
    },
    // disclaimers single: paragraphs[{label, body}] + required effectiveDate
    disclaimers: {
      effectiveDate: "2026-06-09",
      paragraphs: GLOBAL_SETTINGS.disclaimers.map((body, i) => ({
        label: `Paragraph ${i + 1}`,
        body,
      })),
    },
    // global-settings single: topBanner(string), footerLinks, socialLinks, copyright
    globalSettings: {
      topBanner: GLOBAL_SETTINGS.banner?.text ?? null,
      topBannerEnabled: Boolean(GLOBAL_SETTINGS.banner),
      footerLinks: GLOBAL_SETTINGS.footerLinks.map((l) => ({
        label: l.label,
        href: l.href,
      })),
      socialLinks: GLOBAL_SETTINGS.socials.map((s) => ({
        label: s.label,
        href: s.href,
      })),
      copyright: GLOBAL_SETTINGS.legalText,
    },
    // portfolio-snapshot single: asOfDate, intro, holdings[{name, allocation, sector}], footnotes
    portfolio: {
      asOfDate: "2026-05-13",
      intro: portfolioBlock?.intro ?? null,
      holdings: (portfolioBlock?.holdings ?? []).map((h) => ({
        name: h.name,
        allocation: h.allocation,
      })),
      footnotes: [
        ...(portfolioBlock?.footnotes ?? []),
        ...(portfolioBlock?.sectors ?? []).map((s) => `${s.name}: ${s.allocation}`),
      ].join("\n\n"),
    },
    // page: title, slug, seo{title, description}, sections (filtered dynamic zone)
    // slug is a Strapi uid (no slashes): "/" → "home", "/vision" → "vision".
    pages: Object.values(PAGE_FIXTURES).map((p) => ({
      slug: p.slug === "/" ? "home" : p.slug.replace(/^\//, ""),
      data: {
        slug: p.slug === "/" ? "home" : p.slug.replace(/^\//, ""),
        title: p.title,
        seo: { title: p.title, description: p.metaDescription ?? null },
        sections: p.sections
          .map(sanitizeSection)
          .filter((s): s is Payload => s !== null),
      },
    })),

    // fund-document: title, kind(enum), file(media), effectiveDate, order
    fundDocuments: findDocList("fund-docs").map((d, i) => ({
      filePath: d.href,
      data: {
        title: d.label,
        kind: classifyFundDocKind(d.label),
        effectiveDate: extractEffectiveDate(d.label, d.href),
        order: i + 1,
      },
    })),

    // news-item: headline, date, url, source (no image field in schema)
    newsItems: collectNewsItems()
      .map((n) => ({
        headline: n.title,
        date: parseLongDate(n.date),
        url: n.href,
        source: n.source ?? null,
      }))
      .filter((n): n is Required<typeof n> & { date: string } => Boolean(n.date)),

    // form: identifier(uid), portalId, formId, theme
    forms: collectForms(),

    // legal-page: title, slug(uid), body(richtext), effectiveDate, seo
    legalPages: Object.entries(LEGAL_FIXTURES).map(([slug, p]) => ({
      slug,
      data: {
        title: p.title,
        slug,
        body: p.body,
        effectiveDate: p.effectiveDate ?? "2025-05-01",
        seo: { title: p.title, description: p.metaDescription ?? null },
      },
    })),
  };
}
