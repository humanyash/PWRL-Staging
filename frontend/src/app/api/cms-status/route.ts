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

  const strapiUrlSource = process.env.NEXT_PUBLIC_STRAPI_URL
    ? "NEXT_PUBLIC_STRAPI_URL"
    : process.env.STRAPI_URL
      ? "STRAPI_URL"
      : "default";
  const isLocalhostDefault = STRAPI_URL === "http://localhost:1337";

  return Response.json({
    ok: !usingFixtures && !strapiDisabled && !isLocalhostDefault,
    strapiUrl: STRAPI_URL,
    strapiUrlSource,
    isLocalhostDefault,
    strapiDisabled,
    usingFixtures,
    cmsBannerPreview: cmsBanner?.slice(0, 120) ?? null,
    fixtureBannerPreview: fixtureBanner?.slice(0, 120) ?? null,
    cmsPublishedAt: settings?.publishedAt ?? null,
    hint: isLocalhostDefault
      ? "No Strapi URL in this build. Set NEXT_PUBLIC_STRAPI_URL (or STRAPI_URL) on Vercel to https://pwrl-cms-humandesign.onrender.com, then Redeploy WITHOUT build cache."
      : usingFixtures
        ? "Strapi URL is set but the CMS request failed (fell back to fixtures). Check the URL is reachable and NEXT_PUBLIC_STRAPI_DISABLED is unset."
        : "CMS is connected. After Publish in Strapi, wait up to 60s or call POST /api/revalidate.",
  });
}
