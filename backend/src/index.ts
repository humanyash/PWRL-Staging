import type { Core } from '@strapi/strapi';

/** Content types the Next.js frontend reads without an API token. */
const PUBLIC_READ_ACTIONS = [
  'api::page.page.find',
  'api::page.page.findOne',
  'api::team-member.team-member.find',
  'api::team-member.team-member.findOne',
  'api::board-director.board-director.find',
  'api::board-director.board-director.findOne',
  'api::news-item.news-item.find',
  'api::news-item.news-item.findOne',
  'api::fund-document.fund-document.find',
  'api::fund-document.fund-document.findOne',
  'api::form.form.find',
  'api::form.form.findOne',
  'api::legal-page.legal-page.find',
  'api::legal-page.legal-page.findOne',
  'api::faq.faq.find',
  'api::disclaimers.disclaimers.find',
  'api::global-settings.global-settings.find',
  'api::portfolio-snapshot.portfolio-snapshot.find',
  'api::sec-filing.sec-filing.find',
  'api::sec-filing.sec-filing.findOne',
] as const;

async function enablePublicReadPermissions(strapi: Core.Strapi) {
  const store = strapi.store({ type: 'plugin', name: 'users-permissions' });
  const flag = (await store.get({ key: 'pwrl-public-read' })) as { enabled?: boolean } | null;
  if (flag?.enabled) return;

  const publicRole = await strapi.db.query('plugin::users-permissions.role').findOne({
    where: { type: 'public' },
  });
  if (!publicRole) {
    strapi.log.warn('Public role missing — skip public read bootstrap');
    return;
  }

  const permissionQuery = strapi.db.query('plugin::users-permissions.permission');
  let updated = 0;

  for (const action of PUBLIC_READ_ACTIONS) {
    const existing = await permissionQuery.findOne({
      where: { action, role: publicRole.id },
    });
    if (existing) {
      if (!existing.enabled) {
        await permissionQuery.update({ where: { id: existing.id }, data: { enabled: true } });
        updated++;
      }
    } else {
      await permissionQuery.create({
        data: { action, role: publicRole.id, enabled: true },
      });
      updated++;
    }
  }

  await store.set({ key: 'pwrl-public-read', value: { enabled: true } });
  strapi.log.info(`Public read permissions ready (${updated} updated/created).`);
}

export default {
  register(/* { strapi }: { strapi: Core.Strapi } */) {},

  async bootstrap({ strapi }: { strapi: Core.Strapi }) {
    try {
      await enablePublicReadPermissions(strapi);
    } catch (err) {
      strapi.log.error('Failed to bootstrap public read permissions', err);
    }
  },
};
