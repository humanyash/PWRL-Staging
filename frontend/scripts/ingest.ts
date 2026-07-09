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
 * already exists and points at Cloudinary).
 *
 * Flags:
 *   --media-only       Skip content upserts; upload files only.
 *   --force-reupload   Delete existing Strapi media (same filename) and upload fresh.
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
const MEDIA_ONLY = process.argv.includes("--media-only");
const FORCE_REUPLOAD = process.argv.includes("--force-reupload");
const RETRY_STATUSES = new Set([429, 502, 503, 504]);
const UPLOAD_DELAY_MS = 600;
const LARGE_FILE_BYTES = 2 * 1024 * 1024;
const LARGE_UPLOAD_DELAY_MS = 1500;

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

function fetchTimed(url: string, init?: RequestInit, ms = 120_000) {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), ms);
  return fetch(url, { ...init, signal: ctrl.signal }).finally(() => clearTimeout(timer));
}

async function parseJson(res: Response, label: string) {
  const text = await res.text();
  try {
    return JSON.parse(text) as unknown;
  } catch {
    throw new Error(
      `${label} → ${res.status} (expected JSON, got HTML/text): ${text.slice(0, 200)}`,
    );
  }
}

/** Retry Render cold-starts / gateway timeouts. */
async function fetchWithRetry(url: string, init?: RequestInit, retries = 5): Promise<Response> {
  let last: Response | undefined;
  for (let i = 0; i <= retries; i++) {
    try {
      last = await fetchTimed(url, init);
    } catch (e) {
      if (i === retries) throw e;
      const wait = 1500 * 2 ** i;
      console.log(`  … retry ${i + 1}/${retries} after network error, waiting ${wait}ms`);
      await sleep(wait);
      continue;
    }
    if (last.ok || !RETRY_STATUSES.has(last.status) || i === retries) return last;
    const wait = 1500 * 2 ** i;
    console.log(`  … retry ${i + 1}/${retries} after ${last.status}, waiting ${wait}ms`);
    await sleep(wait);
  }
  return last!;
}

async function warmup() {
  console.log("Warming up Strapi…");
  for (let i = 0; i < 6; i++) {
    try {
      const res = await fetch(`${STRAPI_URL}/_health`);
      if (res.ok) {
        console.log("  Strapi is up.");
        return;
      }
    } catch {
      /* ignore */
    }
    await sleep(5000);
  }
  console.warn("  Warmup timed out — continuing anyway.");
}

async function api(path: string, init?: RequestInit) {
  const res = await fetchWithRetry(`${STRAPI_URL}/api${path}`, init);
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`${init?.method ?? "GET"} ${path} → ${res.status}: ${body.slice(0, 300)}`);
  }
  return parseJson(res, `${init?.method ?? "GET"} ${path}`);
}

// --- media ----------------------------------------------------------
interface UploadRecord {
  id: number;
  name: string;
  url?: string;
}

const uploadCache = new Map<string, UploadRecord>();
let uploadCacheLoaded = false;

function isCloudinaryUrl(url?: string) {
  return !!url && url.includes("res.cloudinary.com/");
}

async function deleteUpload(record: UploadRecord) {
  // Strapi v5 upload delete accepts numeric id; skip if referenced entries block delete.
  const res = await fetchWithRetry(`${STRAPI_URL}/api/upload/files/${record.id}`, {
    method: "DELETE",
    headers: H,
  }, 2);
  if (!res.ok && res.status !== 404) {
    const body = await res.text();
    throw new Error(`delete ${record.name} (id ${record.id}) → ${res.status}: ${body.slice(0, 200)}`);
  }
  uploadCache.delete(record.name);
}

