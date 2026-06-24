/**
 * Strapi data layer — CMS-first with fixture fill.
 *
 * Strategy: the CMS is the source of truth for everything its schema can
 * express (all copy, lists, people, tables). Fields the schema doesn't carry
 * yet (hero rotator config, background video, form field definitions) fill
 * from the fixtures, merged per-section. So an editor's change in Strapi goes
 * live, and pixel fidelity never regresses while the schema catches up.
 *
 * Resilience: every fetch returns null on failure (network, 4xx/5xx, parse)
 * and callers fall back to fixtures — a sleeping free-tier CMS degrades to
 * the baked-in content instead of crashing the render.
 *
 * ISR: all fetches revalidate every 60s.
 */

import type {
  Block,
  AnchorNavBlock,
  FormBlock,
  GlobalSettings,
  IntroBlock,
  PageData,
  PersonCard,
  PullQuoteBlock,
} from "@/types/blocks";
import { GLOBAL_SETTINGS, PAGE_SLUGS, getFixturePage } from "@/lib/fixtures";

export const STRAPI_URL =
  process.env.NEXT_PUBLIC_STRAPI_URL ?? "http://localhost:1337";

const STRAPI_DISABLED = process.env.NEXT_PUBLIC_STRAPI_DISABLED === "true";
const REVALIDATE_SECONDS = 60;

/* ------------------------------------------------------------------ */
/* low-level fetch                                                     */
/* ------------------------------------------------------------------ */

export async function strapiFetch<T>(
  path: string,
  query: Record<string, string> = {},
): Promise<T | null> {
  if (STRAPI_DISABLED) return null;
  const url = new URL(path.startsWith("/") ? path : `/${path}`, STRAPI_URL);
  for (const [k, v] of Object.entries(query)) url.searchParams.set(k, v);
  try {
    const res = await fetch(url.toString(), {
      next: { revalidate: REVALIDATE_SECONDS },
    });
    if (!res.ok) return null;
    const json = (await res.json()) as { data?: T };
    return (json?.data ?? null) as T | null;
  } catch {
    return null;
  }
}

/* ------------------------------------------------------------------ */
/* slug mapping: frontend "/" ↔ CMS uid "home"                         */
/* ------------------------------------------------------------------ */

