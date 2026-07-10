import Link from "next/link";
import { listAdminLegalPages } from "@/lib/admin/data";

export const dynamic = "force-dynamic";

export default async function AdminLegalList() {
  const pages = await listAdminLegalPages();
  return (
    <div>
      <h1
        className="mb-8 text-2xl text-white"
        style={{ fontFamily: "var(--font-display)" }}
      >
        Legal
      </h1>
      {pages.length === 0 ? (
        <p className="text-sm text-[#6f6f78]">No legal pages yet.</p>
      ) : (
        <div className="flex flex-col gap-2">
          {pages.map((p) => (
            <Link
              key={p.slug}
              href={`/admin/legal/${p.slug}`}
              className="flex items-center justify-between rounded-lg border border-[#1e1e22] bg-[#111114] px-5 py-4 transition-colors hover:border-[#33333a] hover:bg-[#15151a]"
            >
              <span className="text-sm text-white">{p.title || p.slug}</span>
              <span className="text-xs text-[#6f6f78]">/{p.slug}</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
