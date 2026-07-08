import type { NewsItem } from "@/types/blocks";

const newsImg = (src: string, alt: string) => ({ src, alt });

/** Home page carousel — matches production /pwrl #news (6 cards). */
export const HOME_NEWS_ITEMS: NewsItem[] = [
  {
    date: "July 8, 2026",
    title:
      "Powerlaw Corp. (Nasdaq: PWRL) Reports Net Asset Value (NAV) and NAV per Share for June 30, 2026.",
    href: "https://finance.yahoo.com/markets/stocks/articles/powerlaw-corp-nasdaq-pwrl-reports-100000082.html",
    source: "Yahoo Finance",
    image: newsImg("/remote-assets/news/pwrl-preview.jpg", "PWRL"),
  },
  {
    date: "July 6, 2026",
    title: "Yahoo Finance Live: How to Invest in Private Companies",
    href: "https://www.youtube.com/watch?v=WAmyhiL1mZo&t=3754s",
    source: "Yahoo Finance",
    image: newsImg(
      "/remote-assets/news/yahoo-finance-live.png",
      "Yahoo Finance",
    ),
  },
  {
    date: "June 16, 2026",
    title:
      "Bloomberg: Powerlaw CEO Mike Dinsdale Discusses SpaceX, Private Markets, and the IPO Environment",
    href: "https://www.bloomberg.com/news/videos/2026-06-16/spacex-investor-powerlaw-debuts-amid-ipo-race-video",
    source: "Bloomberg",
    image: newsImg(
      "/remote-assets/news/bloomberg-ceo-prod.png",
      "Bloomberg: Powerlaw CEO Mike Dinsdale Discusses SpaceX, Private Markets, and the IPO Environment",
    ),
  },
  {
    date: "June 9, 2026",
    title:
      "CNBC: Powerlaw Capital Group CEO: We're bringing access to private companies to everyone",
    href: "https://www.cnbc.com/video/2026/05/27/powerlaw-capital-group-ceo-were-bringing-access-to-private-companies-to-everyone.html",
    source: "CNBC",
    image: newsImg("/remote-assets/news/cnbc-prod.png", "CNBC"),
  },
  {
    date: "June 9, 2026",
    title:
      "Powerlaw Corp.(Nasdaq: PWRL) Reports Net Asset Value (NAV) and NAV per Share for May 2026",
    href: "https://finance.yahoo.com/markets/stocks/articles/powerlaw-corp-nasdaq-pwrl-reports-100000851.html",
    source: "Yahoo Finance",
    image: newsImg(
      "/remote-assets/news/yahoo-finance-live.png",
      "Yahoo Finance",
    ),
  },
  {
    date: "May 27, 2026",
    title: "Powerlaw Corp. Begins Trading on Nasdaq as PWRL",
    href: "https://www.businesswire.com/news/home/20260527046646/en/Powerlaw-Corp.-Begins-Trading-on-Nasdaq-as-PWRL",
    source: "Business Wire",
    image: newsImg(
      "/remote-assets/news/powerlaw-052726-4.jpg",
      "Powerlaw Corp. (Nasdaq: PWRL)",
    ),
  },
];