const toCmsSlug = (slug: string) =>
  slug === "/" || slug === "" ? "home" : slug.replace(/^\//, "");
const fromCmsSlug = (slug: string) => (slug === "home" ? "/" : `/${slug}`);

/* ------------------------------------------------------------------ */
/* CMS → block transforms                                              */
/* ------------------------------------------------------------------ */

/** Fields the fixtures store as paragraph arrays but the CMS as one string. */
const PARAGRAPH_ARRAY_FIELDS = new Set(["body", "paragraphs", "notes"]);

type CmsSection = { __component: string; [k: string]: unknown };

/**
 * Merge one CMS section over its fixture counterpart. CMS values win when
 * they are non-null; `id` bookkeeping is dropped; joined prose is split back
 * into paragraph arrays where the frontend expects arrays.
 */
function mergeSection(cms: CmsSection, fixture: Block | undefined): Block {
  const fixtureRec = fixture as Record<string, unknown> | undefined;
  const out: Record<string, unknown> = { ...(fixtureRec ?? {}) };
  out.__component = cms.__component;
  for (const [k, v] of Object.entries(cms)) {
    if (k === "id" || k === "__component" || v === null || v === undefined)
      continue;
    if (PARAGRAPH_ARRAY_FIELDS.has(k) && typeof v === "string") {
      // Always split richtext strings into paragraph arrays — components
      // type these fields as string[]. Conditioning the split on a fixture
      // counterpart crashed prerendering when a CMS section had no fixture
      // pair (deploy-hook build during the ingest window: "body.map is not
      // a function" on /vision).
      out[k] = v.split("\n\n");
    } else if (Array.isArray(v)) {
      // Repeatable components: strip Strapi `id`s and drop null fields,
      // then merge element-wise over the fixture array so fields the CMS
      // schema can't express (e.g. item icons — media is stripped at
      // ingest) still fill from the fixture.
      const fixtureArr = Array.isArray(fixtureRec?.[k])
        ? (fixtureRec[k] as unknown[])
        : [];
      // An EMPTY CMS repeatable falls back to the fixture array — wiping
      // content because an editor hasn't populated a new field yet is
      // never what we want.
      if (v.length === 0 && fixtureArr.length > 0) {
        out[k] = fixtureArr;
        continue;
      }
      out[k] = v.map((item, i) => {
        const clean =
          item && typeof item === "object"
            ? Object.fromEntries(
                Object.entries(item as object).filter(
                  ([key, val]) => key !== "id" && val !== null && val !== undefined,
                ),
              )
            : item;
        const base = fixtureArr[i];
        return base &&
          typeof base === "object" &&
          clean &&
          typeof clean === "object"
          ? { ...(base as object), ...(clean as object) }
          : clean;
      });
    } else {
      out[k] = v;
    }
  }

  // Home intro redesign (2026-06): production CMS may still carry the legacy
  // "Introducing Powerlaw Corp." copy while fixtures hold the portfolio grid.
  if (
    cms.__component === "sections.intro" &&
    fixture &&
    cms.heading === "Introducing Powerlaw Corp." &&
    (fixture as IntroBlock).portfolioItems?.length
  ) {
    const introFixture = fixture as IntroBlock;
    out.heading = introFixture.heading;
    out.body = introFixture.body;
    out.cta = introFixture.cta;
    out.subheading = undefined;
    out.tailItems = undefined;
    out.portfolioItems = introFixture.portfolioItems;
    out.fundDetails = introFixture.fundDetails;
    out.fundDetailsFootnote = introFixture.fundDetailsFootnote;
    out.tailHeading = introFixture.tailHeading;
    out.tailParagraphs = introFixture.tailParagraphs;
    out.tailCta = introFixture.tailCta;
  }

  // Home NAV band (2026-06): CMS still has the old heading / first+last fields.
  if (
    cms.__component === "sections.form-block" &&
    fixture?.__component === "sections.form-block"
  ) {
    const formFixture = fixture as FormBlock;
    if (formFixture.fields) out.fields = formFixture.fields;
    if (formFixture.body) out.body = formFixture.body;
    if (!formFixture.heading) out.heading = undefined;
  }

  // Home manifesto pull-quote (2026-06): CMS still carries the old quote/CTA.
  if (
    cms.__component === "sections.pull-quote" &&
    fixture?.__component === "sections.pull-quote" &&
    typeof cms.quote === "string" &&
    cms.quote.includes("built on the principle")
  ) {
    const quoteFixture = fixture as PullQuoteBlock;
    out.quote = quoteFixture.quote;
    out.subheading = quoteFixture.subheading;
    out.cta = quoteFixture.cta;
    out.backgroundSlides = quoteFixture.backgroundSlides;
  }

  // IR anchor tabs are tied to on-page section ids; fixtures carry the
  // current nav (Education, Events, …) until Strapi schema catches up.
  if (
    cms.__component === "sections.anchor-nav" &&
    fixture?.__component === "sections.anchor-nav"
  ) {
    const navFixture = fixture as AnchorNavBlock;
    if (navFixture.items?.length) out.items = navFixture.items;
  }

  return out as unknown as Block;
}

interface CmsPerson {
  name: string;
  role: string;
  bioFormat?: "prose" | "bullets";
  bioProse?: string | null;
  bioBullets?: string[] | null;
  bio?: string | null;
  order?: number;
  headshot?: { url?: string; alternativeText?: string | null } | null;
}

function cmsPersonToCard(p: CmsPerson): PersonCard {
  // board bios were ingested as "- bullet" lines when sourced from bullets
  const bulletBio =
    p.bio && p.bio.startsWith("- ")
      ? p.bio.split("\n").map((l) => l.replace(/^- /, ""))
      : null;
  return {
    name: p.name,
    role: p.role,
    image: p.headshot?.url
      ? { src: p.headshot.url, alt: p.headshot.alternativeText ?? p.name }
      : null,
    bioFormat: p.bioFormat ?? (bulletBio ? "bullets" : "prose"),
    bio: p.bioProse ?? (bulletBio ? undefined : (p.bio ?? undefined)),
    bioBullets: p.bioBullets ?? bulletBio ?? undefined,
  };
}

/* relation hydration — ISR caches each underlying fetch */

async function fetchTeam(): Promise<PersonCard[] | null> {
  const data = await strapiFetch<CmsPerson[]>("/api/team-members", {
    "populate[headshot]": "true",
    sort: "order",
    "pagination[pageSize]": "50",
  });
  return data && data.length > 0 ? data.map(cmsPersonToCard) : null;
}

async function fetchBoard(): Promise<PersonCard[] | null> {
  const data = await strapiFetch<CmsPerson[]>("/api/board-directors", {
    "populate[headshot]": "true",
    sort: "order",
    "pagination[pageSize]": "50",
  });
  return data && data.length > 0 ? data.map(cmsPersonToCard) : null;
}

async function fetchFaqItems(): Promise<{ q: string; a: string }[] | null> {
  const data = await strapiFetch<{
    heading?: string;
    items?: { question: string; answer: string }[];
  }>("/api/faq", { "populate[items]": "true" });
  return data?.items?.length
    ? data.items.map((i) => ({ q: i.question, a: i.answer }))
    : null;
}

async function fetchPortfolio(): Promise<{
  asOfDate?: string;
  intro?: string;
  holdings?: { name: string; allocation: string }[];
} | null> {
  return strapiFetch("/api/portfolio-snapshot", {
    "populate[holdings]": "true",
  });
}

/** Hydrate relation-backed blocks from their own CMS collections. */
async function hydrateSections(sections: Block[]): Promise<Block[]> {
  const out: Block[] = [];
  for (const s of sections) {
    if (s.__component === "sections.team-grid") {
      const members = await fetchTeam();
      out.push(members ? ({ ...s, members } as Block) : s);
    } else if (s.__component === "sections.board-grid") {
      const directors = await fetchBoard();
      out.push(directors ? ({ ...s, directors } as Block) : s);
    } else if (s.__component === "sections.faq-block") {
      const faqs = await fetchFaqItems();
      out.push(faqs ? ({ ...s, faqs } as Block) : s);
    } else if (s.__component === "sections.portfolio-block") {
      const snap = await fetchPortfolio();
      out.push(
        snap?.holdings?.length
          ? ({
              ...s,
              holdings: snap.holdings,
              intro: snap.intro ?? ("intro" in s ? s.intro : undefined),
            } as Block)
          : s,
      );
    } else {
      out.push(s);
    }
  }
  return out;
}

/* ------------------------------------------------------------------ */
/* public API                                                          */
/* ------------------------------------------------------------------ */

interface CmsPage {
  slug: string;
  title: string;
  seo?: { title?: string; description?: string | null } | null;
  sections: CmsSection[];
}

/**
 * Fetch a page by slug: CMS sections merged over the fixture baseline,
 * relations hydrated, fixture-only on CMS failure.
 */
export async function getPage(slug: string): Promise<PageData | null> {
  const normalized =
    slug === "" ? "/" : slug.startsWith("/") ? slug : `/${slug}`;
  const fixture = getFixturePage(normalized);

  const data = await strapiFetch<CmsPage[]>("/api/pages", {
    "filters[slug][$eq]": toCmsSlug(normalized),
    "populate[sections][populate]": "*",
    "populate[seo]": "true",
  });
  const cms = data?.[0];
  if (!cms || !Array.isArray(cms.sections) || cms.sections.length === 0) {
    return fixture;
  }

  // Pair CMS sections with fixture sections by component (consuming each
  // fixture section once) so editor reordering/removal in the CMS is
  // respected while unexpressed fields still fill from the fixture.
  const fixtureSections = fixture?.sections ?? [];
  const fixturePool = [...fixtureSections];
  const merged = cms.sections.map((section) => {
    const idx = fixturePool.findIndex(
      (f) => f.__component === section.__component,
    );
    const counterpart = idx >= 0 ? fixturePool.splice(idx, 1)[0] : undefined;
    return mergeSection(section, counterpart);
  });

  // CMS may not yet carry newer home sections (stats, news). Insert any
  // unconsumed fixture blocks at their intended position in page order.
  for (const fix of fixturePool) {
    const fixIndex = fixtureSections.findIndex(
      (f) => f.__component === fix.__component,
    );
    let insertAt = merged.length;
    for (let j = fixIndex + 1; j < fixtureSections.length; j++) {
      const idx = merged.findIndex(
        (m) => m.__component === fixtureSections[j].__component,
      );
      if (idx >= 0) {
        insertAt = idx;
        break;
      }
    }
    merged.splice(insertAt, 0, fix);
  }

  return {
    slug: normalized,
    title: cms.seo?.title ?? cms.title ?? fixture?.title ?? "PWRL",
    metaDescription:
      cms.seo?.description ?? fixture?.metaDescription ?? undefined,
    sections: await hydrateSections(merged),
  };
}

/** Global settings: CMS banner/footer/socials/copyright + CMS disclaimers. */
export async function getGlobalSettings(): Promise<GlobalSettings> {
  const [settings, disclaimers] = await Promise.all([
    strapiFetch<{
      topBanner?: string | null;
      topBannerEnabled?: boolean;
      footerLinks?: { label: string; href: string }[];
      socialLinks?: { label: string; href: string }[];
      copyright?: string | null;
    }>("/api/global-settings", {
      "populate[footerLinks]": "true",
      "populate[socialLinks]": "true",
    }),
    strapiFetch<{ paragraphs?: { body: string }[] }>("/api/disclaimers", {
      "populate[paragraphs]": "true",
    }),
  ]);

  if (!settings) return GLOBAL_SETTINGS;

  return {
    ...GLOBAL_SETTINGS, // nav (and the banner link) aren't in the CMS schema yet
    // Banner copy/link aren't fully modeled in CMS yet — fixtures match production.
    banner:
      settings.topBannerEnabled === false ? undefined : GLOBAL_SETTINGS.banner,
    footerLinks: settings.footerLinks?.length
      ? settings.footerLinks
      : GLOBAL_SETTINGS.footerLinks,
    socials: settings.socialLinks?.length
      ? settings.socialLinks.map((s) => ({ ...s, platform: s.label }))
      : GLOBAL_SETTINGS.socials,
    legalText: settings.copyright ?? GLOBAL_SETTINGS.legalText,
    disclaimers: disclaimers?.paragraphs?.length
      ? disclaimers.paragraphs.map((p) => p.body)
      : GLOBAL_SETTINGS.disclaimers,
  };
}

/** All page slugs for static generation (frontend-form slugs). */
export async function getAllPageSlugs(): Promise<string[]> {
  const data = await strapiFetch<{ slug: string }[]>("/api/pages", {
    "fields[0]": "slug",
    "pagination[pageSize]": "100",
  });
  if (data && data.length > 0) return data.map((p) => fromCmsSlug(p.slug));
  return PAGE_SLUGS;
}
