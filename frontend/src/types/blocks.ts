/**
 * Block (dynamic-zone) types for the PWRL rebuild.
 *
 * These mirror the Strapi v5 `sections.*` components described in SCHEMA.md.
 * Each block carries a `__component` discriminator (Strapi convention,
 * `sections.<name>`). The `BlockRenderer` switches on it.
 *
 * Field names follow the Strapi schema; the fixture layer (`lib/fixtures.ts`)
 * adapts the raw inventory.json shape into these typed objects.
 */

/* ---------- shared sub-components ---------- */

export type CTAVariant = "primary" | "secondary" | "mint" | "link" | "underline";

export interface CTA {
  label: string;
  href: string;
  variant?: CTAVariant;
}

export interface ImageWithAlt {
  src: string;
  alt: string;
}

export interface SEO {
  title?: string;
  description?: string;
  ogImage?: string;
  noindex?: boolean;
}

/* ---------- block components ---------- */

export interface HeroBlock {
  __component: "sections.hero";
  heading: string;
  /** Small wordmark/label above the headline (e.g. "Powerlaw Corp. · Nasdaq: PWRL"). */
  eyebrow?: string;
  subheading?: string;
  body?: string[];
  /** When 2+ phrases, the headline animates through them (live-site rotator). */
  rotatingPhrases?: string[];
  /** Live home-hero rotator: standalone slides ("Powerlaw Corp.",
   *  "Nasdaq: PWRL") interleaved with a static prefix ("Only for") whose
   *  suffixes rotate ("big thinkers." → … → "everyone."). */
  headlineSlides?: string[];
  headlinePrefix?: string;
  headlineSuffixes?: string[];
  /** Live /investor-relations + /contact use a shorter hero band
   *  (min-h 300–415px, padding ~225/83 on desktop). */
  compact?: boolean;
  backgroundImage?: ImageWithAlt | null;
  /** Full-bleed autoplay/loop/muted background video URL (takes precedence over image). */
  backgroundVideo?: string | null;
  ctas?: CTA[];
}

export interface PortfolioGridItem {
  /** Short label on the tile (live: "SpaceX", "OpenAI"). */
  name: string;
  allocation: string;
  ticker?: string;
  ipo?: boolean;
  logo?: ImageWithAlt;
}

export interface IntroBlock {
  __component: "sections.intro";
  kicker?: string;
  heading: string;
  subheading?: string;
  body?: string[];
  images?: ImageWithAlt[];
  /** Live home: interactive portfolio grid above the white tail. */
  portfolioItems?: PortfolioGridItem[];
  /** Live: mint "EXPLORE THE FUND" under the portfolio grid. */
  cta?: CTA | null;
  /** Live two-column white tail: left = tailHeading + tailParagraphs + tailCta. */
  tailHeading?: string;
  tailParagraphs?: string[];
  tailCta?: CTA | null;
  /** @deprecated Live home no longer renders ACCESS/WISDOM icons here. */
  tailItems?: { icon: ImageWithAlt; label: string; body: string }[];
  /** Live: right column fund-details table in the white tail. */
  fundDetails?: { label: string; value: string }[];
  fundDetailsFootnote?: string;
}

export interface ValuePropItem {
  heading: string;
  body: string;
  icon?: ImageWithAlt | null;
}

export interface ValuePropsBlock {
  __component: "sections.value-props";
  heading: string;
  subheading?: string;
  items: ValuePropItem[];
}

export interface PhilosophyBlock {
  __component: "sections.philosophy";
  heading: string;
  subheading?: string;
  paragraphs: string[];
  supportingImages?: ImageWithAlt[];
  /** Crossfading background variants behind the panel (live /vision reuses
   *  the homepage quote slideshow). Fixture-filled; not in the CMS schema. */
  backgroundSlides?: string[];
  /** "panel" = rounded slideshow statement card (live /vision "We believe…");
   *  "band" = two-column band (live /fund strategy/process). */
  variant?: "panel" | "band";
  /** Band graphics (fixture-driven): animated sector wheel (strategy) or
   *  dotted sphere + footnoted caption (process). */
  graphic?: "sector-wheel" | "dotted-sphere";
  graphicCaption?: string;
  /** Band background; defaults to ice. */
  tone?: "ice" | "light";
  /** Band anchor id (live: investment_strategy / investment_process). */
  anchor?: string;
}

export interface TimelineEntry {
  year?: string | null;
  title: string;
  body: string;
}

