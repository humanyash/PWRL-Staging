import Link from "next/link";
import type { AnchorNavBlock } from "@/types/blocks";

/**
 * AnchorNav — in-page anchor band under the hero (AUDIT.md R4-2).
 * Live /vision: `nav hidden md:block bg-[#E4F7FD]`, centered uppercase row
 * (gap-x-16, py-3), labels bold-on-hover via the invisible-bold-span trick
 * (live hovers to semibold).
 */
export function AnchorNav({ block }: { block: AnchorNavBlock }) {
  return (
    <nav className="anchor-nav hidden bg-[#E4F7FD] font-[family-name:var(--font-franklin)] text-charcoal md:block">
      <ul className="flex flex-wrap items-center justify-center gap-x-8 gap-y-2 py-3 uppercase lg:gap-x-12 xl:gap-x-16">
        {block.items.map((item) => (
          <li key={item.href}>
            <Link href={item.href} className="group no-underline">
              <span className="nav-swap relative inline-block whitespace-nowrap tracking-wide">
                <span className="ghost invisible font-bold">{item.label}</span>
                <span className="real absolute inset-0 group-hover:font-semibold">
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
