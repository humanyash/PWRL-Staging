import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LegalPageView } from "@/components/legal/LegalPageView";
import { getLegalPage, getGlobalSettings } from "@/lib/content";

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const page = await getLegalPage("terms");
  return {
    title: page?.title ?? "Terms & Conditions — PWRL",
    description: page?.metaDescription,
  };
}

export default async function TermsPage() {
  const [page, settings] = await Promise.all([
    getLegalPage("terms"),
    getGlobalSettings(),
  ]);
  if (!page) notFound();
  return <LegalPageView page={page} settings={settings} />;
}
