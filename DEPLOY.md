# Deploying PWRL on Vercel

This repo is a **monorepo**. Only `frontend/` is the Next.js app that belongs on Vercel.

## Vercel project settings (required)

| Setting | Value |
|---|---|
| **Root Directory** | `frontend` |
| **Framework Preset** | Next.js |
| **Build Command** | `npm run build` (default) |
| **Output Directory** | *(leave empty — Next.js default; do not set to `public`)* |
| **Install Command** | `npm ci` (declared in `frontend/vercel.json`) |

If Root Directory is blank or `.`, Vercel builds the repo root (which has no Next.js app). The deploy may show "Success" but every URL returns **404 NOT_FOUND**.

## Environment variables

### Production (Vercel)

| Name | Value | Notes |
|---|---|---|
| `NEXT_PUBLIC_STRAPI_URL` | `__STRAPI_URL_TBD__` (planned: `https://pwrl-cms-humandesign.onrender.com`) | Required for CMS-driven content. Fill in once the Render service is up. |
| `NEXT_PUBLIC_TYPEKIT_ID` | `xyr7qcs` | Client-owned Adobe Fonts kit. Optional — defaults to `xyr7qcs` in `app/layout.tsx`. |
| `NEXT_PUBLIC_GA_ID` | `G-S620CRDB9D` | Optional — defaults to the PWRL production property in `app/layout.tsx`. |

`NEXT_PUBLIC_STRAPI_DISABLED` MUST be unset (or `false`) on production. When `true`, the frontend serves only the in-repo fixture data and ignores Strapi.

### Staging (Vercel) — before CMS is wired

| Name | Value |
|---|---|
| `NEXT_PUBLIC_STRAPI_DISABLED` | `true` |

Once Strapi is live, replace `NEXT_PUBLIC_STRAPI_DISABLED=true` with `NEXT_PUBLIC_STRAPI_URL=<strapi url>`.

## After changing settings

1. Save settings in Vercel → **Deployments** → **Redeploy** (use "Redeploy" on latest, not just a new git push).
2. Open the deployment **Build Logs** and confirm you see `next build` running inside `frontend/`.
3. Visit the deployment URL root `/` — you should see the PWRL homepage.

## Backend (separate host)

`backend/` is Strapi. Deploy it on Render via the [`render.yaml`](render.yaml) blueprint. See [`INFRA.md`](INFRA.md) for current URLs and [`backend/README.md`](backend/README.md) for the CMS data model.
