# pwrl.com Content Inventory

Source: `https://www.powerlawfunds.com/pwrl/*` (canonical), redirected from `pwrl.com`.
Crawl method: server-rendered HTML pulled with curl + parsed with Python/BeautifulSoup.
Crawl date: 2026-06-09.

Artefacts in this folder:

- `html/00-home.html` … `html/05-contact.html` — raw HTML snapshots
- `inventory.json` — structured page/section/component inventory
- `INVENTORY.md` — this file

## Counts

| Metric | Value |
|---|---|
| Pages crawled | **6** |
| Total sections identified | **36** |
| Distinct section/component types | **17** |
| HubSpot forms | **2** (NAV alert + Contact) |
| Third-party embeds | **4** (HubSpot tracking, GTM, InvestingChannel, Adobe Typekit) |
| Unique image URLs referenced | **57** |

## Pages

| Path | Title | Sections (anchors) |
|---|---|---|
| `/pwrl` | PWRL — Private Tech, Nasdaq Listed. | hero, email (NAV form), introducing-powerlaw-corp, principle pull-quote, a-history-of-firsts (timeline) |
| `/pwrl/vision` | PWRL — Private Tech, Nasdaq Listed. | hero, #strategy, #difference, #team, #heritage, #investing, email, #faq + extra "Power Law" prose block |
| `/pwrl/fund` | PWRL — Private Tech, Nasdaq Listed. | hero, #portfolio, #investment_strategy, #investment_process, email, #faq, "How the portfolio gets built", "Exposure", "Sectors", "Stock Info" |
| `/pwrl/trade` | PWRL — Private Tech, Nasdaq Listed. | hero, #where-how (4-step process), #cef-overview, email, "Available on all major brokerage platforms" |
| `/pwrl/investor-relations` | PWRL — Private Tech, Nasdaq Listed. | hero, #news (8 items), #directors (6), #sec-filings, #fund-documents (9 PDFs) |
| `/pwrl/contact` | PWRL — Private Tech, Nasdaq Listed. | hero, contact-form |

Note: every page has the same `<title>` and `<meta name="description">`. Per-page SEO copy is **not** being authored today — this should become a Strapi field per page.

## Identified component types → Strapi dynamic-zone candidates

All 17 unique types found across the site, with frequency and notes for content modelling:

