/**
 * Fixtures — real PWRL content, typed as block objects.
 *
 * Source of truth: `_inventory/inventory.json` + `_inventory/extracted/*.json`.
 * Copy is verbatim (this is a regulated finance site — disclaimers especially
 * must not be paraphrased). These let every page render fully for visual QA
 * while Strapi has no content yet; `lib/strapi.ts` falls back to them.
 *
 * Images are self-hosted under /public/remote-assets (mirrored from the
 * client's Contentful CDN), so the rebuild has no runtime dependency on the
 * live site's asset pipeline. When content moves into Strapi + Cloudinary,
 * these srcs will be replaced by Cloudinary URLs from the CMS.
 */

import type {
  Block,
  GlobalSettings,
  PageData,
  PersonCard,
} from "@/types/blocks";

/**
 * The live site serves images through Next's image proxy:
 *   /pwrl/_next/image?url=<encoded-source>&w=…&q=…
 * Decode back to the real source URL so a plain <img> can load it directly.
 * Local proxy paths (e.g. /pwrl/investment_sector_wheel/head.svg) are returned
 * unchanged but are not resolvable from this app — treated as decorative.
 */
export function resolveImageUrl(raw: string): string {
  if (!raw) return raw;
  const marker = "url=";
  if (raw.includes("/_next/image") && raw.includes(marker)) {
    const after = raw.slice(raw.indexOf(marker) + marker.length);
    const enc = after.split("&")[0];
    try {
      return decodeURIComponent(enc);
    } catch {
      return raw;
    }
  }
  return raw;
}

const img = (src: string, alt: string) => ({
  src: resolveImageUrl(src),
  alt,
});

const CONTACT_EMAIL = "Info@PWRL.com";

/* ------------------------------------------------------------------ */
/* Team & board (from extracted/*.json)                                */
/* ------------------------------------------------------------------ */

const TEAM_IMAGES: Record<string, string> = {
  "Michael Dinsdale":
    "/remote-assets/20be770f-michael_dindsdale.webp",
  "Benjamin Black":
    "/remote-assets/4a16f058-ben_black.webp",
  "Peter Smith":
    "/remote-assets/a2b8c913-peter_smith.webp",
  "Angela Stanley":
    "/remote-assets/a0d27b1a-angela_stanley.webp",
  "Tracy Hogan":
    "/remote-assets/42d560cc-tracy_hogan.webp",
  "Benjamin Hadary":
    "/remote-assets/619a563f-Ben.png",
  "Vivian Chow":
    "/remote-assets/256407df-vivian.webp",
  "Nicholas Earl":
    "/remote-assets/23c13005-nicholas.webp",
  "Lars Leckie":
    "/remote-assets/b421a5fb-lars.webp",
};

const person = (
  name: string,
  role: string,
  bio: Partial<Pick<PersonCard, "bio" | "bioBullets" | "bioFormat" | "alsoOnTeam">>,
): PersonCard => ({
  name,
  role,
  image: TEAM_IMAGES[name] ? { src: TEAM_IMAGES[name], alt: name } : null,
  ...bio,
});

const DINSDALE_BIO =
  'Mike Dinsdale is a Managing Director at Akkadian. For over 20 years, Mr. Dinsdale has embodied the "modern unicorn" CFO, with strategic expertise in building high-growth international companies that consistently exceed growth targets.\n\nPrior to Akkadian, Mr. Dinsdale was the Chief Financial Officer of three market-leading software companies that generated an aggregate of over $80 billion in value and for which he successfully secured an aggregate of over $2 billion in financing. He previously served on the Board of Directors for WildAid (non-profit).\n\nMr. Dinsdale holds a BS in engineering from the University of Western Ontario, an MBA from McMaster University, and the CFA designation. He competed on the Canadian National Sailing Team in the 1996 Olympic trials.\n\nMr. Dinsdale’s finance expertise and his experience as a CFO of multiple companies makes him qualified to serve on the Board.';

const BLACK_BIO =
  "Benjamin Black is the Co-Founder and Managing Director of Akkadian and a 20-year private equity veteran.\n\nIn addition, Mr. Black is the Co-Founder of the RAISE Global Summit, which has grown into a premier launchpad for emerging venture capital funds.\n\nPrior to Akkadian, Mr. Black co-founded New Cycle Capital to bring socially responsible investing to sectors like clean energy and social finance. He started his private equity career on the investment teams at Maveron and Rosewood Capital, where he focused on branded consumer products and services. Prior to his private equity career, Mr. Black was a member of the founding team of Harris Interactive.\n\nMr. Black holds a BA and JD from Cornell University.\n\nMr. Black’s extensive experience in venture capital and private equity, including as a managing director and founder of various firms, makes him qualified to serve on the Board.";

const TEAM_MEMBERS: PersonCard[] = [
  person("Michael Dinsdale", "CEO", { bio: DINSDALE_BIO, bioFormat: "prose" }),
  person("Benjamin Black", "CIO", { bio: BLACK_BIO, bioFormat: "prose" }),
  person("Peter Smith", "President", {
    bioFormat: "bullets",
    bioBullets: [
      "Co-founded Akkadian in 2010",
      "20+ years of legal experience",
      "Associate at Cooley, Morrison & Foerster, and Bryan Cave",
      "Real estate investor and developer",
      "BA (Cum Laude) from Cornell University and JD from UC Berkeley",
      "Inactive member of the State Bar of California and the State Bar of Colorado",
    ],
  }),
  person("Angela Stanley", "COO", {
    bioFormat: "bullets",
    bioBullets: [
      "Joined Akkadian in 2024 after supporting the firm with two prior fundraises in 2016 and 2019",
      "20+ years of IR & fundraising experience",
      "Head of IR & Fundraising at Delta-v Capital",
      "Co-founder and Managing Director of Harpeth Fund Advisors",
      "Vice President and Head of the San Francisco office at BerchWood Partners",
      "BS in International Finance from University of North Carolina-Wilmington",
    ],
  }),
  person("Tracy Hogan", "CFO", {
    bioFormat: "bullets",
    bioBullets: [
      "Joined Akkadian in 2025",
      "20+ years of experience in venture capital / private equity finance and operations",
      "Partner and CFO at IVP",
      "CFO and CCO at Elevation Partners",
      "Vice President of Finance at Code, Hennessy & Simmons",
      "BBA (Magna Cum Laude) from Saint Mary's College (Notre Dame, Indiana)",
    ],
  }),
  person("Benjamin Hadary", "General Counsel", {
    bioFormat: "bullets",
    bioBullets: [
      "20+ years of experience representing technology and energy companies in commercial, M&A, finance, public reporting, securities, and governance matters",
      "Vice President and General Counsel at ANM",
      "Experience as a strategy executive and real estate entrepreneur",
      "JD from Stanford Law School, with distinction; MSc Management, Stanford Business School",
      "BS from Penn State University",
      "Active member of the State Bar of Colorado",
      "RPCV, United States Peace Corps, The Gambia",
    ],
  }),
];

const CHOW_BIO =
  "Vivian Chow spent eight years as SVP Chief Accounting Officer at DocuSign (NASDAQ: DOCU), a cloud-based platform for electronic signatures. While there, she was responsible for accounting, sales compensation, internal audit, tax and treasury.\n\nPrior to joining DocuSign in 2013, Ms. Chow served five years as VP of Finance Worldwide Controller at Electronic Arts Inc. (NASDAQ: EA), a leading publisher of video games. Prior to Electronic Arts, she held VP and Corporate Controller positions at companies in the retail, medical device and financial services industries.\n\nMs. Chow started her career in public accounting at Arthur Andersen & Co., a public accounting partnership. She is an inactive Certified Public Accountant in the State of California.\n\nMs. Chow holds a BS in Accounting from Lehigh University. She is a Board Member of LiveRamp (NYSE: RAMP), a data collaboration platform for consumer data.\n\nMs. Chow’s extensive accounting and financial background and her executive experience, including serving as a chief accounting officer and controller, make her qualified to serve on the Board.";

