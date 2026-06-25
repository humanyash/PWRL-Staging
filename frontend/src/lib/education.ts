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

const PLACEHOLDER_BODY = [
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
];

const PLACEHOLDER_SECTIONS = [
  {
    heading: "Section Headlines",
    paragraphs: [
      "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.",
      "Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem.",
    ],
  },
  {
    heading: "Looking Ahead",
    paragraphs: [
      "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.",
    ],
  },
];

const LEARN_IMAGES = [
  {
    src: "/remote-assets/education/measure-progress.jpg",
    alt: "Stock market data visualization",
  },
  {
    src: "/remote-assets/education/manages-portfolio.jpg",
    alt: "Investor looking out over a city skyline",
  },
  {
    src: "/remote-assets/education/accesses-private-tech.jpg",
    alt: "Abstract blue digital network",
  },
] as const;

const PLACEHOLDER_ARTICLES: Omit<EducationArticle, "slug">[] = [
  {
    title: "Understanding PWRL's Investment Approach",
    date: "June 18, 2026",
    publishedLabel: "Published June 18, 2026",
    image: LEARN_IMAGES[2],
    heroImage: LEARN_IMAGES[2],
    body: PLACEHOLDER_BODY,
    sections: PLACEHOLDER_SECTIONS,
  },
  {
    title: "Private Tech Exposure Explained",
    date: "June 16, 2026",
    publishedLabel: "Published June 16, 2026",
    image: LEARN_IMAGES[0],
    heroImage: LEARN_IMAGES[0],
    body: PLACEHOLDER_BODY,
    sections: PLACEHOLDER_SECTIONS,
  },
  {
    title: "Reading PWRL's Monthly NAV Updates",
    date: "June 14, 2026",
    publishedLabel: "Published June 14, 2026",
    image: LEARN_IMAGES[1],
    heroImage: LEARN_IMAGES[1],
    body: PLACEHOLDER_BODY,
    sections: PLACEHOLDER_SECTIONS,
  },
  {
    title: "The Role of Secondaries in PWRL",
    date: "June 12, 2026",
    publishedLabel: "Published June 12, 2026",
    image: LEARN_IMAGES[1],
    heroImage: LEARN_IMAGES[1],
    body: PLACEHOLDER_BODY,
    sections: PLACEHOLDER_SECTIONS,
  },
  {
    title: "What Makes PWRL Different",
    date: "June 10, 2026",
    publishedLabel: "Published June 10, 2026",
    image: LEARN_IMAGES[2],
    heroImage: LEARN_IMAGES[2],
    body: PLACEHOLDER_BODY,
    sections: PLACEHOLDER_SECTIONS,
  },
  {
    title: "Getting Started with PWRL",
    date: "June 8, 2026",
    publishedLabel: "Published June 8, 2026",
    image: LEARN_IMAGES[0],
    heroImage: LEARN_IMAGES[0],
    body: PLACEHOLDER_BODY,
    sections: PLACEHOLDER_SECTIONS,
  },
];

export const EDUCATION_ARTICLES: EducationArticle[] = [
  {
    slug: "how-to-measure-pwrls-progress",
    title: "How to Measure PWRL's Progress",
    date: "June 24, 2026",
    publishedLabel: "Published June 24, 2026",
    image: LEARN_IMAGES[0],
    heroImage: LEARN_IMAGES[0],
    body: PLACEHOLDER_BODY,
    sections: PLACEHOLDER_SECTIONS,
  },
  {
    slug: "how-pwrl-manages-its-portfolio",
    title: "How PWRL Manages Its Portfolio",
    date: "June 22, 2026",
    publishedLabel: "Published June 22, 2026",
    image: LEARN_IMAGES[1],
    heroImage: LEARN_IMAGES[1],
    body: PLACEHOLDER_BODY,
    sections: PLACEHOLDER_SECTIONS,
  },
  {
    slug: "how-pwrl-accesses-the-best-in-private-tech",
    title: "How PWRL Accesses The Best in Private Tech",
    date: "June 20, 2026",
    publishedLabel: "Published June 20, 2026",
    image: LEARN_IMAGES[2],
    heroImage: LEARN_IMAGES[2],
    body: PLACEHOLDER_BODY,
    sections: PLACEHOLDER_SECTIONS,
  },
  ...PLACEHOLDER_ARTICLES.map((article, i) => ({
    ...article,
    slug: `learn-placeholder-${i + 1}`,
  })),
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
