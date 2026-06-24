/**
 * HeroRotator — the live home-hero headline cycle, reproduced with pure CSS
 * (no JS timers). Live mechanics, probed from the production DOM:
 *
 *   27s master cycle, six 4.5s slots sharing one `hero-slide` keyframe
 *   (rise in over ~0.4s → hold ~4s → exit upward):
 *     slot 0   (delay 0s)     "Powerlaw Corp."
 *     slots 1–4 (4.5s–22.5s)  static "Only for" prefix (own `hero-prefix`
 *                             keyframe spanning the whole window) while the
 *                             suffixes rotate: delays 4.5 / 9 / 13.5 / 18s
 *     slot 5   (delay 22.5s)  "Nasdaq: PWRL"
 *
 *   Layout: an invisible spacer reserves the tallest line; suffixes stack
 *   below the prefix on mobile and sit beside it (pl-4) from xl up.
 */
export function HeroRotator({
  slides,
  prefix,
  suffixes,
}: {
  slides: string[];
  prefix: string;
  suffixes: string[];
}) {
  const slotSeconds = 4.5;
  const longestSuffix = suffixes.reduce(
    (a, b) => (a.length >= b.length ? a : b),
    "",
  );
  // Standalone slides occupy the first and last slots (live: 0s and 22.5s).
  const slideDelays = [0, (suffixes.length + 1) * slotSeconds];

  return (
    <span className="relative block">
      {/* Invisible spacer — reserves the tallest layout (prefix + suffix). */}
      <span aria-hidden className="invisible flex flex-col xl:flex-row">
        <span className="shrink-0">{prefix}</span>
        <span className="xl:pl-4">{longestSuffix}</span>
      </span>

      {/* Standalone slides */}
      {slides.map((slide, i) => (
        <span
          key={slide}
          className="hero-anim absolute left-0 top-0 block opacity-0 will-change-[transform,opacity]"
          style={{
            animationName: "hero-slide",
            animationDelay: `${slideDelays[i] ?? 0}s`,
          }}
        >
          {slide}
        </span>
      ))}

      {/* Static prefix + rotating suffixes */}
      <span className="absolute left-0 top-0 flex w-full flex-col xl:flex-row">
        <span
          className="hero-anim shrink-0 opacity-0 will-change-[transform,opacity]"
          style={{ animationName: "hero-prefix" }}
        >
          {prefix}
        </span>
        <span className="relative min-w-0 flex-1 xl:pl-4">
          <span aria-hidden className="invisible block">
            {longestSuffix}
          </span>
          {suffixes.map((suffix, i) => (
            <span
              key={suffix}
              className="hero-anim absolute left-0 top-0 block opacity-0 will-change-[transform,opacity] xl:pl-4"
              style={{
                animationName: "hero-slide",
                animationDelay: `${(i + 1) * slotSeconds}s`,
              }}
            >
              {suffix}
            </span>
          ))}
        </span>
      </span>
    </span>
  );
}

export default HeroRotator;
