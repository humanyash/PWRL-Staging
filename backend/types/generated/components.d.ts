import type { Schema, Struct } from '@strapi/strapi';

export interface SectionsAnchorNav extends Struct.ComponentSchema {
  collectionName: 'components_sections_anchor_navs';
  info: {
    description: 'In-page anchor sub-navigation band (e.g. /vision STRATEGY\u2026FAQ)';
    displayName: 'Anchor Nav';
  };
  attributes: {
    items: Schema.Attribute.Component<'shared.footer-link', true>;
  };
}

export interface SectionsArticleSection extends Struct.ComponentSchema {
  collectionName: 'components_sections_article_sections';
  info: {
    description: 'A sub-heading and its paragraphs within a Learn article.';
    displayName: 'Article Section';
  };
  attributes: {
    body: Schema.Attribute.RichText & Schema.Attribute.Required;
    heading: Schema.Attribute.String;
  };
}

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
    description: 'A closing band with a heading and one or more buttons.';
    displayName: 'CTA Group';
  };
  attributes: {
    body: Schema.Attribute.RichText;
    ctas: Schema.Attribute.Component<'shared.cta', true>;
    heading: Schema.Attribute.String;
    subheading: Schema.Attribute.Text;
    theme: Schema.Attribute.Enumeration<['navy', 'ice', 'light']> &
      Schema.Attribute.DefaultTo<'ice'>;
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
    documents: Schema.Attribute.Component<'shared.footer-link', true>;
    emptyText: Schema.Attribute.String;
    heading: Schema.Attribute.String;
    kind: Schema.Attribute.Enumeration<['filings', 'fund-docs']> &
      Schema.Attribute.Required;
    note: Schema.Attribute.Text;
  };
}

export interface SectionsEducationGrid extends Struct.ComponentSchema {
  collectionName: 'components_sections_education_grids';
  info: {
    description: 'The full grid of all Learn articles (used on the Learn page).';
    displayName: 'Learn Grid';
  };
  attributes: {
    heading: Schema.Attribute.String;
  };
}

export interface SectionsEducationList extends Struct.ComponentSchema {
  collectionName: 'components_sections_education_lists';
  info: {
    description: 'A row of the most recent Learn articles (used on Investor Relations).';
    displayName: 'Learn List';
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
      Schema.Attribute.DefaultTo<3>;
    viewAllHref: Schema.Attribute.String;
  };
}

export interface SectionsEventItem extends Struct.ComponentSchema {
  collectionName: 'components_sections_event_items';
  info: {
    description: 'A single event or webcast card.';
    displayName: 'Event Item';
  };
  attributes: {
    brandLabel: Schema.Attribute.String;
    brandSublabel: Schema.Attribute.String;
    ctaHref: Schema.Attribute.String & Schema.Attribute.Required;
    ctaLabel: Schema.Attribute.String & Schema.Attribute.Required;
    dateTime: Schema.Attribute.String & Schema.Attribute.Required;
    image: Schema.Attribute.Media<'images'>;
    title: Schema.Attribute.String & Schema.Attribute.Required;
    type: Schema.Attribute.Enumeration<['webcast', 'recording']> &
      Schema.Attribute.DefaultTo<'webcast'>;
  };
}

export interface SectionsEventsList extends Struct.ComponentSchema {
  collectionName: 'components_sections_events_lists';
  info: {
    description: 'A list of events and webcasts (used on Investor Relations).';
    displayName: 'Events List';
  };
  attributes: {
    events: Schema.Attribute.Component<'sections.event-item', true>;
    heading: Schema.Attribute.String;
  };
}

export interface SectionsFaqBlock extends Struct.ComponentSchema {
  collectionName: 'components_sections_faq_blocks';
  info: {
    description: 'Frequently asked questions section. Questions come from the FAQ single type.';
    displayName: 'FAQ Block';
  };
  attributes: {
    contactEmail: Schema.Attribute.String;
    faq: Schema.Attribute.Relation<'oneToOne', 'api::faq.faq'>;
    heading: Schema.Attribute.String;
    intro: Schema.Attribute.Text;
    theme: Schema.Attribute.Enumeration<['light', 'navy']> &
      Schema.Attribute.DefaultTo<'light'>;
  };
}

