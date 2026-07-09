import type { Core } from '@strapi/strapi';

const STAGING_SITE =
  process.env.STRAPI_PREVIEW_SITE_URL ??
  process.env.FRONTEND_URL ??
  'https://pwrl-staging-website-y.vercel.app';

const previewOpen = { openTarget: '_blank' as const, copy: true };

/** Draft preview opens staging /api/preview (Next.js draft mode + unpublished CMS data). */
const draftPreview = (env: Core.Config.Shared.ConfigParams['env'], type: string, extra: Record<string, string> = {}) => ({
  url: `${STAGING_SITE}/api/preview`,
  query: {
    type,
    secret: env('STRAPI_PREVIEW_SECRET'),
    ...extra,
  },
  ...previewOpen,
  alwaysVisible: true,
});

// Use Cloudinary in production (when credentials are present) and the
// default local-disk provider for local dev.
const config = ({ env }: Core.Config.Shared.ConfigParams): Core.Config.Plugin => {
  const cloudName = env('CLOUDINARY_NAME');
  const apiKey = env('CLOUDINARY_KEY');
  const apiSecret = env('CLOUDINARY_SECRET');

  const upload =
    cloudName && apiKey && apiSecret
      ? {
          upload: {
            config: {
              provider: 'cloudinary',
              providerOptions: {
                cloud_name: cloudName,
                api_key: apiKey,
                api_secret: apiSecret,
              },
              actionOptions: {
                upload: {},
                uploadStream: {},
                delete: {},
              },
            },
          },
        }
      : {};

  return {
    ...upload,
    ckeditor: {
      enabled: true,
    },
    'preview-button': {
      enabled: true,
      config: {
        contentTypes: [
          {
            uid: 'api::global-settings.global-settings',
            published: { url: STAGING_SITE, ...previewOpen },
            draft: draftPreview(env, 'global-settings'),
          },
          {
            uid: 'api::news-item.news-item',
            published: {
              url: `${STAGING_SITE}/investor-relations`,
              ...previewOpen,
            },
            draft: draftPreview(env, 'news'),
          },
          {
            uid: 'api::faq.faq',
            published: {
              url: `${STAGING_SITE}/vision#faq`,
              ...previewOpen,
            },
            draft: draftPreview(env, 'faq'),
          },
          {
            uid: 'api::team-member.team-member',
            published: {
              url: `${STAGING_SITE}/vision`,
              ...previewOpen,
            },
            draft: draftPreview(env, 'team'),
          },
          {
            uid: 'api::board-director.board-director',
            published: {
              url: `${STAGING_SITE}/investor-relations`,
              ...previewOpen,
            },
            draft: draftPreview(env, 'directors'),
          },
          {
            uid: 'api::portfolio-snapshot.portfolio-snapshot',
            published: {
              url: `${STAGING_SITE}/fund`,
              ...previewOpen,
            },
            draft: draftPreview(env, 'portfolio'),
          },
          {
            uid: 'api::fund-document.fund-document',
            published: {
              url: `${STAGING_SITE}/investor-relations`,
              ...previewOpen,
            },
            draft: draftPreview(env, 'fund-documents'),
          },
          {
            uid: 'api::page.page',
            published: {
              url: `${STAGING_SITE}/{slug}`,
              ...previewOpen,
            },
            draft: draftPreview(env, 'page', { slug: '{slug}' }),
          },
          {
            uid: 'api::disclaimers.disclaimers',
            published: { url: STAGING_SITE, ...previewOpen },
            draft: draftPreview(env, 'disclaimers'),
          },
          {
            uid: 'api::legal-page.legal-page',
            published: {
              url: `${STAGING_SITE}/{slug}`,
              ...previewOpen,
            },
            draft: draftPreview(env, 'legal', { slug: '{slug}' }),
          },
        ],
      },
    },
    'config-sync': {
      enabled: true,
      config: {
        syncDir: 'config/sync/',
        // Off by default — auto-import crashed Render when stale sync JSON on disk
        // referenced admin actions removed in Strapi 5.47 (admin::admin-tokens.read).
        // Permissions are bootstrapped in src/index.ts instead. To import manually:
        // Settings → Config Sync, or set CONFIG_SYNC_IMPORT_ON_BOOTSTRAP=true on deploy.
        importOnBootstrap: env.bool('CONFIG_SYNC_IMPORT_ON_BOOTSTRAP', false),
        minify: true,
        excludedConfig: ['admin-role', 'user-role', 'core-store'],
      },
    },
    publisher: {
      enabled: true,
      config: {
        contentTypes: [
          'api::news-item.news-item',
          'api::global-settings.global-settings',
        ],
        actions: {
          syncFrequency: '*/1 * * * *',
        },
      },
    },
    'strapi-import-export': {
      enabled: true,
      config: {
        /** Backup/restore for editorial content (Settings → Import Export). */
        contentTypes: [
          'api::global-settings.global-settings',
          'api::news-item.news-item',
          'api::faq.faq',
          'api::team-member.team-member',
          'api::board-director.board-director',
          'api::portfolio-snapshot.portfolio-snapshot',
          'api::fund-document.fund-document',
          'api::page.page',
          'api::legal-page.legal-page',
          'api::disclaimers.disclaimers',
        ],
      },
    },
  };
};

export default config;