const EARL_BIO =
  "Nicholas Earl is a 29-year game industry veteran. He served as Glu Mobile's President and CEO and held a seat on the company's Board of Directors. In 2021, Electronic Arts purchased Glu Mobile for $2.4 billion, the 7th largest acquisition in video gaming history.\n\nPrior to Glu, Mr. Earl was President of Worldwide Studios at Kabam, presiding over such games as Marvel: Contest of Champions. Mr. Earl served as SVP of EA Mobile at Electronic Arts, overseeing hits such as The Simpsons: Tapped Out, The Sims FreePlay and Real Racing 3. While there, he also led the company's transition from the premium to freemium model.\n\nPrior to EA Mobile, Mr. Earl was SVP of EA Games launching such console and PC franchises as Knockout Kings, James Bond, Tiger Woods PGA Tour, The Godfather, The Sims, The Simpsons, Lord of the Rings and Dead Space.\n\nMr. Earl holds a BA in Economics from the University of California, Berkeley. He served as a Board Member and head of the Compensation Committee of SciPlay (SCPL), a leading developer and publisher of digital games, until its sale to Light & Wonder in 2023.\n\nMr. Earl’s service on multiple boards, and his extensive executive experience, including as a CEO make him qualified to serve on the Board.";

const LECKIE_BIO =
  "Lars Leckie has a wealth of experience in technology investment as a former technology founder and twenty year career in venture capital. As a Co-founder of Aspenwood Ventures and a long-standing Managing Director at Hummer Winblad Venture Partners, Mr. Leckie has a track record of identifying and nurturing founders of disruptive software companies.\n\nBefore his venture capital career, Mr. Leckie co-founded AutoFarm, a company focused on GPS and robotics. As a Managing Director at Aspenwood Ventures, Mr. Leckie continues to focus on early-stage B2B software companies. His firm's prior successes include exited category winning companies like Mulesoft and Five9, as well as emerging companies like Arkose Labs, Amberdata and Aria Systems.\n\nMr. Leckie holds a MS (Engineering) from Stanford University and an MBA from the Stanford Graduate School of Business.\n\nMr. Leckie’s depth of experience in venture capital investing, and his experience as an executive make him qualified to serve on the Board.";

const BOARD_DIRECTORS: PersonCard[] = [
  person("Benjamin Black", "Director", {
    bio: BLACK_BIO,
    bioFormat: "prose",
    alsoOnTeam: true,
  }),
  person("Michael Dinsdale", "Director", {
    bio: DINSDALE_BIO,
    bioFormat: "prose",
    alsoOnTeam: true,
  }),
  person("Vivian Chow", "Independent Director, Chair of the Board", {
    bio: CHOW_BIO,
    bioFormat: "prose",
  }),
  person("Nicholas Earl", "Independent Director", {
    bio: EARL_BIO,
    bioFormat: "prose",
  }),
  person("Lars Leckie", "Independent Director", {
    bio: LECKIE_BIO,
    bioFormat: "prose",
  }),
];

/* ------------------------------------------------------------------ */
/* Shared FAQ singleton (rendered on /vision and /fund)                */
/* ------------------------------------------------------------------ */

const FAQ_BLOCK: Block = {
  __component: "sections.faq-block",
  // Live: "Questions." is italic (<em>); the email is an underlined mailto.
  heading: "Frequently Asked _Questions._",
  intro:
    "We want to bring as much transparency as possible to accessing private market investing. If you're not finding the answers you're looking for, contact us at: [Info@PWRL.com](mailto:Info@PWRL.com)",
  contactEmail: CONTACT_EMAIL,
  // Live renders the FAQ on the navy band (verified on /vision).
  theme: "navy",
  faqs: [
    {
      q: "What is Powerlaw Corp. (Nasdaq: PWRL)?",
      a: "Powerlaw Corp. (Nasdaq: PWRL) is a listed closed-end fund registered under the Investment Company Act of 1940, offering exposure to leading private technology companies through a single Nasdaq-listed security. It provides daily liquidity, monthly NAV reporting, and quarterly portfolio disclosure.",
    },
    {
      q: "Who is behind Powerlaw?",
      a: "Powerlaw Corp. (Nasdaq: PWRL) is the first product of Powerlaw Capital Group and advised by Powerlaw Fund Adviser, LLC. The firm is backed by Akkadian Ventures' 16-year heritage in private-company secondary markets.",
    },
    {
      q: "How are portfolio investments valued?",
      a: "Portfolio holdings are carried at fair value, determined under the Fund's valuation policies with input from independent valuation sources. Inputs include recent primary financings, secondary market transactions, and comparable-company multiples.",
    },
    {
      q: "What happens if a portfolio company goes public or is acquired?",
      a: "In an IPO, the Fund's position converts to listed equity, generally subject to a customary lock-up. In a sale, the Fund receives cash, stock, or a mix of consideration. Proceeds are reflected in NAV and may be available for reinvestment or distributions.",
    },
    {
      q: "Do investors receive shares of portfolio companies directly?",
      a: "No. Shareholders own PWRL; the Fund owns the underlying private positions. Buying PWRL provides economic exposure to the portfolio through a single security listed on NASDAQ.",
    },
    {
      q: "How will Powerlaw communicate with stockholders?",
      a: "Powerlaw Corp. publishes monthly NAV and NAV per share, with quarterly portfolio disclosures. All filings are available on PWRL.com and through the SEC's EDGAR system.",
    },
    {
      q: "What are the key risks?",
      a: "Investing in PWRL involves a number of significant risks. Before you invest in PWRL, you should be aware of various risks associated with the investment, including those described in our [prospectus](https://www.sec.gov/ix?doc=/Archives/edgar/data/0002052053/000121390026059594/ea0290638-02_424b3.htm). The prospectus contains this and other information about the Fund, and is available free of charge at www.PWRL.com. You should carefully consider these risk factors, together with all of the other information included in the prospectus, before you decide whether to make an investment in PWRL. If any of the events listed in the prospectus occur, our business, financial condition and results of operations could be materially and adversely affected. In such case, you may lose all or part of your investment.",
    },
  ],
};

const NAV_FORM_BLOCK: Block = {
  __component: "sections.form-block",
  body: [
    "Sign up for monthly NAV updates, quarterly portfolio disclosures, and fund-related news.",
  ],
  portalId: "243469173",
  formId: "ce5f73ec-b4cd-4529-805f-6e7bdb03960a",
  theme: "dark",
  variant: "inline",
  fields: [
    {
      name: "firstname",
      type: "text",
      label: "Full Name",
      placeholder: "Full Name*",
      required: true,
    },
    {
      name: "email",
      type: "email",
      label: "Email",
      placeholder: "Email*",
      required: true,
    },
  ],
};

/** /vision renders the same signup on the live deep-blue #00158D band. */
const NAV_FORM_BLOCK_DEEP = {
  ...(NAV_FORM_BLOCK as object),
  theme: "deep",
} as Block;

/* ------------------------------------------------------------------ */
/* Pages                                                               */
/* ------------------------------------------------------------------ */

