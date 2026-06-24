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
      className={`exit-overlay ${shown ? "open" : ""} fixed inset-0 z-[70] flex items-center justify-center px-6 py-10`}
    >
      <div
        className="scrim absolute inset-0 bg-black/80"
        onClick={close}
        aria-hidden
      />
      <div className="exit-dialog relative w-full max-w-[640px] rounded-[20px] bg-charcoal px-10 py-12 text-center md:px-14 md:py-14">
        <h2 id="exit-link-title" className="exit-dialog__title">
          You are leaving PWRL.com
        </h2>
        <p className="exit-dialog__body">
          By clicking below you acknowledge that you are navigating away from
          PWRL.com. Please take note of Powerlaw&apos;s privacy policy, terms of
          use, and disclosures are not applicable for this site.
        </p>
        <div className="exit-dialog__actions">
          <button type="button" onClick={close} className="exit-dialog__cancel">
            Cancel
          </button>
          <button
            type="button"
            onClick={proceed}
            className="exit-dialog__proceed"
          >
            Proceed
          </button>
        </div>
      </div>
    </div>
  );
}

export default ExternalLinkGuard;
