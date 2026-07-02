import Link from "next/link";
import type { EducationArticle } from "@/lib/education";

type EducationCardProps = {
  article: EducationArticle;
  /** IR strip uses news-like sizing; education index uses larger cards. */
  variant?: "compact" | "featured";
};

export function EducationCard({
  article,
  variant = "compact",
}: EducationCardProps) {
  const featured = variant === "featured";

  return (
    <article className="education-card h-full">
      <Link
        href={`/learn/${article.slug}`}
        className="mo-card mo-card--quiet grid h-full grid-rows-[auto_1fr] overflow-hidden rounded-lg no-underline"
      >
        <span className="news-thumb relative block aspect-video overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={article.image.src}
            alt={article.image.alt || article.title}
            className="absolute inset-0 h-full w-full object-cover"
          />
        </span>
        <div className="flex flex-col gap-2 bg-[#E4F7FD] p-4 text-black">
          <span
            className={`font-normal text-[#0023EC] ${
              featured
                ? "text-sm tracking-[0.05em]"
                : "text-xs"
            }`}
          >
            {article.date}
          </span>
          <h3
            className={`line-clamp-3 text-pretty font-[family-name:var(--font-franklin)] font-semibold leading-snug ${
              featured ? "text-[26px]" : "text-lg"
            }`}
          >
            {article.title}
          </h3>
        </div>
      </Link>
    </article>
  );
}

export default EducationCard;