export interface SectionsFormBlock extends Struct.ComponentSchema {
  collectionName: 'components_sections_form_blocks';
  info: {
    description: 'A form section (newsletter signup or contact). Uses HubSpot ids either from the linked Form or typed directly below.';
    displayName: 'Form Block';
  };
  attributes: {
    body: Schema.Attribute.Text;
    fields: Schema.Attribute.Component<'sections.form-field', true>;
    form: Schema.Attribute.Relation<'oneToOne', 'api::form.form'>;
    formId: Schema.Attribute.String;
    heading: Schema.Attribute.String;
    portalId: Schema.Attribute.String;
    theme: Schema.Attribute.Enumeration<['light', 'dark', 'deep']> &
      Schema.Attribute.DefaultTo<'light'>;
    variant: Schema.Attribute.Enumeration<['inline', 'stacked']> &
      Schema.Attribute.DefaultTo<'stacked'>;
  };
}

export interface SectionsFormField extends Struct.ComponentSchema {
  collectionName: 'components_sections_form_fields';
  info: {
    description: 'One input in a form (name, email, message, etc.).';
    displayName: 'Form Field';
  };
  attributes: {
    label: Schema.Attribute.String & Schema.Attribute.Required;
    name: Schema.Attribute.String & Schema.Attribute.Required;
    options: Schema.Attribute.Component<'shared.bullet', true>;
    placeholder: Schema.Attribute.String;
    required: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    type: Schema.Attribute.Enumeration<
      ['text', 'email', 'textarea', 'select']
    > &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'text'>;
  };
}

export interface SectionsHero extends Struct.ComponentSchema {
  collectionName: 'components_sections_heroes';
  info: {
    description: 'Large banner at the top of a page: headline, optional rotating words, background image or video, and buttons.';
    displayName: 'Hero';
  };
  attributes: {
    backgroundImage: Schema.Attribute.Media<'images'>;
    backgroundVideo: Schema.Attribute.Media<'videos'>;
    body: Schema.Attribute.RichText;
    compact: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    ctas: Schema.Attribute.Component<'shared.cta', true>;
    eyebrow: Schema.Attribute.String;
    heading: Schema.Attribute.String;
    headlinePrefix: Schema.Attribute.String;
    headlineSlides: Schema.Attribute.Component<'shared.bullet', true>;
    headlineSuffixes: Schema.Attribute.Component<'shared.bullet', true>;
    rotatingPhrases: Schema.Attribute.JSON;
    subheading: Schema.Attribute.Text;
  };
}

export interface SectionsIntro extends Struct.ComponentSchema {
  collectionName: 'components_sections_intros';
  info: {
    description: 'Introduction block. On the home page this also holds the interactive portfolio grid and the fund-details table.';
    displayName: 'Intro';
  };
  attributes: {
    body: Schema.Attribute.RichText;
    cta: Schema.Attribute.Component<'shared.cta', false>;
    fundDetails: Schema.Attribute.Component<'shared.key-value', true>;
    fundDetailsFootnote: Schema.Attribute.Text;
    heading: Schema.Attribute.String;
    kicker: Schema.Attribute.String;
    portfolioItems: Schema.Attribute.Component<
      'sections.portfolio-grid-item',
      true
    >;
    subheading: Schema.Attribute.Text;
    tailCta: Schema.Attribute.Component<'shared.cta', false>;
    tailHeading: Schema.Attribute.String;
    tailParagraphs: Schema.Attribute.RichText;
  };
}

