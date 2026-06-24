# Schema Build Notes

File-based Strapi v5 content model for the PWRL rebuild. Generated from
`SCHEMA.md`, `_inventory/inventory.json`, and the `_inventory/extracted/*`
captures. No Strapi server was started; only schema/config/docs files were
written.

## What was created

### Components — 30 files total (23 `sections.*` + 7 `shared.*`)

**`sections.*` (19 named blocks per `SCHEMA.md`):**
hero, intro, value-props, philosophy, timeline, stats-block, portfolio-block,
team-grid, board-grid, faq-block, process-steps, news-list, document-list,
cta-group, pull-quote, stock-info, rich-text, form-block, disclosures.

**`sections.*` (4 repeatable child-item helpers)** so list fields are structured
rather than loose JSON:
value-prop-item (value-props.items[]), timeline-entry (timeline.entries[]),
stat-item (stats-block.stats[]), process-step (process-steps.steps[]).

**`shared.*` (7):** cta, seo, image-with-alt (per spec) + helpers
disclaimer-paragraph, faq-item, holding, footer-link.

### Content types — 12 total (each: schema.json + factory controller/route/service)

**Single types (4):** GlobalSettings, Disclaimers (D&P), FAQ, PortfolioSnapshot.
**Collection types (8):** Page (D&P), LegalPage (D&P), TeamMember,
BoardDirector, NewsItem (D&P), SECFiling, FundDocument, Form.

`draftAndPublish: true` enabled on Page, LegalPage, NewsItem, Disclaimers (per
spec). All others use `draftAndPublish: false`.

### Relations wired
- `sections.portfolio-block` -> `portfolio-snapshot` (oneToOne)
- `sections.team-grid` -> `team-member` (oneToMany)
- `sections.board-grid` -> `board-director` (oneToMany)
- `sections.faq-block` -> `faq` (oneToOne)
- `sections.form-block` -> `form` (oneToOne)
- `sections.disclosures` -> `disclaimers` (oneToOne)
- `board-director.alsoOnTeam` -> `team-member` (oneToOne; Black & Dinsdale)

### Config
- `config/plugins.ts` — registers the `cloudinary` upload provider reading
  `CLOUDINARY_NAME` / `CLOUDINARY_KEY` / `CLOUDINARY_SECRET`.
- `config/database.ts` — now selects `postgres` automatically when `DATABASE_URL`
  is set (Render/prod), otherwise falls back to SQLite. The existing `postgres`
  connection block already reads `connectionString: env('DATABASE_URL')` and
  supports `DATABASE_SSL`.
- `package.json` — added `@strapi/provider-upload-cloudinary` (5.47.1, matched to
  the Strapi version) and `pg` (^8.13.1). **`npm install` was NOT run** — install
  before `strapi develop`/`build`.

### Docs
- `src/bootstrap-roles.md` — Admin / Editor / Legal Reviewer matrix, including
  the field-level `FundDocument.effectiveDate` grant for Legal Reviewer and the
  read-only treatment of `Disclaimers`, `LegalPage`, and `SECFiling`.

## Deviations / decisions vs SCHEMA.md
- **Rich text:** used `"type": "richtext"` everywhere (portability, per
  instructions) rather than the block editor.
- **List fields as components:** `value-props.items`, `timeline.entries`,
  `stats-block.stats`, `process-steps.steps`, FAQ Q&A, disclaimer paragraphs, and
  portfolio holdings are modeled as repeatable components (structured) rather than
  raw JSON. `hero.rotatingPhrases` and `team-member.bioBullets` are kept as
  `json` (simple string arrays, matching the extracted data shape).
- **TeamMember bio:** `bioFormat` enum (`prose` | `bullets`) with `bioProse`
  (richtext) and `bioBullets` (json) — supports both shapes seen in
  `team-bios.json`.
- **SECFiling:** schema includes a unique `accessionNumber`; it is read-only by
  policy (enforced via role permissions, see bootstrap-roles.md), not by schema —
  Strapi has no schema-level "read-only collection" flag.
- **GlobalSettings pluralName:** Strapi requires a distinct plural; used
  `global-settings-plural` (single type, so the plural is cosmetic).
- **FundDocument.kind** enum expanded to cover prospectus, factsheet, report
  variants, and `other`.
- Added an optional `holding.sector` field to support the sector-allocation
  footnote noted in `portfolio.json` (not required).

## Still needs a running Strapi instance (cannot be done via schema files)
1. **Role seeding** — create the Editor and Legal Reviewer admin roles and assign
   the permission matrix in `src/bootstrap-roles.md` (incl. field-level
   `FundDocument.effectiveDate` for Legal Reviewer).
2. **Public API permissions / API tokens** — enable `find`/`findOne` on the
   Public role (or mint a read-only token) so the Next.js frontend can read.
3. **`npm install`** — install the two newly-added dependencies.
4. **Cloudinary env vars** — set `CLOUDINARY_NAME/KEY/SECRET` in the environment.
5. **Webhooks** — Vercel deploy hooks on Page/Disclaimers/NewsItem publish are
   configured in Settings -> Webhooks (or via bootstrap), not in schema.
6. **EDGAR sync job & content seeding** — the SECFiling cron and importing the
   actual page/team/board/portfolio content are separate tasks.

## JSON validation
JSON files were authored to be well-formed. Automated validation
(`python3 -m json.tool` / `node -e require`) could not be executed in this
session because code-executing Bash was unavailable; the more complex files (Page
dynamic zone, all schemas) were visually re-read and confirmed well-formed.
Recommended pre-boot check on a machine with shell access:
`find src -name '*.json' -print -exec node -e "require(process.argv[1])" {} \;`
