import Link from "next/link";
import { Container } from "@/components/ui/Container";
import {
  getAdjacentArticles,
  type EducationArticle,
} from "@/lib/education";

function ArticleNavChevron({ direction }: { direction: "left" | "right" }) {
  return (
    <svg
      width="11"
      height="20"
      viewBox="0 0 11 20"
      fill="none"
      aria-hidden
      className="inline-block shrink-0"
    >
      <path
        d={direction === "left" ? "M9 2L2 10l7 8" : "M2 2l7 8-7 8"}
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/**
 * EducationArticleView — article detail (Figma Education Article NEW).
 */
export function EducationArticleView({ article }: { article: EducationArticle }) {
  const { prev, next } = getAdjacentArticles(article.slug);
  const hero = article.heroImage ?? article.image;

  return (
    <>
      <section className="relative overflow-hidden bg-navy text-white">
        <div className="absolute inset-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={hero.src}
            alt=""
            aria-hidden
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-navy/70" aria-hidden />
        </div>

        <Container className="relative min-h-[300px] pb-[108px] pt-[166.5px] md:min-h-[415px] lg:pb-[83px] lg:pt-[225px]">
          <Link
            href="/education"
            className="inline-flex items-center gap-2 font-[family-name:var(--font-franklin)] text-lg font-light uppercase tracking-wide text-white no-underline hover:underline"
          >
            <ArticleNavChevron direction="left" />
            All Articles
          </Link>

          <h1 className="mt-8 max-w-5xl font-display text-[40px] font-light leading-[1.1] md:text-[64px]">
            {article.title}
          </h1>

          <p className="mt-6 font-[family-name:var(--font-franklin)] text-lg font-light text-white/90">
            {article.publishedLabel}
          </p>
        </Container>
      </section>

      <section className="bg-white py-16 md:py-24">
        <Container>
          <div className="mx-auto max-w-[800px] font-[family-name:var(--font-franklin)] text-xl font-light leading-[1.4] text-charcoal">
            {article.body.map((p, i) => (
              <p key={i} className="mb-5">
                {p}
              </p>
            ))}

            {article.sections?.map((section, sectionIndex) => (
              <div key={`${section.heading}-${sectionIndex}`} className="mt-8">
                <h2 className="mb-5 font-display text-[32px] font-light leading-[1.1] text-charcoal md:text-[42px]">
                  {section.heading}
                </h2>
                {section.paragraphs.map((p, i) => (
                  <p key={i} className="mb-5">
                    {p}
                  </p>
                ))}
              </div>
            ))}
          </div>
        </Container>
      </section>

      {(prev || next) && (
        <nav
          aria-label="Adjacent articles"
          className="border-t border-[#B0E9FD]/40 bg-[#E4F7FD] py-8"
        >
          <Container>
            <div className="flex items-center justify-between gap-6">
              {prev ? (
                <Link
                  href={`/education/${prev.slug}`}
                  className="group flex max-w-[45%] items-center gap-3 font-[family-name:var(--font-franklin)] text-xl font-normal uppercase tracking-[0.08em] text-charcoal no-underline hover:text-[#0023EC] md:text-[26px]"
                >
                  <ArticleNavChevron direction="left" />
                  <span className="line-clamp-2 normal-case tracking-normal md:uppercase md:tracking-[0.08em]">
                    {prev.title}
                  </span>
                </Link>
              ) : (
                <span />
              )}

              {next ? (
                <Link
                  href={`/education/${next.slug}`}
                  className="group flex max-w-[45%] items-center justify-end gap-3 text-right font-[family-name:var(--font-franklin)] text-xl font-normal uppercase tracking-[0.08em] text-charcoal no-underline hover:text-[#0023EC] md:text-[26px]"
                >
                  <span className="line-clamp-2 normal-case tracking-normal md:uppercase md:tracking-[0.08em]">
                    {next.title}
                  </span>
                  <ArticleNavChevron direction="right" />
                </Link>
              ) : (
                <span />
              )}
            </div>
          </Container>
        </nav>
      )}
    </>
  );
}

export default EducationArticleView;
