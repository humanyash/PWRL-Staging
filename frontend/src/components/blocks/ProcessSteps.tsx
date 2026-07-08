import React from "react";
import { moStyle } from "@/lib/motion";
import type { ProcessStepsBlock } from "@/types/blocks";

/**
 * ProcessSteps — live /trade "How to Invest in PWRL" (AUDIT.md R6-3).
 * Matches production DOM: plain section, px-4/md:px-0 container, h4
 * heading block, 4-col grid, bold title in <p><b>…</b></p>.
 */

const sectionClass =
  "pt-[40px] pb-[40px] text-left md:pt-[80px] md:pb-[80px] [&_h1]:font-light [&_h2]:font-light [&_h3]:font-light [&_h4]:font-light [&_h5]:font-light [&_p]:text-charcoal [&_li]:text-charcoal";

const headingBlockClass =
  "mb-[40px] [&_h1]:text-charcoal [&_h2]:text-charcoal [&_h3]:text-charcoal [&_h4]:text-charcoal [&_h5]:text-charcoal [&_h6]:text-charcoal [&_li]:text-p2-mob [&_li]:md:text-p2-desk [&_p]:text-p2-mob [&_p]:md:text-p2-desk";

const stepBodyClass =
  "flex-1 text-black [&_b]:font-bold [&_h1]:font-franklin [&_h1]:text-black [&_h2]:font-franklin [&_h2]:text-black [&_h3]:font-franklin [&_h3]:text-black [&_h4]:font-franklin [&_h4]:text-black [&_h5]:font-franklin [&_h5]:text-black [&_h6]:text-black [&_li]:font-light [&_li]:text-black [&_li]:text-p3-mob [&_li]:md:text-p3-desk [&_p]:my-[8px] [&_p]:font-light [&_p]:text-black [&_p]:text-p3-mob [&_p]:md:text-p3-desk [&_strong]:font-bold";

export function ProcessSteps({ block }: { block: ProcessStepsBlock }) {
  const cols = block.steps.length === 4 ? "md:grid-cols-4" : "md:grid-cols-3";

  return (
    <section id="where-how" className={sectionClass}>
      <div className="mx-auto w-full max-w-6xl px-4 md:px-0">
        <div className={headingBlockClass}>
          <h4
            className="font-display text-h4-mob font-light leading-[1.1] text-charcoal md:text-h4-desk"
            data-mo=""
          >
            {block.heading}
          </h4>
          {block.intro ? (
            <p data-mo="" style={moStyle({ "--mo-i": 1 })}>
              {block.intro}
            </p>
          ) : null}
        </div>

        <div
          className={`grid grid-cols-1 gap-[36px] ${cols}`}
          data-mo-stagger=""
        >
          {block.steps.map((step) => (
            <div
              key={step.title}
              className="flex flex-col items-start text-left md:items-start md:text-left"
              data-mo=""
            >
              {step.icon?.src ? (
                <div className="relative mb-[24px] h-[60px] w-[60px] shrink-0 md:mb-[24px] md:mr-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={step.icon.src}
                    alt={step.icon.alt}
                    className="h-full w-full object-contain"
                  />
                </div>
              ) : null}
              <div className={stepBodyClass}>
                <p>
                  <b>{step.title}</b>
                </p>
                <p>{step.body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default ProcessSteps;
