import type { Core } from '@strapi/strapi';

// Use Cloudinary in production (when credentials are present) and the
// default local-disk provider for local dev. This lets contributors run
// `strapi develop` without Cloudinary creds and have uploads land in
// backend/public/uploads/.
const config = ({ env }: Core.Config.Shared.ConfigParams): Core.Config.Plugin => {
  const cloudName = env('CLOUDINARY_NAME');
  const apiKey = env('CLOUDINARY_KEY');
  const apiSecret = env('CLOUDINARY_SECRET');

  if (cloudName && apiKey && apiSecret) {
    return {
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
    };
  }

  return {};
};

export default config;