const HOME: PageData = {
  slug: "/",
  title: "PWRL - Private Tech, Nasdaq Listed.",
  metaDescription: "18 leading private tech companies. One easily tradeable fund",
  sections: [
    {
      __component: "sections.hero",
      // Full-bleed background video, matching the live home hero.
      // TODO(cloudinary): migrate /media/Home-Sequence.mp4 off the repo to CDN.
      backgroundVideo: "/media/Home-Sequence.mp4",
      // Live rotator: standalone slides + static "Only for" prefix with
      // animated suffixes. `heading` is the reduced-motion/SEO fallback.
      heading: "Only for everyone.",
      // Live renders the home hero body inside <b> — ** markers → bold.
      body: [
        "SpaceX • OpenAI • Kalshi • Deel • Stripe • Kraken • Vast Data • Databricks • Tether •\nColossal • Mercor • Perplexity • Canva • Groq • Rippling • Saronic • Figma • Waymo",
        "**All in one Nasdaq-listed stock. Only for Everyone.**",
      ],
      headlineSlides: ["Powerlaw Corp.", "Nasdaq: PWRL"],
      headlinePrefix: "Only for",
      headlineSuffixes: [
        "big thinkers.",
        "Mars seekers.",
        "world changers.",
        "everyone.",
      ],
      ctas: [{ label: "VIEW PORTFOLIO", href: "/fund", variant: "primary" }],
    },
    NAV_FORM_BLOCK,
    {
      __component: "sections.intro",
      heading: "A Curated Portfolio of Private Tech.",
      body: [
        "Now available in one stock, tradable on Nasdaq. Powerlaw Corp. (Nasdaq: PWRL) is the flagship fund from Powerlaw Capital Group, an asset management firm building a publicly-listed platform for private technology investing.",
      ],
      portfolioItems: [
        { name: "SpaceX", ticker: "$SPCX", allocation: "19.37%", ipo: true, logo: img("/remote-assets/logos/spacex.png", "SpaceX") },
        { name: "OpenAI", allocation: "7.77%", logo: img("/remote-assets/logos/openai.png", "OpenAI") },
        { name: "Kalshi", allocation: "6.26%", logo: img("/remote-assets/logos/kalshi.png", "Kalshi") },
        { name: "Deel", allocation: "4.96%", logo: img("/remote-assets/logos/deel.png", "Deel") },
        { name: "Stripe", allocation: "4.19%", logo: img("/remote-assets/logos/stripe.png", "Stripe") },
        { name: "Kraken", allocation: "4.16%", logo: img("/remote-assets/logos/kraken.png", "Kraken") },
        { name: "Vast Data", allocation: "4.14%", logo: img("/remote-assets/logos/vast-data.png", "Vast Data") },
        { name: "Databricks", allocation: "3.45%", logo: img("/remote-assets/logos/databricks.png", "Databricks") },
        { name: "Tether", allocation: "3.31%", logo: img("/remote-assets/logos/tether.png", "Tether") },
        { name: "Colossal", allocation: "3.31%", logo: img("/remote-assets/logos/colossal.png", "Colossal") },
        { name: "Mercor", allocation: "3.31%", logo: img("/remote-assets/logos/mercor.svg", "Mercor") },
        { name: "Perplexity", allocation: "1.32%", logo: img("/remote-assets/logos/perplexity.png", "Perplexity") },
        { name: "Canva", allocation: "1.09%", logo: img("/remote-assets/logos/canva.png", "Canva") },
        { name: "Groq", allocation: "1.07%", logo: img("/remote-assets/logos/groq.png", "Groq") },
        { name: "Rippling", allocation: "0.82%", logo: img("/remote-assets/logos/rippling.png", "Rippling") },
        { name: "Saronic", allocation: "0.82%", logo: img("/remote-assets/logos/saronic.png", "Saronic") },
        { name: "Figma", ticker: "$FIG", allocation: "0.20%", ipo: true, logo: img("/remote-assets/logos/figma.png", "Figma") },
        { name: "Waymo", allocation: "0.06%", logo: img("/remote-assets/logos/waymo.png", "Waymo") },
      ],
      cta: { label: "EXPLORE THE FUND", href: "/fund", variant: "mint" },
      tailHeading: "Private Tech. Nasdaq Listed.\nOnly for everyone.",
      tailParagraphs: [
        "Powerlaw Corp. offers the access you've been wanting with the\nwisdom you've been waiting for. As more of the world's most\nconsequential technology companies stay private longer, an entire\ngeneration of investors has been locked out of the value creation those\ncompanies represent.",
        "Powerlaw Corp. (Nasdaq: PWRL) is built to change that as a Nasdaq-\nlisted fund offering exposure to leading private technology companies\nthrough a single ticker. Powerlaw Corp. is the first product on Powerlaw\nCapital Group's platform.",
      ],
      tailCta: {
        label: "READ OUR PROSPECTUS",
        href: "https://www.sec.gov/ix?doc=/Archives/edgar/data/0002052053/000121390026059594/ea0290638-02_424b3.htm",
        variant: "primary",
      },
      fundDetails: [
        { label: "Ticker*", value: "PWRL" },
        { label: "Listing Venue*", value: "Nasdaq" },
        { label: "Adviser", value: "Powerlaw Fund Adviser, LLC." },
        { label: "Net Asset Value (NAV)", value: "$662.0M" },
        { label: "NAV Per Share", value: "$15.31" },
        { label: "Annual Management Fee*", value: "2.5%" },
      ],
      fundDetailsFootnote: "Updated monthly. Last updated 05/31/2026.",
    },
    {
      __component: "sections.pull-quote",
      quote:
        "We believe the world's most transformative\ncompanies should be within everyone's reach.",
      subheading:
        "Powerlaw Corp. (Nasdaq: PWRL) seeks to provide investors with exposure to\nleading private technology companies through a single Nasdaq-listed security.",
      cta: {
        label: "LEARN MORE",
        href: "/investor-relations",
        variant: "mint",
      },
      backgroundSlides: [
        "/remote-assets/quote-variant1.webp",
        "/remote-assets/quote-variant4.webp",
        "/remote-assets/quote-variant2.webp",
        "/remote-assets/quote-variant5.webp",
        "/remote-assets/quote-variant3.webp",
        "/remote-assets/quote-variant6.webp",
        "/remote-assets/quote-variant8.webp",
        "/remote-assets/quote-variant7.webp",
      ],
    },
    {
      __component: "sections.stats-block",
      theme: "light",
      heading: "Decades of VC Expertise",
      subheading:
        "More than 875 secondary transactions across 16 years of private technology investing.",
      body: [
        "Powerlaw Corp. (Nasdaq: PWRL) is advised by Powerlaw Fund Adviser, LLC a registered investment adviser. Akkadian's heritage informs Powerlaw's investment approach.",
        "Akkadian Ventures is an venture secondary firm in the private technology market, providing liquidity to founders, employees, and investors since 2010, building a deep origination engine inside the private-technology economy.",
      ],
      cta: { label: "EXPLORE THE FUND", href: "/fund", variant: "primary" },
      stats: [
        {
          value: "$1.36B",
          label: "Assets under management*",
          icon: img("/stats_icons/assets-under-management.png", ""),
        },
        {
          value: "134",
          label: "portfolio companies*",
          icon: img("/stats_icons/portfolio-companies.png", ""),
        },
        {
          value: "57",
          label: "portfolio exits*",
          icon: img("/stats_icons/portfolio-exits.png", ""),
        },
        {
          value: "5,000+",
          label: "raise global community",
          icon: img("/stats_icons/raise-global-community.png", ""),
        },
      ],
      footnote: "*As of March 30, 2026",
    },
    {
      __component: "sections.news-list",
      heading: "News",
      items: [
        {
          date: "June 16, 2026",
          title:
            "Bloomberg: Powerlaw CEO Mike Dinsdale Discusses SpaceX, Private Markets, and the IPO Environment",
          href: "https://www.bloomberg.com/news/videos/2026-06-16/spacex-investor-powerlaw-debuts-amid-ipo-race-video",
          source: "Bloomberg",
          image: img(
            "/remote-assets/news/7vyvWX-bloomberg-interview.png",
            "Bloomberg interview",
          ),
        },
        {
          date: "June 9, 2026",
          title:
            "CNBC: Powerlaw Capital Group CEO: We're bringing access to private companies to everyone",
          href: "https://www.cnbc.com/video/2026/05/27/powerlaw-capital-group-ceo-were-bringing-access-to-private-companies-to-everyone.html",
          source: "CNBC",
          image: img("/remote-assets/news/6XX9eN.png", "CNBC interview"),
        },
        {
          date: "June 9, 2026",
          title:
            "Powerlaw Corp.(Nasdaq: PWRL) Reports Net Asset Value (NAV) and NAV per Share for May 2026",
          href: "https://finance.yahoo.com/markets/stocks/articles/powerlaw-corp-nasdaq-pwrl-reports-100000851.html",
          source: "Yahoo Finance",
          image: img("/remote-assets/news/7pPCOR.png", "PWRL news"),
        },
        {
          date: "May 27, 2026",
          title: "Powerlaw Corp. Begins Trading on Nasdaq as PWRL",
          href: "https://www.businesswire.com/news/home/20260527046646/en/Powerlaw-Corp.-Begins-Trading-on-Nasdaq-as-PWRL",
          source: "Business Wire",
          image: img("/remote-assets/news/43FjJS.png", "PWRL news"),
        },
      ],
    },
    {
      __component: "sections.timeline",
      heading: "A History of Firsts",
      backgroundGraphic: "/remote-assets/timeline-infographic.webp",
      years: ["2010", "2016", "2022", "2025", "2026"],
      beamCaption: "Powerlaw Corp. debuts on Nasdaq under ticker: PWRL",
      intro:
        "Powerlaw Corp. (Nasdaq: PWRL) is the first product of Powerlaw Capital Group and managed by Powerlaw Fund Adviser, LLC. The firm is backed by Akkadian Ventures' 16-year heritage in institutional private-company secondary markets.",
      entries: [
        {
          title: "One of the First in Secondaries",
          body: "Ben Black and Pete Smith launched Akkadian Ventures to buy direct secondary shares from employees, founders, and early investors – when the market was still < $20B and largely unproven.",
        },
        {
          title: "Scaling the Secondary Market",
          body: "Akkadian closes its latest and largest flagship fund: **$276M** Fund VI to continue building one of the leading direct-secondary platforms in the market.",
        },
        {
          title: "Expansive Innovation Engine",
          body: "PWRL begins trading on the Nasdaq Stock Market as the first product of Powerlaw Capital Group. The US Venture Capital Market now exceeds **$1.24 Trillion**.",
        },
        {
          title: "RAISE Global Established",
          body: "Akkadian creates RAISE Global, which becomes one of the leading LP–GP emerging manager conferences connecting forward-thinking allocators with next-generation venture talent.",
        },
        {
          title: "Powerlaw Capital Group Launches",
          body: "Powerlaw Capital Group emerges as a platform with the goal of bringing exposure to leading private technology companies into the public market for investors globally.",
        },
      ],
    },
    FAQ_BLOCK,
  ],
};

