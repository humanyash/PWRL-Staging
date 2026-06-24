# Deploying PWRL on Vercel

This repo is a **monorepo**. Only `frontend/` is the Next.js app that belongs on Vercel.

## Vercel project settings (required)

| Setting | Value |
|---|---|
| **Root Directory** | `frontend` |
| **Framework Preset** | Next.js |
| **Build Command** | `npm run build` (default) |
| **Output Directory** | *(leave empty — Next.js default)* |
| **Install Command** | `npm install` (default) |

If Root Directory is blank or `.`, Vercel builds the repo root (which has no Next.js app). The deploy may show "Success" but every URL returns **404 NOT_FOUND**.

## Environment variables (staging)

Until Strapi is deployed:

| Name | Value |
|---|---|
| `NEXT_PUBLIC_STRAPI_DISABLED` | `true` |

When CMS is live, set `NEXT_PUBLIC_STRAPI_URL` to your Strapi URL and remove `NEXT_PUBLIC_STRAPI_DISABLED`.

## After changing settings

1. Save settings in Vercel → **Deployments** → **Redeploy** (use "Redeploy" on latest, not just a new git push).
2. Open the deployment **Build Logs** and confirm you see `next build` running inside `frontend/`.
3. Visit the deployment URL root `/` — you should see the PWRL homepage.

## Backend (separate host)

`backend/` is Strapi. Deploy it on Render (or similar), not Vercel. See `INFRA.md`.