async function preloadUploadCache() {
  if (uploadCacheLoaded) return;
  if (FORCE_REUPLOAD) {
    console.log("Skipping media index (force reupload).");
    uploadCacheLoaded = true;
    return;
  }
  console.log("Loading existing media index…");
  let page = 1;
  let total = 0;
  // Hard safety cap: this Strapi's /api/upload/files ignores pagination[page]
  // and returns the full list every time, so relying on `batch.length < 100`
  // alone loops forever (it once ran 14k+ pages and wedged the instance).
  // We also break as soon as a page adds no NEW unique filenames.
  const MAX_PAGES = 50;
  for (;;) {
    process.stdout.write(`  … media index page ${page}…\n`);
    const res = await fetchWithRetry(
      `${STRAPI_URL}/api/upload/files?pagination[page]=${page}&pagination[pageSize]=100&sort=createdAt:desc`,
      { headers: H },
      3,
    );
    if (!res.ok) {
      console.warn(`  Could not load media index (page ${page}): ${res.status}`);
      break;
    }
    const batch = (await parseJson(res, "upload/files index")) as UploadRecord[];
    if (!Array.isArray(batch) || batch.length === 0) break;
    const sizeBefore = uploadCache.size;
    for (const f of batch) {
      if (!f.name || !f.id) continue;
      // Keep the newest entry per filename (sorted desc).
      if (!uploadCache.has(f.name)) uploadCache.set(f.name, f);
    }
    total += batch.length;
    if (batch.length < 100) break;
    // No new unique filenames -> endpoint is not paginating; stop.
    if (uploadCache.size === sizeBefore) break;
    if (page >= MAX_PAGES) {
      console.warn(`  Reached media index page cap (${MAX_PAGES}); stopping.`);
      break;
    }
    page++;
    await sleep(400);
  }
  uploadCacheLoaded = true;
  const broken = [...uploadCache.values()].filter((f) => !isCloudinaryUrl(f.url)).length;
  console.log(`  ${uploadCache.size} unique filenames indexed (${total} total rows, ${broken} non-Cloudinary).`);
}

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

async function findExistingByName(name: string): Promise<UploadRecord[]> {
  const res = await fetchWithRetry(
    `${STRAPI_URL}/api/upload/files?filters[name][$eq]=${encodeURIComponent(name)}&pagination[pageSize]=20`,
    { headers: H },
    3,
  );
  if (!res.ok) return [];
  const batch = (await parseJson(res, `upload lookup ${name}`)) as UploadRecord[];
  return Array.isArray(batch) ? batch : [];
}

async function uploadFile(localPath: string): Promise<number | null> {
  if (!localPath?.startsWith("/")) return null;
  const file = join(root, "public", localPath);
  if (!existsSync(file)) return null;
  const name = basename(localPath);
  const size = statSync(file).size;

  const cached = uploadCache.get(name);
  if (cached && !FORCE_REUPLOAD && isCloudinaryUrl(cached.url)) {
    return cached.id;
  }

  const matches = await findExistingByName(name);
  const best = matches[0];
  if (best && !FORCE_REUPLOAD && isCloudinaryUrl(best.url)) {
    uploadCache.set(name, best);
    return best.id;
  }

  for (const rec of matches) {
    if (!FORCE_REUPLOAD) break;
    try {
      await deleteUpload(rec);
    } catch (e) {
      // Deleting in-use media often 500s; upload a fresh copy instead.
      console.warn(`  ! delete skipped ${name}: ${(e as Error).message}`);
    }
  }

  const fd = new FormData();
  const mime = MIME[extname(name).toLowerCase()] ?? "application/octet-stream";
  fd.append("files", new Blob([readFileSync(file)], { type: mime }), name);
  const res = await fetchWithRetry(`${STRAPI_URL}/api/upload`, { method: "POST", headers: H, body: fd }, 8);
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`upload ${name} → ${res.status}: ${body.slice(0, 200)}`);
  }
  const parsed = (await parseJson(res, `upload ${name}`)) as UploadRecord[];
  const [up] = parsed;
  if (!up?.id) throw new Error(`upload ${name} → empty response`);
  uploadCache.set(name, { id: up.id, name: up.name ?? name, url: up.url });
  await sleep(size >= LARGE_FILE_BYTES ? LARGE_UPLOAD_DELAY_MS : UPLOAD_DELAY_MS);
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
  const files = walk(abs, `/${publicDir}`).sort(
    (a, b) => statSync(a.abs).size - statSync(b.abs).size,
  );
  let uploaded = 0;
  let reused = 0;
  let failed = 0;
  const failures: string[] = [];
  for (const f of files) {
    const name = basename(f.rel);
    const had = uploadCache.get(name);
    const hadCloudinary = had && isCloudinaryUrl(had.url);
    try {
      const id = await uploadFile(f.rel);
      if (id == null) continue;
      if (!FORCE_REUPLOAD && hadCloudinary) reused++;
      else uploaded++;
    } catch (e) {
      failed++;
      failures.push(f.rel);
      console.warn(`  ! upload failed ${f.rel}: ${(e as Error).message}`);
    }
  }
  log(
    `media ${publicDir}: ${uploaded} uploaded, ${reused} reused${failed ? `, ${failed} failed` : ""}`,
  );
  if (failures.length) log(`  failed: ${failures.join(", ")}`);
}