const VISION: PageData = {
  slug: "/vision",
  title: "PWRL - Our Vision",
  metaDescription: "18 leading private tech companies. One easily tradeable fund",
  sections: [
    {
      __component: "sections.hero",
      heading: "Only for everyone.",
      body: [
        "We’re on a mission to provide exposure to leading private technology companies to everyone.",
      ],
      backgroundImage: img(
        "/remote-assets/22add191-People_compressed.png",
        "Vision Hero Image",
      ),
    },
    // Live: in-page anchor band directly under the hero (AUDIT R4-2).
    {
      __component: "sections.anchor-nav",
      items: [
        { label: "Strategy", href: "/vision#strategy" },
        { label: "Difference", href: "/vision#difference" },
        { label: "Team", href: "/vision#team" },
        { label: "Heritage", href: "/vision#heritage" },
        { label: "Investing", href: "/vision#investing" },
        { label: "FAQ", href: "/vision#faq" },
      ],
    },
    // Live: numbered truths + dotted-sphere graphic with footnoted caption.
    {
      __component: "sections.truths",
      heading: "Powerlaw Corp. was born from two simple but powerful truths.",
      items: [
        {
          icon: img("/remote-assets/303c6f38-1.png", "One Sky Blue"),
          title: "The Power Law",
          body: "In private technology investing, a small number of breakout companies have historically generated a disproportionate share of total returns. Our name reflects this principle.",
        },
        {
          icon: img("/remote-assets/90bd4e2d-2.png", "Two Sky Blue"),
          title: "The Access Gap",
          body: "Private companies are staying private longer than at any time in modern market history. Until now, the value created during those private years has been available almost exclusively to insiders and institutional investors — leaving most of the world locked out of the asset class.",
        },
      ],
      caption:
        "The top tier companies of a Venture Capital fund typically generate 97% of the exit profits.",
      sourceLabel: "Source",
      sourceHref: "https://pages.stern.nyu.edu/~xgabaix/papers/pl-ar.pdf",
    },
    {
      __component: "sections.philosophy",
      heading:
        "We believe venture capital wisdom should be available to everyone.",
      paragraphs: [
        "Powerlaw Corp. is the first listed product of Powerlaw Capital Group and is advised by Powerlaw Fund Adviser, LLC. The Fund draws on more than two decades of operational and origination experience inside private technology.",
      ],
      // Live panel reuses the homepage quote slideshow (DOM order 1,4,2,5,3,6,8,7).
      backgroundSlides: [
        "/remote-assets/quote-variant1.webp",
        "/remote-assets/quote-variant4.webp",
        "/remote-assets/quote-variant2.webp",
        "/remote-assets/quote-variant5.webp",
        "/remote-assets/quote-variant3.webp",
        "/remote-assets/quote-variant6.webp",
        "/remote-assets/quote-variant8.webp",
        "/remote-assets/quote-variant7.webp",
      ],
    },
    {
      __component: "sections.value-props",
      // Live: "Built for everyone" is italic (<em>) — _markers_ → em.
      heading: "One ticker. Daily liquidity. _Built for everyone_.",
      items: [
        {
          heading: "Access",
          body: "A curated portfolio of private technology companies, available through a single Nasdaq-listed security. Open to any investor with a brokerage account. No accreditation requirement, no minimum investment, no platform fees.",
          icon: img(
            "/remote-assets/dbedcb1f-Access.png",
            "Access Key",
          ),
        },
        {
          heading: "Ease",
          body: "Buy and sell PWRL through any standard brokerage account — Schwab, Fidelity, Vanguard, and others — including taxable accounts, IRAs, and self-directed accounts. No K-1. Standard 1099 reporting at year-end.",
          icon: img(
            "/remote-assets/51cabdb7-ease.png",
            "Ease",
          ),
        },
        {
          heading: "Liquidity",
          body: "PWRL trades on Nasdaq during market hours. Monthly NAV reporting and quarterly fund disclosure, paired with no lockup and no redemption gates. T+1 clearing.",
          icon: img(
            "/remote-assets/fbe72035-liquidity.png",
            "Liquidity",
          ),
        },
        {
          heading: "Conviction",
          body: "A concentrated portfolio focused on what we believe are the most consequential private technology companies of a generation, built through the team’s differentiated expertise and access in private markets. We believe in quality of position over breadth of name.",
          icon: img(
            "/remote-assets/668264ce-conviction.png",
            "Conviction",
          ),
        },
        {
          heading: "Transparency",
          body: "Monthly NAV reporting and quarterly portfolio holdings disclosure. Independent board, independent auditor, independent custodian. The disclosure and governance standards of a registered investment company under the Investment Company Act of 1940.",
          icon: img(
            "/remote-assets/531153de-transparency.png",
            "Transparency",
          ),
        },
        {
          heading: "Structure",
          body: "PWRL is a listed closed-end fund registered under the Investment Company Act of 1940. Like other Nasdaq-listed securities, it can be held in standard brokerage accounts and in individual retirement accounts. Listed exposure to leading private technology companies.",
          icon: img(
            "/remote-assets/4639bb7a-structure.png",
            "Structure",
          ),
        },
      ],
    },
    {
      __component: "sections.team-grid",
      heading: "Decades of breaking through barriers.",
      members: TEAM_MEMBERS,
    },
    {
      __component: "sections.stats-block",
      heading: "Our Heritage",
      subheading:
        "More than 875 secondary transactions across 16 years of private technology investing.",
      intro:
        "Akkadian Ventures is an venture secondary firm in the private technology market, providing liquidity to founders, employees, and investors since 2010, building a deep origination engine inside the private-technology economy. Powerlaw Corp. (Nasdaq: PWRL) is advised by Powerlaw Fund Adviser, LLC a registered investment adviser. Akkadian's heritage informs Powerlaw's investment approach.",
      stats: [
        { value: "$1.36B", label: "Assets under management*" },
        { value: "134", label: "portfolio companies*" },
        { value: "57", label: "portfolio exits*" },
        { value: "5,000+", label: "raise global community" },
      ],
      footnote: "*As of March 30, 2026",
    },
    {
      __component: "sections.cta-group",
      heading: "Only for those who want to own the future.",
      body: [
        "Powerlaw Corp. (Nasdaq: PWRL) provides investors with exposure to leading private technology companies through a single Nasdaq-listed security. Shares can be bought and sold in any standard brokerage account.",
      ],
      // Live: blue compact TRADE PWRL NOW → /trade (AUDIT R4-8).
      ctas: [{ label: "TRADE PWRL NOW", href: "/trade", variant: "primary" }],
    },
    NAV_FORM_BLOCK_DEEP,
    FAQ_BLOCK,
  ],
};

