import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageShell } from "@/components/layout/PageShell";
import { EducationArticleView } from "@/components/education/EducationArticleView";
import { EDUCATION_ARTICLES } from "@/lib/education";
import { getEducationArticles, getEducationArticleCms, getGlobalSettings } from "@/lib/content";

export const revalidate = 60;

export async function generateStaticParams() {
  const articles = await getEducationArticles();
  const slugs = new Set([
    ...EDUCATION_ARTICLES.map((a) => a.slug),
    ...articles.map((a) => a.slug),
  ]);
  return Array.from(slugs).map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = await getEducationArticleCms(slug);
  return {
    title: article ? `${article.title} — PWRL Learn` : "PWRL Learn",
    description: article?.title,
  };
}

export default async function LearnArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = await getEducationArticleCms(slug);
  if (!article) notFound();

  const settings = await getGlobalSettings();

  return (
    <PageShell settings={settings}>
      <EducationArticleView article={article} />
    </PageShell>
  );
}
