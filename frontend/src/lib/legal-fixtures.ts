import fs from "node:fs";
import path from "node:path";
import type { LegalPageData } from "@/types/legal";

function readHtml(name: string): string {
  return fs.readFileSync(
    path.join(process.cwd(), "src/content/legal", name),
    "utf8",
  );
}

/** Fixture legal pages — verbatim copy from powerlawfunds.com/pwrl/legal + /terms. */
export const LEGAL_FIXTURES: Record<string, LegalPageData> = {
  legal: {
    slug: "/legal",
    title: "Privacy Policy",
    metaDescription: "Powerlaw privacy policy.",
    body: readHtml("privacy.html"),
    effectiveDate: "2025-05-01",
  },
  terms: {
    slug: "/terms",
    title: "Terms & Conditions",
    metaDescription: "Powerlaw website terms and conditions.",
    body: readHtml("terms.html"),
  },
};

export function getFixtureLegalPage(slug: string): LegalPageData | null {
  const key = slug.replace(/^\//, "");
  return LEGAL_FIXTURES[key] ?? null;
}
