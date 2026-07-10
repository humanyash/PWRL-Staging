import type { Metadata } from "next";
import Script from "next/script";
import { Libre_Franklin } from "next/font/google";
import { MotionRouter } from "@/components/layout/MotionRouter";
import { ExternalLinkGuard } from "@/components/layout/ExternalLinkGuard";
import "./globals.css";

/**
 * Libre Franklin is the site's sole body / UI face. Combined with Adobe
 * Typekit's ivypresto-headline (loaded via the <link> below) this pairing
 * matches production exactly — no Inter, no Cormorant fallbacks.
 */
const franklin = Libre_Franklin({
  variable: "--font-franklin-sans",
  subsets: ["latin"],
  weight: ["300", "400", "600", "700"],
});

export const metadata: Metadata = {
  title: "PWRL — Private Tech, Nasdaq Listed.",
  description: "18 leading private tech companies. One Nasdaq-listed stock.",
};

/**
 * Google Analytics 4 measurement ID. Override per environment by setting
 * `NEXT_PUBLIC_GA_ID`; falls back to the PWRL production property.
 */
const GA_MEASUREMENT_ID =
  process.env.NEXT_PUBLIC_GA_ID ?? "G-S620CRDB9D";

/**
 * Adobe Fonts (Typekit) kit ID. Defaults to the client-owned production kit
 * `xyr7qcs` (serves `ivypresto-headline`). Override per environment with
 * `NEXT_PUBLIC_TYPEKIT_ID` if a different kit is needed.
 */
const TYPEKIT_ID = process.env.NEXT_PUBLIC_TYPEKIT_ID ?? "xyr7qcs";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      // data-mo-router: tells public/pwrl-motion.js the App Router adapter
      // (MotionRouter) owns page transitions — see the kinetic-layer handoff.
      data-mo-router=""
      className={`${franklin.variable} h-full antialiased`}
    >
      <head>
        {/* Adobe Fonts (Typekit) — serves the real ivypresto-headline
            display face (Regular/Italic/Bold/Bold Italic). globals.css
            `--font-display` prefers "ivypresto-headline" with Cormorant
            Garamond as the fallback. Kit ID is env-driven so dev/staging/
            prod can each point at their own kit without a code change. */}
        <link rel="preconnect" href="https://use.typekit.net" />
        <link
          rel="stylesheet"
          href={`https://use.typekit.net/${TYPEKIT_ID}.css`}
        />
      </head>
      <body className="min-h-full flex flex-col font-[family-name:var(--font-franklin)]">
        {children}
        <MotionRouter />
        <ExternalLinkGuard />
        {/* Kinetic layer runtime (design handoff 06.11.26). Without it
            nothing is ever hidden — all pre-states gate on html[data-mo-on],
            which only this script sets. */}
        <Script src="/pwrl-motion.js" strategy="afterInteractive" />

        {GA_MEASUREMENT_ID ? (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
              strategy="afterInteractive"
            />
            <Script id="ga-init" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${GA_MEASUREMENT_ID}');
              `}
            </Script>
          </>
        ) : null}
      </body>
    </html>
  );
}