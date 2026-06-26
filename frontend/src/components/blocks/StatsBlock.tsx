import { CTA } from "@/components/ui/CTA";
import { Section } from "@/components/ui/Section";
import { moStyle } from "@/lib/motion";
import type { StatsBlock as StatsBlockType } from "@/types/blocks";

/**
 * StatsBlock — live /vision "Our Heritage" (navy) and home
 * "Decades of VC Expertise" (light + ice stat tiles).
 */
export function StatsBlock({ block }: { block: StatsBlockType }) {
  const light = block.theme === "light";

  if (light) {
    return (
      <section
        id="heritage"
        className="scroll-mt-28 py-[70px]"
      >
        <div className="mx-auto w-full max-w-6xl px-4">
          <div className="mb-10 pl-4 md:max-w-[65%] md:pl-0">
            <h2
              className="font-display text-[40px] font-light leading-[1.1] text-charcoal md:text-[64px]"
              data-mo=""
            >
              {block.heading}
            </h2>
          </div>

          <div className="md:flex md:flex-row md:items-center md:gap-10">
            <div className="md:flex-1">
              <div className="flex flex-col items-start gap-y-6 md:gap-y-10">
                <div className="-translate-y-[3px] flex w-full flex-col items-start gap-y-6 md:gap-y-10">
                  {block.subheading ? (
                    <h5
                      className="font-display text-[24px] font-light leading-[1.1] text-charcoal md:text-[30px] md:leading-[1]"
                      data-mo=""
                    >
                      {block.subheading}
                    </h5>
                  ) : null}
                  <div className="flex w-full flex-col items-start gap-y-5 md:gap-y-8">
                    {(block.body ?? (block.intro ? [block.intro] : [])).map(
                      (paragraph, i) => (
                        <p
                          key={i}
                          className="font-[family-name:var(--font-franklin)] text-[16px] font-normal leading-[1.4] text-charcoal md:text-[20px]"
                          data-mo=""
                          style={moStyle({ "--mo-i": i + 1 })}
                        >
                          {paragraph}
                        </p>
                      ),
                    )}
                  </div>
                </div>
                {block.cta ? (
                  <div data-mo="" style={moStyle({ "--mo-i": 3 })}>
                    <CTA cta={block.cta} compact />
                  </div>
                ) : null}
              </div>
            </div>

            <div className="mt-10 md:mt-0 md:flex-1">
              <div className="mx-auto max-w-[640px] md:pt-0">
                <div
                  className="-translate-y-[10px] grid grid-cols-1 gap-4 sm:grid-cols-2"
                  data-mo-stagger=""
                >
                  {block.stats.map((stat) => (
                    <div
                      key={stat.label}
                      className="flex items-center gap-4 bg-ice p-6"
                      data-mo=""
                    >
                      {stat.icon?.src ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={stat.icon.src}
                          alt={stat.icon.alt}
                          className="h-20 w-20 shrink-0"
                        />
                      ) : null}
                      <div>
                        <p
                          className="my-0 font-display text-[32px] font-light leading-none text-[#085CF0] md:text-[48px]"
                          data-countup=""
                        >
                          {stat.value}
                        </p>
                        <p className="mb-0 mt-2 font-[family-name:var(--font-franklin)] text-[18px] font-light uppercase leading-tight text-navy">
                          {stat.label}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                {block.footnote ? (
                  <p
                    className="mt-4 text-right font-[family-name:var(--font-franklin)] text-[14px] font-light text-navy"
                    data-mo="fade"
                  >
                    {block.footnote}
                  </p>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <Section tone="navy" id="heritage" className="!py-[40px] md:!py-[80px]">
      <div className="mb-[40px] md:max-w-[65%]">
        <h2
          className="font-display text-[40px] font-light leading-[1.1] text-white md:text-[64px]"
          data-mo=""
        >
          {block.heading}
        </h2>
      </div>

      <div className="md:flex md:flex-row md:items-center md:gap-[40px] md:[&>*]:flex-1">
        <div className="flex flex-col items-start gap-y-[24px] md:gap-y-[40px]">
          {block.subheading ? (
            <h3
              className="font-display text-[24px] font-light leading-[1.1] text-white md:text-[30px]"
              data-mo=""
            >
              {block.subheading}
            </h3>
          ) : null}
          {block.intro ? (
            <p
              className="font-[family-name:var(--font-franklin)] text-[16px] font-light leading-[1.4] text-white md:text-[20px] md:leading-[25px]"
              data-mo=""
              style={moStyle({ "--mo-i": 1 })}
            >
              {block.intro}
            </p>
          ) : null}
        </div>

        <div className="mt-10 md:mt-0">
          <div
            className="grid grid-cols-[repeat(auto-fit,240px)] justify-center gap-[32px]"
            data-mo-stagger=""
          >
            {block.stats.map((stat) => (
              <div key={stat.label} className="mo-stat text-center" data-mo="">
                <p
                  className="font-display text-[64px] font-light leading-none text-[#B0E9FD]"
                  data-countup=""
                >
                  {stat.value}
                </p>
                <p className="mt-[16px] font-[family-name:var(--font-franklin)] text-[18px] font-light uppercase text-white">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {block.footnote ? (
        <div className="mt-[40px]" data-mo="fade">
          <p className="text-[14px] font-light text-white">{block.footnote}</p>
        </div>
      ) : null}
    </Section>
  );
}

export default StatsBlock;
