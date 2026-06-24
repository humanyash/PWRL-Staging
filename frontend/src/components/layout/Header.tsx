"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { GlobalSettings } from "@/types/blocks";

/**
 * Fixed overlay header matching the live PWRL site (AUDIT.md R3-2/R3-3):
 *  - Banner: bg #085CF0, 20px, py-[10px], underlined link — pinned fixed
 *    at the top on the homepage so it never scrolls away; nav sits below it.
 *  - Nav row: static black gradient `from-black via-black/65 via-50%
 *    to-black/0` (no navy-on-scroll); the row hides on scroll-down and
 *    returns on scroll-up (live translates the wrapper).
 *  - Links: uppercase, tracking-wide, hover = BOLD (invisible-bold-span
 *    width trick so nothing shifts); each item opens a dropdown submenu
 *    (rounded-md bg-neutral-900/95 py-4 px-6 text-sm).
 *  - Contact lives behind the utility hamburger at far right.
 */
export function Header({ settings }: { settings: GlobalSettings }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileSection, setMobileSection] = useState<string | null>(null);
  const [utilityOpen, setUtilityOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const lastY = useRef(0);

  const pathname = usePathname();
  const showBanner = pathname === "/" && Boolean(settings.banner);

  const inlineNav = settings.nav.filter((n) => n.label !== "Contact");
  const utilityNav = settings.nav.filter((n) => n.label === "Contact");

  useEffect(() => {
    if (!mobileOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [mobileOpen]);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      // Live behavior: nav slides away scrolling down, returns scrolling up.
      setHidden(y > 120 && y > lastY.current);
      lastY.current = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      {showBanner && settings.banner ? (
        <div className="fixed inset-x-0 top-0 z-[60] bg-[#085CF0] py-[10px] text-center text-[16px] text-white md:text-[20px]">
          <div className="px-2">
            {settings.banner.href ? (
              <a
                href={settings.banner.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:text-white"
              >
                <u>{settings.banner.text}</u>
              </a>
            ) : (
              <span>{settings.banner.text}</span>
            )}
          </div>
        </div>
      ) : null}

      {/* Reserve space so page content doesn't slide under the fixed banner. */}
      {showBanner ? (
        <div
          className="h-[44px] shrink-0 md:h-[50px]"
          aria-hidden
        />
      ) : null}

      <header
        className={`site-header fixed inset-x-0 z-50 text-white ${
          showBanner ? "top-[44px] md:top-[50px]" : "top-0"
        }`}
      >
        <div
          className={`transition-transform duration-300 ease-out will-change-transform ${
            hidden ? "-translate-y-full" : "translate-y-0"
          }`}
        >
          <div className="flex items-center justify-between bg-gradient-to-b from-black via-black/65 via-50% to-black/0 p-4 md:px-8">
            <Link href="/" aria-label="Go to homepage" className="leading-none">
              {/* Real brand wordmark extracted from the live site's inline SVG
                (includes the "Private Tech. Nasdaq Listed." tagline paths). */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/brand/pwrl-logo.svg"
                alt="PWRL — Private Tech. Nasdaq Listed."
                className="h-auto w-[116px] lg:w-[178px]"
              />
            </Link>

            <nav className="hidden md:block">
              <ul className="flex items-center justify-center gap-x-8 py-3 uppercase lg:gap-x-16">
                {inlineNav.map((item) => (
                  <li
                    key={item.href}
                    className="mo-dropdown-parent group relative"
                  >
                    <Link
                      href={item.href}
                      className="inline-block py-2 no-underline"
                    >
                      {/* Invisible bold copy reserves width; visible copy
                        bolds on hover without layout shift (live trick). */}
                      <span className="relative inline-block whitespace-nowrap tracking-wide transition-colors">
                        <span className="invisible font-bold">
                          {item.label}
                        </span>
                        <span className="absolute inset-0 text-white group-hover:font-bold">
                          {item.label}
                        </span>
                      </span>
                    </Link>
                    {item.children && item.children.length > 0 ? (
                      <div className="nav-dropdown mo-dropdown absolute left-0 top-full z-20 hidden text-left normal-case group-hover:block">
                        <div className="nav-dropdown-panel min-w-40 -translate-x-6 rounded-md bg-neutral-900/95 px-6 py-4 text-sm text-white shadow-xl ring-1 ring-black/40">
                          <ul>
                            {item.children.map((child) => (
                              <li key={child.href}>
                                <Link
                                  href={child.href}
                                  className="block whitespace-nowrap rounded py-1.5 text-white/90 no-underline transition hover:font-bold"
                                >
                                  {child.label}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    ) : null}
                  </li>
                ))}
              </ul>
            </nav>

            {/* Desktop utility hamburger (live keeps Contact behind it). */}
            <div className="relative hidden md:block">
              <button
                type="button"
                aria-label="Open utility menu"
                aria-expanded={utilityOpen}
                className="relative block size-6 cursor-pointer"
                onClick={() => setUtilityOpen((v) => !v)}
              >
                <span className="absolute left-0 top-0 h-[3px] w-6 bg-white" />
                <span className="absolute left-0 top-[11px] h-[3px] w-6 bg-white" />
                <span className="absolute left-0 top-[21px] h-[3px] w-6 bg-white" />
              </button>
              {utilityOpen ? (
                <div className="absolute right-0 top-full z-30 text-left normal-case">
                  <div className="min-w-48 rounded-md bg-neutral-900/95 px-6 py-4 text-sm text-white shadow-xl ring-1 ring-black/40">
                    <ul>
                      {utilityNav.map((item) => (
                        <li key={item.href}>
                          <Link
                            href={item.href}
                            className="block rounded py-1.5 text-white/90 no-underline transition hover:font-bold"
                            onClick={() => setUtilityOpen(false)}
                          >
                            {item.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ) : null}
            </div>

            <button
              type="button"
              aria-label="Open menu"
              className="relative block size-6 md:hidden"
              onClick={() => setMobileOpen((v) => !v)}
            >
              <span className="absolute left-0 top-0 h-[3px] w-6 bg-white" />
              <span className="absolute left-0 top-[11px] h-[3px] w-6 bg-white" />
              <span className="absolute left-0 top-[21px] h-[3px] w-6 bg-white" />
            </button>
          </div>

          {/* Mobile menu — full-screen charcoal slide-down panel, spec
            extracted from the live JS bundle (AUDIT R9-2). */}
          <div
            className={`fixed inset-0 z-[9999] text-white transition-[visibility] duration-300 md:hidden ${
              mobileOpen ? "visible" : "invisible"
            }`}
            aria-hidden={!mobileOpen}
          >
            <div
              id="mobile-nav-panel"
              role="dialog"
              aria-modal="true"
              aria-label="Mobile navigation menu"
              className={`absolute inset-0 flex max-h-svh flex-col justify-between gap-12 overflow-y-auto bg-charcoal px-4 pb-12 pt-6 transition-transform duration-300 ease-out ${
                mobileOpen ? "translate-y-0" : "-translate-y-full"
              }`}
            >
              <div className="sticky top-0 flex items-center justify-between">
                <button
                  type="button"
                  className="ml-auto text-white"
                  aria-label="Close menu"
                  onClick={() => setMobileOpen(false)}
                >
                  <svg
                    viewBox="0 0 24 24"
                    className="h-6 w-6"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <line x1="5" y1="5" x2="19" y2="19" />
                    <line x1="19" y1="5" x2="5" y2="19" />
                  </svg>
                </button>
              </div>

              <nav className="px-12">
                <ul className="border-t border-white/15">
                  {inlineNav.map((item) => {
                    const hasChildren =
                      item.children && item.children.length > 0;
                    if (!hasChildren) {
                      return (
                        <li
                          key={item.href}
                          className="border-b border-white/15"
                        >
                          <Link
                            href={item.href}
                            className="flex w-full items-center justify-between py-4 text-left text-base font-semibold uppercase"
                            onClick={() => setMobileOpen(false)}
                          >
                            <span>{item.label}</span>
                            <svg
                              viewBox="0 0 24 24"
                              className="h-4 w-4"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                            >
                              <polyline points="9 6 15 12 9 18" />
                            </svg>
                          </Link>
                        </li>
                      );
                    }
                    const open = mobileSection === item.label;
                    return (
                      <li key={item.href} className="border-b border-white/15">
                        <div className="flex items-center gap-4 py-4">
                          <Link
                            href={item.href}
                            className="flex-1 text-left text-2xl font-bold uppercase no-underline"
                            onClick={() => setMobileOpen(false)}
                          >
                            {item.label}
                          </Link>
                          <button
                            type="button"
                            aria-expanded={open}
                            aria-label={`Toggle ${item.label} submenu`}
                            className="flex text-white transition"
                            onClick={() =>
                              setMobileSection(open ? null : item.label)
                            }
                          >
                            <svg
                              viewBox="0 0 24 24"
                              className={`h-4 w-4 transition-transform duration-200 ${
                                open ? "rotate-180" : ""
                              }`}
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                            >
                              <polyline points="6 9 12 15 18 9" />
                            </svg>
                          </button>
                        </div>
                        <div
                          className={`overflow-hidden text-sm normal-case tracking-normal transition-[max-height,opacity] duration-300 ease-in-out ${
                            open ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                          }`}
                        >
                          <div className="flex flex-col gap-1.5 pb-4">
                            {item.children!.map((child) => (
                              <Link
                                key={child.href}
                                href={child.href}
                                className="block text-base text-white no-underline"
                                onClick={() => setMobileOpen(false)}
                              >
                                {child.label}
                              </Link>
                            ))}
                          </div>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </nav>

              {utilityNav.length > 0 ? (
                <div className="space-y-3 px-12 text-base">
                  {utilityNav.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="block text-lg text-white/80 transition hover:text-white"
                      onClick={() => setMobileOpen(false)}
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </header>
    </>
  );
}

export default Header;
