import { Section } from "@/components/ui/Section";
import { renderRich } from "@/lib/rich";
import type { ValuePropsBlock } from "@/types/blocks";

/**
 * ValueProps — live /vision "One ticker. Daily liquidity. Built for
 * everyone." (AUDIT.md R4-5). Live treatment:
 *  - WHITE section, pt/pb 20 → 40 at md, id="difference";
 *  - heading block mb-40: h3 36/55 charcoal with an <em> span
 *    ("Built for everyone" — _italic_ marker in content);
 *  - grid gap-36, md:grid-cols-3, NO card chrome: icon 60×60 mb-24;
 *    label = Franklin LIGHT 24/30 uppercase black; body 14/18 light
 *    leading-[1.2] black my-8; centered on mobile, left-aligned at md.
 */
export function ValueProps({ block }: { block: ValuePropsBlock }) {
  return (
    <Section
      tone="light"
      id="difference"
      className="!pb-[20px] !pt-[20px] md:!pb-[40px] md:!pt-[40px]"
    >
      <div className="mb-[40px]">
        <h2
          className="font-display text-[36px] font-light leading-[1.1] text-charcoal md:text-[55px]"
          data-mo=""
        >
          {renderRich(block.heading)}
        </h2>
        {block.subheading ? (
          <p className="mt-4 font-[family-name:var(--font-franklin)] text-base font-light text-charcoal/70">
            {block.subheading}
          </p>
        ) : null}
      </div>

      <div
        className="grid grid-cols-1 gap-[36px] md:grid-cols-3"
        data-mo-stagger=""
      >
        {block.items.map((item) => (
          <div
            key={item.heading}
            className="intro-item flex flex-col items-center text-center md:items-start md:text-left"
            data-mo=""
          >
            {item.icon?.src ? (
              <div className="icon relative mb-[24px] h-[60px] w-[60px] shrink-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.icon.src}
                  alt={item.icon.alt}
                  className="h-full w-full object-contain"
                />
              </div>
            ) : null}
            <div className="flex-1 text-black">
              <h3 className="font-[family-name:var(--font-franklin)] text-[24px] font-light uppercase leading-tight md:text-[30px]">
                {item.heading}
              </h3>
              <p className="my-[8px] font-[family-name:var(--font-franklin)] text-[14px] font-light leading-[1.2] md:text-[18px]">
                {item.body}
              </p>
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}

export default ValueProps;
