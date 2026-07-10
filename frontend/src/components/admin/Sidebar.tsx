"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserButton } from "@clerk/nextjs";

type IconName = "dashboard" | "pages" | "blog" | "settings" | "legal" | "media";

const NAV: { href: string; label: string; icon: IconName; exact?: boolean }[] = [
  { href: "/admin", label: "Dashboard", icon: "dashboard", exact: true },
  { href: "/admin/pages", label: "Pages", icon: "pages" },
  { href: "/admin/blog", label: "Blog", icon: "blog" },
  { href: "/admin/settings", label: "Settings", icon: "settings" },
  { href: "/admin/legal", label: "Legal", icon: "legal" },
  { href: "/admin/media", label: "Media", icon: "media" },
];

function Icon({ name }: { name: IconName }) {
  const common = {
    width: 17,
    height: 17,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.5,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    className: "shrink-0",
  };
  switch (name) {
    case "dashboard":
      return (
        <svg {...common}>
          <path d="M3 9.5 12 3l9 6.5" />
          <path d="M5 9.2V20h14V9.2" />
        </svg>
      );
    case "pages":
      return (
        <svg {...common}>
          <path d="M6 3h8l4 4v14H6z" />
          <path d="M14 3v4h4" />
          <path d="M9 12.5h6M9 16h4" />
        </svg>
      );
    case "blog":
      return (
        <svg {...common}>
          <path d="M4 20h4L19 9l-4-4L4 16z" />
          <path d="M14 6l4 4" />
        </svg>
      );
    case "settings":
      return (
        <svg {...common}>
          <line x1="4" y1="8" x2="20" y2="8" />
          <circle cx="9" cy="8" r="2.1" />
          <line x1="4" y1="16" x2="20" y2="16" />
          <circle cx="15" cy="16" r="2.1" />
        </svg>
      );
    case "legal":
      return (
        <svg {...common}>
          <path d="M12 3l7 3v5.5c0 4-3 7-7 9.5-4-2.5-7-5.5-7-9.5V6z" />
        </svg>
      );
    case "media":
      return (
        <svg {...common}>
          <rect x="3" y="4.5" width="18" height="15" rx="2" />
          <circle cx="8.5" cy="10" r="1.6" />
          <path d="M21 16l-5-4.5L5 19.5" />
        </svg>
      );
  }
}

export function Sidebar() {
  const pathname = usePathname();
  return (
    <aside className="flex w-64 shrink-0 flex-col border-r border-[#17171b] bg-[#0a0a0c] px-3 py-5">
      {/* Brand lockup */}
      <Link
        href="/admin"
        className="mb-5 flex items-center gap-3 border-b border-[#17171b] px-2 pb-5"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/admin/hd-logo.png"
          width={34}
          height={34}
          alt="H × PWRL CMS"
          className="rounded-[9px]"
        />
        <span className="flex flex-col leading-none">
          <span
            className="text-[15px] tracking-tight text-white"
            style={{ fontFamily: "var(--font-display)" }}
          >
            H × PWRL
          </span>
          <span className="mt-1.5 text-[10px] uppercase tracking-[0.28em] text-[#63636c]">
            CMS
          </span>
        </span>
      </Link>

      {/* Nav */}
      <span className="mb-2 px-3 text-[10px] font-medium uppercase tracking-[0.2em] text-[#54545c]">
        Content
      </span>
      <nav className="flex flex-1 flex-col gap-0.5">
        {NAV.map((item) => {
          const active = item.exact
            ? pathname === item.href
            : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={`group relative flex items-center gap-3 rounded-lg py-2 pl-3.5 pr-3 text-[13px] transition-colors duration-150 ${
                active
                  ? "bg-[#151519] text-white"
                  : "text-[#8b8b94] hover:bg-[#101014] hover:text-white"
              }`}
            >
              {active ? (
                <span className="absolute left-0 top-1/2 h-4 w-[2px] -translate-y-1/2 rounded-full bg-white" />
              ) : null}
              <span
                className={
                  active
                    ? "text-white"
                    : "text-[#5c5c64] transition-colors group-hover:text-[#c9c9d0]"
                }
              >
                <Icon name={item.icon} />
              </span>
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* View live site */}
      <a
        href="/"
        target="_blank"
        rel="noreferrer"
        className="mb-4 flex items-center justify-between rounded-lg px-3.5 py-2 text-[12px] text-[#71717a] transition-colors hover:bg-[#101014] hover:text-white"
      >
        View live site
        <span aria-hidden className="text-[#54545c]">
          ↗
        </span>
      </a>

      {/* Account */}
      <div className="flex items-center gap-3 border-t border-[#17171b] px-2 pt-4">
        <UserButton appearance={{ elements: { avatarBox: "h-8 w-8" } }} />
        <span className="flex flex-col leading-tight">
          <span className="text-[12px] text-[#c9c9d0]">Signed in</span>
          <span className="text-[10px] text-[#54545c]">Human Design</span>
        </span>
      </div>
    </aside>
  );
}

export default Sidebar;
