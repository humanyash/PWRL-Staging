import Link from "next/link";

export const dynamic = "force-dynamic";

const SECTIONS = [
  {
    href: "/admin/pages",
    title: "Pages",
    body: "Edit copy and swap images across the marketing site.",
  },
  {
    href: "/admin/blog",
    title: "Blog",
    body: "Write and publish Learn articles. Save drafts before going live.",
  },
  {
    href: "/admin/settings",
    title: "Settings",
    body: "Announcement banner, navigation, footer, and social links.",
  },
  {
    href: "/admin/legal",
    title: "Legal",
    body: "Privacy Policy and Terms & Conditions.",
  },
  {
    href: "/admin/media",
    title: "Media",
    body: "The uploaded image library used across the site.",
  },
];

export default function AdminDashboard() {
  return (
    <div>
      <header className="mb-10">
        <h1
          className="text-3xl text-white"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Content
        </h1>
        <p className="mt-2 text-sm text-[#9a9aa2]">
          Manage everything on the PWRL website. Changes go live immediately.
        </p>
      </header>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {SECTIONS.map((s) => (
          <Link
            key={s.href}
            href={s.href}
            className="group rounded-xl border border-[#1e1e22] bg-[#111114] p-6 transition-colors hover:border-[#33333a] hover:bg-[#15151a]"
          >
            <h2 className="text-lg text-white">{s.title}</h2>
            <p className="mt-1.5 text-sm leading-relaxed text-[#9a9aa2]">
              {s.body}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
