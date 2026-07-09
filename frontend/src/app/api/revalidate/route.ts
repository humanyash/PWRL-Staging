import { revalidatePath } from "next/cache";

/**
 * On-demand cache bust after Strapi Publish.
 * Strapi → Settings → Webhooks → POST this URL on entry.publish.
 */
export async function POST(request: Request) {
  const secret =
    request.headers.get("x-revalidation-secret") ??
    new URL(request.url).searchParams.get("secret");
  const expected =
    process.env.REVALIDATION_SECRET ?? process.env.STRAPI_PREVIEW_SECRET;

  if (!expected || secret !== expected) {
    return Response.json({ error: "Invalid revalidation secret" }, { status: 401 });
  }

  revalidatePath("/", "layout");
  revalidatePath("/vision");
  revalidatePath("/fund");
  revalidatePath("/trade");
  revalidatePath("/investor-relations");
  revalidatePath("/contact");
  revalidatePath("/learn");

  return Response.json({ revalidated: true, at: new Date().toISOString() });
}
