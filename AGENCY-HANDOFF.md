# PWRL — HumanDesign Internal Ops Guide

*Internal documentation for the HumanDesign team. Not for PWRL editors —
they get [`CLIENT-HANDOFF.md`](CLIENT-HANDOFF.md).*

This is everything a HumanDesign team member needs to operate, support, and (if
necessary) take over the PWRL website.

---

## Stack at a glance

See [`INFRA.md`](INFRA.md) for full details. Summary:

```
GitHub (HumanDesign/pwrl-staging-website-y)
  └─ push to main
       └─> Vercel rebuilds the Next.js app (frontend/)
             ├─> reads content from Supabase Postgres (public, RLS)
             ├─> serves /admin CMS (writes via Supabase service role)
             ├─> media from Supabase Storage (public "media" bucket)
             └─> admin auth via Clerk (invite-only Google)
```

Auto-deploy on every push to `main`. No backend service, no manual steps to ship
code. **Content edits do not require a deploy** — CMS saves call
`revalidatePath` and update the live site within seconds.

---

## Credential ownership

| Platform | Account | Notes |
|---|---|---|
| GitHub (HumanDesign org) | TBD | Repo: `pwrl-staging-website-y` |
| Vercel (HumanDesign team) | TBD | Frontend + CMS project |
| **Supabase** | TBD | Content DB + media storage. Holds the service-role key. |
| **Clerk** | TBD | Admin auth. Manage invited users here. |
| HubSpot portal `243469173` | Client-owned | We do not control |
| Adobe Fonts kit `xyr7qcs` | Client-owned | We do not control |
| Google Analytics `G-S620CRDB9D` | Client-owned | We do not control |

**Action item:** fill in the TBDs with the shared HumanDesign accounts and store
real logins in your team password manager. The repo never holds raw credentials.

### Bus factor

If the primary HumanDesign engineer is unavailable:

1. Anyone with the password manager can rotate logins on Vercel, Supabase, and
   Clerk.
2. The repo is self-contained: `frontend/supabase/schema.sql` rebuilds the DB
   schema, and `npm run seed` re-populates content from
   `frontend/src/lib/fixtures.ts`.
3. Worst-case recovery from total credential loss: new Supabase + Clerk
   projects, run schema + seed, set Vercel env vars, point DNS. ~1-2 hours.

---

## Onboarding a new PWRL editor

PWRL emails you a request to add `someone@pwrl.com` (must be a Google account).

1. Log in to the **Clerk dashboard** → **Users** (or **Organizations** if using
   org-based access) → **Invite / Create user**.
2. Add their email. Because sign-in is invite-only, only added users can log in.
3. They open `/admin`, click **Continue with Google**, and they're in.
4. Confirm to them via email that it's done.

To remove an editor: delete them in Clerk → they lose access immediately;
published content is untouched.

---

## Onboarding a new HumanDesign team member

1. Add them to the HumanDesign GitHub org and the `pwrl-staging-website-y` repo.
2. Share the HumanDesign password manager (Vercel, Supabase, Clerk).
3. Add them as an admin user in Clerk (same invite flow as an editor).
4. Have them clone the repo, `cd frontend`, `npm install`, copy
   `.env.local.example` → `.env.local`, fill in Supabase + Clerk keys, then
   `npm run dev`.

---

## Common support requests from PWRL

| Request | Resolution |
|---|---|
| "My edit isn't showing on the live site" | Saves are live immediately — have them hard-refresh (Cmd/Ctrl+Shift+R). If still stale, check Vercel function logs for the save action / `revalidatePath` errors. |
| "I can't log in" | Confirm the Google email is invited in Clerk. Invite-only — unknown accounts are rejected. |
| "Image upload failed" | Check Supabase Storage (`media` bucket) exists and the service-role key is set in Vercel. Check the file size. |
| "Page is broken / 500 error" | Vercel deploy + function logs first. Then check `/api/cms-status`; if not `ok`, Supabase is unreachable or env vars are wrong. |
| "Can we add a new section to the home page?" | Code change — add the block type + editor field, ship it. |

---

## Routine maintenance

### Monthly
- Confirm GA4 (`G-S620CRDB9D`) is recording sessions.
- Confirm HubSpot lead capture still flows to portal `243469173`.

### Quarterly / as needed
- Review Supabase usage (DB size, storage, bandwidth) against the plan.
- Review Clerk MAU against the plan (admin users only — tiny).
- **Adobe Fonts kit `xyr7qcs`**: client-owned; ensure the live domain(s) stay
  authorized.

### Custom domain move (staging → `www.pwrl.com`)
See the "Custom domain cutover" section in [`INFRA.md`](INFRA.md): Vercel
domain, Adobe Fonts authorization, and a Clerk **production instance** with
`pk_live`/`sk_live` keys.

---

## Code change workflow

1. Make changes locally on a feature branch. `frontend/` runs against the shared
   Supabase project (or a personal Supabase project for risky schema work).
2. Push the branch → Vercel builds a preview URL.
3. Merge to `main` → Vercel rebuilds production.
4. Schema changes: edit `frontend/supabase/schema.sql` and run it in the
   Supabase SQL editor (it's written to be idempotent). Back up first for
   destructive changes (Supabase → Database → Backups).

---

## Bootstrapping a completely new environment

1. Create a **Supabase** project. Run `frontend/supabase/schema.sql` in the SQL
   editor. Enable the Data API.
2. Create a **Clerk** application; enable Google as a sign-in provider; set it
   invite-only.
3. Locally, fill `frontend/.env.local` with the Supabase + Clerk keys and run
   `npm run seed` to load content.
4. Create the **Vercel** project (Root Directory `frontend`), set env vars per
   [`DEPLOY.md`](DEPLOY.md), and deploy.
5. Verify `/api/cms-status`, the public site, and `/admin` sign-in.

End-to-end: ~30 minutes once accounts are ready.

---

## Where to look when things break

| Symptom | First place to look |
|---|---|
| Site returns 500 | Vercel deploy + function logs → latest deployment |
| Site returns 404 on all routes | Vercel project Root Directory should be `frontend` |
| Site renders but content is stale/empty | `/api/cms-status`; check Supabase env vars in Vercel |
| `/admin` won't sign in | Clerk keys in Vercel; user invited in Clerk; domain in Clerk allowed origins |
| Admin save fails / images won't upload | `SUPABASE_SERVICE_ROLE_KEY` set? `media` bucket exists? |
| Uploaded image won't display | `**.supabase.co` present in `next.config.ts` `remotePatterns` |

---

## Files in this repo worth knowing

| File | What it is |
|---|---|
| [`DEPLOY.md`](DEPLOY.md) | Vercel setup + env vars |
| [`INFRA.md`](INFRA.md) | Stack, content flow, decommission checklist |
| [`CLIENT-HANDOFF.md`](CLIENT-HANDOFF.md) | What PWRL editors see |
| [`AGENCY-HANDOFF.md`](AGENCY-HANDOFF.md) | This file |
| `frontend/supabase/schema.sql` | DB schema + RLS + storage bucket (idempotent) |
| `frontend/scripts/seed-supabase.ts` | Loads fixture content into Supabase (`npm run seed`) |
| `frontend/src/lib/content.ts` | Public content read layer (Supabase, RLS) |
| `frontend/src/lib/admin/data.ts` | Admin read layer (service role) |
| `frontend/src/app/admin/actions.ts` | Clerk-gated write actions + revalidate |
| `frontend/src/lib/fixtures.ts` | Verbatim launch content (seed source / baseline) |

---

*This document is the operational handover for the HumanDesign team. Keep it
current as accounts move and the team changes.*
