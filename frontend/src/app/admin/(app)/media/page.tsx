import { MediaLibrary } from "@/components/admin/MediaLibrary";
import { listMedia } from "@/lib/admin/data";

export const dynamic = "force-dynamic";

export default async function AdminMedia() {
  const media = await listMedia();
  return <MediaLibrary media={media} />;
}
