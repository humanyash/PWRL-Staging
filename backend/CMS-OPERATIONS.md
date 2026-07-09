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

## Related docs

- [`CLIENT-HANDOFF.md`](../CLIENT-HANDOFF.md) — editor-facing guide
- [`src/bootstrap-roles.md`](src/bootstrap-roles.md) — role permissions
- [`README.md`](README.md) — local setup and plugins
