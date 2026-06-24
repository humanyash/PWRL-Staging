import type { Metadata } from "next";
import { PageView } from "@/components/PageView";
import { getPage, getAllPageSlugs } from "@/lib/strapi";

export const revalidate = 60;

/**
 * The 5 non-home marketing pages: /vision, /fund, /trade,
 * /investor-relations, /contact. Home (`/`) is served by app/page.tsx.
 * Pages are statically generated from Strapi slugs (fixture fallback).
 */
export async function generateStaticParams() {
  const slugs = await getAllPageSlugs();
  return slugs
    .filter((s) => s !== "/" && s !== "")
    .map((s) => ({ slug: s.replace(/^\//, "") }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const page = await getPage(`/${slug}`);
  return {
    title: page?.title ?? "PWRL",
    description: page?.metaDescription,
  };
}

export default async function DynamicPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return <PageView slug={`/${slug}`} />;
}
