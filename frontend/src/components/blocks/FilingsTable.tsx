"use client";

import { useMemo, useState } from "react";
import { PdfIcon } from "@/components/ui/PdfIcon";
import type { EdgarFiling } from "@/lib/edgar";

/**
 * FilingsTable — client half of the SEC Filings section (AUDIT.md R7-5).
 * Live treatment:
 *  - filter row `flex gap-6 pb-8`: semibold labels (text-xs md:text-sm)
 *    with white selects (`bg-white border border-charcoal rounded px-2
 *    py-1` navy text) — REAL filtering by year and form type;
 *  - table: header row bg-[#E4F7FD] px-[24px] py-[8px] semibold 14px
 *    (Date 112px | Filing Type 112px | Filing Description flex |
 *    Download / View); rows bg-white border-b #B0E9FD px-[24px] py-[16px]
 *    gap-[36px] 14px navy text; 24px PDF icon links the document.
 */
export function FilingsTable({ filings }: { filings: EdgarFiling[] }) {
  const [year, setYear] = useState("all");
  const [type, setType] = useState("all");

  const years = useMemo(
    () =>
      [...new Set(filings.map((f) => f.filingDate.slice(0, 4)))].sort((a, b) =>
        b.localeCompare(a),
      ),
    [filings],
  );
  const types = useMemo(
    () => [...new Set(filings.map((f) => f.form))].sort(),
    [filings],
  );
  const rows = filings.filter(
    (f) =>
      (year === "all" || f.filingDate.startsWith(year)) &&
      (type === "all" || f.form === type),
  );

  const fmtDate = (iso: string) => {
    const [y, m, d] = iso.split("-");
    return m && d ? `${m}/${d}/${y}` : iso;
  };

  return (
    <>
      <div className="flex justify-between gap-6 pb-8 md:justify-start">
        <div className="flex items-center">
          <label
            htmlFor="year-selector"
            className="pr-2 text-xs font-semibold text-white md:text-sm"
          >
            Select Year:
          </label>
          <select
            id="year-selector"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            className="rounded border border-charcoal bg-white px-2 py-1 text-xs text-[#060B35] md:text-sm"
          >
            <option value="all">All Years</option>
            {years.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-center">
          <label
            htmlFor="type-selector"
            className="pr-2 text-xs font-semibold text-white md:text-sm"
          >
            Filing Type:
          </label>
          <select
            id="type-selector"
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="rounded border border-charcoal bg-white px-2 py-1 text-xs text-[#060B35] md:text-sm"
          >
            <option value="all">All Form Types</option>
            {types.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="overflow-x-auto">
        <div className="min-w-[720px]">
          <div className="flex w-full items-center gap-[36px] bg-[#E4F7FD] px-[24px] py-[8px] font-[family-name:var(--font-franklin)] text-[14px] font-semibold leading-[18.5px] text-[#060B35]">
            <p className="w-[112px] shrink-0">Date</p>
            <p className="w-[112px] shrink-0">Filing Type</p>
            <p className="min-w-0 flex-1">Filing Description</p>
            <p className="w-[130px] shrink-0">Download / View</p>
          </div>
          {rows.map((f) => (
            <div
              key={f.accessionNumber + f.form}
              className="flex w-full items-center gap-[36px] border-b border-[#B0E9FD] bg-white px-[24px] py-[16px] font-[family-name:var(--font-franklin)] text-[14px] font-normal leading-[18.5px] text-[#060B35]"
            >
              <p className="w-[112px] shrink-0">{fmtDate(f.filingDate)}</p>
              <p className="w-[112px] shrink-0">{f.form}</p>
              <p className="min-w-0 flex-1">{f.description}</p>
              <div className="flex w-[130px] shrink-0 items-center gap-2">
                <a
                  href={f.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Open filing: ${f.description}`}
                  className="text-[#060B35] hover:opacity-70"
                >
                  <PdfIcon className="h-6 w-6" />
                </a>
              </div>
            </div>
          ))}
          {rows.length === 0 ? (
            <p className="bg-white px-[24px] py-[16px] text-[14px] text-[#060B35]">
              No filings match the selected filters.
            </p>
          ) : null}
        </div>
      </div>
    </>
  );
}

export default FilingsTable;
