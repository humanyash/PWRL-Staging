import Link from "next/link";
import { Section } from "@/components/ui/Section";
import { EducationCard } from "@/components/blocks/EducationCard";
import { getEducationArticles } from "@/lib/strapi";
import type { EducationListBlock } from "@/types/blocks";

/**
 * EducationList — IR page education band (Figma 06.24.26):
 * heading + VIEW ALL, three article cards linking to /learn/[slug].
 * Articles come from the CMS (Learn Articles) with fixture fallback.
 */
export async function EducationList({ block }: { block: EducationListBlock }) {
  const articles = await getEducationArticles();
  const picked =
    block.items && block.items.length > 0
      ? block.items
          .map((item) => articles.find((a) => a.slug === item.slug))
          .filter((a): a is (typeof articles)[number] => Boolean(a))
      : articles.slice(0, block.limit ?? 3);
  const cards = picked;

  return (
    <Section tone="light" id="learn" className="!pt-[54px] !pb-[100px]">
      <div className="flex items-end justify-between">
        <h2
          className="font-display text-[32px] font-normal leading-[1.1] text-black md:text-[48px]"
          data-mo=""
        >
          {block.heading}
        </h2>
        {block.viewAllHref ? (
          <Link
            href={block.viewAllHref}
            className="mb-1 h-[19px] font-[family-name:var(--font-franklin)] text-[18px] font-semibold uppercase tracking-[1px] text-[#0023EC] underline"
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
