import { renderRich } from "@/lib/rich";
import { moStyle } from "@/lib/motion";
import type { TimelineBlock } from "@/types/blocks";

/**
 * Timeline ("A History of Firsts") — rebuilt from the live DOM + Figma
 * frame 1:139 (AUDIT.md R3-8).
 *
 * Live structure:
 *   - section: `pt-23 pb-17 relative overflow-hidden bg-gray-100`
 *   - heading container: max-w-6xl px-4; h2 40/64; intro p1 (24px) light
 *     leading-snug black, max-w-2xl, mt-7
 *   - collage: mt-10, full-bleed `w-screen overflow-x-auto` wrapper, inner
 *     `width:max(100vw,1400px)`, grid rows 230px/400px/230px (860 total);
 *     the beam image object-cover fills the middle row; cards are absolute
 *     `<article>`s with live's exact inline left/width/top, padding 24px,
 *     inner max-w-85 (382px); titles franklin bold 24px black, bodies 18px
 *     light leading-relaxed with <b> spans.
 *   - years/caption/connector lines are a client-side overlay on live (the
 *     static HTML ships an empty z-20 target); geometry taken from Figma:
 *     3px #B0E9FD verticals at each card's left edge, 48px IvyPresto white
 *     years (all equal size), bold-italic 18px caption above 2026.
 */

const CARDS_TOP = [
  { left: "6.8%", width: "31.7%", top: 110 },
  { left: "38.5%", width: "31.5%", top: 30 },
  { left: "70%", width: "30%", top: 0 },
];
const CARDS_BOTTOM = [
  { left: "22.7%", width: "31.8%", top: -50 },
  { left: "54.5%", width: "45.5%", top: 0 },
];

/** Figma 1:178–1:182, converted to grid-space px (grid top = beam top − 230). */
const LINES = [
  { left: "6.8%", top: 177, height: 286 },
  { left: "38.5%", top: 86, height: 377 },
  { left: "70%", top: 59, height: 404 },
  { left: "22.7%", top: 431, height: 323 },
  { left: "calc(54.5% - 2px)", top: 431, height: 335 },
];

/** Year anchor = ascending connector-line x (live adds +24px inline). */
const YEAR_LEFTS = ["6.8%", "22.7%", "38.5%", "calc(54.5% - 2px)", "70%"];

function Card({
  entry,
  pos,
  index,
}: {
  entry: TimelineBlock["entries"][number];
  pos: { left: string; width: string; top: number };
  index: number;
}) {
  return (
    <article
      className="tl-card absolute p-6"
      data-mo=""
      style={{
        left: pos.left,
        width: pos.width,
        top: pos.top,
        bottom: 0,
        ...moStyle({ "--mo-i": index }),
      }}
    >
      <div className="max-w-[382px]">
        <p className="font-[family-name:var(--font-franklin)] text-[24px] font-bold text-black">
          {entry.title}
        </p>
        <div className="leading-relaxed">
          <p className="font-[family-name:var(--font-franklin)] text-[18px] font-light text-[#242424]">
            {renderRich(entry.body)}
          </p>
        </div>
      </div>
    </article>
  );
}

