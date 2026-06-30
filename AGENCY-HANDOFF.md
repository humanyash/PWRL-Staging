# PWRL — HumanDesign Internal Ops Guide

*Internal documentation for the HumanDesign team. Not for PWRL editors —
they get [`CLIENT-HANDOFF.md`](CLIENT-HANDOFF.md).*

This is everything a HumanDesign team member needs to operate, support,
and (if necessary) take over the PWRL website.

---

## Stack at a glance

See [`INFRA.md`](INFRA.md) for the current URLs (some still TBD during
the HumanDesign migration).

```
GitHub (HumanDesign/pwrl-staging-website-y)
  ├─ push to main
  │    ├─> Render rebuilds Strapi backend
  │    │     └─> Postgres (Neon)
  │    │     └─> Media uploads (Cloudinary)
  │    └─> Vercel rebuilds Next.js frontend
  │          └─> reads CMS via NEXT_PUBLIC_STRAPI_URL
```

Auto-deploy on every push to `main`. No manual steps to ship code.

---

## Credential ownership

| Platform | Account email | Password manager entry | Notes |
|---|---|---|---|
| GitHub (HumanDesign org) | TBD | TBD | Repo: `pwrl-staging-website-y` |
| Vercel (HumanDesign team) | TBD | TBD | Frontend project |
| Render | TBD | TBD | Strapi web service |
| Neon | TBD | TBD | Postgres `pwrl-humandesign` |
| Cloudinary | TBD | TBD | Media CDN |
| Strapi Super Admin | yash@humandesign.com | TBD | Created at first-admin step |
| HubSpot portal `243469173` | Client-owned | n/a | We do not control |
| Adobe Fonts kit `xyr7qcs` | Client-owned | n/a | We do not control |
| Google Analytics `G-S620CRDB9D` | Client-owned | n/a | We do not control |

**Action item for HumanDesign:** fill in the TBDs above with whichever
shared HumanDesign credentials apply, and store the actual logins in
your team password manager (1Password, Bitwarden, etc.). The repo never
holds raw credentials.

### Bus factor

If the primary HumanDesign engineer is unavailable:

1. Anyone with the password manager can rotate logins on every platform.
2. The repo is self-contained — `render.yaml` rebuilds Strapi from
   scratch, and `frontend/scripts/ingest.ts` re-populates content from
   the bundled fixtures (`frontend/src/lib/fixtures.ts`).
3. Worst-case recovery time from a total credential loss is roughly 2-3
   hours: provision new SaaS accounts, run the blueprint, re-ingest,
   point DNS.

---

## Onboarding a new PWRL editor

PWRL emails you a request to add `someone@pwrl.com`.

1. Log in to the Strapi admin (yash@humandesign.com).
2. **Settings -> Administration Panel -> Users -> Invite new user**.
3. Email: their address.
4. Role: usually **Editor**. Use **Super Admin** only for their main
   point of contact (1-2 people max).
5. Save. Strapi sends a one-time setup email automatically.
6. Confirm to them via email that it's done.

To remove an editor: same menu, click the user, click delete. They lose
access immediately; published content is untouched.

To change someone's role: same menu, edit the user, swap role, save.

---

## Onboarding a new HumanDesign team member

1. Add them to the HumanDesign GitHub org and the
   `pwrl-staging-website-y` repo (Maintain or Admin role).
2. Share the HumanDesign password manager with them.
3. Invite them as a Strapi Super Admin (same flow as a PWRL editor,
   different role).
4. Have them clone the repo and run `frontend/` locally (no backend
   needed for frontend work — it falls back to fixtures).
5. For backend work, walk them through `cp backend/.env.example
   backend/.env`, generate secrets, `npm run develop`. See
   [`backend/README.md`](backend/README.md) for details.

---

## Common support requests from PWRL

| Request | Resolution |
|---|---|
| "My edit isn't showing on the live site" | Check Strapi: is the entry **Published** (not just Saved)? If yes, wait 90s and hard-refresh. If still nothing, check Vercel deploy logs for errors. |
| "I can't log in" | Reset their password from Strapi admin (Users -> click user -> Reset password). Or send them a fresh invite if they never set up. |
| "Image upload failed" | Check Cloudinary monthly bandwidth (free tier is 25 GB/mo). If exceeded, upgrade Cloudinary plan or wait until next month. |
| "Page is broken / 500 error" | Check Vercel deploy logs first, then Render Strapi logs. Most issues trace to a schema mismatch (someone changed a content type field on dev but didn't push to prod). |
| "Admin panel is super slow" | Free Render tier sleeps after 15min idle. First login = 50s cold start. Suggest upgrading to Render Starter ($7/mo) if it's a recurring complaint. |
| "Can we add a new section to the home page?" | Code change required. Edit `backend/src/api/page/content-types/page/schema.json` dynamic zone, add a component if needed, ship it, then ingest. |

---

## Routine maintenance

### Weekly

- Skim Render and Vercel deploy logs for any failed deploys.
- Check Cloudinary usage dashboard (free tier limits).

### Monthly

- Confirm GA4 (`G-S620CRDB9D`) is still recording sessions on the live
  site.
- Make sure HubSpot lead capture is still flowing (form submission ->
  check it appears in portal 243469173).

### Annually

- **Neon free tier renewal**: managed Postgres. Check storage and CU
  hours. Upgrade if approaching limits.
- **Render free tier**: never expires per se, but reconsider the paid
  tier if cold starts annoy PWRL.
- **Cloudinary**: free tier is 25 GB storage + 25 GB bandwidth/mo. If
  PWRL adds heavy video, upgrade.
- **Adobe Fonts kit `xyr7qcs`**: client-owned, renews on the client's
  Adobe account.

### When PWRL adds a new domain (e.g. switching from staging to
`www.pwrl.com`)

