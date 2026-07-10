import { Sidebar } from "@/components/admin/Sidebar";

// Admin pages read live content and are Clerk-gated — never prerender.
export const dynamic = "force-dynamic";

export default function AdminAppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="admin-root flex min-h-screen bg-[#0b0b0d] text-[#f5f5f5] font-[family-name:var(--font-franklin)]">
      <Sidebar />
      <main className="min-w-0 flex-1">
        <div className="mx-auto max-w-5xl px-8 py-10">{children}</div>
      </main>
    </div>
  );
}
