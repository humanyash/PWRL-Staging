import { PageShell } from "@/components/layout/PageShell";
import type { GlobalSettings } from "@/types/blocks";
import type { LegalPageData } from "@/types/legal";

export function LegalPageView({
  page,
  settings,
}: {
  page: LegalPageData;
  settings: GlobalSettings;
}) {
  return (
    <PageShell settings={settings}>
      {/* Live clears the fixed masthead with an empty navy band first. */}
      <section
        aria-hidden
        className="bg-[#060B35] pb-[40px] pt-[40px] md:pb-[80px] md:pt-[80px]"
      />
      <section className="bg-[#060B35] pb-[40px] pt-[40px] md:pb-[80px] md:pt-[80px]">
        <div className="mx-auto w-full max-w-6xl px-4">
          <div
            className="legal-prose textbox-content"
            // Legal copy is authored HTML from CMS/fixtures — static, server-only.
            dangerouslySetInnerHTML={{ __html: page.body }}
          />
        </div>
      </section>
    </PageShell>
  );
}

export default LegalPageView;
