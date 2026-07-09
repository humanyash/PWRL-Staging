/**
 * Publish a small banner tweak to verify CMS → staging wiring.
 * Usage: npx tsx scripts/publish-test-banner.ts
 */
import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";

const root = join(import.meta.dirname, "..");
if (existsSync(join(root, ".env.ingest"))) {
  for (const line of readFileSync(join(root, ".env.ingest"), "utf8").split("\n")) {
    const m = line.match(/^([A-Z_]+)=(.*)$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2];
  }
}

const STRAPI_URL = process.env.STRAPI_URL ?? "https://pwrl-cms-humandesign.onrender.com";
const TOKEN = process.env.STRAPI_TOKEN;
if (!TOKEN) {
  console.error("STRAPI_TOKEN missing");
  process.exit(1);
}

const MARKER = " — CMS live test";

async function main() {
  const res = await fetch(`${STRAPI_URL}/api/global-settings?status=published`, {
    headers: { Authorization: `Bearer ${TOKEN}` },
  });
  const json = (await res.json()) as {
    data?: { topBanner?: string | null; topBannerEnabled?: boolean; topBannerLink?: string | null };
  };
  const current = json.data?.topBanner ?? "";
  const base = current.replace(MARKER, "");
  const topBanner = base.includes(MARKER) ? base : `${base}${MARKER}`;

  const put = await fetch(`${STRAPI_URL}/api/global-settings?status=published`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      data: {
        topBanner,
        topBannerEnabled: json.data?.topBannerEnabled ?? true,
        topBannerLink: json.data?.topBannerLink ?? null,
      },
    }),
  });

  if (!put.ok) {
    console.error("Publish failed:", put.status, await put.text());
    process.exit(1);
  }

  console.log("Published banner test marker to Strapi.");
  console.log("Check staging in ~60s:", "https://pwrl-staging-website-y.vercel.app");
  console.log("Banner ends with:", MARKER.trim());
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
