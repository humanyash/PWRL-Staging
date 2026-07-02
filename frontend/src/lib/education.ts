import type { ImageWithAlt } from "@/types/blocks";

export interface EducationArticle {
  slug: string;
  title: string;
  date: string;
  publishedLabel: string;
  image: ImageWithAlt;
  heroImage?: ImageWithAlt;
  body: string[];
  sections?: { heading: string; paragraphs: string[] }[];
}

const IMG_MEET_PWRL: ImageWithAlt = {
  src: "/remote-assets/education/meet-pwrl.png",
  alt: "Blurred silhouettes of professionals walking, bathed in deep blue light",
};

const IMG_CURATED_BUILT: ImageWithAlt = {
  src: "/remote-assets/education/curated-and-built.png",
  alt: "Abstract digital waveform over a dark blue background",
};

const IMG_ACCESSES_PRIVATE_TECH: ImageWithAlt = {
  src: "/remote-assets/education/accesses-private-tech.png",
  alt: "A lone figure walking through a beam of light into darkness",
};

const IMG_MANAGES_PORTFOLIO: ImageWithAlt = {
  src: "/remote-assets/education/manages-portfolio.png",
  alt: "Silhouette of an investor overlooking a city skyline from a high-rise window",
};

const IMG_MEASURE_PROGRESS: ImageWithAlt = {
  src: "/remote-assets/education/measure-progress.png",
  alt: "Stock market numbers and data visualization radiating outward",
};

