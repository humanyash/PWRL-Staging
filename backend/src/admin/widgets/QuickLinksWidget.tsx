import { Box, Flex, Typography } from '@strapi/design-system';
import { Link as RouterLink } from 'react-router-dom';
import { ArrowRight } from '@strapi/icons';

const LINKS = [
  {
    label: 'Site Banner & Footer',
    href: '/content-manager/single-types/api::global-settings.global-settings',
  },
  {
    label: 'Press & News',
    href: '/content-manager/collection-types/api::news-item.news-item',
  },
  {
    label: 'FAQ',
    href: '/content-manager/single-types/api::faq.faq',
  },
  {
    label: 'Leadership Team',
    href: '/content-manager/collection-types/api::team-member.team-member',
  },
  {
    label: 'Board of Directors',
    href: '/content-manager/collection-types/api::board-director.board-director',
  },
  {
    label: 'Fund Portfolio',
    href: '/content-manager/single-types/api::portfolio-snapshot.portfolio-snapshot',
  },
  {
    label: 'Fund Documents (PDFs)',
    href: '/content-manager/collection-types/api::fund-document.fund-document',
  },
  {
    label: 'Pages',
    href: '/content-manager/collection-types/api::page.page',
  },
  {
    label: 'Legal Page',
    href: '/content-manager/collection-types/api::legal-page.legal-page',
  },
  {
    label: 'Disclaimers',
    href: '/content-manager/single-types/api::disclaimers.disclaimers',
  },
  {
    label: 'Full content guide',
    href: '/plugins/pwrl-editor-guide',
  },
] as const;

const QuickLinksWidget = () => (
  <Box padding={2}>
    <Typography variant="omega" textColor="neutral600">
      If other homepage widgets say &quot;Loading widget content&quot;, Render is
      still waking up (up to ~60s on the free tier). Use the links below — they
      work immediately.
    </Typography>
    <Typography variant="omega" textColor="neutral600">
      Save drafts freely — only Publish goes live (~60s). Unpublish or History to
      roll back. Don&apos;t see your change? Confirm you clicked Publish, then
      hard-refresh the page.
    </Typography>
    <Flex direction="column" gap={2} marginTop={3}>
      {LINKS.map((item) => (
        <RouterLink
          key={item.href}
          to={item.href}
          style={{ textDecoration: 'none', color: 'inherit' }}
        >
          <Flex alignItems="center" gap={1}>
            <Typography variant="omega" textColor="primary600">
              {item.label}
            </Typography>
            <ArrowRight />
          </Flex>
        </RouterLink>
      ))}
    </Flex>
  </Box>
);

export default QuickLinksWidget;
