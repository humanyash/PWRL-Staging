import { Section } from "@/components/ui/Section";
import { DonutChart } from "@/components/ui/DonutChart";
import { renderLines } from "@/lib/rich";
import { moStyle } from "@/lib/motion";
import type {
  PortfolioBlock as PortfolioBlockType,
  PortfolioHolding,
} from "@/types/blocks";

/**
 * PortfolioBlock — rebuilt from live /fund (AUDIT.md R5-3). Live renders:
 *  1. Intro textbox section (id=portfolio, pt 40/80 pb 20/40): h2 blue-400
 *     40/64 + p2 charcoal, gap-y 24/40, centered.
 *  2. Ice origination panel — section-spacing py-15/22, h4 ivy + p3 body.
 *  3. "Exposure" / "Sectors" — section-spacing, max-w-4xl grid + donuts.
 */

const portfolioIntroSection =
  "bg-white pb-[20px] pt-[40px] text-center md:pb-[40px] md:pt-[80px] [&_h1]:font-light [&_h2]:font-light [&_h3]:font-light [&_h4]:font-light [&_h5]:font-light [&_h6]:font-light [&_h1]:text-blue-400 [&_h2]:text-blue-400 [&_h3]:text-blue-400 [&_h4]:text-blue-400 [&_h5]:text-blue-400 [&_h6]:text-blue-400 [&_p]:text-charcoal [&_li]:text-charcoal [&_p]:text-p2-mob [&_p]:md:text-p2-desk [&_li]:text-p2-mob [&_li]:md:text-p2-desk [&_hr]:hidden";

function pct(v: string): number {
  return parseFloat(v.replace("%", "")) || 0;
}

