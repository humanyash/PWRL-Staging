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
  DocumentListBlock,
  GlobalSettings,
  HeroBlock,
  IntroBlock,
  NewsItem,
  NewsListBlock,
  PageData,
  PersonCard,
  PullQuoteBlock,
} from "@/types/blocks";
import { GLOBAL_SETTINGS, PAGE_SLUGS, getFixturePage } from "@/lib/fixtures";
import { isPreviewDraft } from "@/lib/preview";
import { EDUCATION_ARTICLES, type EducationArticle } from "@/lib/education";

export const STRAPI_URL =
  process.env.NEXT_PUBLIC_STRAPI_URL ??
  process.env.STRAPI_URL ??
  "http://localhost:1337";

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
  const draft = await isPreviewDraft();
  const url = new URL(path.startsWith("/") ? path : `/${path}`, STRAPI_URL);
  const params = { ...query };
  if (draft) {
    params.status = "draft";
  }
  for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v);

  const headers: HeadersInit = {};
  const previewToken = process.env.STRAPI_PREVIEW_TOKEN;
  if (draft && previewToken) {
    headers.Authorization = `Bearer ${previewToken}`;
  }

  try {
    const res = await fetch(url.toString(), {
      headers,
      ...(draft
        ? { cache: "no-store" as const }
        : { next: { revalidate: REVALIDATE_SECONDS } }),
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
const PARAGRAPH_ARRAY_FIELDS = new Set([
  "body",
  "paragraphs",
  "notes",
  "tailParagraphs",
]);

type CmsSection = { __component: string; [k: string]: unknown };

/* ------------------------------------------------------------------ */
/* CMS component/media shapes → frontend primitive shapes              */
/* ------------------------------------------------------------------ */

type MediaLike = { url?: string; alternativeText?: string | null } | null | undefined;

function mediaToImage(m: MediaLike): { src: string; alt: string } | undefined {
  return m?.url ? { src: m.url, alt: m.alternativeText ?? "" } : undefined;
}
function mediaToUrl(m: MediaLike): string | undefined {
  return m?.url ?? undefined;
}

/** [{text}] or ["a","b"] → ["a","b"]; empty/absent → undefined. */
function toTextList(v: unknown): string[] | undefined {
  if (!Array.isArray(v)) return undefined;
  const out = v
    .map((it) =>
      typeof it === "string"
        ? it
        : it && typeof it === "object" && "text" in it
          ? String((it as { text?: unknown }).text ?? "")
          : "",
    )
    .filter((s) => s.length > 0);
  return out.length ? out : undefined;
}

/** [{media,alt}] → [{src,alt}]; empty/absent → undefined. */
function toImageList(v: unknown): { src: string; alt: string }[] | undefined {
  if (!Array.isArray(v)) return undefined;
  const out = v
    .map((it) => {
      const o = it as { media?: MediaLike; alt?: string; src?: string };
      const src = o?.media?.url ?? o?.src;
      return src ? { src, alt: o?.alt ?? o?.media?.alternativeText ?? "" } : null;
    })
    .filter((x): x is { src: string; alt: string } => x !== null);
  return out.length ? out : undefined;
}

/** [{media,alt}] → ["url", …]; empty/absent → undefined. */
function toImageUrlList(v: unknown): string[] | undefined {
  return toImageList(v)?.map((i) => i.src);
}

interface CmsNavItem {
  label?: string;
  href?: string;
  children?: { label?: string; href?: string }[];
}

/** CMS nav component rows → NavItem[]; drops rows missing label/href. */
function toNavItems(v: unknown): { label: string; href: string; children?: { label: string; href: string }[] }[] | undefined {
  if (!Array.isArray(v)) return undefined;
  const out = (v as CmsNavItem[])
    .filter((n) => n?.label && n?.href)
    .map((n) => {
      const children = Array.isArray(n.children)
        ? n.children
            .filter((c) => c?.label && c?.href)
            .map((c) => ({ label: c.label as string, href: c.href as string }))
        : undefined;
      return {
        label: n.label as string,
        href: n.href as string,
        ...(children && children.length ? { children } : {}),
      };
    });
  return out.length ? out : undefined;
}

function mapItemIcon<T extends { icon?: unknown }>(items: unknown): T[] | undefined {
  if (!Array.isArray(items)) return undefined;
  return items.map((it) => {
    const copy = { ...(it as Record<string, unknown>) };
    const icon = mediaToImage(copy.icon as MediaLike);
    if (icon) copy.icon = icon;
    else delete copy.icon;
    return copy as T;
  });
}

/**
 * Convert a raw CMS section's component/media fields into the primitive shapes
 * the frontend renders (string lists, {src,alt} images, video URLs). Fields
 * that resolve to nothing are dropped so mergeSection fills them from fixtures.
 */
function normalizeCmsSection(section: CmsSection): CmsSection {
  const s: CmsSection = { ...section };
  const setOrDrop = (key: string, val: unknown) => {
    if (val === undefined) delete s[key];
    else s[key] = val;
  };

  switch (section.__component) {
    case "sections.hero":
      if ("headlineSlides" in s) setOrDrop("headlineSlides", toTextList(s.headlineSlides));
      if ("headlineSuffixes" in s) setOrDrop("headlineSuffixes", toTextList(s.headlineSuffixes));
      if ("backgroundImage" in s) setOrDrop("backgroundImage", mediaToImage(s.backgroundImage as MediaLike));
      if ("backgroundVideo" in s) setOrDrop("backgroundVideo", mediaToUrl(s.backgroundVideo as MediaLike));
      break;
    case "sections.timeline":
      if ("years" in s) setOrDrop("years", toTextList(s.years));
      if ("backgroundGraphic" in s) setOrDrop("backgroundGraphic", mediaToUrl(s.backgroundGraphic as MediaLike));
      break;
    case "sections.intro":
      if (Array.isArray(s.portfolioItems)) {
        s.portfolioItems = (s.portfolioItems as Record<string, unknown>[]).map((it) => {
          const copy = { ...it };
          const logo = mediaToImage(copy.logo as MediaLike);
          if (logo) copy.logo = logo;
          else delete copy.logo;
          return copy;
        });
      }
      break;
    case "sections.philosophy":
      if ("backgroundSlides" in s) setOrDrop("backgroundSlides", toImageUrlList(s.backgroundSlides));
      if ("supportingImages" in s) setOrDrop("supportingImages", toImageList(s.supportingImages));
      break;
    case "sections.pull-quote":
      if ("backgroundImage" in s) setOrDrop("backgroundImage", mediaToImage(s.backgroundImage as MediaLike));
      if ("backgroundSlides" in s) setOrDrop("backgroundSlides", toImageUrlList(s.backgroundSlides));
      break;
    case "sections.stats-block":
      if (Array.isArray(s.stats)) s.stats = mapItemIcon(s.stats);
      break;
    case "sections.value-props":
      if (Array.isArray(s.items)) s.items = mapItemIcon(s.items);
      break;
    case "sections.truths":
      if (Array.isArray(s.items)) s.items = mapItemIcon(s.items);
      break;
    case "sections.process-steps":
      if (Array.isArray(s.steps)) s.steps = mapItemIcon(s.steps);
      break;
    case "sections.platform-tabs":
      if (Array.isArray(s.items)) {
        s.items = (s.items as Record<string, unknown>[]).map((it) => {
          const copy = { ...it };
          const logo = mediaToImage(copy.logo as MediaLike);
          if (logo) copy.logo = logo;
          else delete copy.logo;
          return copy;
        });
      }
      break;
    case "sections.events-list":
      if (Array.isArray(s.events)) {
        s.items = (s.events as Record<string, unknown>[]).map((e) => {
          const image = mediaToImage(e.image as MediaLike);
          const brandLabel = e.brandLabel as string | undefined;
          const brandSublabel = e.brandSublabel as string | undefined;
          return {
            dateTime: e.dateTime,
            title: e.title,
            ctaLabel: e.ctaLabel,
            ctaHref: e.ctaHref,
            type: e.type,
            ...(image ? { image } : {}),
            ...(brandLabel
              ? { brandPanel: { label: brandLabel, sublabel: brandSublabel } }
              : {}),
          };
        });
        delete s.events;
      }
      break;
    case "sections.form-block": {
      // Resolve HubSpot ids from the linked Form when not typed directly.
      const rel = s.form as { portalId?: string; formId?: string } | null | undefined;
      if (rel?.portalId && !s.portalId) s.portalId = rel.portalId;
      if (rel?.formId && !s.formId) s.formId = rel.formId;
      delete s.form;
      if (Array.isArray(s.fields)) {
        s.fields = (s.fields as Record<string, unknown>[]).map((f) => {
          const copy = { ...f };
          const options = toTextList(copy.options);
          if (options) copy.options = options;
          else delete copy.options;
          return copy;
        });
      }
      break;
    }
  }
  return s;
}

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

  // Home hero body (2026-06): CMS may still carry the legacy manifesto line.
  if (
    cms.__component === "sections.hero" &&
    fixture?.__component === "sections.hero" &&
    typeof cms.body === "string" &&
    cms.body.includes("18 leading private tech companies")
  ) {
    const heroFixture = fixture as HeroBlock;
    if (heroFixture.body) out.body = heroFixture.body;
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

  return out as unknown as Block;
}

interface CmsPerson {
  name: string;
  role: string;
  bioFormat?: "prose" | "bullets";
  bioProse?: string | null;
  bioBullets?: ({ text?: string | null } | string)[] | null;
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
  // bioBullets is now a repeatable component ([{text}]); tolerate legacy string[]
  const cmsBullets = Array.isArray(p.bioBullets)
    ? p.bioBullets
        .map((b) => (typeof b === "string" ? b : (b?.text ?? "")))
        .filter((s) => s.length > 0)
    : null;
  return {
    name: p.name,
    role: p.role,
    image: p.headshot?.url
      ? { src: p.headshot.url, alt: p.headshot.alternativeText ?? p.name }
      : null,
    bioFormat: p.bioFormat ?? (cmsBullets?.length || bulletBio ? "bullets" : "prose"),
    bio: p.bioProse ?? (bulletBio ? undefined : (p.bio ?? undefined)),
    bioBullets: (cmsBullets?.length ? cmsBullets : bulletBio) ?? undefined,
  };
}

/* relation hydration — ISR caches each underlying fetch */

async function fetchTeam(): Promise<PersonCard[] | null> {
  const data = await strapiFetch<CmsPerson[]>("/api/team-members", {
    "populate[headshot]": "true",
    "populate[bioBullets]": "true",
    sort: "order",
    "pagination[pageSize]": "50",
    status: "published",
  });
  return data && data.length > 0 ? data.map(cmsPersonToCard) : null;
}

async function fetchBoard(): Promise<PersonCard[] | null> {
  const data = await strapiFetch<CmsPerson[]>("/api/board-directors", {
    "populate[headshot]": "true",
    sort: "order",
    "pagination[pageSize]": "50",
    status: "published",
  });
  return data && data.length > 0 ? data.map(cmsPersonToCard) : null;
}

async function fetchFaqItems(): Promise<{ q: string; a: string }[] | null> {
  const data = await strapiFetch<{
    heading?: string;
    items?: { question: string; answer: string }[];
  }>("/api/faq", { "populate[items]": "true", status: "published" });
  return data?.items?.length
    ? data.items.map((i) => ({ q: i.question, a: i.answer }))
    : null;
}

function formatNewsDate(iso: string): string {
  const d = new Date(`${iso}T12:00:00`);
  return d.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

interface CmsNewsRow {
  headline: string;
  date: string;
  url: string;
  source?: string | null;
  showOnHome?: boolean;
  showOnInvestorRelations?: boolean;
  thumbnail?: { url?: string; alternativeText?: string | null } | null;
}

async function fetchNewsItems(
  placement: "home" | "investor-relations",
): Promise<NewsItem[] | null> {
  const data = await strapiFetch<CmsNewsRow[]>("/api/news-items", {
    "populate[thumbnail]": "true",
    sort: "date:desc",
    "pagination[pageSize]": "50",
    status: "published",
  });
  if (!data?.length) return null;

  const filtered = data.filter((row) =>
    placement === "home"
      ? row.showOnHome !== false
      : row.showOnInvestorRelations !== false,
  );

  return filtered.map((row) => ({
    title: row.headline,
    href: row.url,
    date: row.date ? formatNewsDate(row.date) : undefined,
    source: row.source ?? undefined,
    image: row.thumbnail?.url
      ? {
          src: row.thumbnail.url,
          alt: row.thumbnail.alternativeText ?? row.headline,
        }
      : undefined,
  }));
}

async function fetchFundDocuments(): Promise<
  { label: string; href: string }[] | null
> {
  const data = await strapiFetch<
    { title: string; file?: { url?: string } | null; order?: number }[]
  >("/api/fund-documents", {
    "populate[file]": "true",
    sort: "order",
    "pagination[pageSize]": "100",
    status: "published",
  });
  const docs = data
    ?.filter((d) => d.file?.url)
    .map((d) => ({ label: d.title, href: d.file!.url! }));
  return docs?.length ? docs : null;
}

async function fetchPortfolio(): Promise<{
  asOfDate?: string;
  intro?: string;
  holdings?: { name: string; allocation: string }[];
} | null> {
  return strapiFetch("/api/portfolio-snapshot", {
    "populate[holdings]": "true",
    status: "published",
  });
}

/** Hydrate relation-backed blocks from their own CMS collections. */
async function hydrateSections(
  sections: Block[],
  pageSlug: string,
): Promise<Block[]> {
  const newsPlacement =
    pageSlug === "/" || pageSlug === "home"
      ? ("home" as const)
      : pageSlug === "/investor-relations"
        ? ("investor-relations" as const)
        : null;

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
    } else if (s.__component === "sections.news-list" && newsPlacement) {
      const block = s as NewsListBlock;
      const items = await fetchNewsItems(newsPlacement);
      const limit = block.limit ?? (newsPlacement === "home" ? 6 : 8);
      out.push(
        items?.length
          ? ({ ...block, items: items.slice(0, limit) } as Block)
          : s,
      );
    } else if (
      s.__component === "sections.document-list" &&
      (s as DocumentListBlock).kind === "fund-docs"
    ) {
      const block = s as DocumentListBlock;
      const documents = await fetchFundDocuments();
      out.push(documents ? ({ ...block, documents } as Block) : s);
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
    status: "published",
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
    return mergeSection(normalizeCmsSection(section), counterpart);
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
    sections: await hydrateSections(merged, normalized),
  };
}

/** Global settings: CMS banner/footer/socials/copyright + CMS disclaimers. */
export async function getGlobalSettings(): Promise<GlobalSettings> {
  const [settings, disclaimers] = await Promise.all([
    strapiFetch<{
      topBanner?: string | null;
      topBannerLink?: string | null;
      topBannerEnabled?: boolean;
      logo?: MediaLike;
      nav?: CmsNavItem[];
      footerLinks?: { label: string; href: string }[];
      socialLinks?: { label: string; href: string }[];
      copyright?: string | null;
    }>("/api/global-settings", {
      "populate[logo]": "true",
      "populate[nav][populate]": "children",
      "populate[footerLinks]": "true",
      "populate[socialLinks]": "true",
      status: "published",
    }),
    strapiFetch<{ paragraphs?: { body: string }[] }>("/api/disclaimers", {
      "populate[paragraphs]": "true",
      status: "published",
    }),
  ]);

  if (!settings) return GLOBAL_SETTINGS;

  const bannerEnabled = settings.topBannerEnabled !== false;
  const bannerText = settings.topBanner?.trim();
  const bannerHref = settings.topBannerLink?.trim();

  const cmsNav = toNavItems(settings.nav);

  return {
    ...GLOBAL_SETTINGS,
    banner:
      bannerEnabled && bannerText
        ? {
            text: bannerText,
            href: bannerHref || undefined,
          }
        : undefined,
    logo: mediaToImage(settings.logo) ?? GLOBAL_SETTINGS.logo,
    nav: cmsNav?.length ? cmsNav : GLOBAL_SETTINGS.nav,
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

/* ------------------------------------------------------------------ */
/* Learn articles (CMS-first, fixture fill)                            */
/* ------------------------------------------------------------------ */

interface CmsArticle {
  title: string;
  slug: string;
  date?: string | null;
  publishedLabel?: string | null;
  excerpt?: string | null;
  body?: string | null;
  cardImage?: MediaLike;
  heroImage?: MediaLike;
  sections?: { heading?: string | null; body?: string | null }[];
}

/** Split a richtext/plain string into paragraphs (blank-line separated). */
function splitParagraphs(v: string | null | undefined): string[] {
  if (!v) return [];
  return v
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter(Boolean);
}

function formatArticleDate(iso: string | null | undefined): string | undefined {
  if (!iso) return undefined;
  const t = Date.parse(iso);
  if (Number.isNaN(t)) return undefined;
  return new Date(t).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
}

/** Merge one CMS article over its fixture twin (by slug) so images/body that
 *  the CMS doesn't carry yet still render. */
function cmsArticleToEducation(a: CmsArticle): EducationArticle {
  const fixture = EDUCATION_ARTICLES.find((f) => f.slug === a.slug);
  const card = mediaToImage(a.cardImage);
  const hero = mediaToImage(a.heroImage);
  const body = splitParagraphs(a.body);
  const sections = (a.sections ?? [])
    .map((s) => ({
      heading: s.heading ?? "",
      paragraphs: splitParagraphs(s.body),
    }))
    .filter((s) => s.heading || s.paragraphs.length);
  const displayDate = a.publishedLabel?.replace(/^Published\s+/i, "").trim();
  return {
    slug: a.slug,
    title: a.title || fixture?.title || a.slug,
    date: displayDate || formatArticleDate(a.date) || fixture?.date || "",
    publishedLabel:
      a.publishedLabel ||
      (formatArticleDate(a.date)
        ? `Published ${formatArticleDate(a.date)}`
        : (fixture?.publishedLabel ?? "")),
    image: card ?? fixture?.image ?? { src: "", alt: a.title },
    heroImage: hero ?? card ?? fixture?.heroImage ?? fixture?.image,
    body: body.length ? body : (fixture?.body ?? []),
    sections: sections.length ? sections : fixture?.sections,
  };
}

/** All Learn articles: CMS-first, fixtures on failure/empty. */
export async function getEducationArticles(): Promise<EducationArticle[]> {
  const data = await strapiFetch<CmsArticle[]>("/api/education-articles", {
    "populate[cardImage]": "true",
    "populate[heroImage]": "true",
    "populate[sections]": "true",
    sort: "order",
    "pagination[pageSize]": "100",
    status: "published",
  });
  if (!data || data.length === 0) return EDUCATION_ARTICLES;
  return data.map(cmsArticleToEducation);
}

/** One Learn article by slug: CMS-first, fixture on failure. */
export async function getEducationArticleCms(
  slug: string,
): Promise<EducationArticle | null> {
  const data = await strapiFetch<CmsArticle[]>("/api/education-articles", {
    "filters[slug][$eq]": slug,
    "populate[cardImage]": "true",
    "populate[heroImage]": "true",
    "populate[sections]": "true",
    status: "published",
  });
  const cms = data?.[0];
  if (cms) return cmsArticleToEducation(cms);
  return EDUCATION_ARTICLES.find((a) => a.slug === slug) ?? null;
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
