"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { FieldLabel } from "@/components/admin/fields";
import { SaveBar } from "@/components/admin/SaveBar";
import { saveLegalPage } from "@/app/admin/actions";
import type { AdminLegalRow } from "@/lib/admin/data";

const inputCls =
  "w-full rounded-md border border-[#26262b] bg-[#0f0f12] px-3 py-2 text-sm text-white outline-none focus:border-[#4a4a55]";

export function LegalEditor({ page }: { page: AdminLegalRow }) {
  const [title, setTitle] = useState(page.title ?? "");
  const [metaDescription, setMetaDescription] = useState(
    page.meta_description ?? "",
  );
  const [body, setBody] = useState(page.body ?? "");
  const [effectiveDate, setEffectiveDate] = useState(page.effective_date ?? "");
  const [pending, start] = useTransition();
  const [status, setStatus] = useState<
    { kind: "ok" | "error"; message: string } | null
  >(null);

  function save() {
    setStatus(null);
    start(async () => {
      const res = await saveLegalPage({
        slug: page.slug,
        title,
        meta_description: metaDescription || null,
        body,
        effective_date: effectiveDate || null,
      });
      setStatus(
        res.ok
          ? { kind: "ok", message: "Saved — live on the site." }
          : { kind: "error", message: res.error },
      );
    });
  }

  return (
    <div>
      <Link href="/admin/legal" className="text-xs text-[#6f6f78] hover:text-white">
        ← Legal
      </Link>
      <h1
        className="mb-8 mt-2 text-2xl text-white"
        style={{ fontFamily: "var(--font-display)" }}
      >
        {title || page.slug}
      </h1>

      <div className="flex flex-col gap-5">
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
          <input
            className={inputCls}
            value={metaDescription}
            onChange={(e) => setMetaDescription(e.target.value)}
          />
        </div>
        <div>
          <FieldLabel>Effective date (optional)</FieldLabel>
          <input
            className={inputCls}
            value={effectiveDate}
            onChange={(e) => setEffectiveDate(e.target.value)}
            placeholder="YYYY-MM-DD"
          />
        </div>
        <div>
          <FieldLabel>Body (HTML)</FieldLabel>
          <textarea
            className={`${inputCls} min-h-[480px] resize-y font-mono text-xs leading-relaxed`}
            value={body}
            onChange={(e) => setBody(e.target.value)}
          />
        </div>
      </div>

      <SaveBar onSave={save} pending={pending} status={status} />
    </div>
  );
}
