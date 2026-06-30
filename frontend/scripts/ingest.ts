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
import { readFileSync, readdirSync, statSync, existsSync } from "node:fs";
import { join, basename, extname } from "node:path";

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

// Strapi cares about MIME for routing files/images. Map by extension so PDFs,
// SVGs, WEBP, etc. all upload correctly.
const MIME: Record<string, string> = {
  ".pdf": "application/pdf",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".gif": "image/gif",
  ".mp4": "video/mp4",
  ".webm": "video/webm",
};

async function uploadFile(localPath: string): Promise<number | null> {
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
  const mime = MIME[extname(name).toLowerCase()] ?? "application/octet-stream";
  fd.append("files", new Blob([readFileSync(file)], { type: mime }), name);
  const res = await fetch(`${STRAPI_URL}/api/upload`, { method: "POST", headers: H, body: fd });
  if (!res.ok) throw new Error(`upload ${name} → ${res.status}`);
  const [up] = await res.json();
  uploadCache.set(name, up.id);
  return up.id;
}

/** Recursively walk a /public/... directory and upload every file. */
async function bulkUploadDir(publicDir: string, log: (m: string) => void) {
  const abs = join(root, "public", publicDir);
  if (!existsSync(abs)) return;
  const walk = (dir: string, rel: string): { abs: string; rel: string }[] => {
    const out: { abs: string; rel: string }[] = [];
    for (const entry of readdirSync(dir)) {
      const p = join(dir, entry);
      const r = `${rel}/${entry}`;
      if (statSync(p).isDirectory()) out.push(...walk(p, r));
      else out.push({ abs: p, rel: r });
    }
    return out;
  };
  const files = walk(abs, `/${publicDir}`);
  let uploaded = 0;
  let reused = 0;
  for (const f of files) {
    const before = uploadCache.size;
    const id = await uploadFile(f.rel);
    if (id == null) continue;
    if (uploadCache.size > before) uploaded++;
    else reused++;
  }
  log(`media ${publicDir}: ${uploaded} new, ${reused} reused`);
}

// --- helpers --------------------------------------------------------
async function upsertCollection(
  uid: string,
  keyField: string,
  keyValue: string,
  data: object,
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

  const {
    teamMembers,
    boardDirectors,
    faq,
    disclaimers,
    globalSettings,
    portfolio,
    pages,
    fundDocuments,
    newsItems,
    forms,
    legalPages,
  } = await import("./ingest-data").then((m) => m.buildPayloads());

  for (const t of teamMembers) {
    const image = t.imagePath ? await uploadFile(t.imagePath) : null;
    log(await upsertCollection("team-members", "name", t.data.name as string, { ...t.data, headshot: image }));
  }
  for (const b of boardDirectors) {
    const image = b.imagePath ? await uploadFile(b.imagePath) : null;
    log(await upsertCollection("board-directors", "name", b.data.name as string, { ...b.data, headshot: image }));
  }
  log(await putSingle("faq", faq));
  log(await putSingle("disclaimers", disclaimers));
  log(await putSingle("global-settings", globalSettings));
  log(await putSingle("portfolio-snapshot", portfolio));

  for (const p of pages) {
    log(await upsertCollection("pages", "slug", p.slug, p.data));
  }

  // Fund documents: upload the PDF, then upsert by title.
  for (const f of fundDocuments) {
    const fileId = f.filePath ? await uploadFile(f.filePath) : null;
    if (!fileId) {
      log(`SKIP fund-document/${f.data.title} (file missing: ${f.filePath})`);
      continue;
    }
    log(await upsertCollection("fund-documents", "title", f.data.title as string, { ...f.data, file: fileId }));
  }

  // News items: dedupe key = url
  for (const n of newsItems) {
    log(await upsertCollection("news-items", "url", n.url, n));
  }

  // Forms: dedupe key = identifier (Strapi uid)
  for (const f of forms) {
    log(await upsertCollection("forms", "identifier", f.identifier, f));
  }

  // Legal pages: dedupe key = slug
  for (const lp of legalPages) {
    log(await upsertCollection("legal-pages", "slug", lp.slug, lp.data));
  }

  // Bulk-upload every PDF/image/GIF in public/documents and public/remote-assets
  // so the Strapi Media Library mirrors the site's full asset inventory.
  console.log("Bulk media upload:");
  await bulkUploadDir("documents", log);
  await bulkUploadDir("remote-assets", log);
  await bulkUploadDir("stats_icons", log);
  await bulkUploadDir("brand", log);
  await bulkUploadDir("events", log);
  await bulkUploadDir("media", log);

  console.log("Done.");
}

main().catch((e) => {
  console.error("INGEST FAILED:", e.message);
  process.exit(1);
});
