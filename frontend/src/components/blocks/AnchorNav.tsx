"use client";

import Link from "next/link";
import type { AnchorNavBlock } from "@/types/blocks";

/**
 * AnchorNav — in-page anchor band under the hero (AUDIT.md R4-2).
 * Live /vision: `nav hidden md:block bg-[#E4F7FD]`, centered uppercase row
 * (gap-x-16, py-3), labels bold on hover and when scroll-spied active.
 *
 * Clicks on same-page hash links are intercepted so the browser scrolls
 * smoothly to the target section. CSS scroll-margin-top (scroll-mt-28) on
 * each section already accounts for the fixed header offset, so
 * scrollIntoView picks up the correct stopping point automatically.
 */
export function AnchorNav({ block }: { block: AnchorNavBlock }) {
  function handleAnchorClick(
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string,
  ) {
    const hashIndex = href.indexOf("#");
    if (hashIndex === -1) return;
    const id = href.slice(hashIndex + 1);
    const target = document.getElementById(id);
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: "smooth", block: "start" });
    // Keep the URL in sync without triggering a full navigation.
    history.pushState(null, "", `#${id}`);
  }

  return (
    <nav className="anchor-nav hidden bg-[#E4F7FD] font-[family-name:var(--font-franklin)] text-charcoal md:block">
      <ul className="flex flex-wrap items-center justify-center gap-x-8 gap-y-2 py-3 uppercase lg:gap-x-12 xl:gap-x-16">
        {block.items.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              className="group no-underline"
              onClick={(e) => handleAnchorClick(e, item.href)}
            >
              <span className="nav-swap relative inline-block whitespace-nowrap tracking-wide">
                <span className="ghost invisible font-bold">{item.label}</span>
                <span className="real absolute inset-0">{item.label}</span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export default AnchorNav;
