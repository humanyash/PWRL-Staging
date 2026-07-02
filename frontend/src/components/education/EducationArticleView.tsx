import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { renderRich } from "@/lib/rich";
import {
  getAdjacentArticles,
  type EducationArticle,
} from "@/lib/education";

/**
 * Prod inlines each section's heading as a bold sentence lead-in at the start
 * of the section's first paragraph (sentence case + trailing period). Acronyms
 * like PWRL, NAV, IPO, SPVs are preserved.
 */
const KEEP_UPPER = /^(PWRL|NAV|IPO|SPV|SPVs|CEF|SEC|EDGAR|VC|LP|GP|CFO|CEO|AI|US|IRS)$/;

function sentenceLeadIn(heading: string): string {
  const trimmed = heading.trim().replace(/[.!?]+$/, "");
  const words = trimmed.split(/\s+/);
  const cased = words
    .map((word, i) => {
      if (KEEP_UPPER.test(word)) return word;
      if (i === 0) return word[0].toUpperCase() + word.slice(1).toLowerCase();
      return word.toLowerCase();
    })
    .join(" ");
  const endsWithQuestion = /\?$/.test(heading.trim());
  return cased + (endsWithQuestion ? "?" : ".");
}

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
      <section data-mo-hero="" className="relative h-[415px] min-h-[415px] max-h-[415px] overflow-hidden bg-navy text-white">
        <div className="absolute inset-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={hero.src}
            alt=""
            aria-hidden
            className="absolute inset-0 h-full w-full object-cover [object-position:center_75%]"
          />
          {/* Transparent at top so the image shows; navy at bottom where text sits */}
          <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/60 to-navy/10" aria-hidden />
        </div>

        <Container className="relative flex h-full flex-col justify-between pb-10 pt-28 md:pb-12">
          <Link
            href="/learn"
            className="mt-[25px] inline-flex items-center gap-2 font-[family-name:var(--font-franklin)] text-base font-light uppercase leading-none tracking-[1px] text-white no-underline hover:opacity-75"
          >
            <ArticleNavChevron direction="left" />
            All Articles
          </Link>

          <div>
            <h1 className="whitespace-nowrap font-display text-[40px] font-light leading-[1.1] md:text-[64px]">
              {article.title}
            </h1>
            <p className="mt-3 font-[family-name:var(--font-franklin)] text-sm font-normal text-white/70">
              {article.publishedLabel}
            </p>
          </div>
        </Container>
      </section>

      <section className="bg-white py-16 md:py-24">
        <Container>
          <div className="mx-auto max-w-[800px] font-[family-name:var(--font-franklin)] text-xl font-light leading-[1.4] text-charcoal">
            {article.body.map((p, i) => (
              <p key={i} className="mb-5">
                {renderRich(p)}
              </p>
            ))}

            {article.sections?.map((section, sectionIndex) => {
              const leadIn = sentenceLeadIn(section.heading);
              return (
                <div key={`${section.heading}-${sectionIndex}`}>
                  {section.paragraphs.map((p, i) => {
                    const text = i === 0 ? `**${leadIn}** ${p}` : p;
                    return (
                      <p key={i} className="mb-5">
                        {renderRich(text)}
                      </p>
                    );
                  })}
                </div>
              );
            })}
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
                  href={`/learn/${prev.slug}`}
                  className="group flex max-w-[45%] items-center gap-3 font-[family-name:var(--font-franklin)] text-xl font-normal uppercase leading-[30px] tracking-[1px] text-charcoal no-underline hover:text-[#0023EC] md:text-[26px]"
                >
                  <ArticleNavChevron direction="left" />
                  <span className="line-clamp-2 normal-case leading-[30px] tracking-normal px-[13px] md:uppercase md:tracking-[1px]">
                    {prev.title}
                  </span>
                </Link>
              ) : (
                <span />
              )}

              {next ? (
                <Link
                  href={`/learn/${next.slug}`}
                  className="group flex max-w-[38%] items-center justify-end gap-3 text-right font-[family-name:var(--font-franklin)] text-xl font-normal uppercase leading-[30px] tracking-[1px] text-charcoal no-underline hover:text-[#0023EC] md:text-[26px]"
                >
                  <span className="line-clamp-2 normal-case leading-[30px] tracking-normal md:uppercase md:tracking-[1px]">
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
