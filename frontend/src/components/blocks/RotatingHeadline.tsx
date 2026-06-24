"use client";

import { useEffect, useState } from "react";

/**
 * Animated rotating headline — crossfades through phrases, matching the live
 * PWRL hero ("Only for big thinkers." → "Mars seekers." → …).
 *
 * All phrases are stacked absolutely; only the active one is at full opacity.
 * On each tick the outgoing phrase fades out while the incoming fades in
 * simultaneously, so the headline is *never* fully empty between phrases.
 * The longest phrase renders invisibly underneath to reserve stable height so
 * the surrounding layout never shifts. Respects `prefers-reduced-motion` by
 * holding the first phrase.
 */
export function RotatingHeadline({
  phrases,
  className = "",
  intervalMs = 2600,
}: {
  phrases: string[];
  className?: string;
  intervalMs?: number;
}) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (phrases.length <= 1) return;
    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;

    const id = setInterval(
      () => setIndex((i) => (i + 1) % phrases.length),
      intervalMs,
    );
    return () => clearInterval(id);
  }, [phrases, intervalMs]);

  const longest = phrases.reduce((a, b) => (a.length >= b.length ? a : b), "");

  return (
    <span className={`relative inline-block ${className}`}>
      {/* Invisible spacer reserves height for the tallest phrase */}
      <span aria-hidden className="invisible block">
        {longest}
      </span>
      {phrases.map((phrase, i) => (
        <span
          key={phrase}
          aria-hidden={i !== index}
          className={`absolute inset-0 block transition-opacity duration-700 ease-out ${
            i === index ? "opacity-100" : "opacity-0"
          }`}
        >
          {phrase}
        </span>
      ))}
    </span>
  );
}

export default RotatingHeadline;