export interface SectionsNewsItem extends Struct.ComponentSchema {
  collectionName: 'components_sections_news_items';
  info: {
    description: 'A press/news card (date + title + link + thumbnail)';
    displayName: 'News Item';
  };
  attributes: {
    date: Schema.Attribute.String;
    href: Schema.Attribute.String & Schema.Attribute.Required;
    image: Schema.Attribute.Media<'images'>;
    source: Schema.Attribute.String;
    title: Schema.Attribute.String & Schema.Attribute.Required;
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
    description: "A statement block: heading + paragraphs, shown either as a slideshow card ('panel') or a two-column band ('band').";
    displayName: 'Philosophy';
  };
  attributes: {
    anchor: Schema.Attribute.String;
    backgroundSlides: Schema.Attribute.Component<'shared.image-with-alt', true>;
    graphic: Schema.Attribute.Enumeration<['sector-wheel', 'dotted-sphere']>;
    graphicCaption: Schema.Attribute.Text;
    heading: Schema.Attribute.String;
    paragraphs: Schema.Attribute.RichText;
    supportingImages: Schema.Attribute.Component<'shared.image-with-alt', true>;
    tone: Schema.Attribute.Enumeration<['ice', 'light']> &
      Schema.Attribute.DefaultTo<'ice'>;
    variant: Schema.Attribute.Enumeration<['panel', 'band']> &
      Schema.Attribute.DefaultTo<'panel'>;
  };
}

export interface SectionsPlatformItem extends Struct.ComponentSchema {
  collectionName: 'components_sections_platform_items';
  info: {
    description: 'A brokerage platform link (logo + label + group)';
    displayName: 'Platform Item';
  };
  attributes: {
    group: Schema.Attribute.Enumeration<['self-directed', 'advisor']> &
      Schema.Attribute.DefaultTo<'self-directed'>;
    href: Schema.Attribute.String & Schema.Attribute.Required;
    label: Schema.Attribute.String & Schema.Attribute.Required;
    logo: Schema.Attribute.Media<'images'>;
  };
}

export interface SectionsPlatformTabs extends Struct.ComponentSchema {
  collectionName: 'components_sections_platform_tabs';
  info: {
    description: 'Tabbed brokerage platform grid (/trade: Self Directed / Advisor Managed)';
    displayName: 'Platform Tabs';
  };
  attributes: {
    advisorLabel: Schema.Attribute.String &
      Schema.Attribute.DefaultTo<'Financial Advisor Managed'>;
    heading: Schema.Attribute.String;
    intro: Schema.Attribute.Text;
    items: Schema.Attribute.Component<'sections.platform-item', true>;
    selfDirectedLabel: Schema.Attribute.String &
      Schema.Attribute.DefaultTo<'Self Directed Brokerage'>;
  };
}

export interface SectionsPortfolioBlock extends Struct.ComponentSchema {
  collectionName: 'components_sections_portfolio_blocks';
  info: {
    description: 'The /fund holdings section: exposure table, sectors table, and an origination panel. Holdings can also be pulled from the Fund Portfolio single type.';
    displayName: 'Portfolio Block';
  };
  attributes: {
    footnotes: Schema.Attribute.RichText;
    heading: Schema.Attribute.String;
    holdings: Schema.Attribute.Component<'shared.holding', true>;
    intro: Schema.Attribute.Text;
    panelBody: Schema.Attribute.Text;
    panelHeading: Schema.Attribute.String;
    portfolioSnapshot: Schema.Attribute.Relation<
      'oneToOne',
      'api::portfolio-snapshot.portfolio-snapshot'
    >;
    scheduleHref: Schema.Attribute.String;
    sectors: Schema.Attribute.Component<'shared.holding', true>;
    sectorsFootnote: Schema.Attribute.Text;
  };
}

export interface SectionsPortfolioGridItem extends Struct.ComponentSchema {
  collectionName: 'components_sections_portfolio_grid_items';
  info: {
    description: 'One company tile in the home-page portfolio grid.';
    displayName: 'Portfolio Grid Item';
  };
  attributes: {
    allocation: Schema.Attribute.String & Schema.Attribute.Required;
    ipo: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    logo: Schema.Attribute.Media<'images'>;
    name: Schema.Attribute.String & Schema.Attribute.Required;
    ticker: Schema.Attribute.String;
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
    centered: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    heading: Schema.Attribute.String;
    intro: Schema.Attribute.Text;
    steps: Schema.Attribute.Component<'sections.process-step', true>;
  };
}

