import type { Block } from "@/types/blocks";

import { Hero } from "./blocks/Hero";
import { AnchorNav } from "./blocks/AnchorNav";
import { Truths } from "./blocks/Truths";
import { PlatformTabs } from "./blocks/PlatformTabs";
import { Intro } from "./blocks/Intro";
import { ValueProps } from "./blocks/ValueProps";
import { Philosophy } from "./blocks/Philosophy";
import { Timeline } from "./blocks/Timeline";
import { StatsBlock } from "./blocks/StatsBlock";
import { PortfolioBlock } from "./blocks/PortfolioBlock";
import { TeamGrid } from "./blocks/TeamGrid";
import { BoardGrid } from "./blocks/BoardGrid";
import { FAQBlock } from "./blocks/FAQBlock";
import { ProcessSteps } from "./blocks/ProcessSteps";
import { NewsList } from "./blocks/NewsList";
import { EducationList } from "./blocks/EducationList";
import { EventsList } from "./blocks/EventsList";
import { EducationGrid } from "./blocks/EducationGrid";
import { DocumentList } from "./blocks/DocumentList";
import { CTAGroup } from "./blocks/CTAGroup";
import { PullQuote } from "./blocks/PullQuote";
import { StockInfo } from "./blocks/StockInfo";
import { RichText } from "./blocks/RichText";
import { FormBlock } from "./blocks/FormBlock";
import { Disclosures } from "./blocks/Disclosures";

/**
 * Renders a single dynamic-zone block by its Strapi `__component` key.
 * Unknown components render nothing (but warn in dev) so an unrecognized
 * block never crashes the page.
 */
function renderBlock(block: Block, key: number) {
  switch (block.__component) {
    case "sections.hero":
      return <Hero key={key} block={block} />;
    case "sections.intro":
      return <Intro key={key} block={block} />;
    case "sections.anchor-nav":
      return <AnchorNav key={key} block={block} />;
    case "sections.truths":
      return <Truths key={key} block={block} />;
    case "sections.platform-tabs":
      return <PlatformTabs key={key} block={block} />;
    case "sections.value-props":
      return <ValueProps key={key} block={block} />;
    case "sections.philosophy":
      return <Philosophy key={key} block={block} />;
    case "sections.timeline":
      return <Timeline key={key} block={block} />;
    case "sections.stats-block":
      return <StatsBlock key={key} block={block} />;
    case "sections.portfolio-block":
      return <PortfolioBlock key={key} block={block} />;
    case "sections.team-grid":
      return <TeamGrid key={key} block={block} />;
    case "sections.board-grid":
      return <BoardGrid key={key} block={block} />;
    case "sections.faq-block":
      return <FAQBlock key={key} block={block} />;
    case "sections.process-steps":
      return <ProcessSteps key={key} block={block} />;
    case "sections.news-list":
      return <NewsList key={key} block={block} />;
    case "sections.education-list":
      return <EducationList key={key} block={block} />;
    case "sections.events-list":
      return <EventsList key={key} block={block} />;
    case "sections.education-grid":
      return <EducationGrid key={key} block={block} />;
    case "sections.document-list":
      return <DocumentList key={key} block={block} />;
    case "sections.cta-group":
      return <CTAGroup key={key} block={block} />;
    case "sections.pull-quote":
      return <PullQuote key={key} block={block} />;
    case "sections.stock-info":
      return <StockInfo key={key} block={block} />;
    case "sections.rich-text":
      return <RichText key={key} block={block} />;
    case "sections.form-block":
      return <FormBlock key={key} block={block} />;
    case "sections.disclosures":
      return <Disclosures key={key} block={block} />;
    default: {
      if (process.env.NODE_ENV !== "production") {
        // eslint-disable-next-line no-console
        console.warn(
          "BlockRenderer: unknown component",
          (block as { __component?: string }).__component,
        );
      }
      return null;
    }
  }
}

export function BlockRenderer({ sections }: { sections: Block[] }) {
  return <>{sections.map((block, i) => renderBlock(block, i))}</>;
}

export default BlockRenderer;
