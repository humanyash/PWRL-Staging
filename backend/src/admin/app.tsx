import type { StrapiApp } from '@strapi/strapi/admin';
import { Layout, Pencil } from '@strapi/icons';

export default {
  config: {
    locales: [],
    tutorials: false,
    notifications: { releases: false },
  },
  register(app: StrapiApp) {
    app.addMenuLink({
      to: '/plugins/pwrl-editor-guide',
      icon: Pencil,
      intlLabel: {
        id: 'pwrl.editor-guide.menu',
        defaultMessage: 'Content guide',
      },
      Component: () => import('./pages/EditorGuidePage'),
      permissions: [],
    });

    if ('widgets' in app && typeof app.widgets?.register === 'function') {
      app.widgets.register({
        id: 'pwrl-quick-links',
        icon: Layout,
        title: {
          id: 'pwrl.widget.quick-links.title',
          defaultMessage: 'Content shortcuts',
        },
        component: async () => {
          const mod = await import('./widgets/QuickLinksWidget');
          return mod.default;
        },
        link: {
          label: {
            id: 'pwrl.widget.quick-links.link',
            defaultMessage: 'Open full guide',
          },
          href: '/admin/plugins/pwrl-editor-guide',
        },
      });
    }
  },
  bootstrap(_app: StrapiApp) {},
};
