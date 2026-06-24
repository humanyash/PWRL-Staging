import { Section } from "@/components/ui/Section";
import { SectorWheel } from "@/components/ui/SectorWheel";
import { AnimatedSphere } from "@/components/ui/AnimatedSphere";
import { renderRich } from "@/lib/rich";
import { countup, moStyle } from "@/lib/motion";
import type { PhilosophyBlock } from "@/types/blocks";

/**
 * Philosophy — live /vision "We believe venture capital wisdom should be
 * available to everyone." (AUDIT.md R4-4). Live panel reuses the homepage
 * quote-slideshow treatment, inset in the container:
 *   `relative overflow-hidden bg-black rounded-xl text-center text-white
 *    p-8 md:aspect-3/1 flex flex-col justify-center`
 * with the 8 crossfading variants + `from-blue-400 to-blue-500 opacity-90
 * mix-blend-hard-light` overlay (z-10); content z-20 in lg:max-w-[80%]:
 * h2 40/64 leading-[1.2] + Franklin font-medium 16/20 paragraph.
 */
export function Philosophy({ block }: { block: PhilosophyBlock }) {
  // "band": live /fund Investment Strategy / Investment Process
  // (AUDIT R5-6/7): py-15 md:py-18 px-2, two-column grid items-center;
  // text = .p2 (16/20) light black with [&_p]:my-4 and h2 pb-1; the other
  // column holds a graphic — the animated sector wheel (graphic-left,
  // 8fr/12fr) or the dotted sphere + blue caption (graphic-right,
  // 10fr/10fr, md:ml-12 md:self-start md:mt-20).
  if (block.variant === "band") {
    const wheel = block.graphic === "sector-wheel";
    const sphere = block.graphic === "dotted-sphere";
    const tone = block.tone === "light" ? "light" : "ice";

    const text = (
      <div
        className={`text-left ${wheel ? "md:order-2" : "md:order-1"}`}
        data-mo-stagger=""
      >
        <div className="font-light leading-relaxed text-black [&_p]:my-4">
          <h2
            className="pb-1 font-display text-[40px] font-light leading-[1.1] md:text-[64px]"
            data-mo=""
          >
            {block.heading}
          </h2>
          {block.paragraphs.map((p, i) => (
            <p
              key={i}
              className="font-[family-name:var(--font-franklin)] text-[16px] leading-[1.4] md:text-[20px]"
              data-mo=""
            >
              {p}
            </p>
          ))}
        </div>
      </div>
    );

    return (
      <Section
        tone={tone}
        id={block.anchor ?? "investment_strategy"}
        className="!py-[67.5px] md:!py-[81px]"
      >
        <div
          className={`grid items-center gap-10 ${
            wheel ? "md:grid-cols-[8fr_12fr]" : "md:grid-cols-[10fr_10fr]"
          }`}
        >
          {text}
          {wheel ? (
            <div className="md:order-1">
              <div className="flex flex-col items-center">
                <SectorWheel />
              </div>
            </div>
          ) : sphere ? (
            <div className="md:order-2 md:ml-12 md:mt-20 md:self-start">
              <div className="flex flex-col items-center">
                {block.graphicCaption ? (
                  <div
                    className="mb-6 text-center font-[family-name:var(--font-franklin)] text-[18px] font-light leading-6 tracking-[0.1em] text-[#0023EC] md:text-[24px]"
                    data-mo=""
                  >
                    <p className="m-0 max-w-[540px]">
                      {/* E5 — the 97% counts up on reveal. renderRich output
                          keeps its markers; countup only wraps plain text. */}
                      {typeof block.graphicCaption === "string" &&
                      !block.graphicCaption.includes("**")
                        ? countup(block.graphicCaption)
                        : renderRich(block.graphicCaption)}
                      <sup>1</sup>
                    </p>
                  </div>
                ) : null}
                <div className="flex w-full justify-center">
                  {/* Live animates this build client-side (AUDIT R10-2). */}
                  <AnimatedSphere revealDelayMs={200} />
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </Section>
    );
  }

  const slides = block.backgroundSlides ?? [];

  return (
    <Section tone="light" id="strategy" className="!py-8">
      <div className="relative flex flex-col justify-center overflow-hidden rounded-xl bg-black p-8 text-center text-white md:aspect-[3/1]">
        {/* Static base slide so the panel is never black at t=0. */}
        {slides.length > 0 ? (
          <div
            aria-hidden
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url(${slides[0]})` }}
          />
        ) : null}
        {slides.map((src, i) => (
          <div
            key={src}
            aria-hidden
            className="quote-slide absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: `url(${src})`,
              animationDelay: `${i * 4}s`,
              animationDuration: `${slides.length * 4}s`,
            }}
          />
        ))}
        {slides.length > 0 ? (
          <div
            aria-hidden
            className="absolute inset-0 z-10 bg-gradient-to-b from-[#0023EC] to-[#000A96] opacity-90 mix-blend-hard-light"
          />
        ) : null}

        <div className="relative z-20 mx-auto lg:max-w-[80%]">
          <h2
            className="font-display text-[40px] font-light leading-[1.2] md:text-[64px]"
            data-mo=""
          >
            {block.heading}
          </h2>

          {block.subheading ? (
            <p className="mx-auto mt-6 max-w-2xl font-display text-xl font-light text-white/85 md:text-2xl">
              {block.subheading}
            </p>
          ) : null}

          {/* Live panel copy: Franklin font-medium, p2 (16 → 20 at xl). */}
          <div
            className="mx-auto mt-6 space-y-5 font-[family-name:var(--font-franklin)] text-[16px] font-medium leading-[1.4] text-white xl:text-[20px]"
            data-mo=""
            style={moStyle({ "--mo-i": 1 })}
          >
            {block.paragraphs.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        </div>
      </div>
    </Section>
  );
}

export default Philosophy;
