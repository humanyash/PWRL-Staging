import { Section } from "@/components/ui/Section";
import type { DisclosuresBlock } from "@/types/blocks";

/**
 * Disclosures — verbatim regulated text. Normally rendered globally in the
 * Footer; this block exists for pages that place disclosures inline.
 */
export function Disclosures({ block }: { block: DisclosuresBlock }) {
  return (
    <Section tone="navy">
      <div className="space-y-4 text-[11px] leading-relaxed text-white/50">
        {block.disclaimers.map((para, i) => (
          <p key={i}>{para}</p>
        ))}
      </div>
      {block.legalText ? (
        <p className="mt-6 border-t border-white/10 pt-6 text-xs text-white/60">
          {block.legalText}
        </p>
      ) : null}
    </Section>
  );
}

export default Disclosures;
