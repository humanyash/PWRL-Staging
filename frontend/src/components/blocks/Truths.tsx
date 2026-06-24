import { Section } from "@/components/ui/Section";
import { AnimatedSphere } from "@/components/ui/AnimatedSphere";
import { countup, moStyle } from "@/lib/motion";
import type { TruthsBlock } from "@/types/blocks";

/**
 * Truths — live /vision "born from two simple but powerful truths"
 * (AUDIT.md R4-3):
 *  - heading block mb-40, md:max-w-[65%], h3 55px blue-400;
 *  - two-col `md:flex gap-40 items-center [&>*]:flex-1`:
 *    LEFT = numbered rows (60×60 number graphics, mr-16/32; title 42px ivy
 *    black; body p2 light black my-8; rows gap-36);
 *    RIGHT = dotted-sphere graphic + caption (Franklin BOLD p2 centered,
 *    max-w-220/320, mt-24) with a <sup>1</sup> marker;
 *  - footnote row mt-40: 14px light #757575 "1. Source" underlined link.
 */
export function Truths({ block }: { block: TruthsBlock }) {
  return (
    <Section
      tone="light"
      className="!pb-[20px] !pt-[40px] md:!pb-[40px] md:!pt-[80px]"
    >
      <div className="mb-[40px] md:max-w-[65%]">
        <h2
          className="font-display text-[36px] font-light leading-[1.1] text-[#0023EC] md:text-[55px]"
          data-mo=""
        >
          {block.heading}
        </h2>
      </div>

      <div className="md:flex md:flex-row md:items-center md:gap-[40px] md:[&>*]:flex-1">
        <div className="grid grid-cols-1 gap-[36px]" data-mo-stagger="">
          {block.items.map((item) => (
            <div
              key={item.title}
              className="truth-row flex flex-row items-start text-left"
              data-mo=""
            >
              <div className="num relative mr-[16px] h-[60px] w-[60px] shrink-0 md:mr-[32px]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.icon.src}
                  alt={item.icon.alt}
                  className="h-full w-full object-contain"
                />
              </div>
              <div className="flex-1 text-black">
                <h3 className="font-display text-[32px] font-light leading-[1.1] md:text-[42px]">
                  {item.title}
                </h3>
                <p className="my-[8px] font-[family-name:var(--font-franklin)] text-[16px] font-light leading-[1.4] md:text-[20px]">
                  {item.body}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div data-mo="" style={moStyle({ "--mo-d": "150ms" })}>
          {/* Live animates this build client-side (AUDIT R10-2). */}
          <AnimatedSphere revealDelayMs={250} />
          {block.caption ? (
            <div className="mx-auto mt-[24px] max-w-[220px] text-center font-[family-name:var(--font-franklin)] text-[16px] font-bold text-charcoal md:max-w-[320px] md:text-[20px]">
              <p className="m-0">
                {/* E5 — the 97% counts up on reveal. */}
                {countup(block.caption)}
                {block.sourceHref ? <sup>1</sup> : null}
              </p>
            </div>
          ) : null}
        </div>
      </div>

      {block.sourceHref ? (
        <div className="mt-[40px]" data-mo="fade">
          <p className="text-[14px] font-light text-[#757575]">
            1.{" "}
            <a
              href={block.sourceHref}
              target="_blank"
              rel="noopener noreferrer"
            >
              <u>{block.sourceLabel ?? "Source"}</u>
            </a>
          </p>
        </div>
      ) : null}
    </Section>
  );
}

export default Truths;
