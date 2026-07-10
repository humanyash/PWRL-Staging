# PWRL Website — Editor Guide

*Prepared by HumanDesign for the PWRL editorial team.*

This guide is everything you need to update content on the PWRL website. You
log into the built-in **PWRL CMS** at `/admin` with your Google account.
**Changes go live immediately** — there is no separate "publish" step and no
waiting for a rebuild.

---

## Your links

| | URL | What it does |
|---|---|---|
| Website | https://pwrl-staging-website-y.vercel.app | The live (staging) site visitors see |
| **CMS login** | https://pwrl-staging-website-y.vercel.app/admin | Where you edit content |
| CMS health check | https://pwrl-staging-website-y.vercel.app/api/cms-status | Should show `"ok": true` |
| Help | yash@humandesign.com | Anything broken, unclear, or new |

You do **not** need Vercel, GitHub, Supabase, or Clerk accounts. You only need
the Google account that HumanDesign invited.

---

## Logging in

1. Open https://pwrl-staging-website-y.vercel.app/admin
2. You'll land on the **Human Design — PWRL CMS** sign-in screen.
3. Click **Continue with Google** and use the email HumanDesign invited.
4. You're in. The CMS loads instantly — no cold-start wait.

Access is **invite-only**. If Google says you don't have access, email
HumanDesign to be added. To sign out, click your avatar (bottom-left) →
**Sign out**.

---

## What you can edit

The left sidebar has five sections:

| Section | What it changes on the site |
|---|---|
| **Pages** | Every page's copy, headlines, buttons, images, and background video — Home, Vision, Fund, Trade, Investor Relations, Learn, Contact. Includes the per-page **SEO title & description**. |
| **Blog** | Articles on `/learn` — write, save as draft, and publish when ready. |
| **Settings** | Announcement banner, logo, navigation menu, footer links, social links, and disclaimers. |
| **Legal** | Privacy Policy and Terms & Conditions copy. |
| **Media** | The shared image library — upload once, reuse anywhere. |

---

## How editing works

1. Click a section in the sidebar (e.g. **Pages**), then click the item you
   want to edit (e.g. **Home**).
2. Each page is built from **sections** (Hero, Intro, Stats, News, FAQ, etc.).
   Open the section you want and edit its fields. Click a section header to
   collapse/expand it.
3. Click **Save** (bottom bar). Your change is **live on the site
   immediately** — refresh the public page to confirm.

There is no draft/publish split for Pages, Settings, or Legal — **Save = live**.
Only **Blog** posts have a draft state (see below).

### Swapping an image

- Any image field has a drop zone. **Drag an image file onto it**, or click to
  pick one — it uploads to the Media library and swaps in automatically.
- Or open **Media**, upload the image, **Copy URL**, and paste it into the
  image field.
- Formats: PNG, JPG, WebP, SVG, GIF. Keep files reasonably sized (under ~10 MB).

### Editing the announcement banner

1. **Settings** → the banner fields at the top.
2. Edit the banner text and its link. Toggle it on/off.
3. **Save** → refresh the site to confirm.

### Writing a blog / Learn article

1. **Blog** → **New post** (or open an existing one).
2. Fill in title, slug, date, images, and body sections.
3. **Save draft** keeps it hidden. **Publish** makes it live on `/learn`.
   You can **Unpublish** to hide it again, or **Delete** to remove it.

### Updating SEO for a page

1. Open the page in **Pages**.
2. Edit **Title** and **Meta description** at the top (the **Page & SEO** card).
3. **Save**. These control the browser tab title and the text search engines
   and social shares display.

---

## Undo a mistake

- **Just saved something wrong?** Re-edit the field and Save again — there's no
  cache delay.
- **Blog post you're not ready to show?** Unpublish it.
- **Bigger mistake / need a prior version restored?** Email HumanDesign — the
  database is backed up and content history can be recovered.

---

## 5-minute checklist (verify everything works)

After HumanDesign invites your account, run through this once:

- [ ] Log in at `/admin` with Google
- [ ] Change the banner text in **Settings** → appears on the home page after refresh
- [ ] Edit a headline on **Pages → Home** → updates on the site
- [ ] Swap an image on any page → new image shows
- [ ] Create a **Blog** draft, publish it → appears on `/learn`
- [ ] Edit **Legal → Privacy Policy** → updates on `/legal`

---

## When to contact HumanDesign

| Situation | Contact |
|---|---|
| Google says you don't have access | yash@humandesign.com |
| Saved but the site still shows old content after a refresh | yash@humandesign.com |
| Image upload fails | yash@humandesign.com |
| Need a new page, section, or layout change | yash@humandesign.com |
| Site broken / images missing | yash@humandesign.com (urgent) |

---

## FAQ

**Q: Do I need to "publish" my changes?**
For Pages, Settings, and Legal, no — **Save puts it live immediately**. Only
Blog posts have a draft → publish flow.

**Q: I edited something and the site still shows the old version.**
Hard-refresh the page: **Cmd+Shift+R** (Mac) or **Ctrl+Shift+R** (Windows).
Still wrong? Email HumanDesign.

**Q: Can I edit the page layout or move sections around?**
You can edit the content of existing sections. Adding new sections or changing
layout is a code change — email HumanDesign.

**Q: Can multiple people edit at once?**
Yes. Last save wins on the same field.

**Q: Is the CMS slow the first time like the old one?**
No. The old Strapi CMS had a ~50s cold start. The new CMS is instant.

---

*Last updated: July 2026 — HumanDesign*
