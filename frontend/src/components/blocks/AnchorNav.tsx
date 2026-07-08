"use client";

import Link from "next/link";
import type { AnchorNavBlock } from "@/types/blocks";

/**
 * AnchorNav — in-page anchor band under the hero (AUDIT.md R4-2).
 * Live /vision: `nav hidden md:block bg-[#E4F7FD]`, centered uppercase row
 * (gap-x-16, py-3), labels bold on hover and when scroll-spied active.
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
    history.pushState(null, "", `#${id}`);
  }

  return (
    <nav className="anchor-nav hidden bg-[#E4F7FD] font-[family-name:var(--font-franklin)] text-charcoal md:block">
      <ul className="flex items-center justify-center gap-x-16 py-3 uppercase">
        {block.items.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              className="group no-underline"
              onClick={(e) => handleAnchorClick(e, item.href)}
            >
              <span className="relative inline-block tracking-wide">
                <span className="invisible font-semibold" aria-hidden="true">
                  {item.label}
                </span>
                <span className="absolute inset-0 hover:font-semibold">
                  {item.label}
                </span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export default AnchorNav;
