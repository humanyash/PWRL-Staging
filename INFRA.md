# PWRL Rebuild — Infrastructure

> **Secrets policy:** No connection strings, API secrets, or passwords are stored
> in this repo or in any agent context. Secrets live only in the hosting
> provider's env-var settings (Render, Vercel). This file records *non-secret*
> identifiers only.

## Database — Neon Postgres (via Vercel integration)

| Field | Value |
|---|---|
| Resource name | `pwrl-production` |
| Provider | Neon (Serverless Postgres) |
| Neon ID | `dark-king-53709192` |
| Region | Washington, D.C., USA (East) — `iad1` |
| Plan | Free (0.5 GB storage, 100 CU-hours/project, no card) |
| Auth add-on | Off (Strapi manages its own users) |
| Created | 2026-06-09 |
| Vercel org | Chris Znerold's projects (Pro) |

**Connection string location:** Vercel → Storage → `pwrl-production` → Quickstart
→ `.env.local` tab → "Show secret" / "Copy Snippet". Pulled at Render-setup time,
pasted directly into Render's `DATABASE_URL` env var. Never copied into the repo.

## Media — Cloudinary

| Field | Value |
|---|---|
| Cloud name | `djf4okl19` (public — appears in image URLs) |
| API key | `212366552287821` (semi-public; inert without secret) |
| API secret | **NOT stored here.** Reveal in Cloudinary console (email-verified), paste directly into Render env var `CLOUDINARY_SECRET`. |
| Plan | Free (25 GB storage, 25 GB bandwidth/mo) |

Strapi env vars needed on Render: `CLOUDINARY_NAME=djf4okl19`,
`CLOUDINARY_KEY=212366552287821`, `CLOUDINARY_SECRET=<from console>`.
Provider plugin: `@strapi/provider-upload-cloudinary`.

## Fonts — Adobe Fonts (Typekit)

| Field | Value |
|---|---|
| Production kit ID | `xyr7qcs` (client-owned) |
| Embed | `<link rel="stylesheet" href={`https://use.typekit.net/${TYPEKIT_ID}.css`}>` in `app/layout.tsx` head |
| Env override | `NEXT_PUBLIC_TYPEKIT_ID` (defaults to `xyr7qcs`) |
| Family | `ivypresto-headline` (display) — Regular 400, Italic 400, Bold 700, Bold Italic 700 |
| Body font | Inter (Google, self-hosted via next/font) |
| Fallback | `globals.css --font-display` = `"ivypresto-headline", var(--font-cormorant), …` so Cormorant covers any load gap |
| Domains | Domain-locked. Before production cutover, the client must authorize `www.pwrl.com` (and any staging domain) on the `xyr7qcs` kit. |

Account history: an earlier dev kit (`usg7ynr`, personal account) was used during the build and replaced as part of go-live prep. The kit ID is now env-driven so no code change is needed if the client ever rotates kits.

## Hosting plan — ALL LIVE

| Layer | Service | Status |
|---|---|---|
| Frontend | Next.js → Vercel `pwrl-website` (chris-znerolds-projects) | ✅ **https://pwrl-website-theta.vercel.app** — git-connected (root dir `frontend/`), pushes to main auto-deploy |
| Backend | Strapi v5 → Render `pwrl-cms` (free, Virginia) | ✅ **https://pwrl-cms.onrender.com** — auto-deploys from `backend/` on push |
| Database | Neon Postgres `pwrl-production` (US East) | ✅ live, holds all content |
| Media | Cloudinary `djf4okl19` | ✅ serving team/board headshots |
| Forms | HubSpot portal 243469173 (Forms API) | ✅ wired (NAV + contact); needs one supervised live test |
| Filings | SEC EDGAR (CIK 2052053, ISR 1h) | ✅ live, 33 filings rendering |
| Analytics | Google Analytics 4 (`G-S620CRDB9D`) | ✅ wired in root layout via `next/script`; env override `NEXT_PUBLIC_GA_ID` |

### Content/editing flow
- Editors work in Strapi admin (roles: Admin, Editor, Legal Reviewer — disclaimers gated to Legal Reviewer).
- Publish in Strapi → webhook `vercel_rebuild` → Vercel deploy hook `strapi-publish` → static rebuild (~1 min). ISR also refreshes every 60s without rebuilds.
- Frontend merge strategy: CMS values win; fixture baseline fills fields the schema doesn't carry yet (hero rotator config, hero media, form definitions).

### Before production cutover (pwrl.com DNS)
1. Authorize the production domain on the client's Adobe Fonts kit `xyr7qcs` (kits are domain-locked).
2. One supervised HubSpot form submission per form (NAV signup + contact) as acceptance.
3. Client-owned Cloudinary creds set on Render (`CLOUDINARY_NAME/KEY/SECRET`).
4. Consider Render paid tier (free tier admin cold-starts ~50s; public site unaffected).
5. Delete the `content-ingest` API token in Strapi (self-expires 7 days from 2026-06-09).
6. Set Vercel env vars per `DEPLOY.md` (`NEXT_PUBLIC_STRAPI_URL`; remove `NEXT_PUBLIC_STRAPI_DISABLED`).

### Go-live changes already in code
- InvestingChannel stock widget was removed (`StockInfoBlock.widgetId` field deleted, `InvestingChannelWidget.tsx` deleted). Stock Info renders only the static rows in `fixtures.ts`. If a live-data widget is ever needed, reintroduce a CMS-driven block.
- All previously Contentful-hosted assets are now bundled in `frontend/public/`:
  - 9 PDFs → `frontend/public/documents/*.pdf`
  - 18 portfolio-company logos → `frontend/public/remote-assets/logos/*.{png,svg}`
  - 1 news image → `frontend/public/remote-assets/news/7vyvWX-bloomberg-interview.png`
- `next.config.ts` `images.remotePatterns` no longer allows `assets.ctfassets.net` / `images.ctfassets.net`.
- Dev-only `/font-compare` route was deleted.

## Source control

| Field | Value |
|---|---|
| Repo | `github.com/znerold/pwrl-website` (private) |
| Layout | Monorepo: `frontend/` (Vercel root) + `backend/` (Render root) |
| GitHub account | `znerold` (gh CLI authed, `repo` scope) |
| Status | Repo created; first push deferred until build agents finish |

Vercel project root dir → `frontend/`. Render service root dir → `backend/`.

## Strapi DB config strategy

- **Dev (local):** SQLite (`.tmp/data.db`) — default, no secret needed.
- **Prod (Render):** Postgres via `DATABASE_URL` env var → Neon `pwrl-production`.
- `backend/config/database.ts` switches on `NODE_ENV` / presence of `DATABASE_URL`.
