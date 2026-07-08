import { Section } from "@/components/ui/Section";
import { renderRich } from "@/lib/rich";
import type { ValuePropsBlock } from "@/types/blocks";

const headingTextbox =
  "mb-[40px] [&_p]:text-p2-mob [&_p]:md:text-p2-desk [&_li]:text-p2-mob [&_li]:md:text-p2-desk [&_h1]:text-charcoal [&_h2]:text-charcoal [&_h3]:text-charcoal [&_h4]:text-charcoal [&_h5]:text-charcoal [&_h6]:text-charcoal";

const itemTextbox =
  "flex-1 [&_p]:text-p3-mob [&_p]:md:text-p3-desk [&_li]:text-p3-mob [&_li]:md:text-p3-desk [&_h1]:font-franklin [&_h2]:font-franklin [&_h3]:font-franklin [&_h4]:font-franklin [&_h5]:font-franklin [&_p]:font-franklin [&_p]:font-light [&_li]:font-light [&_p]:my-[8px] [&_b]:font-bold [&_strong]:font-bold text-black [&_h1]:text-black [&_h2]:text-black [&_h3]:text-black [&_h4]:text-black [&_h5]:text-black [&_h6]:text-black [&_p]:text-black [&_li]:text-black";

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
      className="!pb-[20px] !pt-[20px] text-left [&_h1]:font-light [&_h2]:font-light [&_h3]:font-light [&_h4]:font-light [&_h5]:font-light [&_p]:text-charcoal [&_li]:text-charcoal md:!pb-[40px] md:!pt-[40px]"
      containerClassName="!px-4 md:!px-0"
    >
      <div className={headingTextbox}>
        <h3
          className="font-display text-[36px] font-light leading-[1.1] text-charcoal md:text-[55px] md:leading-[55px]"
          data-mo=""
        >
          {renderRich(block.heading)}
        </h3>
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
            className="flex flex-col items-center text-center md:items-start md:text-left"
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
            <div className={itemTextbox}>
              <h5 className="text-[24px] font-light uppercase leading-[30px] md:text-[30px]">
                {item.heading}
              </h5>
              <p className="leading-[1.2] md:leading-[25.2px]">{item.body}</p>
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}

export default ValueProps;
