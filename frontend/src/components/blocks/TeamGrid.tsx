import { Section } from "@/components/ui/Section";
import { PersonCardItem } from "./PersonCardItem";
import type { TeamGridBlock } from "@/types/blocks";

/**
 * TeamGrid — live /vision "Decades of breaking through barriers."
 * (AUDIT.md R4-6): centered h4 (32/48), then
 * `ul mt-8 grid grid-cols-1 gap-6 max-w-sm md:max-w-6xl
 *  md:grid-cols-[repeat(auto-fit,180px)] md:gap-[16px] md:justify-center
 *  md:justify-items-center` of PersonCardItem (desktop: 180px square photo
 * cards with hover ice wash + bio dialog; mobile: ice expandable cards).
 */
export function TeamGrid({ block }: { block: TeamGridBlock }) {
  return (
    <Section tone="light" id="team" className="my-9 !py-[36px]">
      <div className="mx-auto text-center">
        <h2
          className="font-display text-[32px] font-light leading-[1.1] text-charcoal md:text-[48px]"
          data-mo=""
        >
          {block.heading}
        </h2>
        {block.subheading ? (
          <p className="mt-4 font-[family-name:var(--font-franklin)] text-xl font-normal text-charcoal md:text-[27px]">
            {block.subheading}
          </p>
        ) : null}
      </div>

      <ul
        className="mx-auto mt-8 grid max-w-sm grid-cols-1 gap-6 md:max-w-6xl md:grid-cols-[repeat(auto-fit,180px)] md:justify-center md:justify-items-center md:gap-[16px]"
        data-mo-stagger=""
      >
        {block.members.map((m) => (
          <li key={m.name} className="w-full" data-mo="">
            <PersonCardItem person={m} />
          </li>
        ))}
      </ul>
    </Section>
  );
}

export default TeamGrid;
