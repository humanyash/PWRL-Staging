"use client";

import React, { useState } from "react";
import { Section } from "@/components/ui/Section";
import { renderRich, renderLines, renderCmsAnswer } from "@/lib/rich";
import type { FAQBlock as FAQBlockType } from "@/types/blocks";

/**
 * FAQBlock — rebuilt from live /vision (AUDIT.md R4-9):
 *  - navy section py-15 md:py-22; container flex lg:flex-row gap-x-20;
 *  - LEFT (lg:w-[855px], flex-shrinks beside the full-width right column —
 *    live's exact classes): h2 40/64 with italic "Questions." (_em_ marker)
 *    + p2 20px light intro with underlined mailto link;
 *  - RIGHT (w-full pt-8 lg:pt-0): rows `border-b-2 border-gray-200 (#aaa)
 *    py-3 px-2`, first row also border-t-2 and OPEN by default; question
 *    Franklin light 18→24; answer 14/18 light with max-height/opacity
 *    transition (700ms open / 300ms close); answers render rich links.
 */
export function FAQBlock({ block }: { block: FAQBlockType }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const navy = block.theme === "navy";

  return (
    <Section
      tone={navy ? "navy" : "light"}
      id="faq"
      className="flex justify-center !py-[67.5px] md:!py-[99px]"
      containerClassName="!px-4"
    >
      <div className="flex flex-col gap-x-20 lg:flex-row">
        <div className={`lg:w-190 ${navy ? "text-white" : "text-charcoal"}`}>
          <h2
            className="font-display text-[40px] font-light leading-[1.1] md:text-[64px] md:leading-[64px]"
            data-mo=""
          >
            {renderRich(block.heading)}
          </h2>
          {block.intro ? (
            <p
              className="mb-[18px] mt-[23px] max-w-[500px] font-[family-name:var(--font-franklin)] text-[16px] font-light leading-[1.4] md:text-[20px] md:leading-[25.2px] [&_a]:underline"
              data-mo=""
              style={{ "--mo-i": 1 } as React.CSSProperties}
            >
              {renderLines(block.intro)}
            </p>
          ) : null}
        </div>

        <div
          className="w-full pt-8 lg:pt-0"
          data-mo="fade"
          style={{ "--mo-i": 2 } as React.CSSProperties}
        >
          {block.faqs.map((faq, i) => {
            const open = openIndex === i;
            return (
              <div
                key={i}
                className={`faq-row w-full border-b-2 px-2 py-3 transition-colors duration-300 ${
                  navy ? "border-gray-200" : "border-charcoal/15"
                } ${i === 0 ? "border-t-2" : ""}`}
              >
                <button
                  type="button"
                  className="faq-q w-full leading-none"
                  onClick={() => setOpenIndex(open ? null : i)}
                  aria-expanded={open}
                >
                  <div className="flex items-center justify-between gap-2 hover:cursor-pointer">
                    <h4
                      className={`text-left font-franklin text-p1-mob font-light leading-[18px] md:text-p1-desk md:leading-[24px] ${
                        navy ? "text-white" : "text-charcoal"
                      }`}
                    >
                      {faq.q}
                    </h4>
                    <span className="icon mo-arrow w-6 shrink-0" aria-hidden>
                      <svg
                        viewBox="0 0 24 24"
                        width="24"
                        height="24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <line x1="4" y1="12" x2="20" y2="12" />
                        {!open ? <line x1="12" y1="4" x2="12" y2="20" /> : null}
                      </svg>
                    </span>
                  </div>
                </button>
                <div
                  className={`overflow-hidden text-p3-mob transition-[max-height,opacity] md:text-p3-desk lg:pr-6 [&_p]:my-[18px] [&_p]:font-light [&_p]:leading-[19.6px] md:[&_p]:leading-[25.2px] ${
                    open
                      ? "max-h-96 opacity-100 duration-700"
                      : "max-h-0 opacity-30 duration-300"
                  }`}
                >
                  <div
                    className={`font-light leading-[19.6px] md:leading-[25.2px] [&_p]:my-[18px] [&_p]:font-light ${
                      navy ? "text-white" : "text-charcoal/70"
                    }`}
                  >
                    {renderCmsAnswer(faq.a)}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Section>
  );
}

export default FAQBlock;