// --- helpers --------------------------------------------------------
interface StrapiListResponse {
  data?: { documentId?: string; identifier?: string }[];
}

async function upsertCollection(
  uid: string,
  keyField: string,
  keyValue: string,
  data: object,
) {
  const found = (await api(
    `/${uid}?filters[${keyField}][$eq]=${encodeURIComponent(keyValue)}&fields[0]=${keyField}`,
    { headers: H },
  )) as StrapiListResponse;
  const docId = found?.data?.[0]?.documentId;
  if (docId) {
    await api(`/${uid}/${docId}?status=published`, { method: "PUT", headers: JH, body: JSON.stringify({ data }) });
    return `updated ${uid}/${keyValue}`;
  }
  await api(`/${uid}?status=published`, { method: "POST", headers: JH, body: JSON.stringify({ data }) });
  return `created ${uid}/${keyValue}`;
}

/** Replace {__upload:"/path"} placeholders (emitted by ingest-data for media
 *  inside components) with uploaded Cloudinary ids; drops files not found. */
async function resolveUploads(node: unknown): Promise<unknown> {
  if (Array.isArray(node)) {
    const out: unknown[] = [];
    for (const item of node) {
      const r = await resolveUploads(item);
      if (r !== null && r !== undefined) out.push(r);
    }
    return out;
  }
  if (node && typeof node === "object") {
    if ("__upload" in (node as Record<string, unknown>)) {
      const path = (node as { __upload?: unknown }).__upload;
      return typeof path === "string" ? await uploadFile(path) : null;
    }
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(node)) out[k] = await resolveUploads(v);
    return out;
  }
  return node;
}

async function putSingle(uid: string, data: Record<string, unknown>) {
  await api(`/${uid}?status=published`, { method: "PUT", headers: JH, body: JSON.stringify({ data }) });
  return `set ${uid}`;
}

// --- main -----------------------------------------------------------
async function bulkUploadAll(log: (m: string) => void) {
  console.log("Bulk media upload:");
  await bulkUploadDir("documents", log);
  await bulkUploadDir("remote-assets", log);
  await bulkUploadDir("stats_icons", log);
  await bulkUploadDir("brand", log);
  await bulkUploadDir("events", log);
  await bulkUploadDir("media", log);
}

