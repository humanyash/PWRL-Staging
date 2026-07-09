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

/** Daily-content types Elle may edit. Page layout stays admin-only. */
const EDITOR_WRITE_SUBJECTS: { subject: string; fields?: string[] }[] = [
  {
    subject: 'api::global-settings.global-settings',
    fields: ['topBanner', 'topBannerLink', 'topBannerEnabled'],
  },
  { subject: 'api::faq.faq' },
  { subject: 'api::news-item.news-item' },
  { subject: 'api::team-member.team-member' },
  { subject: 'api::board-director.board-director' },
  { subject: 'api::portfolio-snapshot.portfolio-snapshot' },
  { subject: 'api::fund-document.fund-document' },
];

const EDITOR_DENIED_SUBJECTS = [
  'api::page.page',
  'api::form.form',
  'api::sec-filing.sec-filing',
  'api::legal-page.legal-page',
  'api::disclaimers.disclaimers',
] as const;

const CM_EXPLORER_ACTIONS = [
  'plugin::content-manager.explorer.create',
  'plugin::content-manager.explorer.read',
  'plugin::content-manager.explorer.update',
  'plugin::content-manager.explorer.delete',
  'plugin::content-manager.explorer.publish',
] as const;

const UPLOAD_ACTIONS = [
  'plugin::upload.read',
  'plugin::upload.assets.create',
  'plugin::upload.assets.update',
  'plugin::upload.assets.download',
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

async function upsertAdminPermission(
  strapi: Core.Strapi,
  roleId: number,
  action: string,
  subject: string | null,
  properties: Record<string, unknown> = {},
) {
  const permQuery = strapi.db.query('admin::permission');
  const existing = await permQuery.findOne({
    where: { role: roleId, action, subject },
  });
  const data = { action, subject, role: roleId, properties, conditions: [] as string[] };
  if (existing) {
    await permQuery.update({ where: { id: existing.id }, data });
  } else {
    await permQuery.create({ data });
  }
}

/** Restrict built-in Editor role to daily content only (no Pages). */
async function bootstrapEditorRole(strapi: Core.Strapi) {
  const editorRole = await strapi.db.query('admin::role').findOne({
    where: { code: 'strapi-editor' },
  });
  if (!editorRole) {
    strapi.log.warn('Editor role missing — skip editor role bootstrap');
    return;
  }

  const permQuery = strapi.db.query('admin::permission');
  let removed = 0;
  let added = 0;

  for (const subject of EDITOR_DENIED_SUBJECTS) {
    const perms = await permQuery.findMany({
      where: { role: editorRole.id, subject },
    });
    for (const p of perms) {
      await permQuery.delete({ where: { id: p.id } });
      removed++;
    }
  }

  for (const { subject, fields } of EDITOR_WRITE_SUBJECTS) {
    const properties = fields?.length ? { fields } : {};
    for (const action of CM_EXPLORER_ACTIONS) {
      await upsertAdminPermission(strapi, editorRole.id, action, subject, properties);
      added++;
    }
  }

  for (const action of UPLOAD_ACTIONS) {
    await upsertAdminPermission(strapi, editorRole.id, action, null);
    added++;
  }

  strapi.log.info(
    `Editor role synced for daily content (${removed} denied removed, ${added} permissions upserted).`,
  );
}

export default {
  register(/* { strapi }: { strapi: Core.Strapi } */) {},

  async bootstrap({ strapi }: { strapi: Core.Strapi }) {
    try {
      await enablePublicReadPermissions(strapi);
    } catch (err) {
      strapi.log.error('Failed to bootstrap public read permissions', err);
    }
    try {
      await bootstrapEditorRole(strapi);
    } catch (err) {
      strapi.log.error('Failed to bootstrap editor role permissions', err);
    }
  },
};
