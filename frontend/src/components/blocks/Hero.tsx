import { Container } from "@/components/ui/Container";
import { CTA } from "@/components/ui/CTA";
import { HeroRotator } from "@/components/blocks/HeroRotator";
import { renderRich } from "@/lib/rich";
import { moStyle } from "@/lib/motion";
import type { HeroBlock } from "@/types/blocks";

/**
 * Hero — full-bleed banner. When a background image exists it sits behind a
 * navy scrim (matching the live image-hero treatment); otherwise it renders on
 * the ice background.
 *
 * Headline logic mirrors the live site:
 *  - headlinePrefix/Suffixes/Slides → the live home rotator (static "Only
 *    for" + animated tail, plus standalone slides), via HeroRotator.
 *  - otherwise → static `heading`, with optional `subheading` beneath.
 * Live h1 typography: 90px desktop, weight 300, normal style, lh 1.3.
 */
export function Hero({ block }: { block: HeroBlock }) {
  const hasVideo = Boolean(block.backgroundVideo);
  const hasImage = !hasVideo && Boolean(block.backgroundImage?.src);
  const onDark = hasVideo || hasImage;
  const rotator =
    block.headlinePrefix &&
    block.headlineSuffixes &&
    block.headlineSuffixes.length > 0;

  return (
    <section
      data-mo-hero=""
      className={`relative overflow-hidden ${
        onDark ? "bg-navy text-white" : "bg-ice text-charcoal"
      }`}
    >
      {/* AUDIT R4-1: live's hero overlay div is EMPTY — the imagery already
          carries its blue treatment, so no scrim is layered on top. */}
      {hasVideo || hasImage ? (
        <div className="mo-settle absolute inset-0">
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

      {/* Live hero spacing: standard pages = pt-43 pb-19 lg:pt-68 lg:pb-29
          (xl:min-h-[730px]); compact (/investor-relations, /contact) =
          ~225/83px desktop with min-h 300–415px. The top padding clears the
          fixed overlay header in both cases. */}
      <Container
        className={
          block.compact
            ? "relative min-h-[300px] pb-[108px] pt-[166.5px] md:min-h-[415px] lg:pb-[83px] lg:pt-[225px]"
            : "relative pb-19 pt-43 lg:pb-29 lg:pt-68 xl:min-h-[730px]"
        }
      >
        <div>
          {block.eyebrow ? (
            <p
              className={`mb-5 text-xs font-semibold uppercase tracking-[0.2em] ${
                onDark ? "text-white/70" : "text-charcoal/55"
              }`}
            >
              {block.eyebrow}
            </p>
          ) : null}

          {/* Live h1: 90px desktop, weight 300, normal (NOT italic), lh 1.3 */}
          {rotator ? (
            // Kinetic layer: the home rotator stays untouched inside; the h1
            // itself arrives with the hero choreography (mo-arrive @150ms).
            <h1
              className="mo-arrive font-display text-[55px] font-light leading-[1.3] md:text-[90px]"
              style={moStyle({ "--mo-arrive-d": "150ms" })}
            >
              <HeroRotator
                slides={block.headlineSlides ?? []}
                prefix={block.headlinePrefix!}
                suffixes={block.headlineSuffixes!}
              />
            </h1>
          ) : (
            <h1 className="font-display text-[55px] font-light leading-[1.3] md:text-[90px]">
              <span className="mo-mask">
                <span className="mo-line" style={moStyle({ "--mo-i": 0 })}>
                  {block.heading}
                </span>
              </span>
            </h1>
          )}

          {/* Live (/fund, /trade): the subheading is a SECOND h1-scale line
              (hero-wysiwyg renders two h1s; italics via _markers_ —
              AUDIT R5-1). Skipped when duplicating the headline. */}
          {block.subheading && block.subheading !== block.heading ? (
            <p className="font-display text-[55px] font-light leading-[1.3] md:text-[90px]">
              <span className="mo-mask">
                <span className="mo-line" style={moStyle({ "--mo-i": 1 })}>
                  {renderRich(block.subheading)}
                </span>
              </span>
            </p>
          ) : null}

          {/* Live hero body: hero-wysiwyg — Franklin p1 (18/24) light inside
              max-w-240 (=1080px), leading-8 (36px); home copy is bold via
              ** markers (AUDIT.md R3-4). */}
          {block.body?.map((p, i) => (
            <p
              key={i}
              data-mo=""
              style={moStyle({ "--mo-d": "380ms" })}
              className={`mt-6 max-w-[1080px] font-[family-name:var(--font-franklin)] text-[18px] font-light leading-relaxed md:text-[24px] md:leading-[36px] ${
                onDark ? "text-white" : "text-charcoal/80"
              }`}
            >
              {renderRich(p)}
            </p>
          ))}

          {/* Live: rich-cta pt-6 (27px). */}
          {block.ctas && block.ctas.length > 0 ? (
            <div
              className="mt-6 flex flex-wrap gap-4"
              data-mo=""
              style={moStyle({ "--mo-d": "540ms" })}
            >
              {block.ctas.map((cta) => (
                <CTA key={cta.href} cta={cta} />
              ))}
            </div>
          ) : null}
        </div>
      </Container>
    </section>
  );
}

export default Hero;
