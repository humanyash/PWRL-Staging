import { draftMode } from "next/headers";

/** True when viewing the staging site via /api/preview (draft CMS content). */
export async function isPreviewDraft(): Promise<boolean> {
  try {
    return (await draftMode()).isEnabled;
  } catch {
    return false;
  }
}
