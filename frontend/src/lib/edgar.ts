/**
 * SEC EDGAR feed for Powerlaw Corp. (CIK 2052053 — from the live site's
 * prospectus link at /Archives/edgar/data/0002052053/).
 *
 * Uses the public submissions API (no key). SEC requires a descriptive
 * User-Agent with a contact address. Server-side only; cached via Next's
 * fetch revalidation (1 hour) so we stay far under SEC's rate guidance.
 */

const CIK = "0002052053";
const SUBMISSIONS_URL = `https://data.sec.gov/submissions/CIK${CIK}.json`;
const USER_AGENT =
  "Powerlaw Corp website rebuild (contact: Info@PWRL.com)";

export interface EdgarFiling {
  form: string;
  filingDate: string;
  description: string;
  href: string;
  accessionNumber: string;
}

interface SubmissionsRecent {
  accessionNumber: string[];
  filingDate: string[];
  form: string[];
  primaryDocument: string[];
  primaryDocDescription: string[];
}

/** Live maps bare ownership/registration form codes to full names… */
const FORM_NAMES: Record<string, string> = {
  "3": "Initial Statement Of Beneficial Ownership Of Securities",
  "4": "Statement Of Changes In Beneficial Ownership",
  "144": "Report Of Proposed Sale Of Securities",
  D: "Notice Of Exempt Offering Of Securities",
  "N-2": "Registration Statement For Closed-End Investment Companies",
  "DEF 14A": "Definitive Proxy Statement",
  "PRE 14A": "Preliminary Proxy Statement",
  "NT-NCSR": "Notification Of Late Filing",
};

/** …and word-by-word capitalizes descriptions ("N-CSRS" → "N-Csrs"). */
function titleCase(s: string): string {
  return s
    .toLowerCase()
    .replace(/(^|[\s-/])([a-z0-9])/g, (m, sep, ch) => sep + ch.toUpperCase());
}

export async function getFilings(limit = 40): Promise<EdgarFiling[]> {
  try {
    const res = await fetch(SUBMISSIONS_URL, {
      headers: { "User-Agent": USER_AGENT, Accept: "application/json" },
      next: { revalidate: 3600 },
    });
    if (!res.ok) return [];
    const data = await res.json();
    const r: SubmissionsRecent | undefined = data?.filings?.recent;
    if (!r?.accessionNumber?.length) return [];

    const cikNum = String(Number(CIK)); // archives path uses the unpadded CIK
    return r.accessionNumber.slice(0, limit).map((acc, i) => {
      const accNoDashes = acc.replace(/-/g, "");
      const doc = r.primaryDocument[i];
      const href = doc
        ? `https://www.sec.gov/Archives/edgar/data/${cikNum}/${accNoDashes}/${doc}`
        : `https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&CIK=${CIK}&type=&dateb=&owner=include&count=40`;
      const form = r.form[i] ?? "";
      const rawDesc =
        r.primaryDocDescription[i] || FORM_NAMES[form] || form || "Filing";
      return {
        form,
        filingDate: r.filingDate[i] ?? "",
        description: titleCase(rawDesc),
        href,
        accessionNumber: acc,
      };
    });
  } catch {
    return [];
  }
}