function AllocationTable({
  rows,
  id,
}: {
  rows: PortfolioHolding[];
  id?: string;
}) {
  return (
    <div
      className="alloc-scroll max-h-[300px] overflow-y-auto md:max-h-[340px] [&::-webkit-scrollbar]:w-[6px] [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-[#B0E9FD] [&::-webkit-scrollbar-track]:bg-transparent"
      style={{ scrollbarColor: "#B0E9FD transparent", scrollbarWidth: "thin" }}
    >
      <table
        id={id}
        className="alloc-table w-full border-collapse text-base text-charcoal"
        style={moStyle({ "--mo-stagger": "30ms" })}
      >
        <thead>
          <tr>
            <th
              className="sticky top-0 z-10 border-b border-[#B0E9FD] bg-white text-left"
              aria-hidden="true"
            />
            <th className="sticky top-0 z-10 border-b border-[#B0E9FD] bg-white pb-2 text-left font-[family-name:var(--font-franklin)] text-[12px] font-semibold uppercase tracking-[0.2em] text-[#060B35]">
              Allocation*
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((h, i) => (
            <tr
              key={h.name}
              className="cursor-pointer border-t border-[#B0E9FD] transition-colors first:border-t-0 hover:bg-black/[0.02] [&.hot_td:first-child]:font-semibold [&.hot_td:first-child]:text-[#085CF0]"
              data-mo=""
              data-name={h.name}
              style={moStyle({ "--mo-i": Math.min(i, 8), "--mo-dist": "10px" })}
            >
              <td className="py-3 pr-8 text-left">
                <span>{h.name}</span>
              </td>
              <td className="py-3 text-left">{h.allocation}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function PortfolioBlock({ block }: { block: PortfolioBlockType }) {
  const holdings = block.holdings;
  const donutData = holdings
    .map((h) => ({ name: h.name, value: pct(h.allocation) }))
    .sort((a, b) => b.value - a.value);
  const sectorData = (block.sectors ?? [])
    .map((s) => ({ name: s.name, value: pct(s.allocation) }))
    .sort((a, b) => b.value - a.value);

  return (
    <>
      {/* 1. Intro textbox — live DOM structure. */}
      <section id="portfolio" className={portfolioIntroSection}>
        <div className="mx-auto w-full max-w-6xl px-4 md:px-0">
          <div className="mx-auto w-full max-w-6xl">
            <div className="textbox-content flex flex-col items-center gap-y-[24px] md:gap-y-[40px] [&>*]:my-0">
              <h2 data-mo="">{block.heading}</h2>
              {block.intro ? (
                <p data-mo="" style={moStyle({ "--mo-i": 1 })}>
                  {renderLines(block.intro)}
                </p>
              ) : null}
            </div>
          </div>
        </div>
      </section>

      {/* 2. Ice origination panel (AUDIT R5-4). */}
      {block.panelHeading ? (
        <section className="section-spacing py-15 md:py-22">
          <div className="mx-auto w-full max-w-6xl px-4">
            <div
              className="grid grid-cols-1 gap-[24px] border-t-2 border-[#085CF0] bg-[#E4F7FD] p-[48px] md:grid-cols-2 md:gap-[40px]"
              data-mo=""
            >
              <h4 className="font-ivy font-light text-black text-h4-mob md:text-h4-desk">
                {block.panelHeading}
              </h4>
              <div className="font-franklin text-p3-mob md:text-p3-desk text-black [&_li]:font-light [&_p]:my-0 [&_p]:font-light">
                <p>{block.panelBody}</p>
              </div>
            </div>
          </div>
        </section>
      ) : null}

      {/* 3. Exposure. */}
      <section className="section-spacing">
        <div className="mx-auto grid w-full max-w-6xl max-w-4xl! grid-cols-1 gap-10 px-4 md:grid-cols-2">
          <div>
            <h3
              className="mb-4 inline-flex items-end font-display text-[36px] font-light leading-[1.1] text-charcoal md:text-[55px]"
              data-mo=""
            >
              <span>Exposure</span>
            </h3>
            <AllocationTable rows={holdings} id="exposure-table" />
            <div className="mt-[16px] font-[family-name:var(--font-franklin)] text-[14px] font-light text-[#757575]">
              {block.footnotes?.[0] ? (
                <p className="my-0">{block.footnotes[0]}</p>
              ) : null}
              {block.scheduleHref ? (
                <p className="my-0">
                  For the detailed Portfolio Schedule,{" "}
                  <a
                    href={block.scheduleHref}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <u>click here</u>
                  </a>
                  <u>.</u>
                </p>
              ) : null}
            </div>
          </div>
          <div className="flex w-full items-center justify-center self-stretch">
            <DonutChart
              data={donutData}
              id="exposure-donut"
              linkTableId="exposure-table"
              className="aspect-square size-full max-h-[520px] max-w-full min-h-[320px] sm:min-h-[400px] md:min-h-[480px]"
            />
          </div>
        </div>
      </section>

      {/* 4. Sectors — table right, donut left at md. */}
      {block.sectors && block.sectors.length > 0 ? (
        <section className="section-spacing">
          <div className="mx-auto grid w-full max-w-6xl max-w-4xl! grid-cols-1 gap-10 px-4 md:grid-cols-2">
            <div className="order-1 md:order-2">
              <h3
                className="mb-4 inline-flex items-end text-center font-display text-[36px] font-light leading-[1.1] text-charcoal md:text-left md:text-[55px]"
                data-mo=""
              >
                <span>Sectors</span>
              </h3>
              <AllocationTable rows={block.sectors} id="sectors-table" />
              {block.sectorsFootnote ? (
                <div className="mt-[16px] font-[family-name:var(--font-franklin)] text-[14px] font-light text-[#757575]">
                  <p className="my-0">{block.sectorsFootnote}</p>
                </div>
              ) : null}
            </div>
            <div className="order-2 flex w-full items-center justify-center self-stretch md:order-1">
              <DonutChart
                data={sectorData}
                hideDecimals
                id="sectors-donut"
                linkTableId="sectors-table"
                className="aspect-square size-full max-h-[520px] max-w-full min-h-[320px] sm:min-h-[400px] md:min-h-[480px]"
              />
            </div>
          </div>
        </section>
      ) : null}
    </>
  );
}

export default PortfolioBlock;
