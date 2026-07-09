import { Box, Flex, Link, Typography } from '@strapi/design-system';
import { ArrowRight } from '@strapi/icons';

const CONTENT_LINKS = [
  {
    label: 'Site Banner & Footer',
    href: '/content-manager/single-types/api::global-settings.global-settings',
    hint: 'Home-page banner text, link, and on/off toggle',
  },
  {
    label: 'Press & News',
    href: '/content-manager/collection-types/api::news-item.news-item',
    hint: 'News cards with photo, date, and placement flags',
  },
  {
    label: 'FAQ',
    href: '/content-manager/single-types/api::faq.faq',
    hint: 'Accordion on /vision and /fund — use the link button in answers',
  },
  {
    label: 'Leadership Team',
    href: '/content-manager/collection-types/api::team-member.team-member',
    hint: 'Team grid on /vision',
  },
  {
    label: 'Board of Directors',
    href: '/content-manager/collection-types/api::board-director.board-director',
    hint: 'Board grid on /investor-relations',
  },
  {
    label: 'Fund Portfolio',
    href: '/content-manager/single-types/api::portfolio-snapshot.portfolio-snapshot',
    hint: 'Holdings table on /fund',
  },
  {
    label: 'Fund Documents (PDFs)',
    href: '/content-manager/collection-types/api::fund-document.fund-document',
    hint: 'PDF list on /investor-relations',
  },
] as const;

const EditorGuidePage = () => (
  <Box padding={8} background="neutral0">
    <Typography variant="alpha" as="h1">
      PWRL content guide
    </Typography>
    <Box marginTop={4} marginBottom={6}>
      <Typography variant="omega" textColor="neutral600">
        Use Content Manager to update the site. Save, then Publish. Changes appear
        on the staging site within about one minute. Use the preview buttons on
        each entry to open the live site.
      </Typography>
    </Box>

    <Typography variant="beta" as="h2">
      What you can edit
    </Typography>
    <Flex direction="column" gap={4} marginTop={3} marginBottom={8}>
      {CONTENT_LINKS.map((item) => (
        <Box key={item.href} padding={4} background="neutral100" hasRadius>
          <Link to={item.href} endIcon={<ArrowRight />}>
            <Typography variant="delta">{item.label}</Typography>
          </Link>
          <Box marginTop={1}>
            <Typography variant="pi" textColor="neutral600">
              {item.hint}
            </Typography>
          </Box>
        </Box>
      ))}
    </Flex>

    <Typography variant="beta" as="h2">
      Production mode (this is normal)
    </Typography>
    <Box marginTop={2}>
      <Typography variant="omega" textColor="neutral600">
        The live CMS runs in production mode. Content-Type Builder and schema
        editing are disabled on purpose — that keeps the site stable. Editors
        never need Content-Type Builder. To change page layout or add fields,
        HumanDesign updates schema files in the codebase and redeploys.
      </Typography>
    </Box>
  </Box>
);

export default EditorGuidePage;
