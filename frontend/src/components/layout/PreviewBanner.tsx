import { isPreviewDraft } from "@/lib/preview";

export async function PreviewBanner() {
  if (!(await isPreviewDraft())) return null;

  return (
    <div
      role="status"
      className="sticky top-0 z-[9999] bg-amber-400 px-4 py-2 text-center text-sm font-semibold text-charcoal"
    >
      Preview mode — showing unpublished drafts. The live site is unchanged until
      you click Publish in Strapi.
    </div>
  );
}
