import type { Metadata } from "next";
import { PageView } from "@/components/PageView";
import { getPage } from "@/lib/strapi";

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPage("/");
  return {
    title: page?.title ?? "PWRL",
    description: page?.metaDescription,
  };
}

export default function HomePage() {
  return <PageView slug="/" />;
}