export interface TimelineBlock {
  __component: "sections.timeline";
  heading: string;
  intro?: string;
  entries: TimelineEntry[];
  /** Live: full-width infographic illustration behind the lower card band. */
  backgroundGraphic?: string;
  /** Years rendered along the beam (live: 2010…2026, last one larger). */
  years?: string[];
  /** Italic caption near the final year ("…debuts on Nasdaq under ticker"). */
  beamCaption?: string;
}

export interface StatItem {
  value: string;
  label: string;
  footnote?: string;
  icon?: ImageWithAlt;
}

export interface StatsBlock {
  __component: "sections.stats-block";
  heading: string;
  /** Ivy 24/30px white lead-in (live: "More than 875 secondary…"). */
  subheading?: string;
  intro?: string;
  /** Home heritage band: multiple body paragraphs beneath the subheading. */
  body?: string[];
  stats: StatItem[];
  footnote?: string;
  cta?: CTA;
  /** "light" = home Decades of VC Expertise (white band + ice stat tiles). */
  theme?: "navy" | "light";
}

export interface PortfolioHolding {
  name: string;
  allocation: string;
}

export interface PortfolioBlock {
  __component: "sections.portfolio-block";
  heading: string;
  intro?: string;
  asOfDate?: string;
  holdings: PortfolioHolding[];
  footnotes?: string[];
  /** Live /fund splits allocation into "Exposure" (holdings) and a second
   *  "Sectors" table. */
  sectors?: PortfolioHolding[];
  sectorsFootnote?: string;
  /** "For the detailed Portfolio Schedule, click here." target. */
  scheduleHref?: string;
  /** Ice origination panel between intro and tables (live R5-4). */
  panelHeading?: string;
  panelBody?: string;
}

export type BioFormat = "prose" | "bullets";

export interface PersonCard {
  name: string;
  role: string;
  image?: ImageWithAlt | null;
  bio?: string;
  bioBullets?: string[];
  bioFormat?: BioFormat;
  alsoOnTeam?: boolean;
}

export interface TeamGridBlock {
  __component: "sections.team-grid";
  heading: string;
  subheading?: string;
  members: PersonCard[];
}

export interface BoardGridBlock {
  __component: "sections.board-grid";
  heading: string;
  subheading?: string;
  directors: PersonCard[];
}

export interface FAQItem {
  q: string;
  a: string;
}

export interface FAQBlock {
  __component: "sections.faq-block";
  heading: string;
  intro?: string;
  contactEmail?: string;
  /** Live: /vision + /fund render the FAQ on navy; default light. */
  theme?: "light" | "navy";
  faqs: FAQItem[];
}

export interface ProcessStep {
  title: string;
  body: string;
  icon?: ImageWithAlt | null;
}

export interface ProcessStepsBlock {
  __component: "sections.process-steps";
  heading: string;
  intro?: string;
  steps: ProcessStep[];
  /** Live /trade "How to Invest" centers a 48px heading; /fund "Investment
   *  Process" is left-aligned at 64px (default). */
  centered?: boolean;
}

export interface NewsItem {
  title: string;
  href: string;
  date?: string;
  source?: string;
  image?: ImageWithAlt;
}

export interface NewsListBlock {
  __component: "sections.news-list";
  heading: string;
  items: NewsItem[];
}

export interface EducationListItem {
  slug: string;
}

export interface EducationListBlock {
  __component: "sections.education-list";
  heading: string;
  viewAllHref?: string;
  items: EducationListItem[];
}

export interface EventItemBlock {
  dateTime: string;
  title: string;
  ctaLabel: string;
  ctaHref: string;
  type: "webcast" | "recording";
  image?: ImageWithAlt;
  brandPanel?: { label: string; sublabel?: string };
}

export interface EventsListBlock {
  __component: "sections.events-list";
  heading: string;
  items: EventItemBlock[];
}

export interface EducationGridBlock {
  __component: "sections.education-grid";
  heading?: string;
}

export interface DocumentItem {
  label: string;
  href: string;
}

export interface DocumentListBlock {
  __component: "sections.document-list";
  heading: string;
  kind?: "filings" | "fund-docs";
  documents: DocumentItem[];
  emptyText?: string;
  /** Small footnote under the list (e.g. EDGAR-sync status). */
  note?: string;
}

