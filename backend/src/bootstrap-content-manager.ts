import type { Core } from '@strapi/strapi';

type CmConfig = {
  settings?: Record<string, unknown>;
  metadatas?: Record<string, { list?: Record<string, unknown>; edit?: Record<string, unknown> }>;
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

function mergeListLayout(existing: string[] | undefined, preferred: string[]): string[] {
  const base = existing ?? [];
  const extras = base.filter((col) => !preferred.includes(col));
  return [...preferred, ...extras];
}

/** Ensure list views show image/PDF columns in Content Manager on every environment. */
export async function bootstrapContentManagerListViews(strapi: Core.Strapi) {
  const store = strapi.store({
    type: 'plugin',
    name: 'content_manager_configuration_content_types',
  });

  let updated = 0;

  for (const [uid, preferredList] of Object.entries(LIST_LAYOUTS)) {
    const config = (await store.get({ key: uid })) as CmConfig | null;
    if (!config?.layouts) {
      strapi.log.warn(`CM layout missing for ${uid} — skip list view bootstrap`);
      continue;
    }

    const current = config.layouts.list ?? [];
    const next = mergeListLayout(current, preferredList);
    if (JSON.stringify(current) === JSON.stringify(next)) continue;

    config.layouts.list = next;
    await store.set({ key: uid, value: config });
    updated++;
  }

  if (updated > 0) {
    strapi.log.info(`Content Manager list views updated (${updated} types).`);
  }
}
