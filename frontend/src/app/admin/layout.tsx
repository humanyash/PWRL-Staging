import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";

export const metadata: Metadata = {
  title: "H × PWRL CMS",
  robots: { index: false, follow: false },
};

/**
 * Admin root. Scopes Clerk to /admin only (the public site never loads it) and
 * applies the Human Design dark chrome to every Clerk widget.
 */
export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider
      signInUrl="/admin/sign-in"
      signUpUrl="/admin/sign-in"
      signInForceRedirectUrl="/admin"
      signUpForceRedirectUrl="/admin"
      appearance={{
        variables: {
          colorPrimary: "#ffffff",
          colorPrimaryForeground: "#0b0b0d",
          colorBackground: "#0b0b0d",
          colorForeground: "#f5f5f5",
          colorMutedForeground: "#9a9aa2",
          colorInput: "#161619",
          colorInputForeground: "#f5f5f5",
          colorNeutral: "#f5f5f5",
          borderRadius: "0.4rem",
        },
        elements: {
          card: "bg-[#111114] border border-[#26262b] shadow-none",
          headerTitle: "text-white",
          socialButtonsBlockButton:
            "bg-[#161619] border border-[#26262b] text-white hover:bg-[#1d1d21]",
        },
      }}
    >
      {children}
    </ClerkProvider>
  );
}
