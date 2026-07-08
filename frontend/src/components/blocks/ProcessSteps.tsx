import React from "react";
import { Section } from "@/components/ui/Section";
import type { ProcessStepsBlock } from "@/types/blocks";

/**
 * ProcessSteps — rebuilt from live /trade "How to Invest in PWRL"
 * (AUDIT.md R6-3):
 *  - section id=where-how, pt/pb 40 → 80;
 *  - heading block mb-40, LEFT-aligned: h4 32/48 charcoal + p2 16/20 light;
 *  - grid gap-36 md:grid-cols-4 (3 cols for 3 steps); each step:
 *    numbered-circle image 60×60 mb-24, BOLD p3 title (14/18) + p3 light
 *    body, left-aligned, black text.
 */
export function ProcessSteps({ block }: { block: ProcessStepsBlock }) {
  const cols = block.steps.length === 4 ? "md:grid-cols-4" : "md:grid-cols-3";

  return (
    <Section tone="light" id="where-how" className="!pt-[40px] !pb-[80px]">
      <div className="mb-[40px]">
        <h2
          className="font-display text-[32px] font-light leading-[1.1] text-charcoal md:text-[48px]"
          data-mo=""
        >
          {block.heading}
        </h2>
        {block.intro ? (
          <p
            className="mt-4 font-[family-name:var(--font-franklin)] text-[16px] font-light leading-[1.4] text-charcoal md:text-[20px]"
            data-mo=""
            style={{ "--mo-i": 1 } as React.CSSProperties}
          >
            {block.intro}
          </p>
        ) : null}
      </div>

      <div
        className={`steps-grid relative grid grid-cols-1 gap-[36px] ${cols}`}
        data-mo-stagger=""
      >
        {block.steps.map((step) => (
          <div
            key={step.title}
            className="intro-item flex flex-col items-start text-left"
            data-mo=""
          >
            {step.icon?.src ? (
              <div className="icon relative mb-[24px] h-[60px] w-[60px] shrink-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={step.icon.src}
                  alt={step.icon.alt}
                  className="h-full w-full object-contain"
                />
              </div>
            ) : null}
            <div className="flex-1 text-black">
              <p className="my-[8px] font-[family-name:var(--font-franklin)] text-[14px] font-bold leading-[1.2] md:text-[18px]">
                {step.title}
              </p>
              <p className="my-[8px] font-[family-name:var(--font-franklin)] text-[14px] font-light leading-[1.2] md:text-[18px]">
                {step.body}
              </p>
            </div>
          </div>
        ))}
        <span
          className="steps-line"
          data-mo="draw-x"
          aria-hidden="true"
          style={
            {
              "--mo-d": "150ms",
              "--mo-dur-draw": "1400ms",
            } as React.CSSProperties
          }
        />
      </div>
    </Section>
  );
}

export default ProcessSteps;
