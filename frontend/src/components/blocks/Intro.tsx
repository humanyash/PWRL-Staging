import { CTA } from "@/components/ui/CTA";
import { moStyle } from "@/lib/motion";
import { renderRich, introTailHeadingLines, renderLines } from "@/lib/rich";
import type { IntroBlock, PortfolioGridItem } from "@/types/blocks";

/**
 * Intro — live home (2026-06): blue-white gradient band with portfolio grid
 * and a two-column white tail (Private Tech copy + fund details table).
 */

const whiteTextbox =
  "text-center [&_h1]:font-light [&_h2]:font-light [&_h3]:font-light [&_h4]:font-light [&_h5]:font-light [&_h6]:font-light [&_h1]:text-white [&_h2]:text-white [&_h3]:text-white [&_h4]:text-white [&_h5]:text-white [&_h6]:text-white [&_p]:text-white [&_li]:text-white [&_p]:text-p2-mob [&_p]:md:text-p2-desk [&_li]:text-p2-mob [&_li]:md:text-p2-desk [&_hr]:hidden";

const charcoalTextbox =
  "text-left [&_h1]:font-light [&_h2]:font-light [&_h3]:font-light [&_h4]:font-light [&_h5]:font-light [&_h6]:font-light [&_h1]:text-charcoal [&_h2]:text-charcoal [&_h3]:text-charcoal [&_h4]:text-charcoal [&_h5]:text-charcoal [&_h6]:text-charcoal [&_p]:text-charcoal [&_li]:text-charcoal [&_p]:text-p3-mob [&_p]:md:text-p3-desk [&_li]:text-p3-mob [&_li]:md:text-p3-desk [&_hr]:hidden";

const tileBasis =
  "group relative flex h-[90px] grow shrink-0 basis-[calc((100%_-_8px)/2)] items-center justify-center overflow-hidden md:basis-[calc((100%_-_16px)/3)] lg:basis-[calc((100%_-_40px)/6)] bg-black/50 transition-colors duration-300 hover:bg-[#060B35]/90";

function PortfolioTile({ item }: { item: PortfolioGridItem }) {
  return (
    <div className={tileBasis} data-mo="">
      {item.ipo ? (
        <span className="pointer-events-none absolute top-[8px] -right-[39px] w-[110px] rotate-45 bg-[#23FBC5] py-[4px] text-center font-[family-name:var(--font-franklin)] text-[12px] font-bold leading-none text-[#060B35] transition-opacity duration-300 group-hover:opacity-0">
          IPO
        </span>
      ) : null}
      <div className="flex flex-col items-center gap-1 px-2 text-center transition-opacity duration-300 group-hover:opacity-0">
        <span className="font-[family-name:var(--font-franklin)] text-[22px] font-bold uppercase leading-tight text-white">
          {item.name}
        </span>
        {item.ticker ? (
          <span className="font-[family-name:var(--font-franklin)] text-[18px] font-light leading-tight text-white">
            {item.ticker}
          </span>
        ) : null}
      </div>
      {item.logo ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 px-2 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={item.logo.src}
            alt={item.logo.alt}
            className="h-auto max-h-[52px] w-full object-contain"
          />
          <span className="font-[family-name:var(--font-franklin)] text-[18px] font-light text-white">
            {item.allocation}
          </span>
        </div>
      ) : (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 px-2 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <span className="font-[family-name:var(--font-franklin)] text-[18px] font-light text-white">
            {item.allocation}
          </span>
        </div>
      )}
    </div>
  );
}