async function verifyMedia(log: (m: string) => void) {
  const dirs = ["documents", "remote-assets", "stats_icons", "brand", "events", "media"];
  const missing: string[] = [];
  const broken: string[] = [];
  let checked = 0;

  for (const dir of dirs) {
    const abs = join(root, "public", dir);
    if (!existsSync(abs)) continue;
    const stack = [abs];
    while (stack.length) {
      const current = stack.pop()!;
      for (const entry of readdirSync(current)) {
        const p = join(current, entry);
        if (statSync(p).isDirectory()) stack.push(p);
        else {
          checked++;
          const name = basename(p);
          let rec = uploadCache.get(name);
          if (!rec || !isCloudinaryUrl(rec.url)) {
            const found = await findExistingByName(name);
            rec = found.find((f) => isCloudinaryUrl(f.url)) ?? found[0];
            if (rec) uploadCache.set(name, rec);
          }
          if (!rec) missing.push(name);
          else if (!isCloudinaryUrl(rec.url)) broken.push(name);
        }
      }
    }
  }

  if (missing.length === 0 && broken.length === 0) {
    log(`verify: ${checked} local files OK on Cloudinary`);
    return true;
  }
  if (missing.length) log(`verify: missing uploads (${missing.length}): ${missing.slice(0, 10).join(", ")}${missing.length > 10 ? "…" : ""}`);
  if (broken.length) log(`verify: broken urls (${broken.length}): ${broken.slice(0, 10).join(", ")}${broken.length > 10 ? "…" : ""}`);
  return false;
}

async function main() {
  console.log(
    `${MEDIA_ONLY ? "Media-only ingest" : "Ingesting"} into ${STRAPI_URL}${FORCE_REUPLOAD ? " (force reupload)" : ""}`,
  );
  await warmup();
  await preloadUploadCache();
  const log = (m: string) => console.log("  •", m);

  if (MEDIA_ONLY) {
    await bulkUploadAll(log);
    const ok = await verifyMedia(log);
    console.log(ok ? "Done." : "Done with gaps — re-run failed uploads.");
    process.exit(ok ? 0 : 1);
  }

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
    educationArticles,
  } = await import("./ingest-data").then((m) => m.buildPayloads());

  // Upload all static assets first so headshots/PDFs resolve to Cloudinary ids.
  await bulkUploadAll(log);

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
    // Resolve media placeholders inside section components to Cloudinary ids.
    const data = (await resolveUploads(p.data)) as Record<string, unknown>;
    log(await upsertCollection("pages", "slug", p.slug, data));
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

  // News items: dedupe key = url; upload thumbnail when present
  for (const n of newsItems) {
    const thumbnail = n.imagePath ? await uploadFile(n.imagePath) : null;
    log(
      await upsertCollection("news-items", "url", n.data.url as string, {
        ...n.data,
        thumbnail,
      }),
    );
  }

  // Forms: sync by identifier; remove orphans from bad partial ingests (e.g. /-form)
  const validIds = new Set(forms.map((f) => f.identifier));
  const existingForms = (await api(
    "/forms?pagination[pageSize]=100&fields[0]=identifier",
    { headers: H },
  )) as StrapiListResponse;
  for (const row of existingForms?.data ?? []) {
    const id = row.identifier;
    const docId = row.documentId;
    if (id && docId && !validIds.has(id)) {
      await api(`/forms/${docId}`, { method: "DELETE", headers: H });
      log(`deleted orphan form/${id}`);
    }
  }
  for (const f of forms) {
    log(await upsertCollection("forms", "identifier", f.identifier, f));
  }

  // Legal pages: dedupe key = slug
  for (const lp of legalPages) {
    log(await upsertCollection("legal-pages", "slug", lp.slug, lp.data));
  }

  // Learn articles: upload card/hero images, upsert by slug
  for (const a of educationArticles) {
    const cardImage = a.cardPath ? await uploadFile(a.cardPath) : null;
    const heroImage = a.heroPath ? await uploadFile(a.heroPath) : null;
    log(
      await upsertCollection("education-articles", "slug", a.data.slug as string, {
        ...a.data,
        cardImage,
        heroImage,
      }),
    );
  }

  if (!FORCE_REUPLOAD) {
    uploadCacheLoaded = false;
    uploadCache.clear();
    await preloadUploadCache();
  }
  await verifyMedia(log);

  console.log("Done.");
}

main().catch((e) => {
  console.error("INGEST FAILED:", e.message);
  process.exit(1);
});
