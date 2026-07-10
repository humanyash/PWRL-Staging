"use client";

import React, { useRef, useState, useTransition } from "react";
import { uploadMedia } from "@/app/admin/actions";

/* ----------------------------- helpers ----------------------------- */

export function humanize(key: string): string {
  return key
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/[_-]+/g, " ")
    .replace(/^./, (c) => c.toUpperCase());
}

const LONG_TEXT_KEYS = new Set([
  "body",
  "paragraphs",
  "intro",
  "subheading",
  "quote",
  "answer",
  "a",
  "bio",
  "graphicCaption",
  "footnote",
  "note",
  "excerpt",
  "description",
  "caption",
  "panelBody",
]);

const IMAGE_KEYS = new Set([
  "icon",
  "image",
  "logo",
  "backgroundImage",
  "heroImage",
  "cardImage",
  "thumbnail",
]);

const HIDDEN_KEYS = new Set(["__component", "id"]);

type Json = unknown;

function isImageValue(v: Json): v is { src: string; alt?: string } {
  return (
    typeof v === "object" &&
    v !== null &&
    !Array.isArray(v) &&
    typeof (v as { src?: unknown }).src === "string"
  );
}

/** A structurally-identical value with strings/images cleared (for "add item"). */
function blankLike(v: Json): Json {
  if (typeof v === "string") return "";
  if (typeof v === "number") return 0;
  if (typeof v === "boolean") return false;
  if (Array.isArray(v)) return [];
  if (v && typeof v === "object") {
    const out: Record<string, Json> = {};
    for (const [k, val] of Object.entries(v)) out[k] = blankLike(val);
    return out;
  }
  return "";
}

/* --------------------------- primitives ---------------------------- */

const inputCls =
  "w-full rounded-md border border-[#26262b] bg-[#0f0f12] px-3 py-2 text-sm text-white outline-none focus:border-[#4a4a55]";

export function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.12em] text-[#7d7d87]">
      {children}
    </span>
  );
}

function TextInput({
  value,
  onChange,
  multiline,
}: {
  value: string;
  onChange: (v: string) => void;
  multiline?: boolean;
}) {
  if (multiline) {
    return (
      <textarea
        className={`${inputCls} min-h-[92px] resize-y leading-relaxed`}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    );
  }
  return (
    <input
      className={inputCls}
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  );
}

/* --------------------------- ImageField ---------------------------- */

export function ImageField({
  value,
  onChange,
}: {
  value: { src: string; alt?: string } | null | undefined;
  onChange: (v: { src: string; alt: string } | null) => void;
}) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const src = value?.src ?? "";
  const alt = value?.alt ?? "";

  function upload(file: File) {
    setError(null);
    const fd = new FormData();
    fd.set("file", file);
    fd.set("alt", alt);
    startTransition(async () => {
      const res = await uploadMedia(fd);
      if (res.ok) onChange({ src: res.url, alt });
      else setError(res.error);
    });
  }

  return (
    <div>
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          const file = e.dataTransfer.files?.[0];
          if (file) upload(file);
        }}
        onClick={() => inputRef.current?.click()}
        className={`flex cursor-pointer items-center gap-4 rounded-lg border border-dashed p-3 transition-colors ${
          dragging
            ? "border-white bg-[#17171b]"
            : "border-[#33333a] hover:border-[#4a4a55]"
        }`}
      >
        {src ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={src}
            alt={alt}
            className="h-16 w-16 shrink-0 rounded-md object-cover"
          />
        ) : (
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-md bg-[#161619] text-[10px] text-[#6f6f78]">
            No image
          </div>
        )}
        <div className="min-w-0 flex-1 text-sm text-[#9a9aa2]">
          {pending
            ? "Uploading…"
            : dragging
              ? "Drop to upload"
              : "Drag an image here, or click to choose a file."}
          {src ? (
            <span className="mt-1 block truncate text-xs text-[#5f5f68]">
              {src}
            </span>
          ) : null}
        </div>
        {src ? (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onChange(null);
            }}
            className="shrink-0 rounded-md border border-[#33333a] px-2 py-1 text-xs text-[#9a9aa2] hover:text-white"
          >
            Remove
          </button>
        ) : null}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) upload(file);
          e.target.value = "";
        }}
      />
      {src ? (
        <div className="mt-2">
          <FieldLabel>Alt text</FieldLabel>
          <TextInput
            value={alt}
            onChange={(v) => onChange({ src, alt: v })}
          />
        </div>
      ) : null}
      {error ? (
        <p className="mt-1 text-xs text-red-400">{error}</p>
      ) : null}
    </div>
  );
}

