"use client";

import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { uploadMedia, deleteMedia } from "@/app/admin/actions";
import type { AdminMediaRow } from "@/lib/admin/data";

const VIDEO_EXT = /\.(mp4|webm|mov|m4v)$/i;
const SVG_EXT = /\.svg$/i;

function mediaKind(row: AdminMediaRow): "video" | "svg" | "image" {
  const url = row.url.split("?")[0].split("#")[0];
  if ((row.content_type ?? "").startsWith("video/") || VIDEO_EXT.test(url))
    return "video";
  if ((row.content_type ?? "") === "image/svg+xml" || SVG_EXT.test(url))
    return "svg";
  return "image";
}

export function MediaLibrary({ media }: { media: AdminMediaRow[] }) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [pending, start] = useTransition();
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);

  function upload(file: File) {
    setError(null);
    const fd = new FormData();
    fd.set("file", file);
    start(async () => {
      const res = await uploadMedia(fd);
      if (res.ok) router.refresh();
      else setError(res.error);
    });
  }

  function remove(row: AdminMediaRow) {
    if (!confirm("Delete this file from the library?")) return;
    start(async () => {
      const res = await deleteMedia(row.id, row.path);
      if (res.ok) router.refresh();
      else setError(res.error);
    });
  }

  async function copy(url: string) {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(url);
      setTimeout(() => setCopied(null), 1500);
    } catch {
      /* clipboard unavailable */
    }
  }

  return (
    <div>
      <h1
        className="mb-8 text-2xl text-white"
        style={{ fontFamily: "var(--font-display)" }}
      >
        Media
      </h1>

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
        className={`mb-8 flex cursor-pointer items-center justify-center rounded-xl border border-dashed p-10 text-sm transition-colors ${
          dragging
            ? "border-white bg-[#17171b] text-white"
            : "border-[#33333a] text-[#9a9aa2] hover:border-[#4a4a55]"
        }`}
      >
        {pending
          ? "Uploading…"
          : "Drag an image, video, or SVG here, or click to upload to the library."}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*,video/*,.svg,image/svg+xml"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) upload(file);
          e.target.value = "";
        }}
      />
      {error ? <p className="mb-4 text-sm text-red-400">{error}</p> : null}

      {media.length === 0 ? (
        <p className="text-sm text-[#6f6f78]">No uploads yet.</p>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
          {media.map((m) => {
            const kind = mediaKind(m);
            return (
            <div
              key={m.id}
              className="overflow-hidden rounded-lg border border-[#1e1e22] bg-[#111114]"
            >
              <div className="relative">
                {kind === "video" ? (
                  <video
                    src={`${m.url.split("#")[0]}#t=0.1`}
                    muted
                    playsInline
                    preload="metadata"
                    className="aspect-square w-full bg-black object-contain"
                  />
                ) : (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={m.url}
                    alt={m.alt ?? ""}
                    className={`aspect-square w-full bg-[#0d0d10] ${
                      kind === "svg" ? "object-contain p-4" : "object-cover"
                    }`}
                  />
                )}
                <span className="absolute left-1.5 top-1.5 rounded bg-black/70 px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-white">
                  {kind}
                </span>
              </div>
              <div className="flex items-center justify-between gap-2 p-2">
                <button
                  type="button"
                  onClick={() => copy(m.url)}
                  className="truncate text-left text-[11px] text-[#9a9aa2] hover:text-white"
                  title={m.url}
                >
                  {copied === m.url ? "Copied!" : "Copy URL"}
                </button>
                <button
                  type="button"
                  onClick={() => remove(m)}
                  className="shrink-0 text-[11px] text-red-400 hover:text-red-300"
                >
                  Delete
                </button>
              </div>
            </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
