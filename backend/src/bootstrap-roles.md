# Admin Role / Permission Bootstrap

Strapi admin-panel roles live in the database (`admin_roles` /
`admin_permissions`), not in versioned schema files, so they cannot be created
by committing JSON. This document is the source of truth for the three roles the
PWRL site requires. Seed them by hand in **Settings → Administration Panel →
Roles** on a running instance, or via a one-off script using
`strapi.service('admin::role')` / `strapi.service('admin::permission')`.

> Do NOT run a DB seed as part of this schema build. This file only documents the
> target state.

## Roles

Strapi ships with `Super Admin`, `Editor`, and `Author` by default. We keep
`Super Admin` as **Admin**, repurpose/replace the built-in `Editor`, and add a
new **Legal Reviewer** role.

### 1. Admin (Super Admin)
- **Read:** all content types, all settings.
- **Write:** all content types, plugins, settings, users, roles.
- This is the built-in `Super Admin` role — leave it untouched.

### 2. Editor
- **Read:** all content types.
- **Write (create / update / publish / delete):** every content type **except**
  `Disclaimers` and `LegalPage`.
  - GlobalSettings ✅
  - FAQ ✅
  - PortfolioSnapshot ✅
  - Page ✅
  - TeamMember ✅
  - BoardDirector ✅
  - NewsItem ✅
  - FundDocument ✅ (all fields)
  - Form ✅
  - SECFiling — **read-only** (synced by the EDGAR cron job; do not grant write
    to anyone in the admin)
  - Disclaimers — ❌ no write (read-only)
  - LegalPage — ❌ no write (read-only)

### 3. Legal Reviewer
- **Read:** all content types.
- **Write (create / update / publish / delete):**
  - `Disclaimers` ✅ (full)
  - `LegalPage` ✅ (full)
  - `FundDocument` — **field-level**: write access limited to the
    `effectiveDate` field only (review/sign-off on document effective dates).
    All other FundDocument fields remain read-only for this role. Field-level
    permissions are configured per-field in the role editor's content-type
    permission tree.
- **No write** to any other content type.

## Permission matrix (summary)

| Content type        | Admin | Editor            | Legal Reviewer            |
|---------------------|-------|-------------------|---------------------------|
| GlobalSettings      | RW    | RW                | R                         |
| Disclaimers         | RW    | R (no write)      | RW                        |
| FAQ                 | RW    | RW                | R                         |
| PortfolioSnapshot   | RW    | RW                | R                         |
| Page                | RW    | RW                | R                         |
| LegalPage           | RW    | R (no write)      | RW                        |
| TeamMember          | RW    | RW                | R                         |
| BoardDirector       | RW    | RW                | R                         |
| NewsItem            | RW    | RW                | R                         |
| SECFiling           | RW*   | R                 | R                         |
| FundDocument        | RW    | RW                | R + write `effectiveDate` |
| Form                | RW    | RW                | R                         |

`*` SECFiling is mutated only by the scheduled EDGAR sync (server-side, not via
admin UI). No human role should be granted write access in the admin.

## Seeding outline (run only on a live instance)

```ts
// Example only — execute via `strapi console` or a bootstrap function,
// NOT during schema generation.
const roleService = strapi.service('admin::role');

const editor = await roleService.create({
  name: 'Editor',
  description: 'Writes all content except Disclaimers and LegalPage',
});
const legal = await roleService.create({
  name: 'Legal Reviewer',
  description: 'Owns Disclaimers, LegalPage, and FundDocument.effectiveDate',
});

// Then assign permissions per the matrix above with
// strapi.service('admin::permission').
```

## Public / API permissions
The Users & Permissions plugin "Public" role also needs `find`/`findOne`
enabled per content type for the Next.js frontend to read published content over
the REST/GraphQL API. Configure under **Settings → Users & Permissions →
Roles → Public**, or issue a read-only API token. This is also a live-instance
step.