/* ---------------------- generic value editor ----------------------- */

export function FieldControl({
  fieldKey,
  value,
  onChange,
}: {
  fieldKey: string;
  value: Json;
  onChange: (v: Json) => void;
}) {
  // Image object, or a null/absent value under an image-y key.
  if (isImageValue(value) || (value == null && IMAGE_KEYS.has(fieldKey))) {
    return (
      <ImageField
        value={value as { src: string; alt?: string } | null}
        onChange={(v) => onChange(v)}
      />
    );
  }

  if (typeof value === "boolean") {
    return (
      <label className="inline-flex cursor-pointer items-center gap-2 text-sm text-white">
        <input
          type="checkbox"
          checked={value}
          onChange={(e) => onChange(e.target.checked)}
        />
        {value ? "On" : "Off"}
      </label>
    );
  }

  if (typeof value === "number") {
    return (
      <input
        type="number"
        className={inputCls}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
      />
    );
  }

  if (typeof value === "string" || value == null) {
    const s = (value as string) ?? "";
    const multiline =
      LONG_TEXT_KEYS.has(fieldKey) || s.includes("\n") || s.length > 70;
    return <TextInput value={s} onChange={onChange} multiline={multiline} />;
  }

  if (Array.isArray(value)) {
    const allStrings = value.every((v) => typeof v === "string");
    if (allStrings) {
      return (
        <StringListField
          value={value as string[]}
          onChange={(v) => onChange(v)}
        />
      );
    }
    return (
      <ObjectArrayField value={value as Json[]} onChange={(v) => onChange(v)} />
    );
  }

  if (value && typeof value === "object") {
    return (
      <ObjectFields
        value={value as Record<string, Json>}
        onChange={(v) => onChange(v)}
      />
    );
  }

  return null;
}

export function ObjectFields({
  value,
  onChange,
}: {
  value: Record<string, Json>;
  onChange: (v: Record<string, Json>) => void;
}) {
  const keys = Object.keys(value).filter((k) => !HIDDEN_KEYS.has(k));
  return (
    <div className="flex flex-col gap-4">
      {keys.map((k) => (
        <div key={k}>
          <FieldLabel>{humanize(k)}</FieldLabel>
          <FieldControl
            fieldKey={k}
            value={value[k]}
            onChange={(v) => onChange({ ...value, [k]: v })}
          />
        </div>
      ))}
    </div>
  );
}

function StringListField({
  value,
  onChange,
}: {
  value: string[];
  onChange: (v: string[]) => void;
}) {
  return (
    <div className="flex flex-col gap-2">
      {value.map((item, i) => (
        <div key={i} className="flex gap-2">
          <textarea
            className={`${inputCls} min-h-[64px] flex-1 resize-y leading-relaxed`}
            value={item}
            onChange={(e) => {
              const next = [...value];
              next[i] = e.target.value;
              onChange(next);
            }}
          />
          <button
            type="button"
            onClick={() => onChange(value.filter((_, j) => j !== i))}
            className="shrink-0 self-start rounded-md border border-[#33333a] px-2 py-1 text-xs text-[#9a9aa2] hover:text-white"
          >
            ✕
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={() => onChange([...value, ""])}
        className="self-start rounded-md border border-[#33333a] px-3 py-1.5 text-xs text-[#9a9aa2] hover:text-white"
      >
        + Add
      </button>
    </div>
  );
}

function ObjectArrayField({
  value,
  onChange,
}: {
  value: Json[];
  onChange: (v: Json[]) => void;
}) {
  return (
    <div className="flex flex-col gap-3">
      {value.map((item, i) => (
        <div
          key={i}
          className="rounded-lg border border-[#26262b] bg-[#0d0d10] p-4"
        >
          <div className="mb-3 flex items-center justify-between">
            <span className="text-xs font-semibold text-[#7d7d87]">
              Item {i + 1}
            </span>
            <button
              type="button"
              onClick={() => onChange(value.filter((_, j) => j !== i))}
              className="rounded-md border border-[#33333a] px-2 py-1 text-xs text-[#9a9aa2] hover:text-white"
            >
              Remove
            </button>
          </div>
          <FieldControl
            fieldKey=""
            value={item}
            onChange={(v) => {
              const next = [...value];
              next[i] = v;
              onChange(next);
            }}
          />
        </div>
      ))}
      <button
        type="button"
        onClick={() =>
          onChange([...value, value.length ? blankLike(value[0]) : {}])
        }
        className="self-start rounded-md border border-[#33333a] px-3 py-1.5 text-xs text-[#9a9aa2] hover:text-white"
      >
        + Add item
      </button>
    </div>
  );
}