export interface SectionsPullQuote extends Struct.ComponentSchema {
  collectionName: 'components_sections_pull_quotes';
  info: {
    description: 'A large quote band with optional supporting copy, a button, and background imagery.';
    displayName: 'Pull Quote';
  };
  attributes: {
    backgroundImage: Schema.Attribute.Media<'images'>;
    backgroundSlides: Schema.Attribute.Component<'shared.image-with-alt', true>;
    cta: Schema.Attribute.Component<'shared.cta', false>;
    quote: Schema.Attribute.Text & Schema.Attribute.Required;
    subheading: Schema.Attribute.Text;
  };
}

export interface SectionsRichText extends Struct.ComponentSchema {
  collectionName: 'components_sections_rich_texts';
  info: {
    description: 'A flexible prose section with an optional side list of key/value rows.';
    displayName: 'Rich Text';
  };
  attributes: {
    body: Schema.Attribute.RichText & Schema.Attribute.Required;
    ctas: Schema.Attribute.Component<'shared.cta', true>;
    heading: Schema.Attribute.String;
    headingStyle: Schema.Attribute.Enumeration<['blue', 'dark']> &
      Schema.Attribute.DefaultTo<'dark'>;
    sideItems: Schema.Attribute.Component<'shared.key-value', true>;
    subheading: Schema.Attribute.Text;
    tone: Schema.Attribute.Enumeration<['light', 'panel', 'gradient']> &
      Schema.Attribute.DefaultTo<'light'>;
  };
}