export function Intro({ block }: { block: IntroBlock }) {
  const intro = block.body?.[0];

  return (
    <section
      id="introducing-powerlaw-corp"
      className="bg-blue-white-gradient pb-[40px] pt-[40px] md:pb-[80px]"
    >
      <div className="mx-auto w-full max-w-6xl px-4">
        {/* Mint divider — live leads the portfolio band. */}
        <div className={`pt-0 pb-0 ${whiteTextbox}`}>
          <div className="mx-auto w-full max-w-6xl px-4 md:px-0!">
            <div className="mx-auto w-full max-w-6xl">
              <div
                role="separator"
                aria-orientation="vertical"
                className="divider-mint mx-auto h-[80px] w-[3px] bg-mint"
                data-mo="draw"
              />
            </div>
          </div>
        </div>

        {/* Portfolio intro + grid + CTA. */}
        <div className={`pb-[40px] pt-[40px] md:pb-[80px] md:pt-[80px] ${whiteTextbox}`}>
          <div className="mx-auto w-full max-w-6xl px-4 md:px-0!">
            <div className="mx-auto w-full max-w-6xl">
              <div className="flex flex-col items-center gap-y-[24px] md:gap-y-[40px] [&>*]:my-0">
                <h4
                  className="font-display text-[32px] font-light leading-[1.1] md:text-[48px]"
                  data-mo=""
                >
                  {block.heading}
                </h4>
                {intro ? (
                  <p className="font-[family-name:var(--font-franklin)] text-[16px] font-light leading-[1.4] md:text-[20px]" data-mo="" style={moStyle({ "--mo-i": 1 })}>
                    {intro}
                  </p>
                ) : null}

                {block.portfolioItems && block.portfolioItems.length > 0 ? (
                  <div className="w-full flex">
                    <div className="section-spacing w-full">
                      <div className="mx-auto w-full max-w-6xl px-4">
                        <div
                          className="portfolio-grid flex flex-wrap gap-[8px]"
                          data-mo-stagger=""
                        >
                          {block.portfolioItems.map((item) => (
                            <PortfolioTile key={item.name} item={item} />
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ) : null}

                {block.cta ? (
                  <span data-mo="" style={moStyle({ "--mo-i": 2 })}>
                    <CTA cta={block.cta} compact />
                  </span>
                ) : null}
              </div>
            </div>
          </div>
        </div>

        {/* White tail: Private Tech copy + fund details. */}
        {(block.tailHeading || block.fundDetails) && (
          <div className="md:flex md:flex-row md:items-center md:gap-[40px] md:[&>*]:flex-1">
            {block.tailHeading ? (
              <div className={`pb-0 pt-[40px] md:pt-[80px] ${charcoalTextbox}`}>
                <div className="mx-auto w-full max-w-6xl px-4 md:px-0!">
                  <div className="mx-auto w-full max-w-6xl">
                    <div className="flex flex-col items-start gap-y-[24px] md:gap-y-[40px] [&>*]:my-0">
                      <h3
                        className="flex flex-col font-display text-[36px] font-light leading-[1.1] md:text-[55px]"
                        data-mo="fade"
                      >
                        {introTailHeadingLines(block.tailHeading).map(
                          (line, i) => (
                            <span
                              key={i}
                              className={`block${i === 0 ? " w-[650px]" : ""}${i === 1 ? " italic" : ""}`}
                            >
                              {renderRich(line)}
                            </span>
                          ),
                        )}
                      </h3>
                      {block.tailParagraphs?.map((p, i) => (
                        <p
                          key={i}
                          className="max-w-[650px] font-[family-name:var(--font-franklin)] text-[14px] font-normal leading-[1.2] md:text-[18px]"
                          data-mo=""
                        >
                          {renderLines(p)}
                        </p>
                      ))}
                      {block.tailCta ? (
                        <span data-mo="">
                          <CTA cta={block.tailCta} compact />
                        </span>
                      ) : null}
                    </div>
                  </div>
                </div>
              </div>
            ) : null}

            {block.fundDetails && block.fundDetails.length > 0 ? (
              <div className="section-spacing pt-[80px]">
                <div className="mx-auto ml-auto mr-0 w-full max-w-[500px]! px-0!">
                  <h6 className="pb-0 font-[family-name:var(--font-franklin)] font-normal uppercase tracking-[0.2em] text-[#757575]">
                    FUND DETAILS
                  </h6>
                  <div className="mt-[14px] flex flex-col" data-mo-stagger="">
                    {block.fundDetails.map((row) => (
                      <div
                        key={row.label}
                        className="flex justify-between gap-4 border-t border-[#085CF0] py-[16px] last:border-b"
                        data-mo=""
                      >
                        <span className="whitespace-nowrap font-[family-name:var(--font-franklin)]">
                          <strong>{row.label}</strong>
                        </span>
                        <span className="text-right font-[family-name:var(--font-franklin)]">
                          {row.value}
                        </span>
                      </div>
                    ))}
                  </div>
                  {block.fundDetailsFootnote ? (
                    <div className="mt-[16px] text-right font-[family-name:var(--font-franklin)] text-[14px] font-light text-[#757575] [&_p]:my-0">
                      <p>{block.fundDetailsFootnote}</p>
                    </div>
                  ) : null}
                </div>
              </div>
            ) : null}
          </div>
        )}
      </div>
    </section>
  );
}

export default Intro;
