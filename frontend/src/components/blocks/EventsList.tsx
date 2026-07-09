import { Section } from "@/components/ui/Section";
import { EVENT_ITEMS } from "@/lib/education";
import type { EventItemBlock, EventsListBlock } from "@/types/blocks";

function PinIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      aria-hidden
      className="mt-px shrink-0"
    >
      <path
        d="M7 1.5A3.5 3.5 0 0 0 3.5 5c0 2.625 3.5 7 3.5 7s3.5-4.375 3.5-7A3.5 3.5 0 0 0 7 1.5z"
        stroke="currentColor"
        strokeWidth="1.2"
      />
      <circle cx="7" cy="5" r="1.2" fill="currentColor" />
    </svg>
  );
}

function ChainIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      aria-hidden
      className="mt-px shrink-0"
    >
      <path
        d="M5.5 8.5 8.5 5.5M6.5 3.5l.5-.5a2.5 2.5 0 0 1 3.536 3.536l-.5.5M7.5 10.5l-.5.5a2.5 2.5 0 0 1-3.536-3.536l.5-.5"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="round"
      />
    </svg>
  );
}

function EventCard({ event }: { event: EventItemBlock }) {
  return (
    <article
      className="event-card overflow-hidden rounded-lg bg-white shadow-sm"
      data-mo=""
    >
      {/* Thumbnail — standalone link so we don't nest <a> tags */}
      <a
        href={event.ctaHref}
        target="_blank"
        rel="noopener noreferrer"
        tabIndex={-1}
        aria-hidden
        className="block no-underline"
      >
        {event.brandPanel ? (
          <div className="flex h-[219px] flex-col items-center justify-center bg-[#085CF0] px-8 text-center text-white">
            <p className="font-display text-3xl font-light italic leading-none md:text-4xl">
              {event.brandPanel.label}
            </p>
            {event.brandPanel.sublabel ? (
              <p className="mt-1 font-display text-3xl font-light italic leading-none md:text-4xl">
                {event.brandPanel.sublabel}
              </p>
            ) : null}
          </div>
        ) : event.image ? (
          <div className="event-thumb relative h-[219px] overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={event.image.src}
              alt={event.image.alt}
              className="absolute inset-0 h-full w-full object-cover object-top"
            />
          </div>
        ) : (
          <div className="h-[219px] bg-navy" />
        )}
      </a>

      {/* Body */}
      <div className="flex flex-col gap-2 p-4">
        <p className="font-[family-name:var(--font-franklin)] text-xs text-[#0023EC]">
          {event.dateTime}
        </p>
        <h3 className="line-clamp-3 text-pretty font-[family-name:var(--font-franklin)] text-lg font-semibold leading-snug text-charcoal">
          {event.title}
        </h3>
        <div className="mt-auto flex items-start gap-1.5 pt-1 font-[family-name:var(--font-franklin)] text-sm text-charcoal/60">
          <PinIcon />
          <span>{event.ctaLabel}</span>
        </div>
        <a
          href={event.ctaHref}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 font-[family-name:var(--font-franklin)] text-sm text-charcoal underline"
        >
          <ChainIcon />
          Webcast
        </a>
      </div>
    </article>
  );
}

/**
 * EventsList — ice band with event cards (Figma IR 06.24.26).
 */
export function EventsList({ block }: { block: EventsListBlock }) {
  // CMS-first; when the CMS event has no image yet (media not uploaded),
  // borrow the matching fixture image/brand panel by title so cards stay whole.
  const events =
    block.items.length > 0
      ? block.items.map((e) => {
          if (e.image || e.brandPanel) return e;
          const fx = EVENT_ITEMS.find((f) => f.title === e.title);
          return fx ? { ...e, image: fx.image, brandPanel: fx.brandPanel } : e;
        })
      : EVENT_ITEMS;

  return (
    <Section tone="ice" id="events" className="!py-[80px] md:!py-[100px]">
      <h2
        className="font-display text-[32px] font-normal leading-[1.1] text-black md:text-[48px]"
        data-mo=""
      >
        {block.heading}
      </h2>

      <div
        className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-3"
        data-mo-stagger=""
      >
        {events.map((event, i) => (
          <EventCard key={`${event.title}-${i}`} event={event} />
        ))}
      </div>
    </Section>
  );
}

export default EventsList;
