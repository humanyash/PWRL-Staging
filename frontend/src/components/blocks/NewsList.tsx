"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { Section } from "@/components/ui/Section";
import type { NewsListBlock } from "@/types/blocks";

function NewsChevron({ direction }: { direction: "left" | "right" }) {
  return (
    <svg
      width="13"
      height="22"
      viewBox="0 0 13 22"
      fill="none"
      aria-hidden
      className="inline-block"
    >
      <path
        d={direction === "left" ? "M12 1L1 11L12 21" : "M1 1L12 11L1 21"}
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/**
 * NewsList — rebuilt from live /investor-relations (AUDIT.md R7-3):
 *  - section py-[54px]; heading row `flex justify-between items-end`
 *    (h4 32/48 + scroll chevrons, PDF reference);
 *  - card strip: `flex snap-x snap-mandatory overflow-x-auto
 *    overscroll-x-contain no-scrollbar mt-6 gap-6`;
 *  - cards: `flex-none w-[280px] md:w-[396px]` rounded-lg, aspect-video
 *    thumbnail, ice body p-[16px] gap-2 — date 12px #0023EC, title 18px
 *    Franklin semibold line-clamp-3.
 */
export function NewsList({ block }: { block: NewsListBlock }) {
  const strip = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const updateScrollState = useCallback(() => {
    const el = strip.current;
    if (!el) return;
    const maxScroll = el.scrollWidth - el.clientWidth;
    setCanScrollLeft(el.scrollLeft > 8);
    setCanScrollRight(el.scrollLeft < maxScroll - 8);
  }, []);

  const scrollBy = (dir: number) => {
    const el = strip.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>(".news-card");
    if (!card) return;
    const gap = parseFloat(getComputedStyle(el).columnGap || "24");
    el.scrollBy({ left: dir * (card.offsetWidth + gap), behavior: "smooth" });
  };

  // Kinetic layer E12: one-time nudge on first view (skipped for reduced
  // motion / touch).
  useEffect(() => {
    const el = strip.current;
    if (!el) return;
    el.addEventListener("scroll", updateScrollState, { passive: true });
    window.addEventListener("resize", updateScrollState, { passive: true });
    updateScrollState();

    let nudged = false;
    const maybeNudge = () => {
      if (nudged) return;
      const html = document.documentElement;
      if (
        !html.hasAttribute("data-mo-on") ||
        html.hasAttribute("data-mo-reduced") ||
        html.hasAttribute("data-mo-touch") ||
        window.matchMedia("(prefers-reduced-motion: reduce)").matches
      )
        return;
      const r = el.getBoundingClientRect();
      if (
        r.top < (window.innerHeight || 800) * 0.8 &&
        r.bottom > 0 &&
        el.scrollWidth > el.clientWidth &&
        el.scrollLeft === 0
      ) {
        nudged = true;
        setTimeout(() => {
          el.scrollTo({ left: 26, behavior: "smooth" });
          setTimeout(() => el.scrollTo({ left: 0, behavior: "smooth" }), 340);
        }, 650);
      }
    };
    window.addEventListener("scroll", maybeNudge, { passive: true });
    maybeNudge();
    return () => {
      el.removeEventListener("scroll", updateScrollState);
      window.removeEventListener("resize", updateScrollState);
      window.removeEventListener("scroll", maybeNudge);
    };
  }, [updateScrollState]);

  return (
    <Section
      tone="light"
      id="news"
      className="!pt-[100px] !pb-[54px]"
      containerClassName="!px-[24.5px]"
    >
      <div className="flex items-end justify-between">
        <h4
          className="font-display text-[32px] font-normal leading-[1.1] text-black md:text-[48px] md:leading-none"
          data-mo=""
        >
          {block.heading}
        </h4>
        <div
          className="flex items-center gap-7"
          data-mo=""
          style={{ "--mo-i": 1 } as React.CSSProperties}
        >
          <button
            type="button"
            aria-label="navigate back"
            onClick={() => scrollBy(-1)}
            disabled={!canScrollLeft}
            className="flex items-center justify-center text-charcoal transition disabled:cursor-not-allowed disabled:opacity-30"
          >
            <NewsChevron direction="left" />
          </button>
          <button
            type="button"
            aria-label="navigate forward"
            onClick={() => scrollBy(1)}
            disabled={!canScrollRight}
            className="flex items-center justify-center text-charcoal transition disabled:cursor-not-allowed disabled:opacity-30"
          >
            <NewsChevron direction="right" />
          </button>
        </div>
      </div>

      <div className="mt-6 w-full overflow-hidden">
        <div
          ref={strip}
          className="news-strip no-scrollbar flex w-full snap-x snap-mandatory gap-6 overflow-x-auto overflow-y-clip overscroll-x-contain will-change-contents"
          data-mo-stagger=""
        >
          {block.items.map((item) => (
            <article
              key={item.href + item.title}
              className="news-card w-[280px] flex-none snap-start md:w-[calc((100%-3rem)/3)]"
              data-mo=""
            >
            <a
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              className="mo-card mo-card--quiet grid h-full grid-rows-[auto_1fr] overflow-hidden rounded-lg no-underline"
            >
              <span className="news-thumb relative block aspect-video overflow-hidden">
                {item.image?.src ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={item.image.src}
                    alt={item.image.alt || item.title}
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                ) : (
                  <div className="absolute inset-0 bg-navy" />
                )}
              </span>
              <div className="flex flex-col gap-2 bg-[#E4F7FD] p-[16px] text-black">
                {item.date ? (
                  <span className="text-xs font-normal text-[#0023EC]">
                    {item.date}
                  </span>
                ) : null}
                <h3 className="line-clamp-3 text-pretty font-[family-name:var(--font-franklin)] text-lg font-semibold leading-snug">
                  {item.title}
                </h3>
              </div>
            </a>
          </article>
        ))}
        </div>
      </div>
    </Section>
  );
}

export default NewsList;
