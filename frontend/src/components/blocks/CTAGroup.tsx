import { Section } from "@/components/ui/Section";
import { CTA } from "@/components/ui/CTA";
import type { CTAGroupBlock } from "@/types/blocks";

/**
 * CTAGroup — closing call-to-action band.
 * Live /vision: ice (#E4F7FD) band with a 55px font-light electric-blue
 * display heading. The navy variant is retained for dark placements.
 */
export function CTAGroup({ block }: { block: CTAGroupBlock }) {
  const theme = block.theme ?? "ice";
  const onDark = theme === "navy";

  return (
    <Section
      tone={theme}
      id="investing"
      // Live: ice/navy bands = 80px; the /trade platforms band (light)
      // = pt 36 / pb 72.
      // Live /vision investing band: py-[60px] md:py-[80px].
      className={
        theme === "light" ? "!pb-16 !pt-8" : "!py-[60px] md:!py-[80px]"
      }
    >
      <div className="mx-auto flex max-w-4xl flex-col items-center gap-y-[24px] text-center md:gap-y-[40px]">
        <h2
          className={`font-display font-light leading-tight tracking-tight ${
            theme === "ice"
              ? "text-3xl text-electric-blue md:text-[55px] md:leading-[1.1]"
              : theme === "light"
                ? "text-3xl text-charcoal md:text-[48px]"
                : "text-3xl text-white md:text-[55px] md:leading-[1.1]"
          }`}
        >
          {block.heading}
        </h2>
        {block.subheading ? (
          <p
            className={`font-[family-name:var(--font-franklin)] text-[18px] font-normal ${
              onDark ? "text-white/70" : "text-charcoal"
            }`}
          >
            {block.subheading}
          </p>
        ) : null}
        {/* Live: p3 (14/18) light leading-[1.2], max-w-160 (720px). */}
        {block.body?.map((p, i) => (
          <p
            key={i}
            className={`mx-auto max-w-[720px] font-[family-name:var(--font-franklin)] text-[14px] font-light leading-[1.2] md:text-[18px] ${
              onDark ? "text-white/80" : "text-charcoal"
            }`}
          >
            {p}
          </p>
        ))}
        {block.ctas && block.ctas.length > 0 ? (
          <div className="flex flex-wrap justify-center gap-3">
            {block.ctas.map((cta) => (
              <CTA key={cta.href} cta={cta} compact />
            ))}
          </div>
        ) : null}
      </div>
    </Section>
  );
}

export default CTAGroup;