export interface SectionsStatItem extends Struct.ComponentSchema {
  collectionName: 'components_sections_stat_items';
  info: {
    description: 'A single statistic (big number + label).';
    displayName: 'Stat Item';
  };
  attributes: {
    footnote: Schema.Attribute.Text;
    icon: Schema.Attribute.Media<'images'>;
    label: Schema.Attribute.String;
    value: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface SectionsStatsBlock extends Struct.ComponentSchema {
  collectionName: 'components_sections_stats_blocks';
  info: {
    description: 'A band of headline statistics (e.g. AUM, portfolio companies, exits).';
    displayName: 'Stats Block';
  };
  attributes: {
    body: Schema.Attribute.RichText;
    cta: Schema.Attribute.Component<'shared.cta', false>;
    footnote: Schema.Attribute.Text;
    heading: Schema.Attribute.String;
    intro: Schema.Attribute.Text;
    stats: Schema.Attribute.Component<'sections.stat-item', true>;
    subheading: Schema.Attribute.Text;
    theme: Schema.Attribute.Enumeration<['navy', 'light']> &
      Schema.Attribute.DefaultTo<'navy'>;
  };
}

export interface SectionsStockInfo extends Struct.ComponentSchema {
  collectionName: 'components_sections_stock_infos';
  info: {
    description: 'Stock Info: static labelled rows + notes (widget optional)';
    displayName: 'Stock Info';
  };
  attributes: {
    heading: Schema.Attribute.String;
    notes: Schema.Attribute.RichText;
    rows: Schema.Attribute.Component<'shared.key-value', true>;
    theme: Schema.Attribute.Enumeration<['light', 'dark', 'deep']> &
      Schema.Attribute.DefaultTo<'light'>;
    widgetId: Schema.Attribute.String;
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
    description: 'A chronological history section with a year beam and entries.';
    displayName: 'Timeline';
  };
  attributes: {
    backgroundGraphic: Schema.Attribute.Media<'images'>;
    beamCaption: Schema.Attribute.Text;
    entries: Schema.Attribute.Component<'sections.timeline-entry', true>;
    heading: Schema.Attribute.String;
    intro: Schema.Attribute.Text;
    years: Schema.Attribute.Component<'shared.bullet', true>;
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

export interface SectionsTruthItem extends Struct.ComponentSchema {
  collectionName: 'components_sections_truth_items';
  info: {
    description: 'Numbered principle row (number graphic + title + body)';
    displayName: 'Truth Item';
  };
  attributes: {
    body: Schema.Attribute.Text;
    icon: Schema.Attribute.Media<'images'>;
    title: Schema.Attribute.String;
  };
}

export interface SectionsTruths extends Struct.ComponentSchema {
  collectionName: 'components_sections_truths';
  info: {
    description: 'Numbered principles + supporting graphic with footnoted caption (/vision)';
    displayName: 'Truths';
  };
  attributes: {
    caption: Schema.Attribute.Text;
    heading: Schema.Attribute.String;
    items: Schema.Attribute.Component<'sections.truth-item', true>;
    sourceHref: Schema.Attribute.String;
    sourceLabel: Schema.Attribute.String;
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

export interface SharedBullet extends Struct.ComponentSchema {
  collectionName: 'components_shared_bullets';
  info: {
    description: 'A single bullet-point line.';
    displayName: 'Bullet';
  };
  attributes: {
    text: Schema.Attribute.String & Schema.Attribute.Required;
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
      ['primary', 'secondary', 'link', 'underline', 'mint']
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
    answer: Schema.Attribute.RichText &
      Schema.Attribute.Required &
      Schema.Attribute.CustomField<
        'plugin::ckeditor.CKEditor',
        {
          licenseKey: 'GPL';
          output: 'HTML';
          preset: 'standard';
        }
      >;
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

export interface SharedKeyValue extends Struct.ComponentSchema {
  collectionName: 'components_shared_key_values';
  info: {
    description: 'A labelled value row (e.g. Stock Info: Ticker \u2192 PWRL)';
    displayName: 'Key Value';
  };
  attributes: {
    label: Schema.Attribute.String & Schema.Attribute.Required;
    value: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface SharedNavItem extends Struct.ComponentSchema {
  collectionName: 'components_shared_nav_items';
  info: {
    description: 'A top-level navigation menu item, with optional dropdown links.';
    displayName: 'Nav Item';
  };
  attributes: {
    children: Schema.Attribute.Component<'shared.nav-link', true>;
    href: Schema.Attribute.String & Schema.Attribute.Required;
    label: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface SharedNavLink extends Struct.ComponentSchema {
  collectionName: 'components_shared_nav_links';
  info: {
    description: 'A dropdown sub-link under a main navigation item.';
    displayName: 'Nav Link';
  };
  attributes: {
    href: Schema.Attribute.String & Schema.Attribute.Required;
    label: Schema.Attribute.String & Schema.Attribute.Required;
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
      'sections.anchor-nav': SectionsAnchorNav;
      'sections.article-section': SectionsArticleSection;
      'sections.board-grid': SectionsBoardGrid;
      'sections.cta-group': SectionsCtaGroup;
      'sections.disclosures': SectionsDisclosures;
      'sections.document-list': SectionsDocumentList;
      'sections.education-grid': SectionsEducationGrid;
      'sections.education-list': SectionsEducationList;
      'sections.event-item': SectionsEventItem;
      'sections.events-list': SectionsEventsList;
      'sections.faq-block': SectionsFaqBlock;
      'sections.form-block': SectionsFormBlock;
      'sections.form-field': SectionsFormField;
      'sections.hero': SectionsHero;
      'sections.intro': SectionsIntro;
      'sections.news-item': SectionsNewsItem;
      'sections.news-list': SectionsNewsList;
      'sections.philosophy': SectionsPhilosophy;
      'sections.platform-item': SectionsPlatformItem;
      'sections.platform-tabs': SectionsPlatformTabs;
      'sections.portfolio-block': SectionsPortfolioBlock;
      'sections.portfolio-grid-item': SectionsPortfolioGridItem;
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
      'sections.truth-item': SectionsTruthItem;
      'sections.truths': SectionsTruths;
      'sections.value-prop-item': SectionsValuePropItem;
      'sections.value-props': SectionsValueProps;
      'shared.bullet': SharedBullet;
      'shared.cta': SharedCta;
      'shared.disclaimer-paragraph': SharedDisclaimerParagraph;
      'shared.faq-item': SharedFaqItem;
      'shared.footer-link': SharedFooterLink;
      'shared.holding': SharedHolding;
      'shared.image-with-alt': SharedImageWithAlt;
      'shared.key-value': SharedKeyValue;
      'shared.nav-item': SharedNavItem;
      'shared.nav-link': SharedNavLink;
      'shared.seo': SharedSeo;
    }
  }
}
