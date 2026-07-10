"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserButton } from "@clerk/nextjs";

const NAV = [
  { href: "/admin", label: "Dashboard", exact: true },
  { href: "/admin/pages", label: "Pages" },
  { href: "/admin/blog", label: "Blog" },
  { href: "/admin/settings", label: "Settings" },
  { href: "/admin/legal", label: "Legal" },
  { href: "/admin/media", label: "Media" },
];

export function Sidebar() {
  const pathname = usePathname();
  return (
    <aside className="flex w-60 shrink-0 flex-col border-r border-[#1e1e22] bg-[#09090b] px-4 py-6">
      <Link href="/admin" className="mb-9 flex items-center gap-3 px-2">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/admin/hd-mark.svg" width={28} height={28} alt="Human Design" />
        <span className="flex flex-col leading-tight">
          <span
            className="text-sm text-white"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Human Design
          </span>
          <span className="text-[11px] uppercase tracking-[0.2em] text-[#6f6f78]">
            PWRL CMS
          </span>
        </span>
      </Link>

      <nav className="flex flex-1 flex-col gap-1">
        {NAV.map((item) => {
          const active = item.exact
            ? pathname === item.href
            : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`rounded-md px-3 py-2 text-sm transition-colors ${
                active
                  ? "bg-[#17171b] text-white"
                  : "text-[#9a9aa2] hover:bg-[#131317] hover:text-white"
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-6 flex items-center gap-3 border-t border-[#1e1e22] px-2 pt-5">
        <UserButton
          appearance={{ elements: { avatarBox: "h-8 w-8" } }}
        />
        <span className="text-xs text-[#6f6f78]">Signed in</span>
      </div>
    </aside>
  );
}

export default Sidebar;
