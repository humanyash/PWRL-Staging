import { notFound } from "next/navigation";
import { LegalEditor } from "@/components/admin/LegalEditor";
import { getAdminLegalPage } from "@/lib/admin/data";

export const dynamic = "force-dynamic";

export default async function AdminLegalEditor({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const page = await getAdminLegalPage(slug);
  if (!page) notFound();
  return <LegalEditor page={page} />;
}
