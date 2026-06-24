"use client";

import { useCallback, useEffect, useState } from "react";

type PendingLink = { href: string; target: string };

function isExternalHref(href: string, origin: string): boolean {
  if (
    !href ||
    href.startsWith("#") ||
    href.startsWith("mailto:") ||
    href.startsWith("tel:")
  ) {
    return false;
  }
  try {
    return new URL(href, origin).origin !== origin;
  } catch {
    return false;
  }
}

/**
 * Intercepts external anchor clicks site-wide and shows the live-site
 * "You are leaving PWRL.com" confirmation before navigation proceeds.
 */
export function ExternalLinkGuard() {
  const [pending, setPending] = useState<PendingLink | null>(null);
  const [shown, setShown] = useState(false);

  const close = useCallback(() => {
    setShown(false);
    setTimeout(() => setPending(null), 220);
  }, []);

  const proceed = useCallback(() => {
    if (!pending) return;
    const { href, target } = pending;
    close();
    if (target === "_blank") {
      window.open(href, "_blank", "noopener,noreferrer");
    } else {
      window.location.assign(href);
    }
  }, [close, pending]);

  useEffect(() => {
    if (!pending) return;
    const t = setTimeout(() => setShown(true), 20);
    return () => clearTimeout(t);
  }, [pending]);

  useEffect(() => {
    if (!pending) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [close, pending]);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0) return;
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;

      const anchor = (e.target as Element | null)?.closest(
        "a[href]",
      ) as HTMLAnchorElement | null;
      if (!anchor || anchor.dataset.externalBypass != null) return;

      const href = anchor.getAttribute("href");
      if (!href || !isExternalHref(href, window.location.origin)) return;

      e.preventDefault();
      setPending({
        href: anchor.href,
        target: anchor.target === "_blank" ? "_blank" : "_self",
      });
    };

    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, []);

  if (!pending) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="exit-link-title"
      className={`exit-overlay ${shown ? "open" : ""} fixed inset-0 z-[70] flex items-center justify-center p-6`}
    >
      <div
        className="scrim absolute inset-0 bg-black/75"
        onClick={close}
        aria-hidden
      />
      <div className="exit-dialog relative w-full max-w-[560px] rounded-2xl bg-[#1c1c1c] px-8 py-10 text-center shadow-2xl md:px-12 md:py-12">
        <h2
          id="exit-link-title"
          className="font-display text-[32px] font-light leading-[1.15] text-white md:text-[40px]"
        >
          You are leaving PWRL.com
        </h2>
        <p className="mx-auto mt-6 max-w-md font-[family-name:var(--font-franklin)] text-[14px] font-light leading-[1.5] text-white/70 md:text-[16px]">
          By clicking below you acknowledge that you are navigating away from
          PWRL.com. Please take note of Powerlaw&apos;s privacy policy, terms of
          use, and disclosures are not applicable for this site.
        </p>
        <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:justify-center sm:gap-4">
          <button
            type="button"
            onClick={close}
            className="mo-btn min-w-[140px] rounded-sm border border-white/20 bg-white px-8 py-3 font-[family-name:var(--font-franklin)] text-[14px] font-bold uppercase tracking-wide text-[#085CF0] transition hover:bg-white/95 md:text-[15px]"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={proceed}
            className="mo-btn min-w-[140px] rounded-sm bg-[#085CF0] px-8 py-3 font-[family-name:var(--font-franklin)] text-[14px] font-bold uppercase tracking-wide text-white transition hover:brightness-105 md:text-[15px]"
          >
            Proceed
          </button>
        </div>
      </div>
    </div>
  );
}

export default ExternalLinkGuard;
