import type { Schema, Struct } from '@strapi/strapi';

export interface SectionsBoardGrid extends Struct.ComponentSchema {
  collectionName: 'components_sections_board_grids';
  info: {
    description: 'Heading + subheading + multi-relation to BoardDirector';
    displayName: 'Board Grid';
  };
  attributes: {
    directors: Schema.Attribute.Relation<
      'oneToMany',
      'api::board-director.board-director'
    >;
    heading: Schema.Attribute.String;
    subheading: Schema.Attribute.Text;
  };
}

export interface SectionsCtaGroup extends Struct.ComponentSchema {
  collectionName: 'components_sections_cta_groups';
  info: {
    description: 'Heading + subheading + a group of CTAs';
    displayName: 'CTA Group';
  };
  attributes: {
    ctas: Schema.Attribute.Component<'shared.cta', true>;
    heading: Schema.Attribute.String;
    subheading: Schema.Attribute.Text;
  };
}

export interface SectionsDisclosures extends Struct.ComponentSchema {
  collectionName: 'components_sections_disclosures';
  info: {
    description: 'Relation to the Disclaimers singleton';
    displayName: 'Disclosures';
  };
  attributes: {
    disclaimers: Schema.Attribute.Relation<
      'oneToOne',
      'api::disclaimers.disclaimers'
    >;
  };
}

export interface SectionsDocumentList extends Struct.ComponentSchema {
  collectionName: 'components_sections_document_lists';
  info: {
    description: 'Heading + kind; auto-pulls SEC filings or fund documents';
    displayName: 'Document List';
  };
  attributes: {
    heading: Schema.Attribute.String;
    kind: Schema.Attribute.Enumeration<['filings', 'fund-docs']> &
      Schema.Attribute.Required;
  };
}

export interface SectionsFaqBlock extends Struct.ComponentSchema {
  collectionName: 'components_sections_faq_blocks';
  info: {
    description: 'Heading + relation to the FAQ singleton';
    displayName: 'FAQ Block';
  };
  attributes: {
    faq: Schema.Attribute.Relation<'oneToOne', 'api::faq.faq'>;
    heading: Schema.Attribute.String;
  };
}

export interface SectionsFormBlock extends Struct.ComponentSchema {
  collectionName: 'components_sections_form_blocks';
  info: {
    description: 'Relation to a Form + optional heading/body/theme';
    displayName: 'Form Block';
  };
  attributes: {
    body: Schema.Attribute.Text;
    form: Schema.Attribute.Relation<'oneToOne', 'api::form.form'>;
    heading: Schema.Attribute.String;
    theme: Schema.Attribute.Enumeration<['light', 'dark']> &
      Schema.Attribute.DefaultTo<'light'>;
  };
}

export interface SectionsHero extends Struct.ComponentSchema {
  collectionName: 'components_sections_heroes';
  info: {
    description: 'Page hero with optional rotating phrases and CTAs';
    displayName: 'Hero';
  };
  attributes: {
    backgroundImage: Schema.Attribute.Media<'images'>;
    body: Schema.Attribute.RichText;
    ctas: Schema.Attribute.Component<'shared.cta', true>;
    heading: Schema.Attribute.String;
    rotatingPhrases: Schema.Attribute.JSON;
    subheading: Schema.Attribute.Text;
  };
}

export interface SectionsIntro extends Struct.ComponentSchema {
  collectionName: 'components_sections_intros';
  info: {
    description: 'Kicker + heading + body intro block';
    displayName: 'Intro';
  };
  attributes: {
    body: Schema.Attribute.RichText;
    heading: Schema.Attribute.String;
    kicker: Schema.Attribute.String;
  };
}

export interface SectionsNewsList extends Struct.ComponentSchema {
  collectionName: 'components_sections_news_lists';
  info: {
    description: 'Heading + limit; auto-pulls latest NewsItems';
    displayName: 'News List';
  };
  attributes: {
    heading: Schema.Attribute.String;
    limit: Schema.Attribute.Integer &
      Schema.Attribute.SetMinMax<
        {
          min: 1;
        },
        number
      > &
      Schema.Attribute.DefaultTo<5>;
  };
}

export interface SectionsPhilosophy extends Struct.ComponentSchema {
  collectionName: 'components_sections_philosophies';
  info: {
    description: 'Heading + paragraphs + supporting images';
    displayName: 'Philosophy';
  };
  attributes: {
    heading: Schema.Attribute.String;
    paragraphs: Schema.Attribute.RichText;
    supportingImages: Schema.Attribute.Component<'shared.image-with-alt', true>;
  };
}