const FUND: PageData = {
  slug: "/fund",
  title: "PWRL - The Fund",
  metaDescription: "18 leading private tech companies. One easily tradeable fund",
  sections: [
    {
      __component: "sections.hero",
      heading: "Listed Private Technology.",
      // Live renders this as a second italic h1 line.
      subheading: "_Built for everyone._",
      backgroundImage: img(
        "/remote-assets/ecf328fe-City_compressed.png",
        "City",
      ),
    },
    {
      __component: "sections.anchor-nav",
      items: [
        { label: "Portfolio", href: "/fund#portfolio" },
        { label: "Investment Strategy", href: "/fund#investment_strategy" },
        { label: "Investment Process", href: "/fund#investment_process" },
        { label: "FAQ", href: "/fund#faq" },
      ],
    },
    {
      __component: "sections.portfolio-block",
      heading:
        "A focused portfolio of leading private technology companies.",
      intro:
        "PWRL invests across the sectors driving the next generation of value creation in technology: artificial intelligence, next-generation software,\nmodern aerospace and defense, and leading consumer technology platforms. The portfolio is advised by Powerlaw Fund Adviser, LLC.",
      // Live: ice panel with #085CF0 top border between intro and tables.
      panelHeading: "How the portfolio gets built.",
      panelBody:
        "PWRL draws on more than 16 years of venture secondary-market relationships through Akkadian Ventures and on the operator networks built by the team of industry veterans. Portfolio decisions are advised by Powerlaw Fund Adviser, LLC, drawing on this origination engine to identify and execute on positions in leading private technology companies.",
      asOfDate: "May 13, 2026",
      holdings: [
        { name: "Space Exploration Technologies Corp.", allocation: "19.37%" },
        { name: "OpenAI Group PBC", allocation: "7.77%" },
        { name: "Kalshi Inc.", allocation: "6.26%" },
        { name: "Deel, Inc.", allocation: "4.96%" },
        { name: "Stripe, Inc.", allocation: "4.19%" },
        { name: "Payward, Inc. (aka Kraken)", allocation: "4.16%" },
        { name: "Vast Data Ltd.", allocation: "4.14%" },
        { name: "Databricks, Inc.", allocation: "3.45%" },
        { name: "Tether Holdings, S.A. de C.V.", allocation: "3.31%" },
        { name: "Colossal Biosciences Inc.", allocation: "3.31%" },
        { name: "Mercor.io Corporation", allocation: "3.31%" },
        { name: "Perplexity AI, Inc.", allocation: "1.32%" },
        { name: "Canva, Inc.", allocation: "1.09%" },
        { name: "Groq, Inc.", allocation: "1.07%" },
        { name: "People Center Inc. d/b/a Rippling", allocation: "0.82%" },
        { name: "Saronic Technologies, Inc.", allocation: "0.82%" },
        { name: "Figma, Inc.", allocation: "0.20%" },
        { name: "Waymo, LLC", allocation: "0.06%" },
        { name: "Other Net Assets", allocation: "30.39%" },
      ],
      footnotes: ["Updated quarterly. Last updated 05/13/2026."],
      scheduleHref: "/documents/portfolio-schedule-05.13.2026.pdf",
      // Live /fund renders a second "Sectors" allocation table.
      sectors: [
        { name: "Aerospace & Defense", allocation: "29%" },
        { name: "Artificial Intelligence (AI)", allocation: "25%" },
        { name: "Financial Technology", allocation: "26%" },
        { name: "Software/Other", allocation: "20%" },
      ],
      sectorsFootnote: "Updated quarterly. Last updated 05/13/2026.",
    },
    {
      __component: "sections.stock-info",
      heading: "Stock Info",
      theme: "light",
      // Live static rows (AUDIT R5-5).
      rows: [
        { label: "Ticker", value: "PWRL" },
        { label: "Listing Venue", value: "Nasdaq" },
        { label: "Net Asset Value (NAV)", value: "$662.0M" },
        { label: "NAV Per Share", value: "$15.31" },
        { label: "Adviser", value: "Powerlaw Fund Adviser, LLC." },
        { label: "Annual Management Fee", value: "2.5%" },
      ],
      notes: [
        "Stock Info section above updated monthly. Last updated 5/31/26.",
        "*Exposure and Sector Allocations based on Portfolio Company's fair value as a percentage of the Fund's net assets as of May 13, 2026.",
      ],
    },
    // Live: two-column band — animated sector wheel left, copy right.
    {
      __component: "sections.philosophy",
      variant: "band",
      graphic: "sector-wheel",
      anchor: "investment_strategy",
      heading: "Investment Strategy",
      paragraphs: [
        "Powerlaw Corp. targets late-stage private technology companies operating in sectors we believe are poised for long-term, transformative growth, including enterprise SaaS, consumer platforms, aerospace and defense, and artificial intelligence.",
        "These companies often remain private longer, driven by abundant private capital, reduced public-market pressure, and the availability of secondary liquidity—shifting meaningful value creation into the private markets.",
        "Powerlaw Corp. is designed to provide access to this phase of growth by focusing on a select group of companies we believe are positioned to become durable, high-performance public companies.",
        "At Powerlaw Corp., we seek to bring transparency and clarity to investing opportunities.",
      ],
    },
    // Live: white two-column band — copy left, footnoted caption + dotted
    // sphere right (plain paragraphs, not titled steps).
    {
      __component: "sections.philosophy",
      variant: "band",
      tone: "light",
      graphic: "dotted-sphere",
      anchor: "investment_process",
      graphicCaption:
        "The **top tier companies** of a Venture Capital fund typically generate **97% of the exit profits.**",
      heading: "Investment Process",
      paragraphs: [
        "Venture capital returns follow a power law, where a small number of companies generate the majority of value. Rather than broad diversification, Powerlaw Corp. is built to concentrate exposure in companies that have already demonstrated outlier potential.",
        "The Adviser leverages its experience and position within the venture capital and secondary market ecosystem to identify a small number of potential outlier companies. Powerlaw Corp. generally targets businesses with meaningful revenue scale, strong growth, durable competitive advantages, globally recognized brands, deep institutional backing, and robust secondary market demand.",
        "Each investment undergoes a rigorous due diligence process, including analysis of financial performance, secondary market pricing, capitalization structure, addressable market size, competitive dynamics, and insights from industry experts. The Fund applies a concentrated portfolio approach, allocating capital to companies the Adviser believes offer the most compelling opportunity for long-term capital appreciation.",
      ],
    },
    NAV_FORM_BLOCK_DEEP,
    FAQ_BLOCK,
  ],
};

