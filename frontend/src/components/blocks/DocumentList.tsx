import { Section } from "@/components/ui/Section";
import React from "react";
import { FilingsTable } from "./FilingsTable";
import { PdfIcon } from "@/components/ui/PdfIcon";
import { getFilings } from "@/lib/edgar";
import type { DocumentListBlock } from "@/types/blocks";

/**
 * DocumentList — rebuilt from live /investor-relations (AUDIT.md R7-5/6).
 *
 * `kind: "filings"` — navy `pt-12 lg:pt-24 pb-[20px]`, h4 mb-[32px], then
 * the client FilingsTable (working Year/Type filters over the EDGAR feed,
 * fetched server-side with hourly ISR).
 *
 * `kind: "fund-docs"` — navy py-18 (81px), h4 mb-10, WHITE panel with an
 * 8px ice top strip, `ul divide-y divide-[#B0E9FD]`, rows `flex
 * justify-between px-6 py-4 sm:px-25` text-sm with underlined "View PDF"
 * + the live 24px PDF glyph.
 */
export async function DocumentList({ block }: { block: DocumentListBlock }) {
  const filings = block.kind === "filings";
  const anchorId = filings ? "sec-filings" : "fund-documents";
  const edgarFilings = filings ? await getFilings() : [];

  const heading = (cls: string) => (
    <h2
      data-mo=""
      className={`font-display text-[32px] font-light leading-[1.1] text-white md:text-[48px] ${cls}`}
    >
      {block.heading}
    </h2>
  );

  if (filings) {
    return (
      <Section
        tone="navy"
        id={anchorId}
        className="!pb-[20px] !pt-[54px] lg:!pt-[108px]"
        containerClassName="!max-w-[1260px]"
      >
        {heading("mb-[32px] -ml-6 text-left md:-ml-8")}
        {edgarFilings.length > 0 ? (
          <div data-mo="fade" style={{ "--mo-i": 1 } as React.CSSProperties}>
            <FilingsTable filings={edgarFilings} />
          </div>
        ) : (
          <p className="text-sm text-gray-400">
            {block.emptyText ?? "Loading filings..."}
          </p>
        )}
        {block.note ? (
          <p className="mt-6 text-xs font-light text-white/60">{block.note}</p>
        ) : null}
      </Section>
    );
  }

  return (
    <Section tone="navy" id={anchorId} className="!py-[81px]" containerClassName="!max-w-[1260px]">
      {heading("mb-10 -ml-6 text-left md:-ml-8")}
      <div
        className="docs-panel -ml-6 w-[calc(100%+3rem)] overflow-hidden bg-white text-black md:-ml-8 md:w-[calc(100%+4rem)]"
        data-mo=""
        style={{ "--mo-i": 1 } as React.CSSProperties}
      >
        <div className="h-[8px] bg-[#E4F7FD]" />
        <ul className="divide-y divide-[#B0E9FD]" data-mo-stagger="">
          {block.documents.map((doc) => (
            <li
              key={doc.href}
              className="doc-row flex h-[60px] items-center justify-between gap-6 overflow-hidden px-6 sm:px-[112.5px]"
              data-mo=""
            >
              <span className="min-w-0 truncate text-sm leading-snug">
                {doc.label}
              </span>
              <div className="flex shrink-0 items-center gap-4">
                <a
                  href={doc.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Open PDF: ${doc.label}`}
                  className="pdf pdf-link inline-flex items-center gap-2 text-black"
                >
                  <span className="text-sm underline">View PDF</span>
                  <PdfIcon className="h-6 w-6" />
                </a>
              </div>
            </li>
          ))}
        </ul>
      </div>
      {block.note ? (
        <p className="mt-6 text-xs font-light text-white/60">{block.note}</p>
      ) : null}
    </Section>
  );
}

export default DocumentList;
