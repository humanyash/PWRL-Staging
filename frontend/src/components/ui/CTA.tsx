import Link from "next/link";
import type { CTA as CTAType } from "@/types/blocks";

/* Live `.common-cta` system (AUDIT.md R3-1), ported verbatim from the live
   CSS bundle:
     .common-cta: franklin extrabold, radius .25rem, py 10px px 24px,
       15px/24px; ≥64rem: py 14px px 36px, 20px. No letter-spacing.
     .cta-compact: py 10px px 32px, 14px → 18px ≥64rem (!important).
     .cta-blue: #085CF0 bg (hardcoded on live — NOT palette blue-400),
       white text. .cta-mint: mint bg, BLACK text.
     :hover = brightness(90%). */
const base =
  "mo-btn inline-block rounded-sm font-[family-name:var(--font-franklin)] font-extrabold no-underline transition";
const full =
  "px-[24px] py-[10px] text-[15px] leading-[24px] lg:px-[36px] lg:py-[14px] lg:text-[20px]";
const compactSize =
  "px-[32px] py-[10px] text-[14px] leading-[24px] lg:text-[18px]";

const variants: Record<NonNullable<CTAType["variant"]>, string> = {
  primary: `${base} bg-[#085CF0] text-white`,
  /* Live brokerage-platform pills: rounded-xl, dark gray-900 border + text,
     transparent fill (/trade "Available on all major brokerage platforms"). */
  secondary:
    "mo-btn mo-btn--outline inline-flex items-center gap-3 rounded-xl border border-[#101828] bg-transparent px-4 py-3 text-sm font-semibold text-[#101828] transition-colors duration-300 hover:border-[#101828] hover:bg-[#101828] hover:text-white",
  mint: `${base} bg-mint text-black`,
  link: "inline-flex items-center gap-1 text-sm font-medium text-brand-blue hover:underline",
  underline:
    "inline-flex items-center gap-1 text-sm font-medium text-brand-blue underline underline-offset-4 hover:no-underline",
};

const sized = new Set(["primary", "mint"]);

export function CTA({
  cta,
  compact = false,
  className = "",
}: {
  cta: CTAType;
  /** Live `.cta-compact` (TRADE PWRL, READ OUR PROSPECTUS, EXPLORE OUR VISION). */
  compact?: boolean;
  className?: string;
}) {
  const variant = cta.variant ?? "primary";
  const size = sized.has(variant) ? (compact ? compactSize : full) : "";
  const cls = `${variants[variant]} ${size} ${className}`;
  const external = cta.href.startsWith("http");

  if (external) {
    return (
      <a
        href={cta.href}
        className={cls}
        target="_blank"
        rel="noopener noreferrer"
      >
        {cta.label}
      </a>
    );
  }
  return (
    <Link href={cta.href} className={cls}>
      {cta.label}
    </Link>
  );
}

export default CTA;
