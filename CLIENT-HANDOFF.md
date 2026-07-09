# PWRL Website — Editor Guide

*Prepared by HumanDesign for the PWRL editorial team (Elle & Rachel).*

This guide is everything you need to update **daily content** on the PWRL
website. You only log into **Strapi** — changes go live on the staging site
in about one minute after you click **Publish**.

You do **not** edit page layout (hero text, section order, etc.). HumanDesign
maintains that. You edit the seven content areas below.

---

## Your links

| | URL | What it does |
|---|---|---|
| Staging website | https://pwrl-staging-website-y.vercel.app | Preview site — check your edits here |
| Editor login | https://pwrl-cms-humandesign.onrender.com/admin | Where you edit content |
| Help | yash@humandesign.com | Anything broken, unclear, or new |

You do **not** need Vercel, Render, GitHub, or Cloudinary accounts.

---

## Logging in

1. Open https://pwrl-cms-humandesign.onrender.com/admin
2. Sign in with the email and password HumanDesign sent you.
3. First load after idle (~15 min) can take **~50 seconds** — the server wakes
   on demand. **Wait; do not refresh.** After that, it is fast.

---

## What you can edit (Content Manager sidebar)

These are the **only** menus you should see as an **Editor**:

| Menu in Strapi | What it changes on the site |
|---|---|
| **Site Banner & Footer** | Home-page top banner (text, link, on/off) |
| **Press & News** | News cards on home and Investor Relations |
| **FAQ** | FAQ accordion on `/vision` and `/fund` |
| **Leadership Team** | Team grid on `/vision` |
| **Board of Directors** | Board grid on `/investor-relations` |
| **Fund Portfolio** | Holdings table on `/fund` |
| **Fund Documents (PDFs)** | PDF list on `/investor-relations` |

You should **not** see **Page**, **Form**, or **HubSpot Forms**. If you do,
contact HumanDesign — your account may have the wrong role.

---

## Helpful tools built into Strapi

### Preview on the staging site

Every entry has **Open preview** / **View live** buttons in the right sidebar
while you edit. They open https://pwrl-staging-website-y.vercel.app at the
right section (home banner, news, FAQ, team, etc.) so you can confirm changes
before or after publishing.

In list views (e.g. Press & News), use the **preview** icon in each row for a
quick link.

### Rich text editor (FAQ and bios)

FAQ answers and team/board bios use a full **rich text editor** with a proper
**link** button in the toolbar. Highlight text → click the link icon → paste the
URL. Do not type markdown like `[text](url)`.

### Schedule a publish (banner and news)

For **Site Banner & Footer** and **Press & News**, scroll to the **Publisher**
section on the edit screen. Pick a date and time to **publish** or **unpublish**
automatically — useful for webinar banners or timed announcements.

---

## Common tasks

### Update the home-page banner

1. **Content Manager → Site Banner & Footer**
2. Edit **topBanner** — banner message. Use `**double asterisks**` for bold.
3. Edit **topBannerLink** — URL when someone clicks the banner (optional).
4. Set **topBannerEnabled** to **true** to show, **false** to hide.
5. Optional: use **Publisher** to schedule when the banner goes live.
6. **Save** → **Publish**
7. Click **View live** or wait ~60s and hard-refresh the staging site.

### Add or edit a news article

1. **Content Manager → Press & News**
2. Open an existing entry or **Create new entry**
3. Fill in:
   - **headline** — title on the card
   - **date** — publication date
   - **url** — link to the full article
   - **source** — e.g. Yahoo Finance, Bloomberg
   - **thumbnail** — click the field → upload or pick from Media Library
   - **showOnHome** — show on the home page news section
   - **showOnInvestorRelations** — show on `/investor-relations` news
4. **Save** → **Publish**

### Edit an FAQ answer (with a link)

1. **Content Manager → FAQ**
2. Open the FAQ entry → expand the **items** list
3. Edit the **answer** field (rich text editor)
4. To add a link: highlight text → click the **link** icon in the toolbar →
   paste the URL
5. **Save** → **Publish**
6. Check `/vision#faq` or `/fund#faq` on the staging site (or use **View live**)

### Update a team member or board director

1. **Leadership Team** or **Board of Directors**
2. Open the person → edit bio, role, or **headshot** (image field)
3. **Save** → **Publish**

### Replace a fund PDF

1. **Content Manager → Fund Documents (PDFs)**
2. Open the document → **file** field → upload or replace the PDF
3. **Save** → **Publish**
4. Check `/investor-relations#fund-documents` on the staging site.

### Update portfolio holdings

1. **Content Manager → Fund Portfolio**
2. Edit **asOfDate**, **intro**, or rows in **holdings**
3. **Save** → **Publish**

---

## Save vs Publish

1. **Save** — stores a draft; **not live** yet.
2. **Publish** — pushes to the website (~60 seconds until visible).
3. Hard refresh if needed: **Cmd+Shift+R** (Mac) or **Ctrl+Shift+R** (Windows).

### Undo a mistake

`…` menu (top right) → **History** → revert to a previous version.

---

## Uploading images and PDFs

**For news photos:** use the **thumbnail** field on each Press & News entry.

**For fund PDFs:** use the **file** field on each Fund Documents entry.

You can also upload via **Media Library** (left sidebar), then pick the asset
in the entry field.

Formats: PNG, JPG, WebP, SVG, GIF, PDF. Max ~200 MB.

---

## 5-minute checklist (verify everything works)

After HumanDesign wires your account, run through this once:

- [ ] Change banner text + link → appears on home within ~60s
- [ ] Add or edit a news item with a photo → appears on home and/or IR
- [ ] Edit an FAQ answer link → link works on `/vision#faq`
- [ ] Edit a team bio → updates `/vision`
- [ ] Replace a fund PDF → new file on `/investor-relations#fund-documents`
- [ ] Edit a portfolio row → updates `/fund`

---

## When to contact HumanDesign

| Situation | Contact |
|---|---|
| Cannot log in / forgot password | yash@humandesign.com |
| Published but site still shows old content after 90s | yash@humandesign.com |
| Upload fails or file too large | yash@humandesign.com |
| Need a new page, section, or layout change | yash@humandesign.com |
| See **Page** or **Form** in your menu (wrong role) | yash@humandesign.com |
| Site broken / images missing | yash@humandesign.com (urgent) |

---

## FAQ

**Q: I edited something and the site still shows the old version.**
Wait 60 seconds and hard-refresh. Still wrong? Email HumanDesign.

**Q: The admin panel is slow the first time.**
Normal on the free hosting tier — ~50s wake-up, then fast.

**Q: Can I edit the home page hero or move sections?**
No — that is page layout. Email HumanDesign for layout changes.

**Q: Can multiple people edit at once?**
Yes. Last save wins on the same field.

---

*Last updated: July 2026 — HumanDesign*