export function Timeline({ block }: { block: TimelineBlock }) {
  const years = block.years ?? [];

  return (
    <section
      id="history"
      // Live: pt-23 pb-17 — with the 18px root these compute to 103.5/76.5px.
      className="relative overflow-hidden bg-ice pb-17 pt-23"
    >
      <div className="mx-auto w-full max-w-6xl px-4">
        <h2
          className="font-display text-[40px] font-light leading-[1.1] text-charcoal md:text-[64px]"
          data-mo=""
        >
          {block.heading}
        </h2>
        {block.intro ? (
          <div
            className="mt-7 max-w-2xl"
            data-mo=""
            style={moStyle({ "--mo-i": 1 })}
          >
            <p className="font-[family-name:var(--font-franklin)] text-[18px] font-light leading-snug text-black md:text-[24px]">
              {block.intro}
            </p>
          </div>
        ) : null}
      </div>

      {/* Live renders ONE collage at every width: the 1400px-min grid
          horizontally scrolls on mobile (overflow-x-auto) — there is no
          stacked variant (AUDIT R9). */}
      <div className="mt-10">
        <div className="relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] w-screen overflow-x-auto">
          <div className="relative" style={{ width: "max(100vw, 1400px)" }}>
            <div
              className="grid"
              style={{ height: 860, gridTemplateRows: "230px 400px 230px" }}
            >
              <div className="relative">
                <div className="absolute inset-0">
                  {CARDS_TOP.map((pos, i) =>
                    block.entries[i] ? (
                      <Card
                        key={i}
                        entry={block.entries[i]}
                        pos={pos}
                        index={i}
                      />
                    ) : null,
                  )}
                </div>
              </div>

              <div className="relative overflow-visible">
                {block.backgroundGraphic ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={block.backgroundGraphic}
                    alt="Timeline ribbon"
                    className="absolute inset-0 z-10 h-full w-full object-cover"
                    data-mo="fade"
                  />
                ) : null}
                {/* E1 — one soft-light sheen sweeps the beam on reveal. */}
                <span
                  className="beam-sweep"
                  data-mo="fade"
                  style={moStyle({ "--mo-d": "0ms" })}
                  aria-hidden="true"
                />
              </div>

              <div className="relative">
                <div className="absolute inset-0">
                  {CARDS_BOTTOM.map((pos, i) =>
                    block.entries[i + 3] ? (
                      <Card
                        key={i}
                        entry={block.entries[i + 3]}
                        pos={pos}
                        index={i + 3}
                      />
                    ) : null,
                  )}
                </div>
              </div>
            </div>

            {/* Overlay: connector lines + years + caption (Figma geometry;
                live hydrates these into an empty z-20 target). */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 z-20"
            >
              {LINES.map((l, i) => (
                <span
                  key={i}
                  className="tl-line absolute w-[3px] bg-[#B0E9FD]"
                  data-mo="draw"
                  style={{
                    left: l.left,
                    top: l.top,
                    height: l.height,
                    ...moStyle({ "--mo-i": i, "--mo-d": "200ms" }),
                  }}
                />
              ))}
              {/* Live JS truth (R10-3): years 32px (40px for the last) at
                  top 55%, left = connector x + 24px, ls .02em. */}
              {years.map((year, i, arr) => (
                <span
                  key={year}
                  className="absolute whitespace-nowrap font-display font-light text-white"
                  style={{
                    left: `calc(${YEAR_LEFTS[i] ?? `${8 + i * 16}%`} + 24px)`,
                    top: "55%",
                    transform: "translateY(calc(-50% - 25px))",
                    fontSize: i === arr.length - 1 ? 40 : 32,
                    letterSpacing: "0.02em",
                    lineHeight: 1,
                  }}
                >
                  {/* Inner span carries the reveal so the rise-and-scale
                      pre-state never fights the positional translateY. */}
                  <span
                    className="tl-year inline-block"
                    data-mo="fade"
                    style={moStyle({ "--mo-i": i, "--mo-d": "350ms" })}
                  >
                    {year}
                  </span>
                </span>
              ))}
              {block.beamCaption ? (
                <p
                  className="absolute max-w-[340px] text-sm font-semibold italic text-white/90"
                  style={{
                    left: `calc(${YEAR_LEFTS[4] ?? "71.4%"} + 24px)`,
                    top: "42%",
                    transform: "translateY(-50%)",
                  }}
                >
                  <span
                    className="inline-block"
                    data-mo="fade"
                    style={moStyle({ "--mo-i": 5, "--mo-d": "350ms" })}
                  >
                    {block.beamCaption}
                  </span>
                </p>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Timeline;
