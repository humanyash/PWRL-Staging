import { draftMode } from "next/headers";
import { redirect } from "next/navigation";

function previewPath(type: string, params: URLSearchParams): string | null {
  switch (type) {
    case "global-settings":
      return "/";
    case "news":
      return "/investor-relations";
    case "faq":
      return "/vision#faq";
    case "team":
      return "/vision";
    case "directors":
      return "/investor-relations";
    case "portfolio":
      return "/fund";
    case "fund-documents":
      return "/investor-relations";
    case "disclaimers":
      return "/";
    case "legal":
      return params.get("slug") === "terms" ? "/terms" : "/legal";
    case "page": {
      const slug = params.get("slug");
      if (!slug || slug === "home") return "/";
      return `/${slug.replace(/^\//, "")}`;
    }
    default:
      return null;
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const secret = searchParams.get("secret");
  const expected = process.env.STRAPI_PREVIEW_SECRET;

  if (!expected || secret !== expected) {
    return new Response("Invalid preview secret", { status: 401 });
  }

  const type = searchParams.get("type") ?? "";
  const path = previewPath(type, searchParams);
  if (!path) {
    return new Response("Unknown preview type", { status: 400 });
  }

  (await draftMode()).enable();
  redirect(path);
}
