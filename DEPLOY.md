# Deploying PWRL on Vercel

This repo is a **monorepo**. Only `frontend/` is the Next.js app that belongs on Vercel.

## Vercel project settings (required)

| Setting | Value |
|---|---|
| **Root Directory** | `frontend` |
| **Framework Preset** | Next.js |
| **Build Command** | `npm run build` (default) |
| **Output Directory** | *(leave empty — Next.js default; do not set to `public`)* |
| **Install Command** | `npm install` (declared in `frontend/vercel.json`) |

If Root Directory is blank or `.`, Vercel builds the repo root (which has no Next.js app). The deploy may show "Success" but every URL returns **404 NOT_FOUND**.

## Environment variables

### Staging (Vercel) — CMS wired

| Name | Value | Notes |
|---|---|---|
| `NEXT_PUBLIC_STRAPI_URL` | `https://pwrl-cms-humandesign.onrender.com` | Required — daily content from Strapi |
| `NEXT_PUBLIC_TYPEKIT_ID` | `xyr7qcs` | Optional — defaults in `app/layout.tsx` |
| `NEXT_PUBLIC_GA_ID` | `G-S620CRDB9D` | Optional — defaults in `app/layout.tsx` |
| `STRAPI_PREVIEW_SECRET` | *(same random string on Vercel + Render)* | Required for draft preview from Strapi |
| `STRAPI_PREVIEW_TOKEN` | *(Strapi API token, Full Access)* | Server-only — lets preview fetch unpublished drafts |

Do **not** set `NEXT_PUBLIC_STRAPI_DISABLED` on staging. When `true`, the site
ignores Strapi and serves fixture data only.

**Preview setup (one time):**

1. In Strapi admin → **Settings → API Tokens** → Create token (Full Access).
2. Copy the token to Vercel env `STRAPI_PREVIEW_TOKEN` (no `NEXT_PUBLIC_` prefix).
3. Generate a random secret (e.g. `openssl rand -hex 32`) and set the **same**
   value as `STRAPI_PREVIEW_SECRET` on **both** Vercel and Render.
4. Redeploy Vercel and Render.

**Verify CMS wiring:**

Open https://pwrl-staging-website-y.vercel.app/api/cms-status — you want
`"ok": true` and `usingFixtures: false`. If `usingFixtures` is true, the site
is showing baked-in copy, not Strapi (Publish will never appear on staging).

**Instant updates after Publish (optional webhook):**

1. Use the same secret as `REVALIDATION_SECRET` or `STRAPI_PREVIEW_SECRET`.
2. In Strapi → **Settings → Webhooks** → Create:
   - URL: `https://pwrl-staging-website-y.vercel.app/api/revalidate?secret=YOUR_SECRET`
   - Events: `Entry` → `Publish** (and `Unpublish` if desired)
3. After Publish in Strapi, staging updates within seconds instead of waiting 60s.

### Strapi admin “Failed to fetch dynamically imported module”

After a Render deploy, the admin JS filename changes. Your browser may still
request an old chunk (e.g. `App-B1lh77m0.js`). Fix:

1. Hard refresh: **Cmd+Shift+R** (Mac) or **Ctrl+Shift+R** (Windows)
2. Or clear site data for `pwrl-cms-humandesign.onrender.com`
3. Or open admin in an incognito window

---

| Name | Value | Notes |
|---|---|---|
| `NEXT_PUBLIC_STRAPI_URL` | `https://pwrl-cms-humandesign.onrender.com` | Same CMS (or production Strapi when split) |
| `NEXT_PUBLIC_TYPEKIT_ID` | `xyr7qcs` | Optional |
| `NEXT_PUBLIC_GA_ID` | `G-S620CRDB9D` | Optional |

`NEXT_PUBLIC_STRAPI_DISABLED` MUST be unset (or `false`) on production.

## After changing settings

1. Save settings in Vercel → **Deployments** → **Redeploy** (use "Redeploy" on latest, not just a new git push).
2. Open the deployment **Build Logs** and confirm you see `next build` running inside `frontend/`.
3. Visit https://pwrl-staging-website-y.vercel.app — homepage should reflect CMS banner/news after publish.

## Backend (separate host)

`backend/` is Strapi on Render: https://pwrl-cms-humandesign.onrender.com/admin

Deploy via [`render.yaml`](render.yaml). See [`INFRA.md`](INFRA.md) and [`backend/README.md`](backend/README.md).

## Editor handoff

See [`CLIENT-HANDOFF.md`](CLIENT-HANDOFF.md) for the editor workflow and [`backend/CMS-OPERATIONS.md`](backend/CMS-OPERATIONS.md) for production vs development mode.
