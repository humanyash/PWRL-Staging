"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { renderRich } from "@/lib/rich";
import type { GlobalSettings } from "@/types/blocks";

/** Live utility/mobile menu icon — 24×24 SVG, stroke 1.8. */
function HamburgerIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
    >
      <path
        d="M4 7H20"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M4 12H20"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M4 17H20"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

/**
 * Fixed overlay header matching the live PWRL site (AUDIT.md R3-2/R3-3):
 *  - Banner: bg #085CF0, 20px, h-[44px], underlined link — pinned fixed
 *    at the top on the homepage so it never scrolls away; nav sits below it.
 *  - Nav row: gradient over the hero (`from-black via-black/65 to-transparent`);
 *    switches to solid black once scrolled past the hero. The row hides on
 *    scroll-down and returns on scroll-up (live translates the wrapper).
 *  - Links: The Fund, How to Trade, Investor Relations, Learn (primary row).
 *  - Our Vision + Contact live in the utility hamburger (Figma 2.0).
 */
export function Header({ settings }: { settings: GlobalSettings }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileSection, setMobileSection] = useState<string | null>(null);
  const [utilityOpen, setUtilityOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [pastHero, setPastHero] = useState(false);
  const lastY = useRef(0);
  const bannerRef = useRef<HTMLDivElement>(null);

  const pathname = usePathname();
  const showBanner = pathname === "/" && Boolean(settings.banner);

  /** True when the current page lives under `href` (exact or sub-path). */
  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(href + "/");

  /** Primary header row — everything except hamburger-only items. */
  const UTILITY_NAV_LABELS = new Set(["Our Vision", "Contact"]);
  const primaryNav = settings.nav.filter((n) => !UTILITY_NAV_LABELS.has(n.label));
  const utilityNav = settings.nav.filter((n) => UTILITY_NAV_LABELS.has(n.label));
  useEffect(() => {
    const root = document.documentElement;
    if (!showBanner || !bannerRef.current) {
      root.style.setProperty("--pwrl-site-banner-h", "0px");
      return;
    }
    const el = bannerRef.current;
    const sync = () =>
      root.style.setProperty("--pwrl-site-banner-h", `${el.offsetHeight}px`);
    sync();
    const observer = new ResizeObserver(sync);
    observer.observe(el);
    return () => {
      observer.disconnect();
      root.style.setProperty("--pwrl-site-banner-h", "0px");
    };
  }, [showBanner]);

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

  // Gradient over the hero at the top; solid black once the hero scrolls away.
  useEffect(() => {
    const hero = document.querySelector("[data-mo-hero]");
    if (!hero) {
      setPastHero(true);
      return;
    }

    setPastHero(false);
    const observer = new IntersectionObserver(
      ([entry]) => setPastHero(!entry.isIntersecting),
      { threshold: 0 },
    );
    observer.observe(hero);
    return () => observer.disconnect();
  }, [pathname]);

  return (
    <>
      {/* Masthead + nav stack in one fixed column so nav always sits below the banner. */}
      <div className="fixed inset-x-0 top-0 z-50">
        {showBanner && settings.banner ? (
          <div
            ref={bannerRef}
            className="relative z-[60] flex h-[44px] items-center justify-center bg-[#085CF0] text-center text-[16px] text-white md:text-[20px]"
          >
            <div className="px-2 [&_p]:my-0">
              {settings.banner.href ? (
                <a
                  href={settings.banner.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-[family-name:var(--font-franklin)] font-normal text-white no-underline hover:text-white"
                >
                  {renderRich(settings.banner.text)}
                </a>
              ) : (
                <span>{renderRich(settings.banner.text)}</span>
              )}
            </div>
          </div>
        ) : null}

        <header className="site-header text-white">
        <div
          className={`transition-transform duration-300 ease-out will-change-transform ${
            hidden ? "-translate-y-full" : "translate-y-0"
          }`}
        >
          <div
            className={`flex items-center justify-between p-4 transition-colors duration-300 md:px-8 ${
              pastHero
                ? "bg-black"
                : "bg-gradient-to-b from-black via-black/65 via-50% to-black/0"
            }`}
          >
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
                {primaryNav.map((item) => (
                  <li
                    key={item.href}
                    className="mo-dropdown-parent group relative"
                  >
                    <Link
                      href={item.href}
                      className="inline-block py-2 no-underline"
                    >
                      {/* Invisible bold copy reserves width; visible copy
                        bolds on hover/active without layout shift (live trick). */}
                      <span className="relative inline-block whitespace-nowrap tracking-wide transition-colors">
                        <span className="invisible font-bold">
                          {item.label}
                        </span>
                        <span
                          className={`absolute inset-0 text-white group-hover:font-bold ${
                            isActive(item.href) ? "font-bold" : ""
                          }`}
                        >
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

            {/* Desktop utility hamburger — Our Vision + Contact (Figma 2.0). */}
            <div className="relative hidden md:block">
              <button
                type="button"
                aria-label="Open utility menu"
                aria-expanded={utilityOpen}
                className="flex cursor-pointer items-center justify-center rounded-full text-white"
                onClick={() => setUtilityOpen((v) => !v)}
              >
                <HamburgerIcon />
              </button>
              {utilityOpen ? (
                <div className="absolute right-0 top-full z-30 text-left normal-case">
                  <div className="min-w-48 rounded-md bg-neutral-900/95 px-6 py-4 text-sm text-white shadow-xl ring-1 ring-black/40">
                    <ul className="space-y-1">
                      {utilityNav.map((item) => (
                        <li key={item.href}>
                          <Link
                            href={item.href}
                            className="block rounded py-1.5 font-semibold uppercase tracking-wide text-white/90 no-underline transition hover:font-bold"
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
              className="flex items-center justify-center rounded-full text-white md:hidden"
              onClick={() => setMobileOpen((v) => !v)}
            >
              <HamburgerIcon className="h-6 w-6" />
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
                  {primaryNav.map((item) => {
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
                            className={`flex w-full items-center justify-between py-4 text-left text-base uppercase ${isActive(item.href) ? "font-bold" : "font-semibold"}`}
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
                            className={`flex-1 text-left text-2xl uppercase no-underline ${isActive(item.href) ? "font-extrabold" : "font-bold"}`}
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
      </div>
    </>
  );
}

export default Header;
