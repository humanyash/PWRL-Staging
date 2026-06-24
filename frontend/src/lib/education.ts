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

export const EDUCATION_ARTICLES: EducationArticle[] = [
  {
    slug: "how-to-measure-pwrls-progress",
    title: "How to Measure PWRL's Progress",
    date: "June 24, 2026",
    publishedLabel: "Published June 24, 2026",
    image: {
      src: "/remote-assets/education/measure-progress.jpg",
      alt: "Stock market data visualization",
    },
    heroImage: {
      src: "/remote-assets/education/measure-progress.jpg",
      alt: "Stock market data visualization",
    },
    body: PLACEHOLDER_BODY,
    sections: PLACEHOLDER_SECTIONS,
  },
  {
    slug: "how-pwrl-manages-its-portfolio",
    title: "How PWRL Manages Its Portfolio",
    date: "June 22, 2026",
    publishedLabel: "Published June 22, 2026",
    image: {
      src: "/remote-assets/education/manages-portfolio.jpg",
      alt: "Investor looking out over a city skyline",
    },
    heroImage: {
      src: "/remote-assets/education/manages-portfolio.jpg",
      alt: "Investor looking out over a city skyline",
    },
    body: PLACEHOLDER_BODY,
    sections: PLACEHOLDER_SECTIONS,
  },
  {
    slug: "how-pwrl-accesses-the-best-in-private-tech",
    title: "How PWRL Accesses The Best in Private Tech",
    date: "June 20, 2026",
    publishedLabel: "Published June 20, 2026",
    image: {
      src: "/remote-assets/education/accesses-private-tech.jpg",
      alt: "Abstract blue digital network",
    },
    heroImage: {
      src: "/remote-assets/education/accesses-private-tech.jpg",
      alt: "Abstract blue digital network",
    },
    body: PLACEHOLDER_BODY,
    sections: PLACEHOLDER_SECTIONS,
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
    dateTime: "07/15/2026, 1:00 PM",
    title:
      "Join the Webinar: Private markets are opening up — but what are you actually buying?",
    ctaLabel: "Sign Up to Watch Live",
    ctaHref: "https://www.pwrl.com",
    type: "webcast",
    brandPanel: {
      label: "The Modern",
      sublabel: "Investor Podcast",
    },
  },
  {
    dateTime: "06/05/2026, 11:00 AM",
    title: "Virtual Roadshow",
    ctaLabel: "Watch the Recording",
    ctaHref: "https://www.businesswire.com/news/home/20260604841313/en/Powerlaw-Corp.-Nasdaq-PWRL-to-Host-Virtual-Investor-Roadshow",
    type: "recording",
    image: {
      src: "/remote-assets/20be770f-michael_dindsdale.webp",
      alt: "Virtual roadshow speaker",
    },
  },
];
