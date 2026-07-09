# Admin Role / Permission Bootstrap

Strapi admin-panel roles live in the database (`admin_roles` /
`admin_permissions`), not in versioned schema files. The **Editor** role is
synced automatically on server start via [`src/index.ts`](index.ts)
(`bootstrapUnlockedEditorRole`). This document is the source of truth for the
target state.

> Super Admin is still required for plugins, users, roles, and Content-Type
> Builder. Legal Reviewer can be configured manually if needed.

## Roles

### 1. Admin (Super Admin)
- **Read / write:** everything, including plugins, users, roles, schema.
- Built-in `Super Admin` role — leave untouched.

### 2. Editor (full content access)

Anyone with an admin login assigned the **Editor** role can edit all website
content in Content Manager — no field-level locks.

**Writable:** all collection and single types (Pages, banner, news, FAQ, team,
board, portfolio, fund documents, forms, legal pages, disclaimers, etc.)

**Media Library:** upload/read enabled.

**Content guide:** sidebar link and homepage widget for shortcuts.

**Preview:** use the preview button on supported entries to open the live site.

### 3. Legal Reviewer (optional)
- Configure manually if you want a narrower legal-only role.
- Not bootstrapped by default.

## Production mode

The live CMS on Render runs in **production mode**. Content-Type Builder is
disabled — this is intentional. See [`CMS-OPERATIONS.md`](../CMS-OPERATIONS.md).

## Manual steps after deploy

1. **Settings → Administration Panel → Users** — assign editors the **Editor** role.
2. Confirm **Content guide** appears in the left sidebar.
3. Run the checklist in [`CLIENT-HANDOFF.md`](../CLIENT-HANDOFF.md).

## Public / API permissions

Bootstrapped automatically in [`src/index.ts`](index.ts) for the Next.js frontend.
