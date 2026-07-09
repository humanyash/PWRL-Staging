import { Box, Flex, Link, Typography } from '@strapi/design-system';
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
    label: 'Full content guide',
    href: '/plugins/pwrl-editor-guide',
  },
] as const;

const QuickLinksWidget = () => (
  <Box padding={2}>
    <Typography variant="omega" textColor="neutral600">
      Save drafts freely — only Publish goes live (~60s). Unpublish or History to
      roll back.
    </Typography>
    <Flex direction="column" gap={2} marginTop={3}>
      {LINKS.map((item) => (
        <Link key={item.href} to={item.href} endIcon={<ArrowRight />}>
          {item.label}
        </Link>
      ))}
    </Flex>
  </Box>
);

export default QuickLinksWidget;
