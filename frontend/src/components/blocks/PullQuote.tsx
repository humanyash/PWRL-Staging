import { CTA } from "@/components/ui/CTA";
import { moStyle } from "@/lib/motion";
import { renderLines } from "@/lib/rich";
import type { PullQuoteBlock } from "@/types/blocks";

/**
 * PullQuote — ported from the live quote panel (AUDIT.md R3-7):
 *   <div class="relative overflow-hidden bg-black bg-center bg-no-repeat
 *               bg-cover md:aspect-3/1 flex flex-col justify-center py-20">
 * Slides crossfade behind a `from-blue-400 to-blue-500 opacity-90
 * mix-blend-hard-light` gradient overlay (z-10); content sits at z-20.
 * The quote is a plain h2 (40/63, light, NO quotation marks) in a
 * max-w-[1627px] text-balance container; CTA = mint compact, mt-[46px].
 */
export function PullQuote({ block }: { block: PullQuoteBlock }) {
  const slides = block.backgroundSlides ?? [];

  return (
    <section className="pullquote relative flex flex-col justify-center overflow-hidden bg-black py-20 md:aspect-[3/1]">
      {/* Live: 8 full-bleed variants crossfading (1s ease) behind the quote.
          A static copy of slide 1 sits underneath so the panel is never
          black during the animation's start-up gap (AUDIT.md E). */}
      {slides.length > 0 ? (
        <div aria-hidden className="quote-stack mo-kenwrap absolute inset-0">
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url(${slides[0]})` }}
          />
          {slides.map((src, i) => (
            <div
              key={src}
              className="quote-slide absolute inset-0 bg-cover bg-center bg-no-repeat"
              style={{
                backgroundImage: `url(${src})`,
                animationDelay: `${i * 4}s`,
                animationDuration: `${slides.length * 4}s`,
              }}
            />
          ))}
        </div>
      ) : null}
      {slides.length === 0 && block.backgroundImage?.src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={block.backgroundImage.src}
          alt={block.backgroundImage.alt}
          className="absolute inset-0 h-full w-full object-cover"
          aria-hidden
        />
      ) : null}
      {/* AUDIT R3-7: live overlay is a blue gradient at hard-light, not a
          flat multiply — this is what produces the brand-blue duotone. */}
      {slides.length > 0 || block.backgroundImage?.src ? (
        <div
          aria-hidden
          className="absolute inset-0 z-10 bg-gradient-to-b from-[#0023EC] to-[#000A96] opacity-90 mix-blend-hard-light"
        />
      ) : null}

      <blockquote className="relative z-20 mx-auto flex w-full max-w-[2344px] flex-col items-center px-6 text-center">
        <h2
          className="w-full max-w-none text-balance font-display text-[40px] font-light leading-[1.1] text-white md:text-[64px] md:leading-[76.8px]"
          data-mo="fade"
        >
          {renderLines(block.quote)}
        </h2>
        {block.subheading ? (
          <p
            className="mt-6 max-w-[860px] font-[family-name:var(--font-franklin)] text-[17px] font-normal leading-[1.4] text-white md:text-[18px] md:leading-[25.2px]"
            data-mo=""
            style={moStyle({ "--mo-i": 1 })}
          >
            {renderLines(block.subheading)}
          </p>
        ) : null}
        {block.cta ? (
          <div
            className="mt-[46px] flex w-full justify-center"
            data-mo=""
            style={moStyle({ "--mo-i": 1 })}
          >
            <CTA cta={block.cta} compact />
          </div>
        ) : null}
      </blockquote>
    </section>
  );
}

export default PullQuote;
