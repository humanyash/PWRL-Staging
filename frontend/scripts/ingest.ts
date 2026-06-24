/**
 * One-shot content ingest: pushes the fixture content (the verbatim site
 * copy) into Strapi via its REST API, making the CMS the source of truth.
 *
 * Usage:
 *   STRAPI_URL=https://pwrl-cms.onrender.com STRAPI_TOKEN=... npx tsx scripts/ingest.ts
 *
 * The token must be a Full-Access API token (Strapi admin → Settings →
 * API Tokens). Reads STRAPI_TOKEN from the environment or from
 * `.env.ingest` (gitignored) — never hardcode it.
 *
 * Idempotency: collections are looked up by their natural key (name/slug)
 * and updated if present, created otherwise. Single types are plain PUTs.
 * Images upload from /public (skipped if an upload with the same name
 * already exists).
 */
import { readFileSync, existsSync } from "node:fs";
import { join, basename } from "node:path";

// --- env ------------------------------------------------------------
const root = join(import.meta.dirname, "..");
if (existsSync(join(root, ".env.ingest"))) {
  for (const line of readFileSync(join(root, ".env.ingest"), "utf8").split("\n")) {
    const m = line.match(/^([A-Z_]+)=(.*)$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2];
  }
}
const STRAPI_URL = process.env.STRAPI_URL ?? "http://localhost:1337";
const TOKEN = process.env.STRAPI_TOKEN;
if (!TOKEN) {
  console.error("STRAPI_TOKEN missing (env or .env.ingest). Aborting.");
  process.exit(1);
}

const H = { Authorization: `Bearer ${TOKEN}` };
const JH = { ...H, "Content-Type": "application/json" };

async function api(path: string, init?: RequestInit) {
  const res = await fetch(`${STRAPI_URL}/api${path}`, init);
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`${init?.method ?? "GET"} ${path} → ${res.status}: ${body.slice(0, 300)}`);
  }
  return res.json();
}

// --- media ----------------------------------------------------------
const uploadCache = new Map<string, number>();
async function uploadImage(localPath: string): Promise<number | null> {
  if (!localPath?.startsWith("/")) return null;
  const file = join(root, "public", localPath);
  if (!existsSync(file)) return null;
  const name = basename(localPath);
  if (uploadCache.has(name)) return uploadCache.get(name)!;

  // reuse an existing upload with the same name
  const existing = await api(`/upload/files?filters[name][$eq]=${encodeURIComponent(name)}`, { headers: H });
  if (Array.isArray(existing) && existing[0]?.id) {
    uploadCache.set(name, existing[0].id);
    return existing[0].id;
  }
  const fd = new FormData();
  fd.append("files", new Blob([readFileSync(file)]), name);
  const res = await fetch(`${STRAPI_URL}/api/upload`, { method: "POST", headers: H, body: fd });
  if (!res.ok) throw new Error(`upload ${name} → ${res.status}`);
  const [up] = await res.json();
  uploadCache.set(name, up.id);
  return up.id;
}

// --- helpers --------------------------------------------------------
async function upsertCollection(
  uid: string,
  keyField: string,
  keyValue: string,
  data: Record<string, unknown>,
) {
  const found = await api(
    `/${uid}?filters[${keyField}][$eq]=${encodeURIComponent(keyValue)}&fields[0]=${keyField}`,
    { headers: H },
  );
  const docId = found?.data?.[0]?.documentId;
  if (docId) {
    await api(`/${uid}/${docId}?status=published`, { method: "PUT", headers: JH, body: JSON.stringify({ data }) });
    return `updated ${uid}/${keyValue}`;
  }
  await api(`/${uid}?status=published`, { method: "POST", headers: JH, body: JSON.stringify({ data }) });
  return `created ${uid}/${keyValue}`;
}

async function putSingle(uid: string, data: Record<string, unknown>) {
  await api(`/${uid}?status=published`, { method: "PUT", headers: JH, body: JSON.stringify({ data }) });
  return `set ${uid}`;
}

// --- main -----------------------------------------------------------
async function main() {
  console.log(`Ingesting into ${STRAPI_URL}`);
  const log = (m: string) => console.log("  •", m);

  const { teamMembers, boardDirectors, faq, disclaimers, globalSettings, portfolio, pages } =
    await import("./ingest-data").then((m) => m.buildPayloads());

  for (const t of teamMembers) {
    const image = t.imagePath ? await uploadImage(t.imagePath) : null;
    log(await upsertCollection("team-members", "name", t.data.name as string, { ...t.data, headshot: image }));
  }
  for (const b of boardDirectors) {
    const image = b.imagePath ? await uploadImage(b.imagePath) : null;
    log(await upsertCollection("board-directors", "name", b.data.name as string, { ...b.data, headshot: image }));
  }
  log(await putSingle("faq", faq));
  log(await putSingle("disclaimers", disclaimers));
  log(await putSingle("global-settings", globalSettings));
  log(await putSingle("portfolio-snapshot", portfolio));

  for (const p of pages) {
    log(await upsertCollection("pages", "slug", p.slug, p.data));
  }
  console.log("Done.");
}

main().catch((e) => {
  console.error("INGEST FAILED:", e.message);
  process.exit(1);
});
