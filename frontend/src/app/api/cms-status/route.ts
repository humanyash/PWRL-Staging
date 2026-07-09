import { STRAPI_URL, strapiFetch } from "@/lib/strapi";
import { GLOBAL_SETTINGS } from "@/lib/fixtures";

/** Quick diagnostic: is Vercel wired to Strapi or serving fixtures? */
export async function GET() {
  const strapiDisabled = process.env.NEXT_PUBLIC_STRAPI_DISABLED === "true";
  const settings = await strapiFetch<{
    topBanner?: string | null;
    publishedAt?: string | null;
  }>("/api/global-settings", { status: "published" });

  const fixtureBanner = GLOBAL_SETTINGS.banner?.text ?? null;
  const cmsBanner = settings?.topBanner ?? null;
  const usingFixtures = !settings;

  return Response.json({
    ok: !usingFixtures && !strapiDisabled,
    strapiUrl: STRAPI_URL,
    strapiDisabled,
    usingFixtures,
    cmsBannerPreview: cmsBanner?.slice(0, 120) ?? null,
    fixtureBannerPreview: fixtureBanner?.slice(0, 120) ?? null,
    cmsPublishedAt: settings?.publishedAt ?? null,
    hint: usingFixtures
      ? "Set NEXT_PUBLIC_STRAPI_URL on Vercel to https://pwrl-cms-humandesign.onrender.com, remove NEXT_PUBLIC_STRAPI_DISABLED, then Redeploy."
      : "CMS is connected. After Publish in Strapi, wait up to 60s or call POST /api/revalidate.",
  });
}
