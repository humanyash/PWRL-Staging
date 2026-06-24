"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { Section } from "@/components/ui/Section";
import type { NewsListBlock } from "@/types/blocks";

function NewsChevron({ direction }: { direction: "left" | "right" }) {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      aria-hidden
      className={direction === "left" ? "mr-px" : "ml-px"}
    >
      <path
        d={direction === "left" ? "M9 2L4 7l5 5" : "M5 2l5 5-5 5"}
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/**
 * NewsList — rebuilt from live /investor-relations (AUDIT.md R7-3):
 *  - section py-[100px]; heading row `flex justify-between items-end`
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
    el.classList.toggle("has-more", maxScroll > 8 && el.scrollLeft < maxScroll - 8);
  }, []);

  const scrollBy = (dir: number) => {
    strip.current?.scrollBy({ left: dir * 420, behavior: "smooth" });
  };

  // Kinetic layer E12 (handoff bindNews): right-edge fade while more cards
  // exist off-screen, plus a one-time nudge on first view (skipped for
  // reduced motion / touch).
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
    <Section tone="light" id="news" className="!py-[100px]">
      <div className="flex items-end justify-between">
        <h2
          className="font-display text-[32px] font-light leading-[1.1] text-black md:text-[48px]"
          data-mo=""
        >
          {block.heading}
        </h2>
        <div
          className="flex items-center gap-3 pr-2"
          data-mo=""
          style={{ "--mo-i": 1 } as React.CSSProperties}
        >
          <button
            type="button"
            aria-label="Scroll news left"
            onClick={() => scrollBy(-1)}
            disabled={!canScrollLeft}
            className="news-nav-btn"
          >
            <NewsChevron direction="left" />
          </button>
          <button
            type="button"
            aria-label="Scroll news right"
            onClick={() => scrollBy(1)}
            disabled={!canScrollRight}
            className="news-nav-btn"
          >
            <NewsChevron direction="right" />
          </button>
        </div>
      </div>

      <div
        ref={strip}
        className="news-strip no-scrollbar mt-6 flex w-full snap-x snap-mandatory gap-6 overflow-x-auto overflow-y-clip overscroll-x-contain will-change-contents"
        data-mo-stagger=""
      >
        {block.items.map((item) => (
          <article
            key={item.href + item.title}
            className="news-card w-[280px] flex-none snap-start md:w-[396px]"
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
    </Section>
  );
}

export default NewsList;
