import Link from "next/link";
import { listAdminBlogPosts } from "@/lib/admin/data";

export const dynamic = "force-dynamic";

export default async function AdminBlogList() {
  const posts = await listAdminBlogPosts();
  return (
    <div>
      <header className="mb-8 flex items-center justify-between">
        <h1
          className="text-2xl text-white"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Blog
        </h1>
        <Link
          href="/admin/blog/new"
          className="rounded-md bg-white px-4 py-2 text-sm font-semibold text-black hover:opacity-90"
        >
          New article
        </Link>
      </header>

      {posts.length === 0 ? (
        <p className="text-sm text-[#6f6f78]">No articles yet.</p>
      ) : (
        <div className="flex flex-col gap-2">
          {posts.map((p) => (
            <Link
              key={p.id}
              href={`/admin/blog/${p.id}`}
              className="flex items-center justify-between rounded-lg border border-[#1e1e22] bg-[#111114] px-5 py-4 transition-colors hover:border-[#33333a] hover:bg-[#15151a]"
            >
              <span className="min-w-0 truncate text-sm text-white">
                {p.title || "Untitled"}
              </span>
              <span
                className={`ml-4 shrink-0 rounded-full px-2.5 py-0.5 text-[11px] ${
                  p.status === "published"
                    ? "bg-emerald-500/15 text-emerald-400"
                    : "bg-amber-500/15 text-amber-400"
                }`}
              >
                {p.status}
              </span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
