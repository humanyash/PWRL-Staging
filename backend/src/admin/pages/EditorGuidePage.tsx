import { Box, Flex, Typography } from '@strapi/design-system';
import ContentGuideLink from '../components/ContentGuideLink';

type Link = { label: string; href: string; hint: string };

const CONTENT_GROUPS: { title: string; links: Link[] }[] = [
  {
    title: 'Site-wide (every page)',
    links: [
      {
        label: 'Site Banner & Footer',
        href: '/content-manager/single-types/api::global-settings.global-settings',
        hint: 'Top banner, logo, navigation menu, footer links, social links, copyright',
      },
      {
        label: 'Disclaimers',
        href: '/content-manager/single-types/api::disclaimers.disclaimers',
        hint: 'Footer legal disclaimer paragraphs (Legal Reviewer)',
      },
    ],
  },
  {
    title: 'Pages & sections',
    links: [
      {
        label: 'Pages',
        href: '/content-manager/collection-types/api::page.page',
        hint: 'Every page (Home, Vision, Fund, Trade, Investor Relations, Contact, Learn). Add/reorder sections, edit headlines, hero words, images, video, stats, tables, and copy',
      },
      {
        label: 'Legal Page',
        href: '/content-manager/collection-types/api::legal-page.legal-page',
        hint: 'Privacy Policy and Terms text (Legal Reviewer)',
      },
    ],
  },
  {
    title: 'Fund page (/fund)',
    links: [
      {
        label: 'Fund Portfolio',
        href: '/content-manager/single-types/api::portfolio-snapshot.portfolio-snapshot',
        hint: 'Monthly holdings table — update the As of date and holdings',
      },
    ],
  },
  {
    title: 'Investor Relations (/investor-relations)',
    links: [
      {
        label: 'Press & News',
        href: '/content-manager/collection-types/api::news-item.news-item',
        hint: 'News cards with photo, date, and where they appear',
      },
      {
        label: 'Board of Directors',
        href: '/content-manager/collection-types/api::board-director.board-director',
        hint: 'Board grid — headshot and bio per director',
      },
      {
        label: 'Fund Documents (PDFs)',
        href: '/content-manager/collection-types/api::fund-document.fund-document',
        hint: 'PDF list — upload the file in each entry',
      },
    ],
  },
  {
    title: 'Vision page (/vision)',
    links: [
      {
        label: 'Leadership Team',
        href: '/content-manager/collection-types/api::team-member.team-member',
        hint: 'Team grid — headshot and bio per person',
      },
      {
        label: 'FAQ',
        href: '/content-manager/single-types/api::faq.faq',
        hint: 'Questions on /vision and /fund — use the link button in answers',
      },
    ],
  },
  {
    title: 'Advanced (rarely needed)',
    links: [
      {
        label: 'HubSpot Forms',
        href: '/content-manager/collection-types/api::form.form',
        hint: 'HubSpot Portal/Form IDs for the contact and newsletter forms',
      },
    ],
  },
];

const EditorGuidePage = () => (
  <Box padding={8} background="neutral0">
    <Typography variant="alpha" as="h1">
      PWRL content guide
    </Typography>
    <Box marginTop={4} marginBottom={6}>
      <Typography variant="omega" textColor="neutral600">
        Edit at pwrl-cms-humandesign.onrender.com. Save drafts freely — only{' '}
        <strong>Publish</strong> pushes changes to the website (~60 seconds). Use
        the preview buttons to check the staging site before publishing.
      </Typography>
    </Box>

    <Typography variant="beta" as="h2">
      What can I edit?
    </Typography>
    <Box marginTop={2} marginBottom={6}>
      <Typography variant="omega" textColor="neutral600">
        Almost everything: page headlines and copy, the home hero rotating words,
        the portfolio grid, fund tables and stats, images and background video,
        the navigation menu, footer, news, team, board, FAQ, and documents. Use
        the shortcuts below.
      </Typography>
    </Box>

    <Typography variant="beta" as="h2">
      Content shortcuts
    </Typography>
    <Flex direction="column" gap={6} marginTop={3} marginBottom={8}>
      {CONTENT_GROUPS.map((group) => (
        <Box key={group.title}>
          <Box marginBottom={2}>
            <Typography variant="sigma" textColor="neutral600">
              {group.title}
            </Typography>
          </Box>
          <Flex direction="column" gap={3}>
            {group.links.map((item) => (
              <ContentGuideLink key={item.href} {...item} />
            ))}
          </Flex>
        </Box>
      ))}
    </Flex>

    <Typography variant="beta" as="h2">
      I published but don&apos;t see my change
    </Typography>
    <Flex direction="column" gap={2} marginTop={2} marginBottom={8}>
      <Typography variant="omega" textColor="neutral600">
        <strong>Did you click Publish?</strong> Saving only stores a draft. The
        blue <strong>Publish</strong> button pushes it live.
      </Typography>
      <Typography variant="omega" textColor="neutral600">
        <strong>Wait ~60 seconds</strong> and hard-refresh the page (Cmd/Ctrl +
        Shift + R). The website caches content briefly.
      </Typography>
      <Typography variant="omega" textColor="neutral600">
        <strong>Editing on a Page?</strong> Make sure you changed the right
        section — pages are built from stacked sections in order.
      </Typography>
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
