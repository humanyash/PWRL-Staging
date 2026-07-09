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
  {
    label: 'Pages',
    href: '/content-manager/collection-types/api::page.page',
    hint: 'Full page layout and section content',
  },
  {
    label: 'HubSpot Forms',
    href: '/content-manager/collection-types/api::form.form',
    hint: 'Contact and newsletter form IDs (nav-signup, contact)',
  },
  {
    label: 'Legal Page',
    href: '/content-manager/collection-types/api::legal-page.legal-page',
    hint: 'Privacy policy and terms of use',
  },
  {
    label: 'Disclaimers',
    href: '/content-manager/single-types/api::disclaimers.disclaimers',
    hint: 'Footer disclaimer paragraphs',
  },
] as const;

const EditorGuidePage = () => (
  <Box padding={8} background="neutral0">
    <Typography variant="alpha" as="h1">
      PWRL content guide
    </Typography>
    <Box marginTop={4} marginBottom={6}>
      <Typography variant="omega" textColor="neutral600">
        Edit at{' '}
        <Link href="https://pwrl-cms-humandesign.onrender.com/admin" isExternal>
          pwrl-cms-humandesign.onrender.com
        </Link>
        . Save drafts freely — only <strong>Publish</strong> pushes changes to
        the website (~60 seconds). Use preview buttons to check the staging site
        before publishing.
      </Typography>
    </Box>

    <Typography variant="beta" as="h2">
      Content shortcuts
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
      Content looks locked?
    </Typography>
    <Flex direction="column" gap={2} marginTop={2} marginBottom={8}>
      <Typography variant="omega" textColor="neutral600">
        <strong>“Production mode… content types disabled”</strong> — only applies to
        Content-Type Builder (schema). Use <strong>Content Manager</strong> instead.
      </Typography>
      <Typography variant="omega" textColor="neutral600">
        <strong>Greyed-out fields</strong> — click <strong>Edit</strong> (top right),
        then Save (draft) or Publish (live).
      </Typography>
      <Typography variant="omega" textColor="neutral600">
        <strong>Preview drafts</strong> — Save without Publish, then click{' '}
        <strong>Open preview</strong> in the sidebar (yellow banner on staging site).
      </Typography>
    </Flex>

    <Typography variant="beta" as="h2">
      Roll back a mistake
    </Typography>
    <Flex direction="column" gap={2} marginTop={2} marginBottom={8}>
      <Typography variant="omega" textColor="neutral600">
        <strong>Still a draft?</strong> Don&apos;t click Publish — the live site
        stays unchanged.
      </Typography>
      <Typography variant="omega" textColor="neutral600">
        <strong>Already published?</strong> Open the entry → Unpublish to remove
        it from the site, or use ⋯ → History to restore a previous version.
      </Typography>
      <Typography variant="omega" textColor="neutral600">
        <strong>Full backup?</strong> Settings → Import Export → export before
        big edits, import to restore.
      </Typography>
    </Flex>

    <Typography variant="beta" as="h2">
      Production mode (this is normal)
    </Typography>
    <Box marginTop={2}>
      <Typography variant="omega" textColor="neutral600">
        The live CMS runs in production mode. Content-Type Builder is disabled
        on purpose — that keeps the site stable. To add new fields or section
        types, HumanDesign updates schema files in the codebase and redeploys.
      </Typography>
    </Box>
  </Box>
);

export default EditorGuidePage;