export interface SectionsPortfolioBlock extends Struct.ComponentSchema {
  collectionName: 'components_sections_portfolio_blocks';
  info: {
    description: 'Heading + intro + relation to the PortfolioSnapshot singleton';
    displayName: 'Portfolio Block';
  };
  attributes: {
    heading: Schema.Attribute.String;
    intro: Schema.Attribute.Text;
    portfolioSnapshot: Schema.Attribute.Relation<
      'oneToOne',
      'api::portfolio-snapshot.portfolio-snapshot'
    >;
  };
}

export interface SectionsProcessStep extends Struct.ComponentSchema {
  collectionName: 'components_sections_process_step_items';
  info: {
    description: 'A single step in a process';
    displayName: 'Process Step';
  };
  attributes: {
    body: Schema.Attribute.Text;
    icon: Schema.Attribute.Media<'images'>;
    title: Schema.Attribute.String;
  };
}

export interface SectionsProcessSteps extends Struct.ComponentSchema {
  collectionName: 'components_sections_process_steps';
  info: {
    description: 'Heading + intro + ordered steps';
    displayName: 'Process Steps';
  };
  attributes: {
    heading: Schema.Attribute.String;
    intro: Schema.Attribute.Text;
    steps: Schema.Attribute.Component<'sections.process-step', true>;
  };
}

export interface SectionsPullQuote extends Struct.ComponentSchema {
  collectionName: 'components_sections_pull_quotes';
  info: {
    description: 'A large pull quote with an optional CTA';
    displayName: 'Pull Quote';
  };
  attributes: {
    cta: Schema.Attribute.Component<'shared.cta', false>;
    quote: Schema.Attribute.Text & Schema.Attribute.Required;
  };
}

export interface SectionsRichText extends Struct.ComponentSchema {
  collectionName: 'components_sections_rich_texts';
  info: {
    description: 'Fallback heading + rich text body';
    displayName: 'Rich Text';
  };
  attributes: {
    body: Schema.Attribute.RichText & Schema.Attribute.Required;
    heading: Schema.Attribute.String;
  };
}