export const EDUCATION_ARTICLES: EducationArticle[] = [
  {
    slug: "meet-pwrl-high-growth-private-tech-in-one-ticker",
    title: "Meet PWRL – High-growth Private Tech In One Ticker",
    date: "June 29, 2026",
    publishedLabel: "Published June 29, 2026",
    image: IMG_MEET_PWRL,
    heroImage: IMG_MEET_PWRL,
    body: [
      "For most of the last two decades, the innovative and fastest growing companies reshaping our world have opted to remain private for a longer duration before pursuing an IPO. By the time public-market investors could buy in, much of the value creation had already accrued to a small group of early private investors, leaving the public markets to act, increasingly, as an exit ramp for insiders rather than an on-ramp for everyone else. Powerlaw Corp. (Nasdaq: PWRL) was built to change that – to provide access to these previously inaccessible high growth private companies. But before getting deeper into why PWRL exists, it helps to understand exactly what PWRL is, because PWRL is a different kind of instrument.",
    ],
    sections: [
      {
        heading: "The Fund",
        paragraphs: [
          "PWRL is a publicly traded closed-end fund (a \"CEF\"). Unlike traditional open-ended funds which continuously create and redeem shares as money flows in and out, a closed-end fund has a fixed pool of shares that trade between investors on an exchange, just like a stock. You buy PWRL through your brokerage from another investor who is selling their shares. This structure is what enables PWRL to hold these hard-to-trade private assets while still offering you daily liquidity.",
        ],
      },
      {
        heading: "Fund Pricing",
        paragraphs: [
          "Every fund has a Net Asset Value: the value of everything it owns, minus what it owes, divided by shares outstanding. For an ETF, the share price tends to track NAV closely. For a closed-end fund, the two can drift apart, because the share price is set by supply and demand on the exchange, not by the mechanism that keeps the price of a traditional ETF in line with NAV. When the price sits above NAV, the fund trades at a premium; below NAV, a discount. Neither is unusual, and PWRL publishes its NAV every month so investors can see exactly where they stand.",
        ],
      },
      {
        heading: "A Direct Listing, Not an IPO",
        paragraphs: [
          "PWRL came public through a direct listing, not an IPO. In a traditional IPO, a company or fund sells new shares to raise capital before the stock starts trading. PWRL did the opposite: its portfolio was already assembled, so rather than raise new money, it simply listed its existing shares on Nasdaq on May 27, 2026. When you buy PWRL today, you are buying into a fund that is already established, diversified, and invested in the underlying private companies — there is no wait for the fund to source new investment to invest your capital.",
        ],
      },
      {
        heading: "The Guardrails of a Registered Fund",
        paragraphs: [
          "PWRL carries the guardrails of a registered fund. Because PWRL is a registered investment company, it operates with an independent board of directors, an independent auditor, and an independent custodian. It publishes NAV monthly and discloses its portfolio holdings quarterly. And because it has elected to be treated as a Regulated Investment Company, shareholders receive standard 1099 tax reporting at year-end rather than the K-1s common to private partnerships.",
        ],
      },
      {
        heading: "The Why of PWRL",
        paragraphs: [
          "Over the past 25 years, the number of U.S. public companies has roughly halved. The average technology company now takes 12-plus years to reach an IPO, up from about six a decade ago. And by most estimates, 80–90% of U.S. households have effectively been shut out of private-market investing altogether, walled off by accreditation rules, high minimums, and closed networks reserved for the few.",
          "The creators of PWRL believe everyone should have access to invest in these industry defining and high growth private companies. Through a single Nasdaq-listed security, PWRL seeks to offer investors exposure to a concentrated portfolio of roughly 15 to 20 late-stage private companies including leading names across AI, software, aerospace and defense, fintech, and digital infrastructure that many people already know but few could ever own, until now.",
          "The mission, is to put the world's most transformative companies within reach of every investor, not just the privileged few.",
          "The result is a single, Nasdaq-listed way to own a slice of the private technology companies defining this era, paired with the liquidity, reporting, and oversight investors expect from the public markets.",
        ],
      },
    ],
  },
  {
    slug: "how-pwrl-is-curated-and-built",
    title: "How PWRL Is Curated & Built – The Power Law Principle",
    date: "June 29, 2026",
    publishedLabel: "Published June 29, 2026",
    image: IMG_CURATED_BUILT,
    heroImage: IMG_CURATED_BUILT,
    body: [
      "There's a reason this fund is called Powerlaw. It's named for one of the most durable patterns in all of investing, one that explains both why venture capital works and how PWRL decides what to own.",
    ],
    sections: [
      {
        heading: "The Power Law Principle",
        paragraphs: [
          "Venture returns don't distribute evenly. In early-stage, private market investing, a small handful of companies generate a disproportionate share of the total gains, while the majority of investments return little or nothing. This is the \"Power Law\" distribution. The Power Law distribution principle appears in many fields, physics, sociology, and marketing among many others – and in the context of venture capital returns, the Power Law distribution is the venture capital model. A single breakout investment can return more than all other investments in a portfolio combined. Experienced venture investors organize their entire craft around this model.",
        ],
      },
      {
        heading: "The Value of Concentration",
        paragraphs: [
          "If a few names drive the outcome, then diluting across hundreds of positions as an index fund does, can work against you, it waters down exposure to the few companies with the greatest growth potential that are most likely to define the portfolio. PWRL is built around concentrating on a few high quality positions with unmatched growth potential rather than diversification and breadth. The fund seeks long-term capital appreciation by holding a concentrated portfolio of approximately 15 to 20 late-stage companies, chosen deliberately rather than indexed broadly.",
        ],
      },
      {
        heading: "What PWRL Seeks",
        paragraphs: [
          "PWRL's thesis is that a select group of companies have the potential to become generational leaders, businesses that either create entirely new markets (think space, or frontier AI) or fundamentally disrupt existing ones (fintech, software, defense). These are companies that have already reached a scale once reserved for the public markets, yet increasingly choose to stay private for longer, which is precisely what has kept them out of reach for most investors.",
        ],
      },
      {
        heading: "Why the Team Behind PWRL Matters",
        paragraphs: [
          "Identifying which names belong in a concentrated, Power Law driven portfolio is the entire game. PWRL's portfolio is constructed and managed by seasoned venture investors — the team at Akkadian Ventures, which brings a 16-year track record across more than 875 private-market transactions. That history translates into two things that are hard to replicate: access to the right opportunities, and the discipline to be selective among them. The strategy leans on that expertise to target the companies the fund managers view as the most validated and highest-potential, rather than chasing breadth.",
          "In short, PWRL invests across the sectors driving the next generation of value creation in technology — artificial intelligence, next-generation software, modern aerospace and defense, and leading fintech and consumer platforms — and it does so with conviction rather than diffusion. The power law isn't just the fund's name. It's the logic behind every investment.",
        ],
      },
    ],
  },
  {
    slug: "how-pwrl-accesses-the-best-in-private-tech",
    title: "How PWRL Accesses The Best in Private Tech",
    date: "June 29, 2026",
    publishedLabel: "Published June 29, 2026",
    image: IMG_ACCESSES_PRIVATE_TECH,
    heroImage: IMG_ACCESSES_PRIVATE_TECH,
    body: [
      "It's one thing to decide which private companies to invest in. It's another to actually acquire the shares as these companies are, by definition, private, and their stock doesn't trade on any exchange. How we assemble our portfolio of private holdings is an important detail to fully understand how PWRL operates.",
    ],
    sections: [
      {
        heading: "Two Kinds of Private Transactions",
        paragraphs: [
          "When people hear \"investing in a startup,\" they usually picture a primary transaction: the company issues brand-new shares to raise capital. That's a funding round. A secondary transaction is different, no new shares are created. Instead, existing shares change hands: an employee, founder, or early investor sells some of their holdings to a new buyer. The company doesn't raise money; an existing owner gets liquidity, and a new owner gets a stake in the company's future appreciation.",
        ],
      },
      {
        heading: "Why Secondaries Have Become So Important",
        paragraphs: [
          "As companies stay private for a decade or more, a liquidity problem is created: employees and early investors are sitting on valuable but completely illiquid stock, sometimes for years. Secondary transactions are the solution to this illiquidity. Secondary investments have grown from a niche corner of the market into a core mechanism for how private-company ownership is transferred, and they're the primary way PWRL builds exposure to the private companies that make up the PWRL fund.",
        ],
      },
      {
        heading: "So how do those shares end up inside a public fund?",
        paragraphs: [
          "Unlike public shares, private shares are restricted and hard to move, you generally can't transact private shares without jumping through hoops, so PWRL gains its exposure through a few different structures:",
          "**Direct secondary purchases.** In some cases, the fund buys shares directly from existing holders through a negotiated secondary transaction.",
          "**Special purpose vehicles (SPVs).** Often, the fund invests through an SPV, a one-off arrangement formed directly with a counterparty who owns the private shares to gain exposure to the underlying private company. PWRL puts money into the SPV, and the SPV holds the underlying shares, giving the fund indirect economic exposure to that company.",
          "**Forward contracts and call rights.** Where shares can't yet be transferred, because of lock-ups or transfer restrictions, the fund may use forward agreements, advancing the purchase price now with the actual shares delivered later, once restrictions are lifted.",
        ],
      },
      {
        heading: "Why SPVs Matter",
        paragraphs: [
          "In many cases, SPVs are the only path to unlock access to scarce and challenging to source private shares. However investing through SPVs are a more complex path to gaining exposure to private companies and introduce an extra layer between the fund and the underlying company, which can result in additional fees to the fund, less direct transparency into the underlying position, and securities that are themselves illiquid. Despite the added burden of SPVs, they are an invaluable tool for the managers of PWRL to assemble the highly impactful portfolio of industry defining private companies.",
        ],
      },
      {
        heading: "Why Access Is the Real Moat",
        paragraphs: [
          "None of this works without relationships. The secondary market is capacity-constrained and relationship-driven, the best opportunities don't show up on a screen; they come from being trusted by founders, funds, and early shareholders over many years. That's the foundation PWRL is built on. For more than 16 years, the team at Akkadian has specialized in venture secondaries, closing more than 875 unique transactions and building deep relationships across the private technology ecosystem. PWRL applies that same sourcing engine and investment discipline to assembling and managing the fund.",
          "The result is a closed-end, Nasdaq-listed structure designed to bridge two worlds: private-market exposure on one side, and public-market access and liquidity on the other.",
        ],
      },
    ],
  },
  {
    slug: "how-pwrl-manages-its-portfolio",
    title: "How PWRL Manages Its Portfolio",
    date: "June 29, 2026",
    publishedLabel: "Published June 29, 2026",
    image: IMG_MANAGES_PORTFOLIO,
    heroImage: IMG_MANAGES_PORTFOLIO,
    body: [
      "Building a portfolio is one thing. Managing it over time, knowing when to hold, when to take gains, and how to navigate the big milestones, is another. PWRL was assembled by a team of the most experienced venture experts who continue to actively manage the fund and continue the search for the next great private market investment to reinvest into.",
    ],
    sections: [
      {
        heading: "The Objective",
        paragraphs: [
          "PWRL seeks long-term capital appreciation through its concentrated portfolio of roughly 15 to 20 late-stage technology companies. Everything the managers do is in service of that single goal: growing the value of the fund's assets over time.",
        ],
      },
      {
        heading: "How NAV Grows",
        paragraphs: [
          "When one of the fund's portfolio companies has a value-creating event, a new funding round at a higher valuation, a major commercial milestone, or an IPO, the fair value of the fund's stake in that company changes. As those positions are marked up, the fund's overall NAV rises with them. The job of management is to assemble companies likely to experience the largest markups in valuations, and then to make thoughtful and timely capital allocation decisions around these events as they happen.",
        ],
      },
      {
        heading: "Active Management Means Making Real Choices",
        paragraphs: [
          "The managers of PWRL decide when a position should keep compounding and when it makes sense to realize gains. Importantly, the fund is not required to sell when a company goes public or raises a round, it can choose to stay invested if it believes there's more appreciation ahead. As a matter of strategy, the fund generally seeks to keep a substantial majority of the portfolio invested in private holdings, keeping its center of gravity in the late-stage private names that are PWRL's core mission.",
        ],
      },
      {
        heading: "Realizing Gains, and Recycling Capital",
        paragraphs: [
          "When the fund does sell, in whole or in part, those proceeds become cash that can be redeployed into new private opportunities. You can see this in the fund's recent history: it has taken partial gains across positions, including selling a portion of its OpenAI exposure after a sharp markup, and receiving a cash distribution from its Groq position tied to a licensing transaction. Each realization is both a return event and fresh dry powder for the next investment. This is also the area where the fund manager's deep venture and secondaries experience and long held relationships show their value as the fund seeks to reinvest into other industry defining private companies, long before the company becomes a household name.",
        ],
      },
      {
        heading: "The IPO Question, Illustrated",
        paragraphs: [
          "Take Figma, which the fund held privately before the company went public in 2025. Once a holding lists publicly, its accounting changes: it becomes a public position marked to the market's closing price rather than to a private valuation estimate. As active fund managers, the PWRL team had a plan for that transition before it happened. Active management means being positioned for milestones like IPOs ahead of time. The managers decide, name by name, whether a public listing is a moment to exit, trim, or keep holding, and what would be the best re-investment opportunity for proceeds once available.",
        ],
      },
      {
        heading: "The Valuation Challenge",
        paragraphs: [
          "Because substantially all of PWRL's portfolio companies remain private and illiquid, their valuations are estimates, informed by recent funding rounds, comparable companies, and transaction data, but estimates nonetheless. They are classified as the kind of holdings whose fair value relies on significant judgment, and they may not reflect what a position is eventually valued at in a public market. Active management improves the odds of good outcomes; it does not remove the inherent uncertainty of pricing private assets. Past performance is never a guarantee of future results.",
          "This combination, conviction in the holdings, discipline around when to act, and humility around what's knowable, is what active management looks like at PWRL.",
        ],
      },
    ],
  },
  {
    slug: "how-to-measure-pwrls-progress",
    title: "How to Measure PWRL's Progress",
    date: "June 29, 2026",
    publishedLabel: "Published June 29, 2026",
    image: IMG_MEASURE_PROGRESS,
    heroImage: IMG_MEASURE_PROGRESS,
    body: [
      "PWRL's daily liquidity and public market transparency make investing in PWRL easy. But knowing how your investment is performing and following PWRL's regular updates is different from a typical public company's quarterly report. PWRL was designed to make following the fund's progress straightforward, pairing a clear headline metric with a level of disclosure that sets a new bar for a vehicle holding private assets.",
    ],
    sections: [
      {
        heading: "NAV Is the Clearest Yardstick",
        paragraphs: [
          "Net Asset Value is the single best window into what the fund is worth. It's calculated by taking the total value of everything the fund owns, subtracting its liabilities, and dividing by the number of shares outstanding. That gives you NAV per share, the underlying, per-unit value of the portfolio. As the fund's holdings appreciate, NAV per share rises; as they fall, it declines. It is the cleanest measure of the portfolio's progress over time.",
        ],
      },
      {
        heading: "PWRL Reports NAV Monthly",
        paragraphs: [
          "Many funds holding private assets disclose value only quarterly, or less. PWRL publishes its NAV per share every month, within 10 business days of month-end, on its website. And with it, PWRL publishes a quarterly summary of its portfolio of holdings. For a vehicle built on private companies, that level of regular, public reporting is a deliberate transparency choice. We believe in access, liquidity, and transparency.",
        ],
      },
      {
        heading: "Price and NAV Are Two Different Numbers",
        paragraphs: [
          "This is the concept most worth internalizing. Because PWRL is a closed-end fund, its market price (what shares change hands for on Nasdaq) and its NAV per share (what the underlying portfolio is worth) are set by two different forces. NAV is driven by the value of the holdings. Market price is driven by supply and demand among investors for shares of the PWRL fund.",
          "It's worth knowing, plainly, that shares of closed-end funds can and sometimes do trade at a discount to NAV — that's a normal feature of the structure, not a malfunction. PWRL's monthly NAV disclosure exists precisely so that investors can always see the relationship for themselves.",
        ],
      },
      {
        heading: "The Governance Behind the Numbers",
        paragraphs: [
          "Transparency isn't only about frequency of disclosure; it's about who stands behind the figures. As a registered investment company, PWRL maintains an independent board of directors, an independent auditor, an independent custodian, and it files regularly with the SEC. Shareholders receive standard 1099 tax reporting at year-end. The NAV you read each month isn't a marketing number, it's produced inside a regulated framework with independent oversight.",
        ],
      },
      {
        heading: "Where to Find Out More",
        paragraphs: [
          "Everything an investor needs to track the fund lives in one convenient place: right here on PWRL's website. All required SEC disclosures will be made available here on the investor portion of the PWRL website along with much more content and information related to the fund and the portfolio companies.",
          "PWRL is committed to updating shareholders regularly and transparently on the fund's NAV, portfolio, and activity, so you can measure progress with clear eyes.",
        ],
      },
    ],
  },
];