1. Add the domain in Vercel project Settings -> Domains.
2. Have PWRL update DNS at their registrar (Vercel shows the required
   records).
3. Wait for SSL cert provisioning (~5 min).
4. **Authorize the new domain on Adobe Fonts kit `xyr7qcs`**.
   Otherwise the display font won't load on the new domain — kits are
   domain-locked.
5. Optional: keep the old `.vercel.app` URL alive as a staging URL.

---

## Code change workflow

For non-trivial changes (new content type, new section, refactor):

1. Make changes locally on a feature branch.
2. Test locally with `frontend/` pointed at local Strapi (or
   `NEXT_PUBLIC_STRAPI_DISABLED=true` for fixture-only).
3. Push the branch and open a PR. Vercel auto-deploys preview URLs.
4. Merge to `main` -> Render + Vercel both rebuild.
5. If the change adds new schema, the production Strapi migrates on
   restart. Test on a Render preview deploy first for breaking changes.

For schema breaking changes (renamed field, dropped collection):

1. Back up production DB first. Neon dashboard -> Branches -> create a
   branch from main (essentially a snapshot).
2. Push the schema change.
3. If something breaks, revert to the Neon branch with one click.

---

## Bootstrapping a completely new environment

Documented in [`backend/README.md`](backend/README.md) and the
[`render.yaml`](render.yaml) blueprint. Summary:

1. Sign up for Neon, Cloudinary, Render, Vercel under HumanDesign
   accounts (already done for current setup).
2. Render -> New + -> Blueprint -> point at this repo. It reads
   `render.yaml` and provisions the Strapi service.
3. Fill in the prompted env vars: Neon `DATABASE_URL`, Cloudinary
   creds.
4. Wait for build. Open admin, create yash@humandesign.com.
5. Generate Full Access API token, paste into
   `frontend/.env.ingest`, run `npx tsx scripts/ingest.ts` to populate.
6. Vercel -> Add New Project -> import repo with `frontend/` as root.
   Set env vars per [`DEPLOY.md`](DEPLOY.md).
7. Verify both URLs respond, edit one Strapi field, confirm it
   propagates. Done.

End-to-end: ~30 minutes once accounts are ready.

---

## Where to look when things break

| Symptom | First place to look |
|---|---|
| Site returns 500 | Vercel deploy logs -> latest deployment |
| Site returns 404 on all routes | Vercel project Root Directory should be `frontend` |
| Site renders but with fixture data only | Check `NEXT_PUBLIC_STRAPI_URL` is set in Vercel env vars |
| Strapi admin won't load | Render service status; if "deploy failed", check Render build logs |
| Editor saves but content disappears | Postgres connection issue or schema mismatch; check Render runtime logs |
| Image upload returns 400/500 | Cloudinary creds; verify `CLOUDINARY_*` env vars on Render |
| Random "service unavailable" once per day | Free Render tier cold start — normal |

---

## Files in this repo worth knowing

| File | What it is |
|---|---|
| [`render.yaml`](render.yaml) | Render Blueprint for Strapi |
| [`DEPLOY.md`](DEPLOY.md) | Vercel project setup for the frontend |
| [`INFRA.md`](INFRA.md) | Live URLs, accounts, migration state |
| [`CLIENT-HANDOFF.md`](CLIENT-HANDOFF.md) | What PWRL editors see |
| [`AGENCY-HANDOFF.md`](AGENCY-HANDOFF.md) | This file |
| [`backend/README.md`](backend/README.md) | Strapi backend quick-start |
| [`backend/.env.example`](backend/.env.example) | Template for backend local secrets |
| [`frontend/scripts/ingest.ts`](frontend/scripts/ingest.ts) | One-shot content bootstrap |
| [`frontend/src/lib/strapi.ts`](frontend/src/lib/strapi.ts) | CMS fetch layer with fixture fallback |
| [`frontend/src/lib/fixtures.ts`](frontend/src/lib/fixtures.ts) | Verbatim site copy (the fallback baseline) |
| [`SCHEMA.md`](SCHEMA.md) | Content-type schema reference |

---

*This document is the handover from the original developer to the
HumanDesign team. Keep it current as accounts move and team changes.*
