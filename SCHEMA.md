# PWRL Strapi v5 — Content Model

Derived from the live-site inventory at `_inventory/inventory.json` plus client-rendered content captured under `_inventory/extracted/`. This drives the Strapi schema, the role/permission model, and the dynamic-zone block library.

## Single types

| Name | Purpose | Role-gated |
|---|---|---|
| `GlobalSettings` | logo, top banner, footer links, socials, copyright | Editor |
| `Disclaimers` | 8 verbatim disclaimer paragraphs + `effectiveDate` | **Legal Reviewer only** |
| `FAQ` | One FAQ singleton (same content rendered on `/vision#faq` and `/fund#faq`) | Editor |
| `PortfolioSnapshot` | Latest holdings table + `asOfDate` + footnotes; replaced atomically each month | Editor |

## Collection types

| Name | Notes |
|---|---|
| `Page` | The 6 marketing pages. `slug` + `seo` + `sections` dynamic zone |
| `LegalPage` | Privacy + Terms only. Rich text body + `effectiveDate`. **Legal Reviewer only** |
| `TeamMember` | 6 entries. Supports prose bio OR bullet bio (`bioFormat` enum) |
| `BoardDirector` | 5 entries. `alsoOnTeam` relation when applicable (Black, Dinsdale) |
| `NewsItem` | Headline + date + external URL + source |
| `SECFiling` | **Auto-synced from EDGAR**; read-only in admin. Form type, accession, filed date, URL |
| `FundDocument` | Prospectus, factsheets, reports. Cloudinary-hosted PDF + `kind` enum |
| `Form` | HubSpot form references (`portalId`, `formId`, `identifier`, `theme`) |

## Dynamic-zone block components (`sections.*`)

Maps 1:1 to the 17 distinct section types in the inventory:

| Component | Found on | Fields |
|---|---|---|
| `sections.hero` | all 6 pages | heading, subheading, body, rotatingPhrases[], backgroundImage, ctas[] |
| `sections.intro` | home | kicker, heading, body |
| `sections.value-props` | vision#difference | heading, items[]: {heading, body, icon} |
| `sections.philosophy` | vision, fund | heading, paragraphs, supportingImages |
| `sections.timeline` | home | heading, intro, entries[]: {year, title, body} |
| `sections.stats-block` | vision#heritage | heading, intro, stats[]: {value, label, footnote} |
| `sections.portfolio-block` | fund#portfolio | heading, intro, → relation to `PortfolioSnapshot` |
| `sections.team-grid` | vision#team | heading, subheading, → multi-relation to `TeamMember` |
| `sections.board-grid` | IR#directors | heading, subheading, → multi-relation to `BoardDirector` |
| `sections.faq-block` | vision, fund | heading, → relation to `FAQ` singleton |
| `sections.process-steps` | fund, trade | heading, intro, steps[]: {title, body, icon} |
| `sections.news-list` | IR#news | heading, limit, auto-pulls latest `NewsItem`s |
| `sections.document-list` | IR#sec-filings, IR#fund-documents | heading, kind (filings\|fund-docs), auto-pulls |
| `sections.cta-group` | vision#investing, trade | heading, subheading, ctas[] |
| `sections.pull-quote` | home | quote, cta |
| `sections.stock-info` | fund#stock-info | InvestingChannel widgetId, theme |
| `sections.rich-text` | fallback | heading?, body |
| `sections.form-block` | every page (NAV alert), contact | → relation to `Form`, heading?, body?, theme |
| `sections.disclosures` | footer (global, not per-page) | → relation to `Disclaimers` singleton |

## Shared sub-components (`shared.*`)

- `shared.cta` — label, href, variant (primary | secondary | link | underline)
- `shared.seo` — title, description, ogImage, noindex
- `shared.image-with-alt` — media + alt

## Roles & permissions

| Role | Read | Write |
|---|---|---|
| `Admin` | all | all |
| `Editor` | all | everything **except** `Disclaimers` and `LegalPage` |
| `Legal Reviewer` | all | `Disclaimers`, `LegalPage`, the `effectiveDate` field on `FundDocument` |

`SECFiling` is non-writable from the admin (synced by a scheduled job).

## Webhooks & integrations

| Trigger | Action |
|---|---|
| Any `Page` publish | POST Vercel deploy hook → static rebuild |
| `Disclaimers` publish | POST Vercel deploy hook + flag for IR notification |
| Daily cron (Vercel cron + on-demand revalidate) | Pull latest SEC filings from `data.sec.gov` JSON API, upsert `SECFiling` |
| `NewsItem` publish | POST Vercel deploy hook |

## Asset hosting

- **All media (images + PDFs):** Cloudinary via `strapi-provider-upload-cloudinary`
- **Fonts:** Self-host Inter (Google Fonts) + chosen ivypresto substitute via `next/font/google`
- **Initial migration:** import script mirrors all 57 image URLs + 9 PDFs from Contentful into Cloudinary

## Open follow-ups (non-blocking)

1. Confirm font substitute pick (Cormorant Garamond vs. Playfair Display vs. DM Serif Display) — need to render the actual hero strings side-by-side.
2. PortfolioSnapshot publish cadence — monthly + manual, or wire to a feed?
3. EDGAR User-Agent identification string for the SEC API calls (SEC requires a real contact).
4. Webhook endpoint for HubSpot form-submission notifications, if any.
