# PWRL CMS — Operations Guide

How the Strapi CMS is run, who does what, and why production mode behaves the way it does.

## Two different jobs

| Task | Who | Where | Tool |
|------|-----|-------|------|
| **Edit content** (banner, news, FAQ, team, PDFs) | Editors | Render production CMS | Content Manager |
| **Change schema** (new fields, content types, page sections) | HumanDesign | Git repo + local dev | Schema JSON + deploy |

Editors should **never** need Content-Type Builder on the live CMS.

---

## Why you see “production mode” on Render

Render runs:

```bash
npm run build && npm run start   # NODE_ENV=production
```

In production, Strapi **intentionally disables**:

- Content-Type Builder (create/edit content types in the UI)
- Some admin development tools

This is **correct and required** for a stable live CMS. You should **not** switch Render to `strapi develop` — that mode is for local development only, uses more memory, and is unsafe for a public admin URL.

### If HumanDesign needs schema changes

1. Edit schema files under `backend/src/api/` and `backend/src/components/`
2. Test locally: `cd backend && npm run develop`
3. Commit and push to GitHub
4. Render redeploys; the database migrates on boot

### If an editor needs a new field or page section

Contact HumanDesign. That is a schema/code change, not something done in the live admin panel.

---

## Admin homepage widgets

Strapi 5.13+ supports custom dashboard widgets. This project registers:

- **Daily content shortcuts** — links to the seven editor content areas
- **Content guide** — full guide in the left sidebar under **Content guide**

If **Add widgets** shows an empty list, that picker only lists **optional custom widgets**. Default widgets (last edited, profile, etc.) are already on the homepage. After deploy, you should see **Daily content shortcuts** in the widget picker.

---

## Environment summary

| Environment | Command | Content-Type Builder | Used for |
|-------------|---------|----------------------|----------|
| Local | `npm run develop` | Enabled | Schema work, testing |
| Render | `npm run start` | Disabled | Editor content + live API |

---

## Rollback and drafts

All editorial content types use **Save** (draft) vs **Publish** (live). The
website only reads **published** content — drafts never appear on the staging
site until you publish.

To undo:

- **Unpublish** an entry to remove it from the site
- **History** (⋯ menu) to restore a previous version
- **Settings → Import Export** for full backup/restore before big edits

After enabling draft/publish on a content type, run the ingest script once to
republish existing content:

```bash
cd frontend && npx tsx scripts/ingest.ts
```

---

## Config sync (roles and admin layout)

After changing roles or Content Manager layout in admin:

```bash
cd backend
npm run strapi config-sync export -- --yes
git add config/sync/
git commit -m "Sync Strapi admin config"
git push staging main
```

On Render, config sync is **manual only** (Settings → Config Sync → Import).
Auto-import on boot is disabled because stale sync files on disk caused deploy
crashes. Editor permissions are applied automatically via `src/index.ts` on each
boot instead.

---

## What is editable in the CMS

Almost the entire site is now CMS-editable. The frontend is CMS-first and falls
back to the baked-in fixtures per field, so an empty field never blanks the site.

| Area | Where in Strapi |
|------|-----------------|
| Top banner, logo, **navigation menu**, footer/social links, copyright | Site Banner & Footer (single) |
| Every page's sections, headlines, copy, buttons | Pages → *(page)* → Sections |
| Home hero **rotating words** (prefix + suffixes), background **image/video** | Pages → Home → Hero |
| Home **portfolio grid** (name, %, ticker, IPO, logo) + **fund-details table** | Pages → Home → Intro |
| Stats (numbers, labels, icons, footnote, theme) | Pages → *(page)* → Stats Block |
| Timeline (entries, years beam, caption, graphic) | Pages → Vision → Timeline |
| Fund holdings + **sectors** table, footnotes | Pages → Fund → Portfolio Block, or Fund Portfolio (single) |
| FAQ intro/contact/theme + questions | FAQ (single) + Pages → FAQ Block |
| Forms (heading, fields, HubSpot ids) | Pages → Form Block (+ HubSpot Forms) |
| **Learn articles** (card/hero image, body, sub-sections) | Learn Articles (collection) |
| **Events / webcasts** | Pages → Investor Relations → Events List |
| Team, Board, News, Fund Documents, Legal, Disclaimers | Their own content types |

Every field carries a plain-English description in the edit form. Technical
fields (order, slug, HubSpot ids) also get friendly labels via
`src/bootstrap-content-manager.ts`.

## Adding/seeding new schema fields (deploy order matters)

The frontend fills any field the CMS doesn't carry from fixtures, and a few
legacy home sections keep a guarded fixture override that self-disables once the
CMS is re-seeded. So when schema changes ship, follow this order to avoid a
window of stale content:

1. Merge the schema change and **deploy the backend to Render** (migrates on boot).
2. Run the ingest so the CMS holds the current live content, **including media**
   inside components (hero video, logos, stat icons, background slides) which the
   ingest now uploads and links automatically:

   ```bash
   cd frontend && npx tsx scripts/ingest.ts
   ```

3. Deploy the frontend. Verify each page against the previous live output
   (home hero rotator, portfolio grid, fund tables, stats, timeline, nav, Learn,
   Events) before considering it done.

## Related docs

- [`CLIENT-HANDOFF.md`](../CLIENT-HANDOFF.md) — editor-facing guide
- [`src/bootstrap-roles.md`](src/bootstrap-roles.md) — role permissions
- [`README.md`](README.md) — local setup and plugins