const TRADE: PageData = {
  slug: "/trade",
  title: "PWRL - How to Trade",
  metaDescription: "18 leading private tech companies. One easily tradeable fund",
  sections: [
    {
      __component: "sections.hero",
      heading: "PWRL trades on Nasdaq.",
      subheading: "Here's how to invest.",
      backgroundImage: img(
        "/remote-assets/e2aa8596-how-to-trade_compressed.png",
        "How to Trade Hero Image",
      ),
    },
    {
      __component: "sections.anchor-nav",
      items: [
        { label: "Where & How", href: "/trade#where-how" },
        { label: "CEF Overview", href: "/trade#cef-overview" },
      ],
    },
    {
      __component: "sections.process-steps",
      heading: "How to Invest in PWRL",
      intro:
        "PWRL trades on Nasdaq, just like any other listed security. Investors can buy and sell shares through any standard brokerage account.",
      steps: [
        {
          icon: img("/remote-assets/steps/1-blue.png", "Step 1"),
          title: "Use any brokerage account.",
          body: "PWRL is available through any standard brokerage account that supports Nasdaq-listed securities, including taxable accounts and IRAs.",
        },
        {
          icon: img("/remote-assets/steps/2-blue.png", "Step 2"),
          title: "Search for PWRL.",
          body: "In your brokerage account, search for Powerlaw Corp. or the ticker symbol PWRL.",
        },
        {
          icon: img("/remote-assets/steps/3-blue.png", "Step 3"),
          title: "Place your order.",
          body: "Choose the number of shares and place your order through your brokerage platform. Standard order types apply: market, limit, stop.",
        },
        {
          icon: img("/remote-assets/steps/4-blue.png", "Step 4"),
          title: "Track your position.",
          body: "View PWRL's market price in real time through your brokerage platform. Net asset value (NAV) and portfolio holdings are published on a regular basis at PWRL.com.",
        },
      ],
    },
    // Live: tabbed platform grid (Self Directed / Financial Advisor Managed;
    // advisor list extracted from the live RSC payload — AUDIT R6-4).
    {
      __component: "sections.platform-tabs",
      heading: "Available on all major brokerage platforms.",
      intro: "Click your platform below to access PWRL.",
      selfDirectedLabel: "Self Directed Brokerage",
      advisorLabel: "Financial Advisor Managed",
      items: [
        { label: "Charles Schwab", href: "https://www.schwab.com/", group: "self-directed", logo: img("/remote-assets/platforms/charlesschwab.png", "Charles Schwab logo") },
        { label: "Fidelity", href: "https://www.fidelity.com/", group: "self-directed", logo: img("/remote-assets/platforms/fidelity.png", "Fidelity logo") },
        { label: "Public", href: "https://public.com/", group: "self-directed", logo: img("/remote-assets/platforms/public.png", "Public logo") },
        { label: "Chase", href: "https://www.chase.com/", group: "self-directed", logo: img("/remote-assets/platforms/chase.png", "Chase logo") },
        { label: "Robinhood", href: "https://robinhood.com/", group: "self-directed", logo: img("/remote-assets/platforms/robinhood.png", "Robinhood logo") },
        { label: "Vanguard", href: "https://investor.vanguard.com/", group: "self-directed", logo: img("/remote-assets/platforms/vanguard.png", "Vanguard logo") },
        { label: "E-Trade", href: "https://us.etrade.com/", group: "self-directed", logo: img("/remote-assets/platforms/etrade.png", "E-Trade logo") },
        { label: "SoFi", href: "https://www.sofi.com/", group: "self-directed", logo: img("/remote-assets/platforms/sofi.png", "SoFi logo") },
        { label: "WellsTrade", href: "https://www.wellsfargoadvisors.com/services/online.htm", group: "self-directed", logo: img("/remote-assets/platforms/wellsfargo.png", "WellsTrade logo") },
        { label: "Charles Schwab", href: "https://www.schwab.com/", group: "advisor", logo: img("/remote-assets/platforms/charlesschwab.png", "Charles Schwab logo") },
        { label: "Merril Lynch", href: "https://www.ml.com/", group: "advisor", logo: img("/remote-assets/platforms/merril_lynch.png", "Merril Lynch logo") },
        { label: "Stifel", href: "https://www.stifel.com/", group: "advisor", logo: img("/remote-assets/platforms/stifel.png", "Stifel logo") },
        { label: "Commonwealth", href: "https://www.commonwealth.com/", group: "advisor", logo: img("/remote-assets/platforms/commonwealth.png", "Commonwealth logo") },
        { label: "Morgan Stanley", href: "https://www.morganstanley.com/", group: "advisor", logo: img("/remote-assets/platforms/morgan_stanley.png", "Morgan Stanley logo") },
        { label: "TD Ameritrade", href: "http://www.tdameritrade.com/", group: "advisor", logo: img("/remote-assets/platforms/td.png", "TD Ameritrade logo") },
        { label: "Fidelity", href: "https://www.fidelity.com/", group: "advisor", logo: img("/remote-assets/platforms/fidelity.png", "Fidelity logo") },
        { label: "Raymond James", href: "https://www.raymondjames.com/", group: "advisor", logo: img("/remote-assets/platforms/raymond_james.png", "Raymond James logo") },
        { label: "Wells Fargo", href: "https://www.wellsfargo.com/", group: "advisor", logo: img("/remote-assets/platforms/wellsfargo.png", "Wells Fargo logo") },
      ],
    },
    {
      __component: "sections.rich-text",
      tone: "gradient",
      heading: "What is a closed-end fund?",
      body: [
        "A closed-end fund (CEF) is a regulated investment fund that pools investor capital into a managed portfolio and trades on a stock exchange like any other listed security. CEFs offer exchange-traded access to portfolios that have historically been available only through private vehicles.",
      ],
      // Live: right column bordered items (AUDIT R6-5).
      sideItems: [
        {
          label: "Exchange-Listed Trading",
          value:
            "Shares of CEFs are bought and sold through brokerage accounts at market prices, which may trade at a premium or discount to the fund's net asset value (NAV). NAV represents the per-share value of the fund's underlying holdings.",
        },
        {
          label: "Managed Portfolio",
          value:
            "A registered investment adviser selects and advises the portfolio. PWRL is advised by Powerlaw Fund Adviser, LLC.",
        },
      ],
    },
    NAV_FORM_BLOCK_DEEP,
  ],
};

