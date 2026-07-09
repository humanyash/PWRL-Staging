# PWRL CMS (Strapi v5)

The headless CMS that powers content on the PWRL marketing site. Editors
manage copy, team bios, news, fund documents, and the portfolio snapshot
through the Strapi admin panel; the Next.js frontend at
[`../frontend`](../frontend) reads from this CMS at build/revalidate time.

## What this CMS holds

13 content types live under [`src/api/`](src/api/), backed by 29 reusable
components in [`src/components/`](src/components/).

### Collection types (multiple entries each)

| Type | What it drives on the site |
|---|---|
| `page` | The 7 marketing pages (home, vision, fund, trade, investor-relations, learn, contact) — title, SEO, and a dynamic-zone of sections |
| `team-member` | Leadership grid on `/vision` |
| `board-director` | Board grid on `/investor-relations` |
| `news-item` | News list on `/` and `/investor-relations` |
| `fund-document` | PDF library on `/investor-relations` (prospectus, factsheets, reports) |
| `legal-page` | `/legal` (privacy) and `/terms` |
| `form` | HubSpot form references (portalId + formId + theme) |
| `sec-filing` | Reserved — populated automatically from EDGAR in production |

### Single types (exactly one entry)

| Type | What it drives |
|---|---|
| `global-settings` | Top banner, footer links, social links, copyright |
| `disclaimers` | Multi-paragraph legal disclaimers in the footer |
| `faq` | FAQ accordion across the site |
| `portfolio-snapshot` | Holdings table on `/fund` |

## Editor plugins (Elle-friendly)

Installed community plugins in [`config/plugins.ts`](config/plugins.ts):

| Plugin | Purpose |
|---|---|
| `@ckeditor/strapi-plugin-ckeditor` | Rich text with link toolbar for FAQ answers and bios |
| `strapi-plugin-preview-button` | **View live** / preview links to staging site per entry |
| `strapi-plugin-publisher` | Schedule publish/unpublish for banner and Press & News |
| `strapi-plugin-config-sync` | Version-control admin roles/CM layout via `config/sync/` |
| `strapi-import-export` | CSV/JSON export-import for daily content collections |

Set `STRAPI_PREVIEW_SITE_URL` (default: staging Vercel URL) for preview buttons.

After configuring roles/layout in admin, export config sync once:

```bash
npm run strapi config-sync export -- --yes
```

Commit `config/sync/*.json` so Render applies them on deploy (`importOnBootstrap`).

## Local development

```bash
# from this directory
cp .env.example .env       # then fill in unique secrets — see below
npm install
npm run develop
```

Opens the admin panel at `http://localhost:1337/admin`. First run prompts
you to create the initial admin user.

### `.env` secrets for local dev

The six secret values must each be unique strings. Generate with:

```bash
openssl rand -base64 32
```

```
HOST=0.0.0.0
PORT=1337
APP_KEYS=<rand>,<rand>      # two comma-joined
API_TOKEN_SALT=<rand>
ADMIN_JWT_SECRET=<rand>
TRANSFER_TOKEN_SALT=<rand>
JWT_SECRET=<rand>
ENCRYPTION_KEY=<rand>
```

Without `DATABASE_URL` set, the backend uses SQLite at `.tmp/data.db` —
zero setup. Without `CLOUDINARY_*` set, uploads land on local disk under
`public/uploads/`. Both behaviors are intentional; see
[`config/database.ts`](config/database.ts) and
[`config/plugins.ts`](config/plugins.ts).

## Production deployment

See [`../render.yaml`](../render.yaml) for the Render Blueprint, and
[`../INFRA.md`](../INFRA.md) for the live URLs and ops notes. In short:

- **Render Web Service**, `backend/` as root dir, free tier
- **Neon Postgres** via `DATABASE_URL` (SSL on)
- **Cloudinary** for media via `CLOUDINARY_NAME/KEY/SECRET`
- Auto-deploys from `main` branch on push

### Wire Cloudinary on Render (required for media)

