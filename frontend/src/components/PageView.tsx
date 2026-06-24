import { notFound } from "next/navigation";
import { BlockRenderer } from "@/components/BlockRenderer";
import { PageShell } from "@/components/layout/PageShell";
import { getPage, getGlobalSettings } from "@/lib/strapi";

/**
 * Resolves a page by slug (Strapi-first, fixture fallback), then renders it
 * inside the global Header/Footer via BlockRenderer. Shared by the `/` route
 * and the `/[slug]` dynamic route.
 */
export async function PageView({ slug }: { slug: string }) {
  const [page, settings] = await Promise.all([
    getPage(slug),
    getGlobalSettings(),
  ]);

  if (!page) notFound();

  return (
    <PageShell settings={settings}>
      <BlockRenderer sections={page.sections} />
    </PageShell>
  );
}

export default PageView;
