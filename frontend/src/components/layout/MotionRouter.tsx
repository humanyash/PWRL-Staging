"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

declare global {
  interface Window {
    PWRLMotion?: {
      init: (opts?: Record<string, unknown>) => void;
      set: (opts: Record<string, unknown>) => void;
      replay: () => void;
      state: { enabled: boolean };
    };
  }
}

/**
 * Next.js adapter for the kinetic layer (handoff README, "Next.js-specific
 * notes"). pwrl-motion.js skips its own full-page exit interception when
 * <html data-mo-router> is set (see the repo patch in public/pwrl-motion.js);
 * this component supplies the App Router equivalent:
 *  - veil on internal link clicks (same eligibility rules as the stock
 *    bindTransitions, but Next's client routing keeps working underneath),
 *  - on pathname change: PWRLMotion.init() re-indexes staggers/re-observes
 *    the new DOM, then the veil lifts into the arrival sequence.
 */
export function MotionRouter() {
  const pathname = usePathname();
  const veil = useRef<HTMLDivElement | null>(null);
  const first = useRef(true);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const mo = window.PWRLMotion;
      const html = document.documentElement;
      if (!mo?.state.enabled || html.hasAttribute("data-mo-reduced")) return;
      if (e.defaultPrevented || e.button !== 0) return;
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as Element | null)?.closest?.("a[href]");
      if (
        !a ||
        a.getAttribute("target") === "_blank" ||
        a.hasAttribute("download")
      )
        return;
      let url: URL;
      try {
        url = new URL((a as HTMLAnchorElement).href, location.href);
      } catch {
        return;
      }
      if (url.origin !== location.origin) return; // external
      if (url.pathname === location.pathname) return; // in-page anchor
      const v = document.createElement("div");
      v.className = "mo-veil";
      v.style.opacity = "0";
      document.body.appendChild(v);
      requestAnimationFrame(() =>
        requestAnimationFrame(() => {
          v.style.opacity = "1";
        }),
      );
      veil.current = v;
      // Safety: if routing stalls or is cancelled, never trap the user.
      setTimeout(() => {
        if (veil.current === v) {
          veil.current = null;
          v.style.opacity = "0";
          setTimeout(() => v.remove(), 400);
        }
      }, 1800);
    };
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, []);

  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    window.PWRLMotion?.init();
    const v = veil.current;
    veil.current = null;
    if (v) {
      requestAnimationFrame(() =>
        requestAnimationFrame(() => {
          v.style.opacity = "0";
        }),
      );
      setTimeout(() => v.remove(), 700);
    }
  }, [pathname]);

  return null;
}

export default MotionRouter;
