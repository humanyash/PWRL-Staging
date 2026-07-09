import type { Core } from '@strapi/strapi';

const STAGING_SITE =
  process.env.STRAPI_PREVIEW_SITE_URL ??
  process.env.FRONTEND_URL ??
  'https://pwrl-staging-website-y.vercel.app';

const previewOpen = { openTarget: '_blank' as const, copy: true };

// Use Cloudinary in production (when credentials are present) and the
// default local-disk provider for local dev.
const config = ({ env }: Core.Config.Shared.ConfigParams): Core.Config.Plugin => {
  const cloudName = env('CLOUDINARY_NAME');
  const apiKey = env('CLOUDINARY_KEY');
  const apiSecret = env('CLOUDINARY_SECRET');
  const isProduction = env('NODE_ENV') === 'production';

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
            published: {
              url: STAGING_SITE,
              ...previewOpen,
            },
            draft: {
              url: STAGING_SITE,
              ...previewOpen,
              alwaysVisible: true,
            },
          },
          {
            uid: 'api::news-item.news-item',
            published: {
              url: `${STAGING_SITE}/investor-relations`,
              query: { preview: 'news' },
              ...previewOpen,
            },
            draft: {
              url: `${STAGING_SITE}/investor-relations`,
              query: { preview: 'news' },
              ...previewOpen,
              alwaysVisible: true,
            },
          },
          {
            uid: 'api::faq.faq',
            published: {
              url: `${STAGING_SITE}/vision`,
              query: { preview: 'faq' },
              ...previewOpen,
            },
          },
          {
            uid: 'api::team-member.team-member',
            published: {
              url: `${STAGING_SITE}/vision`,
              query: { preview: 'team' },
              ...previewOpen,
            },
          },
          {
            uid: 'api::board-director.board-director',
            published: {
              url: `${STAGING_SITE}/investor-relations`,
              query: { preview: 'directors' },
              ...previewOpen,
            },
          },
          {
            uid: 'api::portfolio-snapshot.portfolio-snapshot',
            published: {
              url: `${STAGING_SITE}/fund`,
              query: { preview: 'portfolio' },
              ...previewOpen,
            },
          },
          {
            uid: 'api::fund-document.fund-document',
            published: {
              url: `${STAGING_SITE}/investor-relations`,
              query: { preview: 'fund-documents' },
              ...previewOpen,
            },
          },
        ],
      },
    },
    'config-sync': {
      enabled: true,
      config: {
        syncDir: 'config/sync/',
        importOnBootstrap: isProduction,
        minify: true,
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
        /** Elle-friendly export/import for daily content collections. */
        contentTypes: [
          'api::news-item.news-item',
          'api::team-member.team-member',
          'api::board-director.board-director',
          'api::fund-document.fund-document',
        ],
      },
    },
  };
};

export default config;
