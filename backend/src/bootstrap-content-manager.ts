import type { Core } from '@strapi/strapi';

type EditMeta = { label?: string; description?: string };

type CmConfig = {
  settings?: Record<string, unknown>;
  metadatas?: Record<
    string,
    { list?: Record<string, unknown>; edit?: Record<string, unknown> }
  >;
  layouts?: { list?: string[]; edit?: unknown[] };
  uid?: string;
};

/** Preferred list columns — media fields first so thumbnails show in Content Manager. */
const LIST_LAYOUTS: Record<string, string[]> = {
  'api::news-item.news-item': ['id', 'thumbnail', 'headline', 'date', 'source', 'showOnHome'],
  'api::team-member.team-member': ['id', 'headshot', 'name', 'role'],
  'api::board-director.board-director': ['id', 'headshot', 'name', 'role'],
  'api::fund-document.fund-document': ['id', 'file', 'title', 'kind', 'effectiveDate'],
};

/**
 * Friendly edit-view labels + help text for technically-named fields.
 * Field `description` in schema.json shows the hint; these override the LABEL
 * (which otherwise defaults to the raw attribute name) so editors see plain
 * English on the edit form.
 */
const EDIT_METADATA: Record<string, Record<string, EditMeta>> = {
  'api::team-member.team-member': {
    order: { label: 'Display order', description: 'Lower numbers show first.' },
    bioFormat: { label: 'Bio format' },
    bioProse: { label: 'Bio (paragraphs)' },
    bioBullets: { label: 'Bio (bullet points)' },
  },
  'api::board-director.board-director': {
    order: { label: 'Display order', description: 'Lower numbers show first.' },
    independent: { label: 'Independent director' },
    alsoOnTeam: { label: 'Also on Leadership Team' },
  },
  'api::fund-document.fund-document': {
    order: { label: 'Display order', description: 'Lower numbers show first.' },
    kind: { label: 'Document type' },
    effectiveDate: { label: 'Effective date' },
  },
  'api::portfolio-snapshot.portfolio-snapshot': {
    asOfDate: { label: 'As of date', description: 'The date these holdings are accurate as of.' },
  },
  'api::page.page': {
    slug: { label: 'Web address (slug)', description: "The URL path. 'home' is the front page." },
    seo: { label: 'Search & social (SEO)' },
    sections: { label: 'Page sections' },
  },
  'api::legal-page.legal-page': {
    slug: { label: 'Web address (slug)' },
    effectiveDate: { label: 'Effective date' },
  },
  'api::disclaimers.disclaimers': {
    effectiveDate: { label: 'Effective date' },
  },
  'api::form.form': {
    identifier: { label: 'Internal code (do not change)' },
    portalId: { label: 'HubSpot Portal ID' },
    formId: { label: 'HubSpot Form ID' },
  },
  'api::news-item.news-item': {
    showOnHome: { label: 'Show on home page' },
    showOnInvestorRelations: { label: 'Show on Investor Relations' },
  },
  'api::global-settings.global-settings': {
    topBanner: { label: 'Banner message' },
    topBannerLink: { label: 'Banner link' },
    topBannerEnabled: { label: 'Show banner' },
    footerLinks: { label: 'Footer links' },
    socialLinks: { label: 'Social links' },
  },
};

function mergeListLayout(existing: string[] | undefined, preferred: string[]): string[] {
  const base = existing ?? [];
  const extras = base.filter((col) => !preferred.includes(col));
  return [...preferred, ...extras];
}

/** Ensure list views + edit-view labels are set in Content Manager on every environment. */
export async function bootstrapContentManagerListViews(strapi: Core.Strapi) {
  const store = strapi.store({
    type: 'plugin',
    name: 'content_manager_configuration_content_types',
  });

  let updated = 0;

  const uids = new Set([
    ...Object.keys(LIST_LAYOUTS),
    ...Object.keys(EDIT_METADATA),
  ]);

  for (const uid of uids) {
    const config = (await store.get({ key: uid })) as CmConfig | null;
    if (!config) {
      strapi.log.warn(`CM config missing for ${uid} — skip bootstrap`);
      continue;
    }

    const before = JSON.stringify(config);

    // List columns (media first).
    const preferredList = LIST_LAYOUTS[uid];
    if (preferredList && config.layouts) {
      config.layouts.list = mergeListLayout(config.layouts.list ?? [], preferredList);
    }

    // Edit-view labels + descriptions.
    const editMeta = EDIT_METADATA[uid];
    if (editMeta) {
      config.metadatas = config.metadatas ?? {};
      for (const [field, meta] of Object.entries(editMeta)) {
        const entry = config.metadatas[field] ?? {};
        entry.edit = { ...(entry.edit ?? {}), ...meta };
        config.metadatas[field] = entry;
      }
    }

    if (JSON.stringify(config) === before) continue;
    await store.set({ key: uid, value: config });
    updated++;
  }

  if (updated > 0) {
    strapi.log.info(`Content Manager config updated (${updated} types).`);
  }
}
