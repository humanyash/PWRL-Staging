import { SignIn } from "@clerk/nextjs";

export const dynamic = "force-dynamic";

/** HD-branded login: black canvas, centered h· mark, single Google sign-in. */
export default function AdminSignInPage() {
  return (
    <div className="admin-root flex min-h-screen flex-col items-center justify-center gap-10 bg-[#0b0b0d] px-6">
      <div className="flex flex-col items-center gap-4">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/admin/hd-logo.png"
          width={56}
          height={56}
          alt="H × PWRL CMS"
          className="rounded-xl"
        />
        <p
          className="text-sm uppercase tracking-[0.35em] text-[#9a9aa2]"
          style={{ fontFamily: "var(--font-display)" }}
        >
          H × PWRL CMS
        </p>
      </div>
      <SignIn />
    </div>
  );
}
