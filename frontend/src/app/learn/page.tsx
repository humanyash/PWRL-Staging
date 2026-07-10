import type { Metadata } from "next";
import { PageView } from "@/components/PageView";
import { getPage } from "@/lib/content";

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPage("/learn");
  return {
    title: page?.title ?? "PWRL — Learn",
    description: page?.metaDescription,
  };
}

export default function LearnPage() {
  return <PageView slug="/learn" />;
}
