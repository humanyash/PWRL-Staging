"use client";

import React, { useEffect, useRef, useState } from "react";
import { moStyle } from "@/lib/motion";
import type { PlatformTabsBlock } from "@/types/blocks";

/**
 * PlatformTabs — live /trade "Available on all major brokerage platforms."
 * (AUDIT.md R6-4): section-spacing pb-16, title-tab h4 + p, tabbed shell.
 */

export function PlatformTabs({ block }: { block: PlatformTabsBlock }) {
  const [tab, setTab] = useState<"self-directed" | "advisor">("self-directed");
  const items = (block.items ?? []).filter(
    (i) => (i.group ?? "self-directed") === tab,
  );
  const gridRef = useRef<HTMLDivElement>(null);
  const firstRender = useRef(true);

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    const grid = gridRef.current;
    if (!grid) return;
    const tiles = grid.querySelectorAll<HTMLElement>(".platform-tile[data-mo]");
    tiles.forEach((t, n) => t.style.setProperty("--mo-i", String(n)));
    void grid.offsetWidth;
    tiles.forEach((t) => t.classList.add("mo-in"));
  }, [tab]);

  const tabBase =
    "p1 w-full px-4 py-3 text-left uppercase lg:text-center";

  return (
    <section className="section-spacing pb-16">
      <div className="mx-auto w-full max-w-6xl px-4">
        <div className="title-tab mb-8 text-center font-light">
          <h4
            className="font-display text-h4-mob font-light leading-[1.1] text-charcoal md:text-h4-desk"
            data-mo=""
          >
            {block.heading}
          </h4>
          {block.intro ? (
            <p
              className="mt-4 font-franklin text-p2-mob font-light text-charcoal md:text-p2-desk"
              data-mo=""
              style={moStyle({ "--mo-i": 1 })}
            >
              {block.intro}
            </p>
          ) : null}
        </div>

        <div className="overflow-hidden rounded-2xl">
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
          <div className="tabs-content bg-[#E4F7FD] py-4 font-bold">
            <div
              ref={gridRef}
              className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3"
              data-mo-stagger=""
            >
              {items.map((item) => (
                <a
                  key={`${item.group}-${item.label}`}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="platform-tile flex items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-semibold text-gray-900 no-underline"
                  data-mo=""
                >
                  {item.logo?.src ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={item.logo.src}
                      alt={`${item.label} → platform logo`}
                      width={50}
                      height={50}
                      className="h-10 w-10 object-contain"
                    />
                  ) : null}
                  <span className="font-franklin text-p1-mob font-bold md:text-p1-desk">
                    {item.label} →
                  </span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default PlatformTabs;
