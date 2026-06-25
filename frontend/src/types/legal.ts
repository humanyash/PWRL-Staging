export interface LegalPageData {
  slug: string;
  title: string;
  metaDescription?: string;
  /** Rich-text body from CMS or fixture HTML. */
  body: string;
  effectiveDate?: string;
}
