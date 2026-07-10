# Deploying PWRL on Vercel

The site is a single **Next.js app** in `frontend/`, deployed to Vercel. Content
and media live in **Supabase**; the `/admin` CMS is gated by **Clerk**. There is
no separate backend service to deploy anymore.

## Vercel project settings (required)

| Setting | Value |
|---|---|
| **Root Directory** | `frontend` |
| **Framework Preset** | Next.js |
| **Build Command** | `npm run build` (default) |
| **Output Directory** | *(leave empty — Next.js default; do not set to `public`)* |
| **Install Command** | `npm install` (declared in `frontend/vercel.json`) |

If Root Directory is blank or `.`, Vercel builds the repo root (which has no
Next.js app). The deploy may show "Success" but every URL returns
**404 NOT_FOUND**.

## Environment variables

Set these on the Vercel project (Production **and** Preview).

### Supabase (content + media)

If you used the **Vercel↔Supabase integration**, most of these are injected
automatically. The app accepts either the plain or `NEXT_PUBLIC_`-prefixed name
for the URL and anon key.

| Name | Notes |
|---|---|
| `SUPABASE_URL` (or `NEXT_PUBLIC_SUPABASE_URL`) | Project URL, e.g. `https://<ref>.supabase.co` |
| `SUPABASE_ANON_KEY` (or `NEXT_PUBLIC_SUPABASE_ANON_KEY`) | Public read key (RLS-restricted) |
| `SUPABASE_SERVICE_ROLE_KEY` | **Server-only.** Used by admin writes + seed. Never expose to the client. |

### Clerk (admin auth)

Add these yourself from the Clerk dashboard → **API keys**.

| Name | Notes |
|---|---|
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | `pk_test_…` (dev) or `pk_live_…` (production) |
| `CLERK_SECRET_KEY` | `sk_test_…` (dev) or `sk_live_…` (production). Server-only. |

**Dev vs production Clerk keys:**
- `pk_test`/`sk_test` (development instance) work on `localhost` and any
  `*.vercel.app` URL. They show a small Clerk "development" badge. Fine for
  staging.
- Create a Clerk **production instance** only when launching on the final
  custom domain (e.g. `www.pwrl.com`). It requires DNS records you add at the
  registrar — you cannot verify it on a `*.vercel.app` URL. Then swap in the
  `pk_live`/`sk_live` keys.

### Optional (site chrome — have safe defaults in `app/layout.tsx`)

| Name | Notes |
|---|---|
| `NEXT_PUBLIC_TYPEKIT_ID` | Adobe Fonts kit (default `xyr7qcs`) |
| `NEXT_PUBLIC_GA_ID` | Google Analytics 4 (default `G-S620CRDB9D`) |

## Verify after deploy

1. Open `https://<your-vercel-url>/api/cms-status` — expect `"ok": true` and a
   page count > 0 (confirms Supabase is reachable).
2. Open `/` — the homepage should render banner/news/stats from Supabase.
3. Open `/admin` — you should be redirected to the branded `/admin/sign-in`.
   Sign in with an invited Google account and confirm the dashboard loads.
4. Edit a field in the CMS, Save, and confirm the public page updates on
   refresh (saves call `revalidatePath`, so updates are near-instant).

## Database + storage setup (one time)

The Supabase schema and seed only need to run once per project:

1. In Supabase → **SQL Editor**, run [`frontend/supabase/schema.sql`](frontend/supabase/schema.sql)
   (idempotent — safe to re-run). This creates the tables, RLS policies, and the
   `media` storage bucket.
2. Locally, with `frontend/.env.local` filled in, run `npm run seed` to load the
   fixture content into Supabase.

See [`INFRA.md`](INFRA.md) for the full stack and account details, and
[`CLIENT-HANDOFF.md`](CLIENT-HANDOFF.md) for the editor workflow.
