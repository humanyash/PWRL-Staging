import Link from "next/link";
import { renderRich } from "@/lib/rich";
import type { GlobalSettings } from "@/types/blocks";

/**
 * Footer — rebuilt from the live DOM (AUDIT.md R3-9):
 *   <footer class="bg-[#060B35] py-12"> → max-w-6xl px-4 container
 *   - LEFT: logo `w-[170px] md:w-[292px]`, © line under it
 *     (`pt-8 text-[14px] font-light text-[#B0E9FD]`, desktop only).
 *   - RIGHT (md:pl-3): one grid `grid-cols-[auto_auto] gap-x-10 gap-y-3`
 *     of semibold uppercase links in live's order (Our Vision / Investor
 *     Relations / The Fund / Contact / How to Trade) with the social icon
 *     row as the 6th cell; mobile © (10px) below.
 *   - Disclaimers: `pt-[36px] text-[12px] md:text-[14px] text-[#B0E9FD]`,
 *     paragraphs mb-3, no border — three paragraphs bold (verbatim markers).
 * Social icons are the live site's exact inline SVGs, extracted to
 * /brand/social/*.svg.
 */

const SOCIAL_ICONS: Record<string, string> = {
  linkedin: "/brand/social/linkedin.svg",
  instagram: "/brand/social/instagram.svg",
  youtube: "/brand/social/youtube.svg",
  x: "/brand/social/x.svg",
  seekingalpha: "/brand/social/seekingalpha.svg",
  stocktwits: "/brand/social/stocktwits.svg",
};

/** Key by platform or label, ignoring case/spaces ("Seeking Alpha" et al). */
function socialIcon(platform: string, label: string): string | undefined {
  const norm = (s: string) => s.toLowerCase().replace(/[^a-z]/g, "");
  return SOCIAL_ICONS[norm(platform)] ?? SOCIAL_ICONS[norm(label)];
}

export function Footer({ settings }: { settings: GlobalSettings }) {
  const byLabel = (label: string) =>
    settings.nav.find((l) => l.label.toLowerCase() === label.toLowerCase());
  // Live grid order (row-major across two columns).
  const navOrder = [
    "Our Vision",
    "Investor Relations",
    "The Fund",
    "Contact",
    "How to Trade",
  ]
    .map(byLabel)
    .filter(Boolean) as GlobalSettings["nav"];
  const legalLinks = settings.footerLinks.filter((l) =>
    /privacy|terms/i.test(l.label),
  );

  const copyright = (
    <p className="m-0">
      {settings.legalText ?? "© Powerlaw Corp. All Rights Reserved."}{" "}
      {legalLinks.map((l, i) => (
        <span key={l.href}>
          {i > 0 ? " | " : ""}
          <Link href={l.href} className="underline">
            {l.label}
          </Link>
        </span>
      ))}
    </p>
  );

  return (
    <footer className="bg-[#060B35] py-12 font-[family-name:var(--font-franklin)] text-white">
      <div className="mx-auto w-full max-w-6xl px-4">
        <div className="flex flex-col md:flex-row md:justify-between">
          <div className="flex flex-col">
            <Link href="/" aria-label="PWRL home">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/brand/pwrl-logo.svg"
                alt="PWRL — Private Tech. Nasdaq Listed."
                className="h-auto w-[170px] md:w-[292px]"
              />
            </Link>
            <div className="hidden pt-8 text-[14px] font-light text-[#B0E9FD] md:block">
              {copyright}
            </div>
          </div>

          <div className="flex flex-col md:pl-3">
            <ul className="grid grid-cols-[auto_auto] gap-x-10 gap-y-3 whitespace-nowrap pt-10 font-semibold md:pt-0">
              {navOrder.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="uppercase no-underline"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
              <li>
                <ul className="flex gap-x-2">
                  {settings.socials.map((s) => (
                    <li key={s.href}>
                      <a
                        href={s.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={s.label}
                        title={s.label}
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={socialIcon(s.platform, s.label)}
                          alt={s.label}
                          width={18}
                          height={18}
                          className="cursor-pointer"
                        />
                      </a>
                    </li>
                  ))}
                </ul>
              </li>
            </ul>
            <div className="mt-10 text-[10px] font-light text-[#B0E9FD] md:hidden">
              {copyright}
            </div>
          </div>
        </div>

        {/* Verbatim disclaimers — do not paraphrase. Live: pt-[36px],
            12→14px, #B0E9FD, three bold paragraphs (** markers). */}
        <div className="pt-[36px] text-[12px] font-light leading-[1.4] text-[#B0E9FD] md:text-[14px]">
          {settings.disclaimers.map((para, i) => (
            <p key={i} className="mb-3 mt-0 last:mb-0">
              {renderRich(para)}
            </p>
          ))}
        </div>
      </div>
    </footer>
  );
}

export default Footer;
