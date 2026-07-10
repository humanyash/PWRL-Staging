import { notFound } from "next/navigation";
import { BlogEditor } from "@/components/admin/BlogEditor";
import { getAdminBlogPost } from "@/lib/admin/data";

export const dynamic = "force-dynamic";

export default async function EditBlogPost({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const post = await getAdminBlogPost(id);
  if (!post) notFound();
  return <BlogEditor post={post} />;
}