| Type | Count | Schema sketch |
|---|---|---|
| **Hero** | 6 | `heading`, optional `subheading`, `bodyCopy[]`, optional `rotatingPhrases[]` (home animates 4–5 "Only for X" phrases), `backgroundImage`, `ctas[]` |
| **FormBlock** | 6 | `heading?`, `bodyCopy?`, `hubspotPortalId`, `hubspotFormId`, theme variant (dark NAV vs. contact) |
| **FAQ** | 2 | `heading`, `faqs[]: { q, a }` — 7 items each (identical content on /vision and /fund) |
| **TeamGrid** | 2 | `heading`, `subheading?`, `members[]: { name, role, headshot, bio }` |
| **Philosophy** | 3 | Big-statement heading + supporting paragraphs + supporting images |
| **Timeline** | 1 | `heading`, `intro?`, `entries[]: { year?, title, body }` (home) |
| **StatsBlock** | 1 | `heading`, `intro`, `stats[]: { value, label, footnote? }` (vision #heritage: $1.36B AUM / 134 cos / 57 exits / 5,000+ community) |
| **ValueProps** | 1 | `heading`, `items[]: { heading, bodyCopy, icon }` (vision #difference: 6 cards / 6 imgs) |
| **Portfolio** | 1 | `heading`, `intro`, **list of holdings (loaded client-side — see Open Questions)** |
| **Process** | 3 | `heading`, `steps[]: { title, body, icon? }` (fund process, trade how-to, where-how) |
| **NewsList** | 1 | `items[]: { date, title, url, source? }` (IR #news, 8 items) |
| **DocumentList** | 2 | `items[]: { label, url, kind? (filing/prospectus/report) }` (IR #sec-filings, #fund-documents) |
| **CTAGroup** | 2 | `heading`, `subheading`, `ctas[]` (vision #investing, trade #where-how landing) |
| **Intro** | 1 | "Introducing Powerlaw Corp." multi-paragraph intro block on home with kicker + headline + body |
| **PullQuote** | 1 | Large centered statement + CTA on home ("…breakout private technology companies drive a disproportionate share of long-term value creation. EXPLORE OUR VISION") |
| **RichText** | 6 | Fallback for ad-hoc prose blocks (fund "How the portfolio gets built", "Exposure", "Sectors"; trade #cef-overview, "Available on all major brokerage platforms" logos list) |
| **StockInfo** | 1 | InvestingChannel UAT widget embed (fund #stock-info) — `widgetId`, `theme` |

Suggested Strapi dynamic zone: name it `pageSections`, attach all of these as components under a `sections.*` namespace.

## Globals

- **Header**: logo + 6 top-level nav items with section anchors as sub-nav (21 nav-link entries total counting duplicated "X X" labels — likely from desktop+mobile menus). Top-level: Our Vision, The Fund, How to Trade, Investor Relations, Contact. Each except Contact has 4–6 sub-anchors.
- **Footer**:
  - 7 site links (`/legal`, `/terms`, `/vision`, `/investor-relations`, `/fund`, `/contact`, `/trade`)
  - 6 social links: LinkedIn (`/company/pwrl`), Instagram (`PWRL_Fund`), YouTube (`@PWRL_Fund`), X (`pwrl_`), Seeking Alpha (`/symbol/PWRL`), StockTwits (`/symbol/PWRL`)
  - `© Powerlaw Corp. All Rights Reserved.`
  - **8 disclaimer paragraphs** (verbatim text in `inventory.json` → `globals.footer.disclaimers`). Total ≈ 4.6 KB of legal copy covering: SEC adviser registration, prospectus disclosure, registration statement, offer/solicitation, investment risks, closed-end-fund mechanics, forward-looking statements, "not advice". **These must be preserved verbatim** — model as a `Disclaimers` content type with rich-text body and an `effectiveDate` field (current text references a "May 20, 2026" prospectus date).

## Forms

| Form | Portal | Form ID | Pages | Fields |
|---|---|---|---|---|
| NAV alert signup (`#email`) | `243469173` | `ce5f73ec-b4cd-4529-805f-6e7bdb03960a` | home, vision, fund, trade | `email` (client-side rendered by HubSpot embed) |
| Contact form | `243469173` | `2b83c383-c728-4cc1-b08c-70545c64d73c` | contact | rendered client-side — fields not in SSR HTML (open question) |

Both use the standard `https://js.hsforms.net/forms/embed/v2.js` embed.

## Third-party embeds

| Service | ID/Kit | Used on |
|---|---|---|
| HubSpot tracking | `243469173` | all 6 pages |
| HubSpot Forms embed | `js.hsforms.net/forms/embed/v2.js` | all 6 pages |
| Google Tag Manager | `GTM-NVJKNWJP` | all 6 pages |
| InvestingChannel UAT (stock widget) | UAT widget id `80350b7a-db00-4466-b42c-585f3b9f4468`, script `https://u5.investingchannel.com/static/uat.js` | all 6 pages (only renders on fund #stock-info) |
| Adobe Typekit | kit `xyr7qcs` | all 6 pages |

## Asset hosting

- **Images**: 57 unique URLs. All served via `/pwrl/_next/image?url=…` (Next.js image optimiser) wrapping originals under `/pwrl/*.webp`, `*.jpg`, `*.png`. A few use the Vercel `pre.fund-finance-services.com` CDN.
- **PDFs (fund documents)**: hosted on **Contentful** — `https://assets.ctfassets.net/lavpbulm6258/*`. The current site is therefore at least partially Contentful-backed for media; the Strapi rebuild will need to either re-host or proxy these.
- **Fonts**: Adobe Typekit (`use.typekit.net/xyr7qcs.css`) + a bundled Inter via Next.js (`/pwrl/_next/static/media/bd61c44353c129b5-s.p.940c99a9.woff2`).

## Notable findings

1. **Client-only content gaps** — three places where SSR HTML is empty and content is rendered after JS hydration:
   - **Portfolio holdings** on `/pwrl/fund#portfolio` — the prose intro is there but **no company list/logos are in HTML**. Live site presumably fetches holdings dynamically.
   - **Team & Board bios** — every member has only a `<p>name</p>` + `<p>role</p>` + a "Show bio" button; the actual bio text is loaded into a modal client-side. We have **names + roles only**.
   - **Form fields** for the Contact form — HubSpot embed renders fields client-side.
2. **NAV form is HubSpot, single-email-field** — reusable in the rebuild with `@hubspot/forms-embed` script tag or via the HubSpot Forms v3 submit API.
3. **Identical FAQ content** appears on `/vision#faq` and `/fund#faq`. Model as a singleton "FAQ" content type and reference from both pages.
4. **InvestingChannel widget** is the only non-text/form embed. It needs a one-time script init + a placeholder div with the widget id.
5. **No `__NEXT_DATA__`** — this is App Router, so the prerendered HTML is the source of truth (no neatly-structured JSON dump to lean on). All extraction was DOM-based.
6. **Animated rotator** on home hero — phrases captured separately under `sections[0].rotatingPhrases`: "Only for big thinkers.", "Only for Mars seekers.", "Only for world changers.", "Only for everyone." (plus "Only for".)
7. **Heritage stats** (`/vision#heritage`) are key marketing numbers — currently captured as `bodyCopy[]` paragraphs. In Strapi these belong in a `StatsBlock` component with explicit `value` + `label` + `footnote` fields so the asterisked "*As of March 30, 2026" can be edited without breaking layout.
8. **`/pwrl/legal` and `/pwrl/terms`** appear in the footer but are **not in the nav** and were not part of this crawl. They will need separate Strapi entries (Privacy Policy + Terms & Conditions) — see Open Questions.
9. **`sitemap.xml`** at the inventory root is actually a 404 HTML page, not a real sitemap. We confirmed page coverage from nav rather than sitemap.
10. **`<meta name="robots" content="noindex">`** is present on the live site (visible in the saved 404 HTML at minimum). Confirm whether production index/follow is desired — see Open Questions.

## Open questions for you

1. **Portfolio holdings list** — where does it come from at runtime? (Contentful API? Vercel KV? a JSON in the bundle?) We need that data source — either re-import to Strapi or keep using the same upstream feed.
2. **Team / Board bios** — the bio copy is gated behind a "Show bio" modal and not in SSR. Do you have access to the source content (Contentful?), or do we need a headless-browser pass / manual transcription for the 7 team + 6 director bios?
3. **Contact form fields** — confirm whether contact form is `name + email + message`, or whether HubSpot is configured with extra fields (subject, inquiry type, phone, etc.). Easy to inspect in HubSpot directly.
4. **Privacy Policy & Terms** at `/pwrl/legal` and `/pwrl/terms` — should I add these to the crawl set in a follow-up?
5. **Prospectus / disclaimer effective date** — the footer text references "prospectus, dated May 20, 2026". Should this date be a CMS-editable field tied to the disclaimer entry?
6. **Stock Info widget** — keep InvestingChannel UAT widget as-is, or replace with a different provider (we own the embed id today)?
7. **Image migration** — do you want to mirror all 57 image URLs into Cloudinary at rebuild time, or proxy through Strapi media library?
8. **Contentful PDFs** — the 9 fund documents currently live on `assets.ctfassets.net`. Migrate to Cloudinary/Strapi, or continue serving from Contentful?
9. **News items** — the 8 news articles link out (presumably to PR Newswire / SEC / blog posts). Should these become a `News` collection type in Strapi with full body copy, or stay as headline + outbound link entries?
10. **`noindex`** meta — production should typically be index/follow; confirm before launch.