export interface SectionsStatItem extends Struct.ComponentSchema {
  collectionName: 'components_sections_stat_items';
  info: {
    description: 'A single statistic';
    displayName: 'Stat Item';
  };
  attributes: {
    footnote: Schema.Attribute.Text;
    label: Schema.Attribute.String;
    value: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface SectionsStatsBlock extends Struct.ComponentSchema {
  collectionName: 'components_sections_stats_blocks';
  info: {
    description: 'Heading + intro + a row of statistics';
    displayName: 'Stats Block';
  };
  attributes: {
    heading: Schema.Attribute.String;
    intro: Schema.Attribute.Text;
    stats: Schema.Attribute.Component<'sections.stat-item', true>;
  };
}

export interface SectionsStockInfo extends Struct.ComponentSchema {
  collectionName: 'components_sections_stock_infos';
  info: {
    description: 'InvestingChannel stock widget embed';
    displayName: 'Stock Info';
  };
  attributes: {
    theme: Schema.Attribute.Enumeration<['light', 'dark']> &
      Schema.Attribute.DefaultTo<'light'>;
    widgetId: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface SectionsTeamGrid extends Struct.ComponentSchema {
  collectionName: 'components_sections_team_grids';
  info: {
    description: 'Heading + subheading + multi-relation to TeamMember';
    displayName: 'Team Grid';
  };
  attributes: {
    heading: Schema.Attribute.String;
    members: Schema.Attribute.Relation<
      'oneToMany',
      'api::team-member.team-member'
    >;
    subheading: Schema.Attribute.Text;
  };
}

export interface SectionsTimeline extends Struct.ComponentSchema {
  collectionName: 'components_sections_timelines';
  info: {
    description: 'Heading + intro + chronological entries';
    displayName: 'Timeline';
  };
  attributes: {
    entries: Schema.Attribute.Component<'sections.timeline-entry', true>;
    heading: Schema.Attribute.String;
    intro: Schema.Attribute.Text;
  };
}

export interface SectionsTimelineEntry extends Struct.ComponentSchema {
  collectionName: 'components_sections_timeline_entries';
  info: {
    description: 'A single timeline entry';
    displayName: 'Timeline Entry';
  };
  attributes: {
    body: Schema.Attribute.Text;
    title: Schema.Attribute.String;
    year: Schema.Attribute.String;
  };
}

export interface SectionsValuePropItem extends Struct.ComponentSchema {
  collectionName: 'components_sections_value_prop_items';
  info: {
    description: 'A single value proposition';
    displayName: 'Value Prop Item';
  };
  attributes: {
    body: Schema.Attribute.Text;
    heading: Schema.Attribute.String;
    icon: Schema.Attribute.Media<'images'>;
  };
}

export interface SectionsValueProps extends Struct.ComponentSchema {
  collectionName: 'components_sections_value_props';
  info: {
    description: 'Heading + a list of value-proposition items';
    displayName: 'Value Props';
  };
  attributes: {
    heading: Schema.Attribute.String;
    items: Schema.Attribute.Component<'sections.value-prop-item', true>;
  };
}

export interface SharedCta extends Struct.ComponentSchema {
  collectionName: 'components_shared_ctas';
  info: {
    description: 'A call-to-action link/button';
    displayName: 'CTA';
  };
  attributes: {
    href: Schema.Attribute.String & Schema.Attribute.Required;
    label: Schema.Attribute.String & Schema.Attribute.Required;
    variant: Schema.Attribute.Enumeration<
      ['primary', 'secondary', 'link', 'underline']
    > &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'primary'>;
  };
}

export interface SharedDisclaimerParagraph extends Struct.ComponentSchema {
  collectionName: 'components_shared_disclaimer_paragraphs';
  info: {
    description: 'A single verbatim disclaimer paragraph';
    displayName: 'Disclaimer Paragraph';
  };
  attributes: {
    body: Schema.Attribute.Text & Schema.Attribute.Required;
    label: Schema.Attribute.String;
  };
}

export interface SharedFaqItem extends Struct.ComponentSchema {
  collectionName: 'components_shared_faq_items';
  info: {
    description: 'A single question and answer';
    displayName: 'FAQ Item';
  };
  attributes: {
    answer: Schema.Attribute.RichText & Schema.Attribute.Required;
    question: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface SharedFooterLink extends Struct.ComponentSchema {
  collectionName: 'components_shared_footer_links';
  info: {
    description: 'A labelled footer/social link';
    displayName: 'Footer Link';
  };
  attributes: {
    group: Schema.Attribute.String;
    href: Schema.Attribute.String & Schema.Attribute.Required;
    label: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface SharedHolding extends Struct.ComponentSchema {
  collectionName: 'components_shared_holdings';
  info: {
    description: 'A single portfolio holding row';
    displayName: 'Holding';
  };
  attributes: {
    allocation: Schema.Attribute.String & Schema.Attribute.Required;
    name: Schema.Attribute.String & Schema.Attribute.Required;
    sector: Schema.Attribute.String;
  };
}

export interface SharedImageWithAlt extends Struct.ComponentSchema {
  collectionName: 'components_shared_image_with_alts';
  info: {
    description: 'Media with an accessible alt string';
    displayName: 'Image With Alt';
  };
  attributes: {
    alt: Schema.Attribute.String & Schema.Attribute.Required;
    media: Schema.Attribute.Media<'images'> & Schema.Attribute.Required;
  };
}

export interface SharedSeo extends Struct.ComponentSchema {
  collectionName: 'components_shared_seos';
  info: {
    description: 'SEO metadata';
    displayName: 'SEO';
  };
  attributes: {
    description: Schema.Attribute.Text;
    noindex: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    ogImage: Schema.Attribute.Media<'images'>;
    title: Schema.Attribute.String;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'sections.board-grid': SectionsBoardGrid;
      'sections.cta-group': SectionsCtaGroup;
      'sections.disclosures': SectionsDisclosures;
      'sections.document-list': SectionsDocumentList;
      'sections.faq-block': SectionsFaqBlock;
      'sections.form-block': SectionsFormBlock;
      'sections.hero': SectionsHero;
      'sections.intro': SectionsIntro;
      'sections.news-list': SectionsNewsList;
      'sections.philosophy': SectionsPhilosophy;
      'sections.portfolio-block': SectionsPortfolioBlock;
      'sections.process-step': SectionsProcessStep;
      'sections.process-steps': SectionsProcessSteps;
      'sections.pull-quote': SectionsPullQuote;
      'sections.rich-text': SectionsRichText;
      'sections.stat-item': SectionsStatItem;
      'sections.stats-block': SectionsStatsBlock;
      'sections.stock-info': SectionsStockInfo;
      'sections.team-grid': SectionsTeamGrid;
      'sections.timeline': SectionsTimeline;
      'sections.timeline-entry': SectionsTimelineEntry;
      'sections.value-prop-item': SectionsValuePropItem;
      'sections.value-props': SectionsValueProps;
      'shared.cta': SharedCta;
      'shared.disclaimer-paragraph': SharedDisclaimerParagraph;
      'shared.faq-item': SharedFaqItem;
      'shared.footer-link': SharedFooterLink;
      'shared.holding': SharedHolding;
      'shared.image-with-alt': SharedImageWithAlt;
      'shared.seo': SharedSeo;
    }
  }
}
