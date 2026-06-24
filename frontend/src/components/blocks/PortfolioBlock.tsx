import { Section } from "@/components/ui/Section";
import { DonutChart } from "@/components/ui/DonutChart";
import { moStyle } from "@/lib/motion";
import type {
  PortfolioBlock as PortfolioBlockType,
  PortfolioHolding,
} from "@/types/blocks";

/**
 * PortfolioBlock — rebuilt from live /fund (AUDIT.md R5-3). Live renders:
 *  1. Intro textbox section (id=portfolio, pt 40/80 pb 20/40): h2 blue-400
 *     40/64 + p2 charcoal, gap-y 24/40, centered.
 *  2. "Exposure" — section-spacing, container capped max-w-4xl, grid
 *     md:grid-cols-2 gap-10: LEFT h3 + scrollable table (max-h 300/340,
 *     sky scrollbar, sticky "Allocation*" header, #B0E9FD row borders,
 *     text-base charcoal) + footnotes (incl. the Portfolio Schedule PDF
 *     link); RIGHT donut chart.
 *  3. "Sectors" — mirrored (donut left via order classes), same table.
 */

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
  // Live table keeps the fixture order (desc with "Other Net Assets" last);
  // the donut sorts purely descending (Other Net Assets becomes the active
  // #085CF0 slice).
  const holdings = block.holdings;
  const donutData = holdings
    .map((h) => ({ name: h.name, value: pct(h.allocation) }))
    .sort((a, b) => b.value - a.value);
  const sectorData = (block.sectors ?? [])
    .map((s) => ({ name: s.name, value: pct(s.allocation) }))
    .sort((a, b) => b.value - a.value);

  return (
    <>
      {/* 1. Intro textbox. */}
      <section
        id="portfolio"
        className="bg-white pb-[20px] pt-[40px] text-center md:pb-[40px] md:pt-[80px]"
      >
        <div className="mx-auto w-full max-w-6xl px-4">
          <div className="mx-auto w-full max-w-[1000px]">
            <div className="flex flex-col items-center gap-y-[24px] md:gap-y-[40px]">
              <h2
                className="font-display text-[40px] font-light leading-[1.1] text-[#0023EC] md:text-[64px]"
                data-mo=""
              >
                {block.heading}
              </h2>
              {block.intro ? (
                <p
                  className="font-[family-name:var(--font-franklin)] text-[16px] font-light leading-[1.4] text-charcoal md:text-[20px]"
                  data-mo=""
                  style={moStyle({ "--mo-i": 1 })}
                >
                  {block.intro}
                </p>
              ) : null}
            </div>
          </div>
        </div>
      </section>

      {/* 2. Ice origination panel between intro and tables (AUDIT R5-4). */}
      {block.panelHeading ? (
        <Section tone="light" className="!py-[67.5px] md:!py-[99px]">
          <div
            className="ice-panel grid grid-cols-1 gap-[24px] border-t-2 border-[#085CF0] bg-[#E4F7FD] p-[48px] md:grid-cols-2 md:gap-[40px]"
            data-mo=""
          >
            <h2 className="font-display text-[32px] font-light leading-[1.1] text-black md:text-[48px]">
              {block.panelHeading}
            </h2>
            <div className="font-[family-name:var(--font-franklin)] text-[14px] font-light leading-[1.2] text-black md:text-[18px]">
              <p className="my-0">{block.panelBody}</p>
            </div>
          </div>
        </Section>
      ) : null}

      {/* 3. Exposure. */}
      <Section tone="light" className="!py-[36px]">
        <div className="mx-auto grid max-w-4xl grid-cols-1 items-start gap-10 md:grid-cols-2">
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
          <div className="flex w-full items-start justify-center">
            <DonutChart
              data={donutData}
              id="exposure-donut"
              linkTableId="exposure-table"
              className="h-[300px] w-full max-w-[482px] sm:h-[360px] md:h-[396px]"
            />
          </div>
        </div>
      </Section>

      {/* 3. Sectors — table right, donut left at md. */}
      {block.sectors && block.sectors.length > 0 ? (
        <Section tone="light" className="!py-[36px]">
          <div className="mx-auto grid max-w-4xl grid-cols-1 items-start gap-10 md:grid-cols-2">
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
            <div className="order-2 flex w-full items-start justify-center md:order-1">
              <DonutChart
                data={sectorData}
                hideDecimals
                id="sectors-donut"
                linkTableId="sectors-table"
                className="h-[300px] w-full max-w-[482px] sm:h-[360px] md:h-[396px]"
              />
            </div>
          </div>
        </Section>
      ) : null}
    </>
  );
}

export default PortfolioBlock;