/** Investor Relations news strip — matches production /pwrl/investor-relations #news. */
export const IR_NEWS_ITEMS: NewsItem[] = [
  {
    date: "July 8, 2026",
    title:
      "Powerlaw Corp. (Nasdaq: PWRL) Reports Net Asset Value (NAV) and NAV per Share for June 30, 2026",
    href: "https://finance.yahoo.com/markets/stocks/articles/powerlaw-corp-nasdaq-pwrl-reports-100000082.html",
    source: "Yahoo Finance",
    image: newsImg("/remote-assets/news/pwrl-preview.jpg", "PWRL"),
  },
  {
    date: "July 6, 2026",
    title: "Yahoo Finance Live: How to Invest in Private Companies",
    href: "https://www.youtube.com/watch?v=WAmyhiL1mZo&t=3754s",
    source: "Yahoo Finance",
    image: newsImg(
      "/remote-assets/news/yahoo-finance-live.png",
      "Yahoo Finance",
    ),
  },
  {
    date: "June 16, 2026",
    title:
      "Bloomberg: Powerlaw CEO Mike Dinsdale Discusses SpaceX, Private Markets, and the IPO Environment",
    href: "https://www.bloomberg.com/news/videos/2026-06-16/spacex-investor-powerlaw-debuts-amid-ipo-race-video",
    source: "Bloomberg",
    image: newsImg(
      "/remote-assets/news/bloomberg-ceo-prod.png",
      "Bloomberg: Powerlaw CEO Mike Dinsdale Discusses SpaceX, Private Markets, and the IPO Environment",
    ),
  },
  {
    date: "June 9, 2026",
    title:
      "Powerlaw Corp. (Nasdaq: PWRL) Reports Net Asset Value (NAV) and NAV per Share for May 2026",
    href: "https://finance.yahoo.com/markets/stocks/articles/powerlaw-corp-nasdaq-pwrl-reports-100000851.html",
    source: "Yahoo Finance",
    image: newsImg("/remote-assets/news/pwrl-preview.jpg", "PWRL"),
  },
  {
    date: "June 5, 2026",
    title: "SpaceX Announced as Powerlaw Corp. (Nasdaq: PWRL) Largest Holding",
    href: "https://finance.yahoo.com/markets/stocks/articles/powerlaw-corp-nasdaq-pwrl-announces-134600213.html",
    source: "Yahoo Finance",
    image: newsImg(
      "/remote-assets/news/spacex-holding.png",
      "SpaceX Announced as Powerlaw Corp. (Nasdaq: PWRL) Largest Holding",
    ),
  },
  {
    date: "June 4, 2026",
    title: "Powerlaw Corp. (Nasdaq: PWRL) to Host Virtual Investor Roadshow",
    href: "https://www.businesswire.com/news/home/20260604841313/en/Powerlaw-Corp.-Nasdaq-PWRL-to-Host-Virtual-Investor-Roadshow",
    source: "Business Wire",
    image: newsImg("/remote-assets/news/pwrl-preview.jpg", "PWRL"),
  },
  {
    date: "May 27, 2026",
    title:
      "Powerlaw Capital Group CEO: We're bringing access to private companies to everyone",
    href: "https://www.cnbc.com/video/2026/05/27/powerlaw-capital-group-ceo-were-bringing-access-to-private-companies-to-everyone.html",
    source: "CNBC",
    image: newsImg(
      "/remote-assets/news/cnbc-mike-dinsdale.jpg",
      "Powerlaw Capital Group CEO",
    ),
  },
  {
    date: "May 27, 2026",
    title: "SpaceX Investor Powerlaw to Debut on Nasdaq as IPO Race Heats Up",
    href: "https://www.bloomberg.com/news/articles/2026-05-27/spacex-investor-powerlaw-to-debut-on-nasdaq-as-ipo-race-heats-up?srnd=undefined&embedded-checkout=true",
    source: "Bloomberg",
    image: newsImg(
      "/remote-assets/news/bloomberg-spacex-debut.png",
      "SpaceX Investor Powerlaw to Debut on Nasdaq as IPO Race Heats Up",
    ),
  },
  {
    date: "March 10, 2026",
    title:
      "It's easy for everyday investors to get a piece of Stripe, Revolut and OpenAI — here's how",
    href: "https://www.businesspost.ie/markets/its-easy-for-everyday-investors-to-get-a-piece-of-stripe-revolut-and-openai-heres-how/",
    source: "Business Post",
    image: newsImg(
      "/remote-assets/news/business-post.jpg",
      "It's easy for everyday investors to get a piece of Stripe, Revolut and OpenAI — here's how",
    ),
  },
  {
    date: "February 17, 2026",
    title: "Akkadian Ventures Announces Powerlaw Capital Group",
    href: "https://pwrl.com/media/powerlaw-capital-launch.pdf",
    source: "Powerlaw",
    image: newsImg("/remote-assets/news/pwrl-preview.jpg", "PWRL"),
  },
];
