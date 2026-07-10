import Link from "next/link";
import { listAdminPages } from "@/lib/admin/data";

export const dynamic = "force-dynamic";

function label(slug: string) {
  if (slug === "/") return "Home";
  return slug
    .replace("/", "")
    .replace(/-/g, " ")
    .replace(/^./, (c) => c.toUpperCase());
}

function toParam(slug: string) {
  return slug === "/" ? "home" : slug.replace(/^\//, "");
}

export default async function AdminPagesList() {
  const pages = await listAdminPages();
  return (
    <div>
      <h1
        className="mb-8 text-2xl text-white"
        style={{ fontFamily: "var(--font-display)" }}
      >
        Pages
      </h1>
      {pages.length === 0 ? (
        <p className="text-sm text-[#6f6f78]">
          No pages yet — run <code className="text-[#9a9aa2]">npm run seed</code>{" "}
          to import content.
        </p>
      ) : (
        <div className="flex flex-col gap-2">
          {pages.map((p) => (
            <Link
              key={p.slug}
              href={`/admin/pages/${toParam(p.slug)}`}
              className="flex items-center justify-between rounded-lg border border-[#1e1e22] bg-[#111114] px-5 py-4 transition-colors hover:border-[#33333a] hover:bg-[#15151a]"
            >
              <span className="text-sm text-white">{label(p.slug)}</span>
              <span className="text-xs text-[#6f6f78]">{p.slug}</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
