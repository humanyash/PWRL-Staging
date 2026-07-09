import { Box, Flex, Typography } from '@strapi/design-system';
import { ArrowRight } from '@strapi/icons';
import { Link as RouterLink } from 'react-router-dom';

interface ContentGuideLinkProps {
  href: string;
  label: string;
  hint?: string;
}

/** Router-aware link — design-system Link `to` does not navigate in plugin pages. */
const ContentGuideLink = ({ href, label, hint }: ContentGuideLinkProps) => (
  <RouterLink to={href} style={{ textDecoration: 'none', color: 'inherit' }}>
    <Box padding={4} background="neutral100" hasRadius>
      <Flex alignItems="center" gap={2}>
        <Typography variant="delta" textColor="primary600">
          {label}
        </Typography>
        <ArrowRight />
      </Flex>
      {hint ? (
        <Box marginTop={1}>
          <Typography variant="pi" textColor="neutral600">
            {hint}
          </Typography>
        </Box>
      ) : null}
    </Box>
  </RouterLink>
);

export default ContentGuideLink;
