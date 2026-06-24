import { Section } from "@/components/ui/Section";
import { PersonCardItem } from "./PersonCardItem";
import type { BoardGridBlock } from "@/types/blocks";

/**
 * BoardGrid — live /investor-relations "Board of Directors" uses the same
 * card system as the /vision team grid (AUDIT.md R7-4): WHITE band
 * (`section-spacing my-9`), centered h4 32/48, and a
 * `repeat(auto-fit,180px)` ul of PersonCardItem.
 */
export function BoardGrid({ block }: { block: BoardGridBlock }) {
  return (
    <Section tone="light" id="directors" className="my-9 !py-[36px]">
      <div className="mx-auto text-center">
        <h2
          className="font-display text-[32px] font-light leading-[1.1] text-charcoal md:text-[48px]"
          data-mo=""
        >
          {block.heading}
        </h2>
        {block.subheading ? (
          <p className="mt-4 font-[family-name:var(--font-franklin)] text-base font-light text-charcoal/70">
            {block.subheading}
          </p>
        ) : null}
      </div>

      <ul
        className="mx-auto mt-8 grid max-w-sm grid-cols-1 gap-6 md:max-w-6xl md:grid-cols-[repeat(auto-fit,180px)] md:justify-center md:justify-items-center md:gap-[16px]"
        data-mo-stagger=""
      >
        {block.directors.map((d) => (
          <li key={d.name} className="w-full" data-mo="">
            <PersonCardItem person={d} />
          </li>
        ))}
      </ul>
    </Section>
  );
}

export default BoardGrid;
