"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { ObjectFields, humanize, FieldLabel } from "@/components/admin/fields";
import { SaveBar } from "@/components/admin/SaveBar";
import { savePage } from "@/app/admin/actions";
import type { AdminPageRow } from "@/lib/admin/data";
import type { Block, SEO } from "@/types/blocks";

const inputCls =
  "w-full rounded-md border border-[#26262b] bg-[#0f0f12] px-3 py-2 text-sm text-white outline-none focus:border-[#4a4a55]";

function sectionTitle(block: Block): string {
  return humanize(block.__component.replace(/^sections\./, ""));
}

export function PageEditor({ page }: { page: AdminPageRow }) {
  const [title, setTitle] = useState(page.title ?? "");
  const [metaDescription, setMetaDescription] = useState(
    page.meta_description ?? "",
  );
  const [seo, setSeo] = useState<SEO>(page.seo ?? {});
  const [sections, setSections] = useState<Block[]>(page.sections ?? []);
  const [openIdx, setOpenIdx] = useState<number | null>(0);
  const [pending, start] = useTransition();
  const [status, setStatus] = useState<
    { kind: "ok" | "error"; message: string } | null
  >(null);

  function save() {
    setStatus(null);
    start(async () => {
      const res = await savePage({
        slug: page.slug,
        title,
        meta_description: metaDescription || null,
        seo,
        sections,
      });
      setStatus(
        res.ok
          ? { kind: "ok", message: "Saved — live on the site." }
          : { kind: "error", message: res.error },
      );
    });
  }

  const publicPath = page.slug;

  return (
    <div>
      <header className="mb-8 flex items-start justify-between">
        <div>
          <Link
            href="/admin/pages"
            className="text-xs text-[#6f6f78] hover:text-white"
          >
            ← Pages
          </Link>
          <h1
            className="mt-2 text-2xl text-white"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {page.slug === "/" ? "Home" : humanize(page.slug.replace("/", ""))}
          </h1>
          <p className="mt-1 text-xs text-[#6f6f78]">{page.slug}</p>
        </div>
        <a
          href={publicPath}
          target="_blank"
          rel="noreferrer"
          className="rounded-md border border-[#33333a] px-3 py-1.5 text-xs text-[#9a9aa2] hover:text-white"
        >
          View page ↗
        </a>
      </header>

      {/* Page meta + SEO */}
      <div className="mb-8 rounded-xl border border-[#1e1e22] bg-[#111114] p-6">
        <h2 className="mb-4 text-sm font-semibold text-white">
          Page &amp; SEO
        </h2>
        <div className="flex flex-col gap-4">
          <div>
            <FieldLabel>Title</FieldLabel>
            <input
              className={inputCls}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div>
            <FieldLabel>Meta description</FieldLabel>
            <textarea
              className={`${inputCls} min-h-[72px] resize-y`}
              value={metaDescription}
              onChange={(e) => setMetaDescription(e.target.value)}
            />
          </div>
          <ObjectFields
            value={seo as Record<string, unknown>}
            onChange={(v) => setSeo(v as SEO)}
          />
        </div>
      </div>

      {/* Sections */}
      <h2 className="mb-3 text-sm font-semibold text-white">Sections</h2>
      <div className="flex flex-col gap-3">
        {sections.map((block, i) => {
          const open = openIdx === i;
          return (
            <div
              key={i}
              className="overflow-hidden rounded-xl border border-[#1e1e22] bg-[#111114]"
            >
              <button
                type="button"
                onClick={() => setOpenIdx(open ? null : i)}
                className="flex w-full items-center justify-between px-6 py-4 text-left"
              >
                <span className="text-sm text-white">{sectionTitle(block)}</span>
                <span className="text-xs text-[#6f6f78]">
                  {open ? "Collapse" : "Edit"}
                </span>
              </button>
              {open ? (
                <div className="border-t border-[#1e1e22] px-6 py-5">
                  <ObjectFields
                    value={block as unknown as Record<string, unknown>}
                    onChange={(v) => {
                      const next = [...sections];
                      next[i] = v as unknown as Block;
                      setSections(next);
                    }}
                  />
                </div>
              ) : null}
            </div>
          );
        })}
        {sections.length === 0 ? (
          <p className="text-sm text-[#6f6f78]">
            No sections yet. Run the seed to populate content.
          </p>
        ) : null}
      </div>

      <SaveBar onSave={save} pending={pending} status={status} />
    </div>
  );
}