export interface CTAGroupBlock {
  __component: "sections.cta-group";
  heading: string;
  subheading?: string;
  body?: string[];
  ctas?: CTA[];
  /** Live: /vision closer = ice band with electric-blue display heading;
   *  /trade platforms = white band with 48px charcoal heading. */
  theme?: "navy" | "ice" | "light";
}

export interface PullQuoteBlock {
  __component: "sections.pull-quote";
  quote: string;
  /** Live home manifesto band: supporting copy beneath the quote. */
  subheading?: string;
  cta?: CTA | null;
  /** Optional full-bleed cover image behind the quote (black panel base). */
  backgroundImage?: ImageWithAlt | null;
  /** Live home quote: 8 full-bleed variants crossfading behind the quote. */
  backgroundSlides?: string[];
}

export interface StockInfoBlock {
  __component: "sections.stock-info";
  heading: string;
  widgetId?: string;
  theme?: string;
  notes?: string[];
  rows?: { label: string; value: string }[];
}

export interface RichTextBlock {
  __component: "sections.rich-text";
  heading?: string;
  subheading?: string;
  body: string[];
  ctas?: CTA[];
  images?: ImageWithAlt[];
  /** Live: "The Power Law" uses a 55px electric-blue heading; other prose
   *  sections (e.g. "How the portfolio gets built.") use 48px black. */
  headingStyle?: "blue" | "dark";
  /** "gradient" = the live blue-mint-gradient dark band (/trade CEF section). */
  tone?: "light" | "panel" | "gradient";
  /** Gradient variant: right-column bordered items (live /trade CEF). */
  sideItems?: { label: string; value: string }[];
}

export interface FormField {
  name: string;
  type: "text" | "email" | "textarea" | "select";
  label: string;
  placeholder?: string;
  required?: boolean;
  options?: string[];
}

export interface FormBlock {
  __component: "sections.form-block";
  heading?: string;
  body?: string[];
  portalId?: string;
  formId?: string;
  /** "deep" = the live #00158D band used for the /vision NAV signup. */
  theme?: "light" | "dark" | "deep";
  /** "inline" = the NAV-signup row (fields side by side); default stacked. */
  variant?: "inline" | "stacked";
  fields?: FormField[];
}

export interface DisclosuresBlock {
  __component: "sections.disclosures";
  disclaimers: string[];
  legalText?: string;
  effectiveDate?: string;
}

export interface AnchorNavBlock {
  __component: "sections.anchor-nav";
  items: { label: string; href: string }[];
}

export interface TruthItem {
  title: string;
  body: string;
  icon: ImageWithAlt;
}

export interface TruthsBlock {
  __component: "sections.truths";
  heading: string;
  items: TruthItem[];
  caption?: string;
  sourceLabel?: string;
  sourceHref?: string;
}

export interface PlatformItem {
  label: string;
  href: string;
  logo?: ImageWithAlt;
  group?: "self-directed" | "advisor";
}

export interface PlatformTabsBlock {
  __component: "sections.platform-tabs";
  heading?: string;
  intro?: string;
  selfDirectedLabel?: string;
  advisorLabel?: string;
  items: PlatformItem[];
}

export type Block =
  | HeroBlock
  | IntroBlock
  | AnchorNavBlock
  | TruthsBlock
  | PlatformTabsBlock
  | ValuePropsBlock
  | PhilosophyBlock
  | TimelineBlock
  | StatsBlock
  | PortfolioBlock
  | TeamGridBlock
  | BoardGridBlock
  | FAQBlock
  | ProcessStepsBlock
  | NewsListBlock
  | EducationListBlock
  | EventsListBlock
  | EducationGridBlock
  | DocumentListBlock
  | CTAGroupBlock
  | PullQuoteBlock
  | StockInfoBlock
  | RichTextBlock
  | FormBlock
  | DisclosuresBlock;

export type BlockComponent = Block["__component"];

/* ---------- page / global shapes ---------- */

export interface PageData {
  slug: string;
  title: string;
  metaDescription?: string;
  seo?: SEO;
  sections: Block[];
}

export interface NavItem {
  label: string;
  href: string;
  children?: NavItem[];
}

export interface SocialLink {
  label: string;
  href: string;
  platform: string;
}

export interface FooterLink {
  label: string;
  href: string;
}

export interface GlobalSettings {
  banner?: { text: string; href?: string } | null;
  nav: NavItem[];
  footerLinks: FooterLink[];
  socials: SocialLink[];
  disclaimers: string[];
  legalText: string;
}
