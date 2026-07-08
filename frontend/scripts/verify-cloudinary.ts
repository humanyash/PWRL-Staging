/**
 * Verify Cloudinary credentials before wiring them into Render.
 *
 * Usage:
 *   CLOUDINARY_NAME=... CLOUDINARY_KEY=... CLOUDINARY_SECRET=... npx tsx scripts/verify-cloudinary.ts
 */
const cloudName = process.env.CLOUDINARY_NAME;
const key = process.env.CLOUDINARY_KEY;
const secret = process.env.CLOUDINARY_SECRET;

if (!cloudName || !key || !secret) {
  console.error("Set CLOUDINARY_NAME, CLOUDINARY_KEY, and CLOUDINARY_SECRET.");
  process.exit(1);
}

const auth = Buffer.from(`${key}:${secret}`).toString("base64");
const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/ping`, {
  headers: { Authorization: `Basic ${auth}` },
});
const body = await res.text();

if (res.ok && body.includes('"status":"ok"')) {
  console.log(`Cloudinary OK for cloud "${cloudName}".`);
  process.exit(0);
}

console.error(`Cloudinary check failed (${res.status}): ${body.slice(0, 300)}`);
process.exit(1);
