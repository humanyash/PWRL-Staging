import { Section } from "@/components/ui/Section";
import { EducationCard } from "@/components/blocks/EducationCard";
import { EDUCATION_ARTICLES } from "@/lib/education";
import type { EducationGridBlock } from "@/types/blocks";

/** Full Learn index — 3×3 article grid (Figma Learn Page). */
export function EducationGrid({ block }: { block: EducationGridBlock }) {
  return (
    <Section tone="light" className="!pb-[100px] !pt-[60px] md:!pt-[80px]">
      {block.heading ? (
        <h2
          className="sr-only font-display text-[32px] font-light leading-[1.1] text-black md:text-[48px]"
          data-mo=""
        >
          {block.heading}
        </h2>
      ) : null}

      <div
        className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
        data-mo-stagger=""
      >
        {EDUCATION_ARTICLES.map((article) => (
          <div key={article.slug} data-mo="">
            <EducationCard article={article} variant="featured" />
          </div>
        ))}
      </div>
    </Section>
  );
}

export default EducationGrid;
