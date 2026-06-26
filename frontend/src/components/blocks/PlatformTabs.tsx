"use client";

import React, { useEffect, useRef, useState } from "react";
import { Section } from "@/components/ui/Section";
import type { PlatformTabsBlock } from "@/types/blocks";

/**
 * PlatformTabs — live /trade "Available on all major brokerage platforms."
 * (AUDIT.md R6-4):
 *  - section-spacing pb-16; centered title block mb-8 (h4 32/48 + p2);
 *  - rounded-2xl tab shell: active tab `font-bold bg-[#E4F7FD]
 *    rounded-tl-2xl`, inactive `border-t-2 border-r-2 border-[#E4F7FD]`
 *    (mirrored radii per side), both `w-full uppercase py-3 px-4` p1;
 *  - panel bg-[#E4F7FD] py-4 with a `grid gap-3 sm:grid-cols-2
 *    lg:grid-cols-3` of platform links: 40px logo + bold p1 label + "→".
 */
export function PlatformTabs({ block }: { block: PlatformTabsBlock }) {
  const [tab, setTab] = useState<"self-directed" | "advisor">("self-directed");
  const items = (block.items ?? []).filter(
    (i) => (i.group ?? "self-directed") === tab,
  );
  const gridRef = useRef<HTMLDivElement>(null);
  const firstRender = useRef(true);

  // Kinetic layer (handoff bindTabs): after a tab switch the freshly
  // mounted tiles re-index --mo-i and cascade in (the page-load observer
  // only covers the initial set).
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    const grid = gridRef.current;
    if (!grid) return;
    const tiles = grid.querySelectorAll<HTMLElement>(".platform-tile[data-mo]");
    tiles.forEach((t, n) => t.style.setProperty("--mo-i", String(n)));
    // Flush styles so the pre-state lands, then reveal — a forced reflow +
    // class add (not rAF, which freezes in backgrounded tabs).
    void grid.offsetWidth;
    tiles.forEach((t) => t.classList.add("mo-in"));
  }, [tab]);

  const tabBase =
    "w-full text-left lg:text-center uppercase py-3 px-4 font-[family-name:var(--font-franklin)] text-[18px] md:text-[24px]";

  return (
    <Section tone="light" className="!pb-16 !pt-[36px]">
      <div className="mb-8 text-center font-light">
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
        className="overflow-hidden rounded-2xl"
        data-mo=""
        style={{ "--mo-i": 2 } as React.CSSProperties}
      >
        <div className="flex">
          <button
            type="button"
            onClick={() => setTab("self-directed")}
            aria-selected={tab === "self-directed"}
            className={`${tabBase} ${
              tab === "self-directed"
                ? "rounded-tl-2xl bg-[#E4F7FD] font-bold"
                : "rounded-tl-2xl border-l-2 border-t-2 border-[#E4F7FD]"
            }`}
          >
            {block.selfDirectedLabel ?? "Self Directed Brokerage"}
          </button>
          <button
            type="button"
            onClick={() => setTab("advisor")}
            aria-selected={tab === "advisor"}
            className={`${tabBase} ${
              tab === "advisor"
                ? "rounded-tr-2xl bg-[#E4F7FD] font-bold"
                : "rounded-tr-2xl border-r-2 border-t-2 border-[#E4F7FD]"
            }`}
          >
            {block.advisorLabel ?? "Financial Advisor Managed"}
          </button>
        </div>
        <div className="bg-[#E4F7FD] py-4 font-bold">
          <div
            ref={gridRef}
            className="tab-grid grid gap-3 sm:grid-cols-2 lg:grid-cols-3"
            data-mo-stagger=""
          >
            {items.map((item) => (
              <a
                key={`${item.group}-${item.label}`}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className="platform-tile mo-card mo-card--quiet flex items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-semibold text-gray-900 no-underline"
                data-mo=""
              >
                {item.logo?.src ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={item.logo.src}
                    alt={`${item.label} platform logo`}
                    width={50}
                    height={50}
                    className="h-10 w-10 object-contain"
                  />
                ) : null}
                <span className="flex-1 font-[family-name:var(--font-franklin)] text-[18px] font-bold md:text-[24px]">
                  <span className="platform-label">{item.label}</span>{" "}<span className="mo-arrow">→</span>
                </span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </Section>
  );
}

export default PlatformTabs;