export function getEducationArticle(slug: string): EducationArticle | null {
  return EDUCATION_ARTICLES.find((a) => a.slug === slug) ?? null;
}

export function getAdjacentArticles(slug: string): {
  prev: EducationArticle | null;
  next: EducationArticle | null;
} {
  const i = EDUCATION_ARTICLES.findIndex((a) => a.slug === slug);
  if (i < 0) return { prev: null, next: null };
  return {
    prev: i > 0 ? EDUCATION_ARTICLES[i - 1]! : null,
    next: i < EDUCATION_ARTICLES.length - 1 ? EDUCATION_ARTICLES[i + 1]! : null,
  };
}

export interface EventItem {
  dateTime: string;
  title: string;
  ctaLabel: string;
  ctaHref: string;
  type: "webcast" | "recording";
  image?: ImageWithAlt;
  /** When set, renders a branded color block instead of a photo. */
  brandPanel?: { label: string; sublabel?: string };
}

export const EVENT_ITEMS: EventItem[] = [
  {
    dateTime: "07/15/2026, 12:00 PM",
    title:
      "Join the Webinar: Private markets are opening up – but what are you actually buying?",
    ctaLabel: "Sign Up to Watch Live",
    ctaHref:
      "https://moderninvestorsummit.webflow.io/2026/modern-investor-community-series/modern-investor-podcast",
    type: "webcast",
    image: {
      src: "/events/modern-investor-podcast.png",
      alt: "The Modern Investor Podcast",
    },
  },
  {
    dateTime: "06/05/2026, 10:00 AM",
    title: "Virtual Roadshow",
    ctaLabel: "Watch the Recording",
    ctaHref: "https://youtu.be/oRKAE4_4G74?si=KhjXn83maYOIQnFD",
    type: "recording",
    image: {
      src: "/events/virtual-roadshow.png",
      alt: "Virtual Roadshow – Mike Dinsdale, CEO Powerlaw Corp.",
    },
  },
];
