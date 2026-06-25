import { Section } from "@/components/ui/Section";
import { countup } from "@/lib/motion";
import { InvestingChannelWidget } from "./InvestingChannelWidget";
import type { StockInfoBlock } from "@/types/blocks";

/**
 * StockInfo — rebuilt from live /fund (AUDIT.md R5-5). Live is a STATIC
 * grid, not a third-party widget:
 *  - container max-w-4xl; h2 (40/64); grid md:grid-cols-2 gap-x-5
 *    gap-y-[16px] mt-10; rows `border-t border-[#085CF0] pt-[16px]
 *    flex justify-between` with <strong> label + plain value;
 *  - notes mt-[24px], 14px light #757575.
 * The InvestingChannel mount is kept as a fallback for a future live-data
 * widget when `widgetId` is set and no rows exist.
 */
export function StockInfo({ block }: { block: StockInfoBlock }) {
  const rows = block.rows ?? [];

  return (
    <Section tone="light" id="stock-info" className="!py-[36px]">
      <div className="mx-auto max-w-4xl">
        <h2
          className="font-display text-[40px] font-light leading-[1.1] text-charcoal md:text-[64px]"
          data-mo=""
        >
          {block.heading}
        </h2>

        {rows.length > 0 ? (
          <div
            className="mt-10 grid grid-cols-1 gap-x-5 gap-y-[16px] md:grid-cols-2"
            data-mo-stagger=""
          >
            {rows.map((row) => (
              <div
                key={row.label}
                className="stockinfo-row flex justify-between border-t border-[#085CF0] pt-[16px]"
                data-mo=""
              >
                <span className="whitespace-nowrap">
                  <strong>{row.label}</strong>
                </span>
                <span>{countup(row.value)}</span>
              </div>
            ))}
          </div>
        ) : block.widgetId ? (
          <InvestingChannelWidget widgetId={block.widgetId} />
        ) : null}

        {block.notes && block.notes.length > 0 ? (
          <div className="mt-[24px] font-[family-name:var(--font-franklin)] text-[14px] font-light text-[#757575]">
            {block.notes.map((n, i) => (
              <p key={i} className="my-0">
                {n}
              </p>
            ))}
          </div>
        ) : null}
      </div>
    </Section>
  );
}

export default StockInfo;