const IR: PageData = {
  slug: "/investor-relations",
  title: "PWRL - Investor Relations",
  metaDescription: "18 leading private tech companies. One easily tradeable fund",
  sections: [
    {
      __component: "sections.hero",
      compact: true,
      heading: "Investor Relations",
      backgroundImage: img(
        "/remote-assets/bbe3442c-background.png",
        "Default Background",
      ),
    },
    {
      __component: "sections.anchor-nav",
      items: [
        { label: "News", href: "/investor-relations#news" },
        { label: "Learn", href: "/investor-relations#learn" },
        { label: "Events", href: "/investor-relations#events" },
        { label: "Board of Directors", href: "/investor-relations#directors" },
        { label: "SEC Filings", href: "/investor-relations#sec-filings" },
        { label: "Fund Documents", href: "/investor-relations#fund-documents" },
      ],
    },
    {
      __component: "sections.news-list",
      heading: "News",
      items: [
        {
          date: "June 9, 2026",
          title: "Powerlaw Corp. (Nasdaq: PWRL) Reports Net Asset Value (NAV) and NAV per Share for May 2026",
          href: "https://finance.yahoo.com/markets/stocks/articles/powerlaw-corp-nasdaq-pwrl-reports-100000851.html",
          source: "Yahoo Finance",
          image: img("/remote-assets/news/7pPCOR.png", "PWRL news"),
        },
        {
          date: "June 5, 2026",
          title: "SpaceX Announced as Powerlaw Corp. (Nasdaq: PWRL) Largest Holding",
          href: "https://finance.yahoo.com/markets/stocks/articles/powerlaw-corp-nasdaq-pwrl-announces-134600213.html",
          source: "Yahoo Finance",
          image: img("/remote-assets/news/46gItP.png", "PWRL news"),
        },
        {
          date: "June 4, 2026",
          title: "Powerlaw Corp. (Nasdaq: PWRL) to Host Virtual Investor Roadshow",
          href: "https://www.businesswire.com/news/home/20260604841313/en/Powerlaw-Corp.-Nasdaq-PWRL-to-Host-Virtual-Investor-Roadshow",
          source: "Business Wire",
          image: img("/remote-assets/news/7pPCOR.png", "PWRL news"),
        },
        {
          date: "May 27, 2026",
          title: "Powerlaw Corp. Begins Trading on Nasdaq as PWRL",
          href: "https://www.businesswire.com/news/home/20260527046646/en/Powerlaw-Corp.-Begins-Trading-on-Nasdaq-as-PWRL",
          source: "Business Wire",
          image: img("/remote-assets/news/43FjJS.png", "PWRL news"),
        },
        {
          date: "May 27, 2026",
          title: "Powerlaw Capital Group CEO: We’re bringing access to private companies to everyone",
          href: "https://www.cnbc.com/video/2026/05/27/powerlaw-capital-group-ceo-were-bringing-access-to-private-companies-to-everyone.html",
          source: "CNBC",
          image: img("/remote-assets/news/6XX9eN.png", "PWRL news"),
        },
        {
          date: "May 27, 2026",
          title: "SpaceX Investor Powerlaw to Debut on Nasdaq as IPO Race Heats Up",
          href: "https://www.bloomberg.com/news/articles/2026-05-27/spacex-investor-powerlaw-to-debut-on-nasdaq-as-ipo-race-heats-up?srnd=undefined&embedded-checkout=true",
          source: "Bloomberg",
          image: img("/remote-assets/news/3bMNnp.png", "PWRL news"),
        },
        {
          date: "March 10, 2026",
          title: "It’s easy for everyday investors to get a piece of Stripe, Revolut and OpenAI — here’s how",
          href: "https://www.businesspost.ie/markets/its-easy-for-everyday-investors-to-get-a-piece-of-stripe-revolut-and-openai-heres-how/",
          source: "Business Post",
          image: img("/remote-assets/news/7rwF8Q.png", "PWRL news"),
        },
        {
          date: "February 17, 2026",
          title: "Akkadian Ventures Announces Powerlaw Capital Group",
          href: "https://pwrl.com/media/powerlaw-capital-launch.pdf",
          source: "Powerlaw",
          image: img("/remote-assets/news/7pPCOR.png", "PWRL news"),
        },
      ],
    },
    {
      __component: "sections.education-list",
      heading: "Learn",
      viewAllHref: "/learn",
      items: [
        { slug: "how-to-measure-pwrls-progress" },
        { slug: "how-pwrl-manages-its-portfolio" },
        { slug: "how-pwrl-accesses-the-best-in-private-tech" },
      ],
    },
    {
      __component: "sections.events-list",
      heading: "Events",
      items: [],
    },
    {
      __component: "sections.board-grid",
      heading: "Board of Directors",
      directors: BOARD_DIRECTORS,
    },
    {
      __component: "sections.document-list",
      heading: "SEC Filings",
      kind: "filings",
      documents: [],
      emptyText: "Filings are synced from the SEC EDGAR system.",
    },
    {
      __component: "sections.document-list",
      heading: "Fund Documents",
      kind: "fund-docs",
      documents: [
        {
          label: "Powerlaw Corp. FAQs (06.04.26)",
          href: "/documents/powerlaw-corp-faqs-06.04.26.pdf",
        },
        {
          label: "Portfolio Schedule",
          href: "/documents/portfolio-schedule-05.13.2026.pdf",
        },
        {
          label: "Investor Deck",
          href: "/documents/powerlaw-investor-deck-06.01.26.pdf",
        },
        {
          label: "Semi-Annual Shareholder Report (03.31.26)",
          href: "/documents/powerlaw-corp-semi-annual-shareholder-report-03.31.26.pdf",
        },
        {
          label: "Semi-Annual Shareholder Report (09.30.25)",
          href: "/documents/powerlaw-corp-semi-annual-shareholder-report-09.30.25.pdf",
        },
        {
          label: "Powerlaw Code of Ethics",
          href: "/documents/powerlaw-code-of-ethics.pdf",
        },
        {
          label: "Compensation Committee Charter",
          href: "/documents/powerlaw-corp-compensation-committee-charter.pdf",
        },
        {
          label: "Nominating and Corporate Governance Committee Charter",
          href: "/documents/powerlaw-corp-nominating-and-corporate-governance-committee-charter.pdf",
        },
        {
          label: "Audit Committee Charter",
          href: "/documents/powerlaw-corp-audit-committee-charter.pdf",
        },
      ],
    },
  ],
};

const LEARN: PageData = {
  slug: "/learn",
  title: "PWRL — Learn",
  metaDescription:
    "Learn how PWRL measures progress, manages its portfolio, and accesses leading private technology companies.",
  sections: [
    {
      __component: "sections.hero",
      compact: true,
      heading: "Learn",
      backgroundImage: img(
        "/remote-assets/bbe3442c-background.png",
        "Learn hero background",
      ),
    },
    {
      __component: "sections.education-grid",
      heading: "Learn articles",
    },
  ],
};

const CONTACT: PageData = {
  slug: "/contact",
  title: "PWRL - Contact",
  metaDescription: "18 leading private tech companies. One easily tradeable fund",
  sections: [
    {
      __component: "sections.hero",
      compact: true,
      heading: "Get in touch",
      backgroundImage: img(
        "/remote-assets/bbe3442c-background.png",
        "Default Background",
      ),
    },
    {
      __component: "sections.form-block",
      body: [
        "Looking for more information on Powerlaw Corp.? We would be glad to help. Please reach out with your inquiry, and we will respond to you soon.",
        "For media inquires contact us at [Press@PWRL.com](mailto:press@pwrl.com)",
      ],
      portalId: "243469173",
      formId: "2b83c383-c728-4cc1-b08c-70545c64d73c",
      theme: "light",
      fields: [
        { name: "firstname", type: "text", label: "First Name", placeholder: "First Name*", required: true },
        { name: "lastname", type: "text", label: "Last Name", placeholder: "Last Name*", required: true },
        { name: "email", type: "email", label: "Email", placeholder: "Email Address*", required: true },
        { name: "company", type: "text", label: "Company Name", placeholder: "Company Name*", required: true },
        {
          name: "which_of_these_best_describes_you_",
          type: "select",
          label: "I am... (select one)",
          placeholder: "I am... (select one)*",
          required: true,
          options: [
            "Asset Manager / RIA",
            "Individual Investor",
            "Institutional Investor",
            "Family Office",
            "Financial Analyst",
            "Press/Media",
            "Other",
          ],
        },
        { name: "message", type: "textarea", label: "Message", placeholder: "What's on your mind?*", required: true },
      ],
    },
  ],
};

