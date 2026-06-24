import Link from "next/link";
import type { CTA as CTAType } from "@/types/blocks";

/* Live `.common-cta` system (AUDIT.md R3-1) — styles live in globals.css:
     .common-cta / .cta-blue / .cta-mint / .cta-compact */
const variantClass: Record<NonNullable<CTAType["variant"]>, string> = {
  primary: "common-cta cta-blue",
  secondary:
    "mo-btn mo-btn--outline inline-flex items-center gap-3 rounded-xl border border-[#101828] bg-transparent px-4 py-3 text-sm font-semibold text-[#101828] transition-colors duration-300 hover:border-[#101828] hover:bg-[#101828] hover:text-white",
  mint: "common-cta cta-mint",
  link: "inline-flex items-center gap-1 text-sm font-medium text-brand-blue hover:underline",
  underline:
    "inline-flex items-center gap-1 text-sm font-medium text-brand-blue underline underline-offset-4 hover:no-underline",
};

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
  const sized = variant === "primary" || variant === "mint";
  const cls = [
    sized ? "mo-btn" : "",
    variantClass[variant],
    compact && sized ? "cta-compact" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");
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
