import { Container } from "@/components/ui/Container";
import { CTA } from "@/components/ui/CTA";
import { HeroRotator } from "@/components/blocks/HeroRotator";
import { renderRich } from "@/lib/rich";
import { moStyle } from "@/lib/motion";
import type { HeroBlock } from "@/types/blocks";

/**
 * Hero — full-bleed banner matching the live PWRL home (/pwrl):
 *  - section: lg:min-h-[785px] pt-43 pb-19 lg:pt-68 lg:pb-29
 *  - h1: text-white font-light relative (sizes from global h1 rule)
 *  - body + CTA inside hero-wysiwyg / rich-cta pt-6
 */
export function Hero({ block }: { block: HeroBlock }) {
  const hasVideo = Boolean(block.backgroundVideo);
  const hasImage = !hasVideo && Boolean(block.backgroundImage?.src);
  const onDark = hasVideo || hasImage;
  const rotator =
    block.headlinePrefix &&
    block.headlineSuffixes &&
    block.headlineSuffixes.length > 0;

  const sectionSpacing = block.compact
    ? "min-h-[300px] pb-[108px] pt-[166.5px] md:min-h-[415px] lg:pb-[83px] lg:pt-[225px]"
    : "pb-19 pt-43 lg:pb-29 lg:pt-68 lg:min-h-[785px] xl:min-h-[785px]";

  return (
    <section
      data-mo-hero=""
      className={`relative overflow-hidden ${sectionSpacing} ${
        onDark ? "text-white" : "bg-ice text-charcoal"
      }`}
    >
      {hasVideo || hasImage ? (
        <div className="mo-settle absolute inset-0 z-0">
          {hasVideo ? (
            <video
              className="mo-parallax absolute inset-0 h-full w-full object-cover"
              src={block.backgroundVideo!}
              autoPlay
              loop
              muted
              playsInline
              aria-hidden
            />
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={block.backgroundImage!.src}
              alt={block.backgroundImage!.alt}
              className="mo-parallax absolute inset-0 h-full w-full object-cover"
            />
          )}
        </div>
      ) : null}

      <Container className="relative z-20 mt-[50px] flex flex-col justify-center !px-4">
        {block.eyebrow ? (
          <p
            className={`mb-5 text-xs font-semibold uppercase tracking-[0.2em] ${
              onDark ? "text-white/70" : "text-charcoal/55"
            }`}
          >
            {block.eyebrow}
          </p>
        ) : null}

        {rotator ? (
          <h1
            className="mo-arrive relative font-light text-white"
            style={moStyle({ "--mo-arrive-d": "150ms" })}
          >
            <HeroRotator
              slides={block.headlineSlides ?? []}
              prefix={block.headlinePrefix!}
              suffixes={block.headlineSuffixes!}
            />
          </h1>
        ) : (
          <h1 className="relative font-light text-white">
            <span className="mo-mask">
              <span className="mo-line" style={moStyle({ "--mo-i": 0 })}>
                {block.heading}
              </span>
            </span>
          </h1>
        )}

        {block.subheading && block.subheading !== block.heading ? (
          <p className="font-display text-[55px] font-light leading-[1.3] xl:text-[90px]">
            <span className="mo-mask">
              <span className="mo-line" style={moStyle({ "--mo-i": 1 })}>
                {renderRich(block.subheading)}
              </span>
            </span>
          </p>
        ) : null}

        {block.body?.length || (block.ctas && block.ctas.length > 0) ? (
          <div
            className={`hero-wysiwyg [&_h1]:font-light [&>p:first-child]:mt-[8px] max-w-240 leading-8 ${
              onDark ? "hero-wysiwyg--on-dark" : "text-charcoal/80"
            }`}
            data-mo=""
            style={moStyle({ "--mo-d": "380ms" })}
          >
            {block.body?.map((p, i) => (
              <p key={i}>{renderRich(p)}</p>
            ))}

            {block.ctas && block.ctas.length > 0 ? (
              <div
                className="rich-cta mt-[30px] pt-6"
                data-mo=""
                style={moStyle({ "--mo-d": "540ms" })}
              >
                {block.ctas.map((cta) => (
                  <CTA key={cta.href} cta={cta} />
                ))}
              </div>
            ) : null}
          </div>
        ) : null}
      </Container>
    </section>
  );
}

export default Hero;
