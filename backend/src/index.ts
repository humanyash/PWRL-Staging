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

/**
 * Editors with admin login can change all site content (no field-level locks).
 * Super Admin still required for plugins, users, and Content-Type Builder.
 */
async function bootstrapUnlockedEditorRole(strapi: Core.Strapi) {
  const editorRole = await strapi.db.query('admin::role').findOne({
    where: { code: 'strapi-editor' },
  });
  if (!editorRole) {
    strapi.log.warn('Editor role missing — skip editor role bootstrap');
    return;
  }

  const permQuery = strapi.db.query('admin::permission');
  let cleared = 0;
  let added = 0;

  // Drop legacy field-scoped permissions from the daily-content-only setup.
  const existing = await permQuery.findMany({ where: { role: editorRole.id } });
  for (const p of existing) {
    const props = p.properties as Record<string, unknown> | null;
    if (props && Array.isArray(props.fields) && props.fields.length > 0) {
      await permQuery.update({
        where: { id: p.id },
        data: { properties: {} },
      });
      cleared++;
    }
  }

  const contentTypeUids = Object.keys(strapi.contentTypes).filter((uid) =>
    uid.startsWith('api::'),
  );

  for (const uid of contentTypeUids) {
    for (const action of CM_EXPLORER_ACTIONS) {
      await upsertAdminPermission(strapi, editorRole.id, action, uid, {});
      added++;
    }
  }

  for (const action of UPLOAD_ACTIONS) {
    await upsertAdminPermission(strapi, editorRole.id, action, null);
    added++;
  }

  strapi.log.info(
    `Editor role unlocked for all content (${cleared} field locks cleared, ${added} permissions upserted).`,
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
      await bootstrapUnlockedEditorRole(strapi);
    } catch (err) {
      strapi.log.error('Failed to bootstrap editor role permissions', err);
    }
  },
};
