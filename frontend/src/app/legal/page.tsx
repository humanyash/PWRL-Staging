import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LegalPageView } from "@/components/legal/LegalPageView";
import { getLegalPage } from "@/lib/legal";
import { getGlobalSettings } from "@/lib/strapi";

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const page = await getLegalPage("legal");
  return {
    title: page?.title ?? "Privacy Policy — PWRL",
    description: page?.metaDescription,
  };
}

export default async function LegalPage() {
  const [page, settings] = await Promise.all([
    getLegalPage("legal"),
    getGlobalSettings(),
  ]);
  if (!page) notFound();
  return <LegalPageView page={page} settings={settings} />;
}
