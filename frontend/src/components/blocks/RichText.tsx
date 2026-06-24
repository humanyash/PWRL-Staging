import { Section } from "@/components/ui/Section";
import { CTA } from "@/components/ui/CTA";
import type { RichTextBlock } from "@/types/blocks";

/** Generic prose section + fallback renderer. */
export function RichText({ block }: { block: RichTextBlock }) {
  // Live /trade "What is a closed-end fund?" (AUDIT R6-5): blue-mint
  // gradient band, two columns (`md:flex gap-40 [&>*]:flex-1 items-start`,
  // each column pt/pb 40/80): LEFT h4 + p2 white (gap-y 24/40); RIGHT
  // bordered items (border-l-2 white pl-16, h5 ivy 24/30 + p2, gap-36).
  if (block.tone === "gradient") {
    return (
      <section
        id="cef-overview"
        className="bg-blue-mint-gradient pb-[40px] pt-[40px] text-white md:pb-[80px] md:pt-[80px]"
      >
        <div className="mx-auto w-full max-w-6xl px-4">
          <div className="md:flex md:flex-row md:items-start md:gap-[40px] md:[&>*]:flex-1">
            <div className="pb-[40px] pt-[40px] md:pb-[80px] md:pt-[80px]">
              <div
                className="flex flex-col items-start gap-y-[24px] md:gap-y-[40px]"
                data-mo-stagger=""
              >
                {block.heading ? (
                  <h2
                    className="font-display text-[32px] font-light leading-[1.1] md:text-[48px]"
                    data-mo=""
                  >
                    {block.heading}
                  </h2>
                ) : null}
                {block.body.map((p, i) => (
                  <p
                    key={i}
                    className="font-[family-name:var(--font-franklin)] text-[16px] font-light leading-[1.4] md:text-[20px]"
                    data-mo=""
                  >
                    {p}
                  </p>
                ))}
                {block.ctas && block.ctas.length > 0 ? (
                  <div className="flex flex-wrap gap-3">
                    {block.ctas.map((cta) => (
                      <CTA key={cta.href} cta={cta} compact />
                    ))}
                  </div>
                ) : null}
              </div>
            </div>

            {block.sideItems && block.sideItems.length > 0 ? (
              <div className="pb-[40px] pt-[40px] md:pb-[80px] md:pt-[80px]">
                <div className="grid grid-cols-1 gap-[36px]" data-mo-stagger="">
                  {block.sideItems.map((item) => (
                    <div
                      key={item.label}
                      className="cef-item border-l-2 border-white pl-[16px]"
                    >
                      <h3
                        className="font-display text-[24px] font-light leading-[1.1] text-white md:text-[30px]"
                        data-mo=""
                      >
                        {item.label}
                      </h3>
                      <p
                        className="my-[8px] font-[family-name:var(--font-franklin)] text-[16px] font-light leading-[1.4] text-white md:text-[20px]"
                        data-mo=""
                      >
                        {item.value}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </section>
    );
  }

  // Live /fund "How the portfolio gets built." (AUDIT R5-4): ice panel with
  // a 2px #085CF0 top border, p-48, two columns (h4 ivy 32/48 + p3 black).
  if (block.tone === "panel") {
    return (
      <Section tone="light" className="!py-[67.5px] md:!py-[99px]">
        <div className="grid grid-cols-1 gap-[24px] border-t-2 border-[#085CF0] bg-[#E4F7FD] p-[48px] md:grid-cols-2 md:gap-[40px]">
          <h2 className="font-display text-[32px] font-light leading-[1.1] text-black md:text-[48px]">
            {block.heading}
          </h2>
          <div className="font-[family-name:var(--font-franklin)] text-[14px] font-light leading-[1.2] text-black md:text-[18px]">
            {block.body.map((p, i) => (
              <p key={i} className="my-0">
                {p}
              </p>
            ))}
          </div>
        </div>
      </Section>
    );
  }

  const blue = block.headingStyle === "blue";

  return (
    <Section
      tone="light"
      // Live paddings: "The Power Law" = 80/40px; default prose bands
      // (e.g. "How the portfolio gets built.") = py-22 (99px).
      className={
        blue
          ? "!pb-[20px] !pt-[40px] md:!pb-[40px] md:!pt-[80px]"
          : "!py-[67.5px] md:!py-[99px]"
      }
    >
      <div className="mx-auto max-w-3xl">
        {block.subheading ? (
          <p className="mb-3 font-[family-name:var(--font-franklin)] text-xs font-semibold uppercase tracking-widest text-brand-blue">
            {block.subheading}
          </p>
        ) : null}
        {block.heading ? (
          /* Live: "blue" = the /vision Power Law treatment (55px electric
             blue); default = 48px black (e.g. /fund "How the portfolio gets
             built."). */
          <h2
            className={`font-display font-light leading-tight tracking-tight ${
              block.headingStyle === "blue"
                ? "text-3xl text-electric-blue md:text-[55px] md:leading-[1.1]"
                : "text-3xl text-black md:text-[48px] md:leading-[1.12]"
            }`}
          >
            {block.heading}
          </h2>
        ) : null}

        {/* Live prose: Franklin font-light — 20px on the Power Law band,
            18px on default prose bands. */}
        <div
          className={`mt-6 space-y-5 font-[family-name:var(--font-franklin)] font-light leading-relaxed text-charcoal ${
            blue ? "text-lg md:text-[20px]" : "text-[18px]"
          }`}
        >
          {block.body.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>

        {block.ctas && block.ctas.length > 0 ? (
          <div className="mt-8 flex flex-wrap gap-3">
            {block.ctas.map((cta) => (
              <CTA key={cta.href} cta={cta} />
            ))}
          </div>
        ) : null}

        {block.images && block.images.length > 0 ? (
          <div className="mt-10 flex flex-wrap items-center gap-8">
            {block.images.map((im) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={im.src}
                src={im.src}
                alt={im.alt}
                className="h-20 w-auto object-contain"
              />
            ))}
          </div>
        ) : null}
      </div>
    </Section>
  );
}

export default RichText;
