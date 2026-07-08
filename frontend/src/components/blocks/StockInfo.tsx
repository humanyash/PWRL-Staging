import { countup } from "@/lib/motion";
import type { StockInfoBlock } from "@/types/blocks";

/**
 * StockInfo — rebuilt from live /fund (AUDIT.md R5-5). Live is a STATIC
 * grid inside section-spacing + max-w-4xl container (px-4).
 */
export function StockInfo({ block }: { block: StockInfoBlock }) {
  const rows = block.rows ?? [];

  return (
    <section id="stock-info" className="section-spacing">
      <div className="mx-auto w-full max-w-6xl px-4 max-w-4xl!">
        <h2 data-mo="">{block.heading}</h2>

        {rows.length > 0 ? (
          <div
            className="mt-10 grid grid-cols-1 gap-x-5 gap-y-[16px] md:grid-cols-2"
            data-mo-stagger=""
          >
            {rows.map((row) => (
              <div
                key={row.label}
                className="flex justify-between border-t border-[#085CF0] pt-[16px]"
                data-mo=""
              >
                <span className="whitespace-nowrap">
                  <strong>{row.label}</strong>
                </span>
                <span>{countup(row.value)}</span>
              </div>
            ))}
          </div>
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
    </section>
  );
}

export default StockInfo;
