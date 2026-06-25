import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageShell } from "@/components/layout/PageShell";
import { EducationArticleView } from "@/components/education/EducationArticleView";
import {
  EDUCATION_ARTICLES,
  getEducationArticle,
} from "@/lib/education";
import { getGlobalSettings } from "@/lib/strapi";

export const revalidate = 60;

export function generateStaticParams() {
  return EDUCATION_ARTICLES.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = getEducationArticle(slug);
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
  const article = getEducationArticle(slug);
  if (!article) notFound();

  const settings = await getGlobalSettings();

  return (
    <PageShell settings={settings}>
      <EducationArticleView article={article} />
    </PageShell>
  );
}
