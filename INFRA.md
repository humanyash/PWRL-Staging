# PWRL — Infrastructure

> **Secrets policy:** No connection strings, API secrets, or passwords are
> stored in this repo or in any agent context. Secrets live only in the
> hosting provider's env-var settings (Vercel, Supabase, Clerk). This file
> records *non-secret* identifiers only.

## Current stack

As of the July 2026 CMS migration, the site is a single Next.js app backed by
Supabase and Clerk. **Strapi, Render, Neon, and Cloudinary are no longer used.**

| Layer | Service | Notes |
|---|---|---|
| Source code | GitHub `HumanDesign/pwrl-staging-website-y` | Monorepo now contains only `frontend/` app code + docs |
| Frontend + CMS | Next.js → Vercel (HumanDesign team) | Root Directory `frontend`. Public site + `/admin` CMS in one app. |
| Content DB | **Supabase Postgres** | Tables: `pages`, `blog_posts`, `global_settings`, `legal_pages`, `media`. RLS: public reads published rows; writes are service-role only. |
| Media | **Supabase Storage** | Public `media` bucket. Admin uploads go here; URLs are `https://<ref>.supabase.co/storage/v1/object/public/media/…` |
| Admin auth | **Clerk** | Invite-only Google sign-in, scoped to `/admin`. |
| Analytics | Google Analytics 4 (`G-S620CRDB9D`) | Wired in `frontend/src/app/layout.tsx`; env override `NEXT_PUBLIC_GA_ID` |
| Forms | HubSpot portal `243469173` (Forms API) | Client-owned; NAV + contact wired |
| Filings | SEC EDGAR (CIK `2052053`) | |
| Fonts | Adobe Fonts kit `xyr7qcs` (client-owned) | env override `NEXT_PUBLIC_TYPEKIT_ID` |

Deployment: push to `main` → Vercel rebuilds the frontend (see
[`DEPLOY.md`](DEPLOY.md)). There is no backend service to deploy.

## How content flows

- **Public site** reads Supabase via `frontend/src/lib/content.ts` (anon key,
  RLS-restricted to published rows). Pages use ISR + on-demand revalidation.
- **`/admin` CMS** reads/writes via server actions in
  `frontend/src/app/admin/actions.ts` using the **service-role** key (bypasses
  RLS). Every save calls `revalidatePath`, so public pages update within
  seconds — no redeploy.
- **Fallback baseline:** `frontend/src/lib/fixtures.ts` holds the verbatim
  launch content and seeded Supabase via `npm run seed`.

## Config that survives account moves

- `frontend/next.config.ts` `images.remotePatterns` allows `**.supabase.co`
  (admin-uploaded media) and `res.cloudinary.com` (legacy asset URLs still
  referenced in some fixtures).
- `frontend/src/lib/supabase/env.ts` resolves Supabase env vars under either the
  plain or `NEXT_PUBLIC_`-prefixed names (Vercel integration compatibility).

## Fonts — Adobe Fonts (Typekit)

| Field | Value |
|---|---|
| Production kit ID | `xyr7qcs` (client-owned) |
| Embed | `https://use.typekit.net/${TYPEKIT_ID}.css` in `app/layout.tsx` head |
| Env override | `NEXT_PUBLIC_TYPEKIT_ID` (defaults to `xyr7qcs`) |
| Domains | Domain-locked. The Vercel `*.vercel.app` URL **and** any custom domain (e.g. `www.pwrl.com`) must be authorized on the `xyr7qcs` kit. |

---

## Decommissioning the old stack (Strapi / Render / Neon / Cloudinary)

The site no longer touches any of these. Once the new Supabase/Clerk stack is
verified in production (recommend ~48h of clean operation), decommission the
legacy services in this order.

### 1. Verify the new stack first (do NOT skip)

- [ ] `/api/cms-status` returns `"ok": true` with a page count on the live URL.
- [ ] Homepage + all pages render correctly from Supabase.
- [ ] `/admin` sign-in works with an invited Google account.
- [ ] A test edit saves and appears on the public site.
- [ ] Confirm **no** Vercel env var still points at Strapi
      (`NEXT_PUBLIC_STRAPI_URL`, `NEXT_PUBLIC_STRAPI_DISABLED`,
      `STRAPI_PREVIEW_*`). Delete any that remain, then redeploy.

### 2. Render (Strapi web service)

- [ ] Confirm no traffic is hitting the Strapi service (Render → service →
      Metrics). It should be idle since the frontend no longer calls it.
- [ ] **Suspend** the service first (reversible) and leave the site running a
      few days as insurance.
- [ ] Once confident, **Delete** the Strapi web service.
- [ ] Delete the associated Render environment/secrets.

### 3. Neon (Postgres for Strapi)

- [ ] Optional safety: export a final backup / create a Neon branch snapshot in
      case any content lived only in Strapi (it shouldn't — everything is in
      fixtures/Supabase).
- [ ] **Delete** the Neon project (`pwrl-humandesign`, and the legacy
      `pwrl-production` if still present).

### 4. Cloudinary (Strapi media)

- [ ] Check whether any live content still references `res.cloudinary.com` URLs
      (`rg "res.cloudinary.com" frontend/src`). If yes, re-upload those assets
      through the CMS Media library (which stores them in Supabase) and update
      the fields, **then** remove the `res.cloudinary.com` entry from
      `next.config.ts`.
- [ ] Once nothing references Cloudinary, downgrade or delete the Cloudinary
      account/media as appropriate.

### 5. Repo cleanup (already done in the migration commit)

- [x] `backend/` (Strapi app) deleted.
- [x] `render.yaml` (Render blueprint) deleted.
- [x] Strapi/Cloudinary helper scripts deleted
      (`ingest*.ts`, `publish-test-banner.ts`, `verify-cloudinary.ts`).
- [x] Strapi data layer + preview API removed from `frontend/`.

---

## Custom domain cutover (when moving to `www.pwrl.com`)

1. Add the domain in Vercel → project **Settings → Domains**; PWRL updates DNS
   at their registrar per Vercel's instructions.
2. **Authorize the new domain on Adobe Fonts kit `xyr7qcs`** (domain-locked).
3. Create a **Clerk production instance** for that domain, add its DNS records,
   and swap Vercel to the `pk_live`/`sk_live` keys.
4. Add the production domain to Clerk's allowed origins.

## See also

- [`AGENCY-HANDOFF.md`](AGENCY-HANDOFF.md) — HumanDesign internal ops.
- [`CLIENT-HANDOFF.md`](CLIENT-HANDOFF.md) — PWRL editor guide.
- [`DEPLOY.md`](DEPLOY.md) — Vercel setup + env vars.
