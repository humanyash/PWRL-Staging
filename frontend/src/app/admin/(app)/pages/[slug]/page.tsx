import { notFound } from "next/navigation";
import { PageEditor } from "@/components/admin/PageEditor";
import { getAdminPage } from "@/lib/admin/data";

export const dynamic = "force-dynamic";

export default async function AdminPageEditor({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const dbSlug = slug === "home" ? "/" : `/${slug}`;
  const page = await getAdminPage(dbSlug);
  if (!page) notFound();
  return <PageEditor page={page} />;
}
