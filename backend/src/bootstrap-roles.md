# Admin Role / Permission Bootstrap

Strapi admin-panel roles live in the database (`admin_roles` /
`admin_permissions`), not in versioned schema files. The **Editor** role is
synced automatically on server start via [`src/index.ts`](index.ts)
(`bootstrapEditorRole`). This document is the source of truth for the target
state.

> Super Admin and Legal Reviewer are still configured manually in
> **Settings → Administration Panel → Roles** unless extended in bootstrap.

## Roles

### 1. Admin (Super Admin)
- **Read / write:** everything, including Page layout, plugins, users, roles.
- Built-in `Super Admin` role — leave untouched.

### 2. Editor (daily content only)

Elle and other editors use this role. They **never** edit Pages or layout.

**Writable (create / update / publish / delete):**

| Menu label | Content type | Notes |
|---|---|---|
| Site Banner & Footer | GlobalSettings | Field-level: `topBanner`, `topBannerLink`, `topBannerEnabled` only |
| FAQ | FAQ | Use link button in answer editor |
| Press & News | NewsItem | Upload thumbnail; check Home / IR placement |
| Leadership Team | TeamMember | |
| Board of Directors | BoardDirector | |
| Fund Portfolio | PortfolioSnapshot | |
| Fund Documents (PDFs) | FundDocument | Upload PDF in File field |

**Hidden (no access):**

| Content type | Reason |
|---|---|
| Page | Layout — HumanDesign / ingest only |
| Form | HubSpot IDs — admin only |
| SECFiling | EDGAR sync — read-only for all humans |
| LegalPage | Legal Reviewer role |
| Disclaimers | Legal Reviewer role |

**Media Library:** upload/read enabled (news photos, fund PDFs).

### 3. Legal Reviewer
- **Write:** `Disclaimers`, `LegalPage`, and `FundDocument.effectiveDate` only.
- **Read:** all other content types.
- Configure manually in the admin panel (field-level on FundDocument).

## Permission matrix (summary)

| Content type        | Admin | Editor            | Legal Reviewer            |
|---------------------|-------|-------------------|---------------------------|
| GlobalSettings      | RW    | RW (banner fields)| R                         |
| Disclaimers         | RW    | — (hidden)        | RW                        |
| FAQ                 | RW    | RW                | R                         |
| PortfolioSnapshot   | RW    | RW                | R                         |
| Page                | RW    | — (hidden)        | R                         |
| LegalPage           | RW    | — (hidden)        | RW                        |
| TeamMember          | RW    | RW                | R                         |
| BoardDirector       | RW    | RW                | R                         |
| NewsItem            | RW    | RW                | R                         |
| SECFiling           | RW*   | — (hidden)        | R                         |
| FundDocument        | RW    | RW                | R + write `effectiveDate` |
| Form                | RW    | — (hidden)        | R                         |

`*` SECFiling is mutated only by the scheduled EDGAR sync.

## Public / API permissions

The Users & Permissions plugin **Public** role is bootstrapped automatically in
[`src/index.ts`](index.ts) so the Next.js frontend can read published content
without an API token.

## Manual steps after deploy

1. **Settings → Administration Panel → Users** — assign Elle the **Editor** role.
2. Confirm she does **not** see **Page** or **HubSpot Forms** in Content Manager.
3. Have Elle run the 5-minute UAT checklist in [`CLIENT-HANDOFF.md`](../CLIENT-HANDOFF.md).
