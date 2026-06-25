import { getFixtureLegalPage } from "@/lib/legal-fixtures";
import { strapiFetch } from "@/lib/strapi";
import type { LegalPageData } from "@/types/legal";

interface CmsLegalPage {
  slug: string;
  title: string;
  body: string;
  effectiveDate?: string | null;
  seo?: { title?: string; description?: string | null } | null;
}

/** Fetch a legal page by slug (`legal` | `terms`), CMS-first with fixture fallback. */
export async function getLegalPage(slug: string): Promise<LegalPageData | null> {
  const key = slug.replace(/^\//, "");
  const fixture = getFixtureLegalPage(key);

  const data = await strapiFetch<CmsLegalPage[]>("/api/legal-pages", {
    "filters[slug][$eq]": key,
    "populate[seo]": "true",
  });
  const cms = data?.[0];
  if (!cms?.body) return fixture;

  return {
    slug: `/${key}`,
    title: cms.title ?? fixture?.title ?? "PWRL",
    metaDescription:
      cms.seo?.description ?? fixture?.metaDescription ?? undefined,
    body: cms.body,
    effectiveDate: cms.effectiveDate ?? fixture?.effectiveDate,
  };
}
