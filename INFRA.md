# PWRL — Infrastructure

> **Secrets policy:** No connection strings, API secrets, or passwords are
> stored in this repo or in any agent context. Secrets live only in the
> hosting provider's env-var settings (Render, Vercel). This file records
> *non-secret* identifiers only.

## Migration in progress

The site is being moved from the original developer's personal SaaS
accounts to HumanDesign-owned accounts. Two stacks are described below.

### Target stack (HumanDesign-owned, in progress)

| Layer | Service | Status | URL / ID |
|---|---|---|---|
| Source code | GitHub `HumanDesign/pwrl-staging-website-y` | LIVE | <https://github.com/HumanDesign/pwrl-staging-website-y> |
| Frontend | Next.js → Vercel (HumanDesign team) | PENDING | `__VERCEL_URL_TBD__` |
| Backend | Strapi v5 → Render (HumanDesign account) | PENDING | `__STRAPI_URL_TBD__` (planned: `https://pwrl-cms-humandesign.onrender.com`) |
| Database | Neon Postgres (HumanDesign account) | PENDING | `__NEON_PROJECT_TBD__` (planned: `pwrl-humandesign`, US East) |
| Media | Cloudinary (HumanDesign account) | PENDING | `__CLOUDINARY_CLOUD_TBD__` |
| Analytics | Google Analytics 4 (`G-S620CRDB9D`) | LIVE | Wired in `frontend/src/app/layout.tsx` via `next/script`; env override `NEXT_PUBLIC_GA_ID` |
| Forms | HubSpot portal `243469173` (Forms API) | LIVE | Client-owned; NAV + contact wired |
| Filings | SEC EDGAR (CIK `2052053`, ISR 1h) | LIVE | |
| Fonts | Adobe Fonts kit `xyr7qcs` (client-owned) | LIVE | env override `NEXT_PUBLIC_TYPEKIT_ID` |

Deployment is automated:
- Push to `main` -> Render rebuilds Strapi (see [`render.yaml`](render.yaml))
- Push to `main` -> Vercel rebuilds the frontend (see [`DEPLOY.md`](DEPLOY.md))

### Legacy stack (Chris Znerold's accounts — TO BE DECOMMISSIONED)

Kept up only as a fallback until the HumanDesign stack is verified. Will
be deleted after 24-48h of clean operation on the new infra.

| Layer | Legacy URL / ID | Decommission action |
|---|---|---|
| Source code | `github.com/znerold/pwrl-website` | Archive (do not delete — keeps git history reachable) |
| Frontend | `https://pwrl-website-theta.vercel.app` (project `pwrl-website`, team `chris-znerolds-projects`) | Delete project in Vercel |
| Backend | `https://pwrl-cms.onrender.com` (service `pwrl-cms`) | Delete service in Render |
| Database | Neon project `pwrl-production` (ID `dark-king-53709192`, region `iad1`) | Delete project in Neon |
| Media | Cloudinary `djf4okl19` | Out of scope (Cloudinary is account-level; HumanDesign cloud is fresh, no migration needed) |

## Configuration that does not change between stacks

These are code-level and survive any account migration.

### Database — backend auto-detection

`backend/config/database.ts` switches automatically:
- **Dev (local):** SQLite at `.tmp/data.db` — no secret needed
- **Prod:** Postgres via `DATABASE_URL`, SSL on

### Media — backend env-gated Cloudinary

`backend/config/plugins.ts` only enables Cloudinary when all three
credentials are set; otherwise falls back to the default local-disk
provider. Means local dev works without Cloudinary creds; prod uses
Cloudinary automatically once the env vars land.

### Frontend — graceful CMS degradation

`frontend/src/lib/strapi.ts` catches every fetch failure and returns
`null`. Callers then fall back to the in-repo fixture data in
`frontend/src/lib/fixtures.ts`. If Strapi is sleeping (Render free tier)
or down, the public site stays up — visitors see the bundled baseline.

### ISR — 60-second revalidation

Every CMS-backed page is revalidated every 60 seconds. Editor publishes
in Strapi propagate within ~1 minute with no Vercel redeploy.

## Fonts — Adobe Fonts (Typekit)

| Field | Value |
|---|---|
| Production kit ID | `xyr7qcs` (client-owned) |
| Embed | `<link rel="stylesheet" href={`https://use.typekit.net/${TYPEKIT_ID}.css`}>` in `app/layout.tsx` head |
| Env override | `NEXT_PUBLIC_TYPEKIT_ID` (defaults to `xyr7qcs`) |
| Family | `ivypresto-headline` (display) — Regular 400, Italic 400, Bold 700, Bold Italic 700 |
| Body font | Inter (Google, self-hosted via `next/font`) |
| Fallback | `globals.css --font-display` = `"ivypresto-headline", var(--font-cormorant), …` |
| Domains | Domain-locked. The new Vercel `*.vercel.app` URL **and** any custom domain (e.g. `www.pwrl.com`) must be authorized on the `xyr7qcs` kit. |

Account history: an earlier dev kit (`usg7ynr`, personal account) was
replaced with the client's `xyr7qcs` kit. The kit ID is env-driven so
rotations require no code change.

## Pre-cutover checklist

Before pointing `pwrl.com` DNS at the HumanDesign Vercel project:

1. Authorize the production domain on the client's Adobe Fonts kit
   `xyr7qcs` (kits are domain-locked).
2. One supervised HubSpot form submission per form (NAV signup +
   contact) as acceptance.
3. Confirm Cloudinary uploads work end-to-end (upload an image via
   Strapi admin, confirm the URL is `res.cloudinary.com/…`).
4. Consider Render paid tier (free tier admin cold-starts ~50s; public
   site unaffected).
5. Delete the `ingest` API token in Strapi after the bootstrap ingest
   completes — should never persist.
6. Set Vercel env vars per [`DEPLOY.md`](DEPLOY.md)
   (`NEXT_PUBLIC_STRAPI_URL`; ensure `NEXT_PUBLIC_STRAPI_DISABLED` is
   unset).

## Go-live changes already in code

- InvestingChannel stock widget removed (`StockInfoBlock.widgetId`
  field deleted, `InvestingChannelWidget.tsx` deleted). Stock Info
  renders only static rows in `fixtures.ts`.
- All previously Contentful-hosted assets are now bundled in
  `frontend/public/`:
  - 9 PDFs → `frontend/public/documents/*.pdf`
  - 18 portfolio-company logos → `frontend/public/remote-assets/logos/`
  - 1 news image → `frontend/public/remote-assets/news/7vyvWX-bloomberg-interview.png`
- `next.config.ts` `images.remotePatterns` only allows
  `res.cloudinary.com` (Contentful patterns removed).
- Dev-only `/font-compare` route deleted.

## Source control

| Field | Target (HumanDesign) | Legacy |
|---|---|---|
| Repo | `github.com/HumanDesign/pwrl-staging-website-y` | `github.com/znerold/pwrl-website` (to archive) |
| Layout | Monorepo: `frontend/` (Vercel root) + `backend/` (Render root) | same |
| Git remotes (local) | `staging` -> HumanDesign | `origin` and `yash` -> personal mirrors |

## For HumanDesign team ops, see

[`AGENCY-HANDOFF.md`](AGENCY-HANDOFF.md) — credential ownership, editor
onboarding flow, renewals.

## For PWRL editors, see

[`CLIENT-HANDOFF.md`](CLIENT-HANDOFF.md) — Strapi-only user guide.
