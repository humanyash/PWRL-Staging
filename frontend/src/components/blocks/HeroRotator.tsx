/**
 * HeroRotator — the live home-hero headline cycle, reproduced with pure CSS
 * (no JS timers). Markup matches the production DOM (grid spacer, slide
 * delays, prefix/suffix layout) so positioning aligns with powerlawfunds.com.
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
  const slideDelays = [0, (suffixes.length + 1) * slotSeconds];

  return (
    <>
      {/* Invisible grid — reserves the tallest line across every slide state. */}
      <span aria-hidden className="invisible grid">
        {slides.map((slide) => (
          <span key={slide} className="col-start-1 row-start-1 block">
            {slide}
          </span>
        ))}
        {suffixes.map((suffix) => (
          <span
            key={suffix}
            className="col-start-1 row-start-1 flex flex-col xl:flex-row"
          >
            <span className="shrink-0">{prefix}</span>
            <span className="xl:pl-4">{suffix}</span>
          </span>
        ))}
      </span>

      {/* Standalone slides (first + last slots). */}
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

      {/* Static prefix + rotating suffixes. */}
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
    </>
  );
}

export default HeroRotator;