Strapi stores uploads on **ephemeral disk** without Cloudinary — files disappear on
redeploy and the Media Library breaks. Set these on the `pwrl-cms-humandesign`
Render service → **Environment**:

| Key | Value | Notes |
|---|---|---|
| `CLOUDINARY_NAME` | **`qgrvy7ii`** | **Cloud name** — short id at top-left of Cloudinary dashboard. **Not** the API key label (e.g. `PWRL_Strapi`). |
| `CLOUDINARY_KEY` | *(from Cloudinary dashboard)* | API Key |
| `CLOUDINARY_SECRET` | *(your secret)* | API Secret |

Then **Manual Deploy → Deploy latest commit** (env changes require a restart).

Verify locally before saving on Render:

```bash
cd frontend
CLOUDINARY_NAME=your-cloud CLOUDINARY_KEY=... CLOUDINARY_SECRET=... npx tsx scripts/verify-cloudinary.ts
```

After deploy, upload one test image in Strapi admin → Media Library. The asset URL
should start with `https://res.cloudinary.com/<cloud>/…`.

**Finding your cloud name:** Cloudinary → Dashboard — the **Product environment** name at the top-left (e.g. `qgrvy7ii`). On the API Keys page, **Key Name** (`PWRL_Strapi`) is only a label; do **not** put that in `CLOUDINARY_NAME`. Or open any asset URL: `https://res.cloudinary.com/qgrvy7ii/…`.

## Populating content (ingest script)

The frontend ships a one-shot ingest at
[`../frontend/scripts/ingest.ts`](../frontend/scripts/ingest.ts) that
pushes the bundled fixture content (the verbatim site copy) into Strapi
via REST. Used to bootstrap a fresh CMS instance.

```bash
# from frontend/
echo "STRAPI_URL=https://<your-strapi>" >> .env.ingest
echo "STRAPI_TOKEN=<full-access-token>" >> .env.ingest
npx tsx scripts/ingest.ts
```

The script is idempotent (upserts by natural key) and uploads every PDF /
image / video in `frontend/public/` to the Strapi Media Library — so a
fresh DB ends up looking exactly like the live site.

After ingest, **delete the Full Access API token** from
`Settings > API Tokens` — it should never persist.

## Adding a new editor

In the admin panel: **Settings > Administration Panel > Users > Invite
new user**. Pick role:

- `Super Admin` — full control, including managing other users
- `Editor` — can edit and publish content (the default for the client)
- `Author` — drafts only, cannot publish

The invitee receives an email with a one-time link to set their password.

## Schema changes

If you change a content type or component schema:

1. Edit the JSON in `src/api/<type>/content-types/<type>/schema.json` or
   `src/components/<cat>/<name>.json`
2. Restart `npm run develop` — Strapi auto-migrates the dev DB on boot
3. Commit and push to `main`
4. Render auto-deploys; production DB migrates on container start

For breaking schema changes (renamed fields, dropped collections), back
up production data first via Strapi's transfer API or a `pg_dump`.

## Frontend integration

The Next.js frontend reads CMS data with a graceful fallback: when a CMS
fetch fails (network, sleep, 4xx/5xx) it returns `null` and the frontend
fills from the in-repo fixtures at
[`../frontend/src/lib/fixtures.ts`](../frontend/src/lib/fixtures.ts). The
site never breaks because of a Strapi outage. See
[`../frontend/src/lib/strapi.ts`](../frontend/src/lib/strapi.ts) for the
merge layer.

ISR is 60 seconds — published edits propagate within ~1 min.

## Useful commands

| Command | What it does |
|---|---|
| `npm run develop` | Dev server with autoreload |
| `npm run build` | Build admin panel for production |
| `npm run start` | Production start (no autoreload) |
| `npm run console` | REPL with Strapi globals (`strapi.entityService`, etc.) |

## Strapi documentation

- [Strapi v5 docs](https://docs.strapi.io)
- [REST API reference](https://docs.strapi.io/dev-docs/api/rest)
