# PWRL Website — Editor Guide

*Prepared by HumanDesign for the PWRL editorial team.*

This guide is everything you need to update content on the PWRL website
yourself. You only ever log into one tool — **Strapi** — and changes go
live in about a minute.

> URLs marked `__TBD__` will be filled in once HumanDesign finalizes the
> production hosts. You'll receive the live values directly.

---

## The three things you have

| | URL | What it does |
|---|---|---|
| Public website | `__VERCEL_URL_TBD__` | The PWRL site your visitors see |
| Editor login | `__STRAPI_URL_TBD__/admin` | Where you edit content (this is the only login you need) |
| Help | HumanDesign (yash@humandesign.com) | For anything broken, unclear, or new |

You do **not** need accounts on Vercel, Render, GitHub, Cloudinary, or
any other platform. HumanDesign manages all of that for you.

---

## Logging in for the first time

1. Open `__STRAPI_URL_TBD__/admin` in your browser.
2. Sign in with the email and password HumanDesign sent you.
3. If the page takes ~50 seconds to load the very first time after a
   long idle period, that is expected — the server wakes up on demand.
   **Wait, do not refresh.** It only happens once per work session.

If you do not have credentials yet, email yash@humandesign.com and
they'll send you an invite.

---

## What you can edit

Everything is under **Content Manager** in the left sidebar of the
Strapi admin. Each row in the table below is one section in that menu.

### Pages (one entry per page on the site)

| Edit this | To change |
|---|---|
| **Page** -> `home` | The home page |
| **Page** -> `vision` | `/vision` |
| **Page** -> `fund` | `/fund` |
| **Page** -> `trade` | `/trade` |
| **Page** -> `investor-relations` | `/investor-relations` |
| **Page** -> `learn` | `/learn` |
| **Page** -> `contact` | `/contact` |

Each page is built from **sections** (hero, intro, FAQ, etc.). You can
edit text inside any section. Adding or removing sections requires
HumanDesign help — message us first.

### Lists (multiple entries each)

| Edit this | To change |
|---|---|
| **Team Member** | Leadership grid on `/vision` |
| **Board Director** | Board grid on `/investor-relations` |
| **News Item** | News list on the home page and `/investor-relations` |
| **Fund Document** | PDFs in the "Fund Documents" list on `/investor-relations` |
| **Legal Page** | The Privacy Policy (`/legal`) and Terms (`/terms`) body text |

### Global content (one entry, applies everywhere)

| Edit this | To change |
|---|---|
| **FAQ** | The FAQ accordion (appears on multiple pages) |
| **Disclaimers** | Legal disclaimer paragraphs in the footer |
| **Global Settings** | Top banner, footer links, social icons, copyright text |
| **Portfolio Snapshot** | The holdings table on `/fund` |

---

## How to edit something

1. Pick the entry you want to change.
2. Edit the field.
3. Click **Save** (top right) — this stores your draft. It is **not yet
   live**.
4. Click **Publish** (top right, next to Save) — this pushes it to the
   live site.
5. Wait about 60 seconds, refresh the public site, and your change will
   appear.

If it does not appear after 90 seconds, do a hard refresh (Cmd+Shift+R
on Mac, Ctrl+Shift+R on Windows). If still nothing, contact HumanDesign.

### Undo a mistake

Click the `…` menu top-right on any entry -> **History**. You can see
every past version and revert to it.

### Take a page off the site temporarily

Open the page entry, click **Unpublish** next to Save / Publish. The
page disappears from the live site within 60 seconds. Click **Publish**
again to bring it back.

---

## Uploading images and PDFs

1. Left sidebar -> **Media Library**.
2. **Add new assets** (top right) -> drag in your files.
3. Files upload to Cloudinary (the CDN HumanDesign manages for you).
4. Go back to the page or entry, find the image field, click "Browse" or
   "Replace", and pick your new asset.

Supported formats: PNG, JPG, WebP, SVG, GIF, PDF, MP4. Max file size
200 MB.

---

## Adding another editor from your team

1. **Settings -> Administration Panel -> Users -> Invite new user**.
2. Enter their email.
3. Pick a role:
   - **Editor** — can edit and publish content. Use this for most
     teammates.
   - **Author** — can edit drafts but cannot publish without review.
   - **Super Admin** — full control, including managing users.
     Reserve for one or two people on your team.
4. They get an email with a one-time link to set their password.

If you do not see the **Users** menu, you do not have Super Admin
permissions. Email HumanDesign and we'll either upgrade you or invite
the new user on your behalf.

---

## When to contact HumanDesign

| Situation | Contact |
|---|---|
| Cannot log in / forgot password | yash@humandesign.com |
| Edited and published but the site shows the old version after 90s | yash@humandesign.com |
| Upload won't work / file too large / unsupported format | yash@humandesign.com |
| Want to add a new section / new page / new content type | yash@humandesign.com |
| Site looks broken / images missing / page not loading | yash@humandesign.com (urgent) |
| New editor onboarding | yash@humandesign.com |

---

## Frequently asked

**Q: I edited something and the live site still shows the old version.**
Wait 60 seconds and hard-refresh. The site caches each page for one
minute for speed. Still not updated? Contact HumanDesign.

**Q: The admin panel is slow / spinning forever.**
The server sleeps after 15 minutes of inactivity to save costs. First
login of the session takes ~50 seconds to wake it up. After that,
everything is instant.

**Q: I uploaded an image but cannot find it.**
Media Library -> sort by "Most recent uploads". If still missing, the
upload may have failed silently — try again.

**Q: Can multiple of us edit at the same time?**
Yes. Strapi handles concurrent edits at the field level. If two people
edit the same field, last-save wins.

**Q: Is there a preview before publishing?**
The site is static — what you see in the entry editor is what will
render. For pixel-level previews, ask HumanDesign to set up a staging
environment.

**Q: Can I schedule a publish for later?**
Not built in. If you need this, contact HumanDesign and we'll add it.

---

*Last updated: __HANDOFF_DATE_TBD__ — HumanDesign*
