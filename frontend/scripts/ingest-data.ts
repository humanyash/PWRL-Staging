/**
 * Transforms the frontend fixtures (verbatim site content) into Strapi REST
 * payloads, matched to the ACTUAL backend schema (field names verified
 * against backend/src/api/* + components).
 */
import { readFileSync, readdirSync, existsSync } from "node:fs";
import { join } from "node:path";
import { PAGE_FIXTURES, GLOBAL_SETTINGS } from "../src/lib/fixtures";
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
  };
}
