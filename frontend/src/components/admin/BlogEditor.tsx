"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  FieldControl,
  FieldLabel,
  ImageField,
} from "@/components/admin/fields";
import { SaveBar } from "@/components/admin/SaveBar";
import { saveBlogPost, deleteBlogPost } from "@/app/admin/actions";
import type { AdminBlogRow } from "@/lib/admin/data";
import type { SEO } from "@/types/blocks";

const inputCls =
  "w-full rounded-md border border-[#26262b] bg-[#0f0f12] px-3 py-2 text-sm text-white outline-none focus:border-[#4a4a55]";

function slugify(s: string) {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

const EMPTY: AdminBlogRow = {
  id: "",
  slug: "",
  title: "",
  status: "draft",
  excerpt: "",
  card_image: null,
  hero_image: null,
  body: [""],
  sections: [],
  seo: {},
  sort_order: 0,
  published_label: "",
  date: "",
  updated_at: "",
};

export function BlogEditor({ post }: { post?: AdminBlogRow }) {
  const router = useRouter();
  const initial = post ?? EMPTY;
  const isNew = !post;
  const [title, setTitle] = useState(initial.title);
  const [slug, setSlug] = useState(initial.slug);
  const [slugTouched, setSlugTouched] = useState(!isNew);
  const [status, setStatus] = useState<"draft" | "published">(initial.status);
  const [date, setDate] = useState(initial.date ?? "");
  const [publishedLabel, setPublishedLabel] = useState(
    initial.published_label ?? "",
  );
  const [excerpt, setExcerpt] = useState(initial.excerpt ?? "");
  const [cardImage, setCardImage] = useState(initial.card_image);
  const [heroImage, setHeroImage] = useState(initial.hero_image);
  const [body, setBody] = useState<string[]>(initial.body ?? []);
  const [sections, setSections] = useState(initial.sections ?? []);
  const [seo] = useState<SEO>(initial.seo ?? {});
  const [pending, start] = useTransition();
  const [msg, setMsg] = useState<
    { kind: "ok" | "error"; message: string } | null
  >(null);

  function onTitleChange(v: string) {
    setTitle(v);
    if (isNew && !slugTouched) setSlug(slugify(v));
  }

  function save(nextStatus?: "draft" | "published") {
    const finalStatus = nextStatus ?? status;
    if (nextStatus) setStatus(nextStatus);
    setMsg(null);
    start(async () => {
      const res = await saveBlogPost({
        id: post?.id,
        slug,
        title,
        status: finalStatus,
        excerpt: excerpt || null,
        card_image: cardImage,
        hero_image: heroImage,
        body,
        sections,
        seo,
        published_label: publishedLabel || null,
        date: date || null,
      });
      if (res.ok) {
        setMsg({ kind: "ok", message: "Saved." });
        if (isNew && res.id) router.push(`/admin/blog/${res.id}`);
        else router.refresh();
      } else {
        setMsg({ kind: "error", message: res.error });
      }
    });
  }

  function remove() {
    if (!post) return;
    if (!confirm("Delete this article? This cannot be undone.")) return;
    start(async () => {
      const res = await deleteBlogPost(post.id, post.slug);
      if (res.ok) router.push("/admin/blog");
      else setMsg({ kind: "error", message: res.error });
    });
  }

  return (
    <div>
      <header className="mb-8 flex items-start justify-between">
        <div>
          <Link href="/admin/blog" className="text-xs text-[#6f6f78] hover:text-white">
            ← Blog
          </Link>
          <h1
            className="mt-2 text-2xl text-white"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {isNew ? "New article" : title || "Untitled"}
          </h1>
          <span
            className={`mt-2 inline-block rounded-full px-2.5 py-0.5 text-[11px] ${
              status === "published"
                ? "bg-emerald-500/15 text-emerald-400"
                : "bg-amber-500/15 text-amber-400"
            }`}
          >
            {status}
          </span>
        </div>
        {!isNew ? (
          <a
            href={`/learn/${slug}`}
            target="_blank"
            rel="noreferrer"
            className="rounded-md border border-[#33333a] px-3 py-1.5 text-xs text-[#9a9aa2] hover:text-white"
          >
            View ↗
          </a>
        ) : null}
      </header>

      <div className="flex flex-col gap-5">
        <div>
          <FieldLabel>Title</FieldLabel>
          <input
            className={inputCls}
            value={title}
            onChange={(e) => onTitleChange(e.target.value)}
          />
        </div>
        <div>
          <FieldLabel>Slug</FieldLabel>
          <input
            className={inputCls}
            value={slug}
            onChange={(e) => {
              setSlug(e.target.value);
              setSlugTouched(true);
            }}
          />
        </div>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div>
            <FieldLabel>Date (e.g. June 29, 2026)</FieldLabel>
            <input
              className={inputCls}
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>
          <div>
            <FieldLabel>Published label</FieldLabel>
            <input
              className={inputCls}
              value={publishedLabel}
              onChange={(e) => setPublishedLabel(e.target.value)}
            />
          </div>
        </div>
        <div>
          <FieldLabel>Excerpt</FieldLabel>
          <textarea
            className={`${inputCls} min-h-[72px] resize-y`}
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
          />
        </div>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div>
            <FieldLabel>Card image</FieldLabel>
            <ImageField value={cardImage} onChange={(v) => setCardImage(v)} />
          </div>
          <div>
            <FieldLabel>Hero image</FieldLabel>
            <ImageField value={heroImage} onChange={(v) => setHeroImage(v)} />
          </div>
        </div>
        <div>
          <FieldLabel>Intro paragraphs</FieldLabel>
          <FieldControl
            fieldKey="body"
            value={body}
            onChange={(v) => setBody(v as string[])}
          />
        </div>
        <div>
          <FieldLabel>Body sections</FieldLabel>
          <FieldControl
            fieldKey="sections"
            value={sections}
            onChange={(v) =>
              setSections(v as { heading: string; paragraphs: string[] }[])
            }
          />
        </div>
      </div>

      <SaveBar
        onSave={() => save()}
        pending={pending}
        status={msg}
        extra={
          <>
            {!isNew ? (
              <button
                type="button"
                onClick={remove}
                disabled={pending}
                className="rounded-md border border-red-500/40 px-3 py-2 text-sm text-red-400 hover:bg-red-500/10 disabled:opacity-50"
              >
                Delete
              </button>
            ) : null}
            {status === "published" ? (
              <button
                type="button"
                onClick={() => save("draft")}
                disabled={pending}
                className="rounded-md border border-[#33333a] px-3 py-2 text-sm text-[#9a9aa2] hover:text-white disabled:opacity-50"
              >
                Unpublish
              </button>
            ) : (
              <button
                type="button"
                onClick={() => save("published")}
                disabled={pending}
                className="rounded-md border border-emerald-500/40 px-3 py-2 text-sm text-emerald-400 hover:bg-emerald-500/10 disabled:opacity-50"
              >
                Publish
              </button>
            )}
          </>
        }
      />
    </div>
  );
}
