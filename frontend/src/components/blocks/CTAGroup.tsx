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
  const HeadingTag = theme === "ice" ? "h3" : "h2";
  const useVisionLayout = theme === "ice";

  return (
    <Section
      tone={theme}
      id="investing"
      className={
        theme === "light" ? "!pb-16 !pt-8" : "!py-[60px] md:!py-[80px]"
      }
      containerClassName={
        useVisionLayout
          ? "!px-4 md:!px-0 [&_p]:mx-auto [&_p]:max-w-[720px] [&_p]:text-center [&_p]:font-light"
          : ""
      }
    >
      {useVisionLayout ? (
        <div className="mx-auto w-full max-w-6xl">
          <div className="textbox-content flex flex-col items-center gap-y-[24px] md:gap-y-[40px] [&>*]:my-0">
            <HeadingTag
              className="font-display font-light tracking-tight text-3xl leading-tight text-electric-blue md:text-[55px] md:leading-[55px]"
            >
              {block.heading}
            </HeadingTag>
            {block.subheading ? (
              <p
                className={`text-center font-[family-name:var(--font-franklin)] text-[18px] font-normal ${
                  onDark ? "text-white/70" : "text-charcoal"
                }`}
              >
                {block.subheading}
              </p>
            ) : null}
            {block.body?.map((p, i) => (
              <p
                key={i}
                className={`text-center font-[family-name:var(--font-franklin)] text-[14px] font-light leading-[1.2] md:text-[18px] md:leading-[25.2px] ${
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
        </div>
      ) : (
        <div className="mx-auto flex max-w-4xl flex-col items-center gap-y-[24px] text-center md:gap-y-[40px]">
          <HeadingTag
            className={`font-display font-light tracking-tight ${
              theme === "light"
                ? "text-3xl leading-tight text-charcoal md:text-[48px]"
                : "text-3xl leading-tight text-white md:text-[55px] md:leading-[55px]"
            }`}
          >
            {block.heading}
          </HeadingTag>
          {block.subheading ? (
            <p
              className={`font-[family-name:var(--font-franklin)] text-[18px] font-normal ${
                onDark ? "text-white/70" : "text-charcoal"
              }`}
            >
              {block.subheading}
            </p>
          ) : null}
          {block.body?.map((p, i) => (
            <p
              key={i}
              className={`mx-auto max-w-[720px] font-[family-name:var(--font-franklin)] text-[14px] font-light leading-[1.2] md:text-[18px] md:leading-[25.2px] ${
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
      )}
    </Section>
  );
}

export default CTAGroup;