export const PAGE_FIXTURES: Record<string, PageData> = {
  "/": HOME,
  "/vision": VISION,
  "/fund": FUND,
  "/trade": TRADE,
  "/investor-relations": IR,
  "/learn": LEARN,
  "/contact": CONTACT,
};

export const PAGE_SLUGS = Object.keys(PAGE_FIXTURES);

export function getFixturePage(slug: string): PageData | null {
  const normalized = slug === "" ? "/" : slug.startsWith("/") ? slug : `/${slug}`;
  return PAGE_FIXTURES[normalized] ?? null;
}

/* ------------------------------------------------------------------ */
/* Global settings (header, footer, disclaimers — verbatim)            */
/* ------------------------------------------------------------------ */

export const GLOBAL_SETTINGS: GlobalSettings = {
  banner: {
    text: "__**Bloomberg**__**: Powerlaw CEO Mike Dinsdale Discusses SpaceX, Private Markets, and the IPO Environment**",
    href: "https://www.bloomberg.com/news/videos/2026-06-16/spacex-investor-powerlaw-debuts-amid-ipo-race-video",
  },
  nav: [
    {
      label: "The Fund",
      href: "/fund",
      children: [
        { label: "Portfolio", href: "/fund#portfolio" },
        { label: "Investment Strategy", href: "/fund#investment_strategy" },
        { label: "Investment Process", href: "/fund#investment_process" },
        { label: "FAQ", href: "/fund#faq" },
      ],
    },
    {
      label: "How to Trade",
      href: "/trade",
      children: [
        { label: "Where & How", href: "/trade#where-how" },
        { label: "CEF Overview", href: "/trade#cef-overview" },
      ],
    },
    {
      label: "Investor Relations",
      href: "/investor-relations",
      children: [
        { label: "News", href: "/investor-relations#news" },
        { label: "Events", href: "/investor-relations#events" },
        { label: "Board of Directors", href: "/investor-relations#directors" },
        { label: "SEC Filings", href: "/investor-relations#sec-filings" },
        { label: "Fund Documents", href: "/investor-relations#fund-documents" },
        { label: "Learn", href: "/learn" },
      ],
    },
    {
      label: "Our Vision",
      href: "/vision",
      children: [
        { label: "Strategy", href: "/vision#strategy" },
        { label: "Difference", href: "/vision#difference" },
        { label: "Team", href: "/vision#team" },
        { label: "Heritage", href: "/vision#heritage" },
        { label: "Investing", href: "/vision#investing" },
        { label: "FAQ", href: "/vision#faq" },
      ],
    },
    { label: "Contact", href: "/contact" },
  ],
  footerLinks: [
    { label: "Our Vision", href: "/vision" },
    { label: "The Fund", href: "/fund" },
    { label: "How to Trade", href: "/trade" },
    { label: "Investor Relations", href: "/investor-relations" },
    { label: "Contact", href: "/contact" },
    { label: "Privacy Policy", href: "/legal" },
    { label: "Terms & Conditions", href: "/terms" },
  ],
  socials: [
    { platform: "LinkedIn", label: "LinkedIn", href: "https://www.linkedin.com/company/pwrl" },
    { platform: "Instagram", label: "Instagram", href: "https://www.instagram.com/PWRL_Fund" },
    { platform: "YouTube", label: "YouTube", href: "https://www.youtube.com/@PWRL_Fund" },
    { platform: "X", label: "X", href: "https://x.com/pwrl_" },
    { platform: "SeekingAlpha", label: "Seeking Alpha", href: "https://seekingalpha.com/symbol/PWRL" },
    { platform: "StockTwits", label: "StockTwits", href: "https://stocktwits.com/symbol/PWRL" },
  ],
  disclaimers: [
    "Powerlaw Fund Adviser, LLC (“Powerlaw”) is an investment adviser registered with the United States Securities and Exchange Commission (“SEC”). Powerlaw is the registered adviser for Powerlaw Corp. (“PWRL”), a closed-end fund listed on Nasdaq.",
    // Live renders the next three paragraphs in <b>; "here" links to the
    // SEC prospectus. ** / [](…) markers only — text itself is verbatim.
    "**Investors are advised to carefully consider the investment objective, risks, charges and expenses of PWRL before investing. A prospectus, dated May 20, 2026, together with any subsequent prospectus supplements, each of which has been filed with the Securities and Exchange Commission (“SEC”), contains this and other information about PWRL and should be read carefully before investing.**",
    "**A registration statement relating to the resale of shares of common stock of PWRL has been filed with the SEC and is effective. This website and the information it contains does not constitute an offer to sell nor a solicitation of an offer to buy shares of common stock of PWRL, which offering may only be made by means of a prospectus, a copy of which may be obtained by clicking [here](https://www.sec.gov/ix?doc=/Archives/edgar/data/0002052053/000121390026059594/ea0290638-02_424b3.htm).**",
    "**This website and the information it contains shall not constitute an offer to sell or the solicitation of an offer to buy any securities, nor shall there be any sale of these securities in any state or jurisdiction in which such offer, solicitation or sale would be unlawful prior to registration or qualification under the securities laws of any such state or jurisdiction.**",
    "There can be no assurance that PWRL investment objectives will be achieved. An investment in PWRL is not appropriate for all investors and is not intended to be a complete investment program. PWRL is designed as a long-term investment and not as a trading vehicle. Investors could lose some or all of their investment. Past performance is not indicative of future results. An investment in PWRL is speculative and involves a high degree of risk with substantial risk of loss. Shares of closed-end funds such as PWRL frequently trade at a discount to net asset value. Before making an investment decision, a prospective investor should (i) consider the suitability of this investment with respect to the investor’s investment objectives and (ii) consider factors such as the investor’s investment goals, income, risk tolerance, and time horizon.",
    "Closed-end funds differ from open-end funds in that closed-end funds do not redeem their shares at the request of an investor. No shareholder has the right to require PWRL to redeem his, her or its shares. While Powerlaw’s shares are expected to be listed on an exchange, an active public market for the shares may not develop. As a result, shareholders may not be able to liquidate their investment. Accordingly, shareholders should consider that they may not have access to the funds they invest in PWRL for an indefinite period of time. There is no assurance that PWRL will achieve its investment objective, or that the private companies in which PWRL invests will ever have a liquidity event.",
    "Certain information on the website may contain forward-looking statements, which can be identified by the use of terms such as “may”, “should”, “believe”, “expect”, “anticipate”, “project”, “estimate”, “optimistic”, “intend”, “aim”, “will”, “continue” (or the negatives thereof) or other variations thereof. Due to various risks and uncertainties, actual events or results of actual performance of an investment may differ materially from those reflected or contemplated in such forward-looking statements, which speak only of the date they are made, and there is no guarantee that these opinions or predictions will ultimately be realized. As a result, investors should not rely on such forward-looking statements in making their investment decisions. Any projection of the performance discussed by Powerlaw is highly speculative and represents Powerlaw’s opinion, which may change. Powerlaw undertakes no obligation to update publicly or revise any statements contained on the website, whether as a result of new information, future developments or otherwise.",
    "This website’s content is for informational purposes only and does not constitute advice, a recommendation or an offer to enter into any transaction with PWRL or any other fund. Powerlaw does not provide tax, accounting, financial, regulatory or legal advice, and all investors are advised to consult with their tax, accounting, financial, legal and/or other professional advisors.",
  ],
  legalText: "© Powerlaw Corp. All Rights Reserved.",
};
