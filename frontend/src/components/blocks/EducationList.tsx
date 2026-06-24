import Link from "next/link";
import { Section } from "@/components/ui/Section";
import { EducationCard } from "@/components/blocks/EducationCard";
import { EDUCATION_ARTICLES } from "@/lib/education";
import type { EducationListBlock } from "@/types/blocks";

/**
 * EducationList — IR page education band (Figma 06.24.26):
 * heading + VIEW ALL, three article cards linking to /education/[slug].
 */
export function EducationList({ block }: { block: EducationListBlock }) {
  const slugs =
    block.items.length > 0
      ? block.items.map((item) => item.slug)
      : EDUCATION_ARTICLES.map((a) => a.slug);

  const cards = slugs
    .map((slug) => EDUCATION_ARTICLES.find((a) => a.slug === slug))
    .filter((a): a is (typeof EDUCATION_ARTICLES)[number] => Boolean(a));

  return (
    <Section tone="light" id="education" className="!py-[100px]">
      <div className="flex items-end justify-between">
        <h2
          className="font-display text-[32px] font-light leading-[1.1] text-black md:text-[48px]"
          data-mo=""
        >
          {block.heading}
        </h2>
        {block.viewAllHref ? (
          <Link
            href={block.viewAllHref}
            className="mb-1 font-[family-name:var(--font-franklin)] text-xs font-semibold uppercase tracking-[0.2em] text-[#0023EC] no-underline hover:underline"
            data-mo=""
            style={{ "--mo-i": 1 } as React.CSSProperties}
          >
            View All
          </Link>
        ) : null}
      </div>

      <div
        className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-3"
        data-mo-stagger=""
      >
        {cards.slice(0, 3).map((article) => (
          <div key={article.slug} data-mo="">
            <EducationCard article={article} variant="compact" />
          </div>
        ))}
      </div>
    </Section>
  );
}

export default EducationList;
