import type { Metadata } from "next";
import Script from "next/script";
import {
  Inter,
  Cormorant_Garamond,
  Libre_Franklin,
} from "next/font/google";
import { MotionRouter } from "@/components/layout/MotionRouter";
import { ExternalLinkGuard } from "@/components/layout/ExternalLinkGuard";
import "./globals.css";

/** Body / UI face — matches the bundled Inter on the live site. */
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

/**
 * Display face — free substitute for the live site's paid Adobe
 * `ivypresto-headline`. Chosen for its high-contrast Didone character.
 * Used for all headings, hero copy, and italic accents.
 */
const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
});

/**
 * Secondary body face — the live site pairs Inter with Libre Franklin
 * (`--font-franklin`); the timeline entry titles and several body blocks
 * use it.
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
      className={`${inter.variable} ${cormorant.variable} ${franklin.variable} h-full antialiased`}
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
      <body className="min-h-full flex flex-col font-[family-name:var(--font-inter)]">
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
