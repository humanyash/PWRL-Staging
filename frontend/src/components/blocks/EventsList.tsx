import { Section } from "@/components/ui/Section";
import { EVENT_ITEMS } from "@/lib/education";
import type { EventItemBlock, EventsListBlock } from "@/types/blocks";

function WebcastBadge({ type }: { type: EventItemBlock["type"] }) {
  return (
    <span className="inline-flex items-center gap-1.5 font-[family-name:var(--font-franklin)] text-xs uppercase tracking-wide text-charcoal/70">
      {type === "recording" ? (
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
          <circle cx="7" cy="7" r="6" stroke="currentColor" strokeWidth="1.2" />
          <path
            d="M5.5 4.5v5l4-2.5-4-2.5z"
            fill="currentColor"
          />
        </svg>
      ) : (
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
          <rect
            x="2"
            y="3"
            width="10"
            height="7"
            rx="1"
            stroke="currentColor"
            strokeWidth="1.2"
          />
          <path d="M5 6.5h4" stroke="currentColor" strokeWidth="1.2" />
        </svg>
      )}
      Webcast
    </span>
  );
}

function EventCard({ event }: { event: EventItemBlock }) {
  return (
    <article
      className="event-card overflow-hidden rounded-lg bg-white shadow-sm"
      data-mo=""
    >
      {event.brandPanel ? (
        <div className="flex aspect-[16/10] flex-col items-center justify-center bg-[#085CF0] px-8 text-center text-white">
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
        <div className="relative aspect-[16/10] overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={event.image.src}
            alt={event.image.alt}
            className="absolute inset-0 h-full w-full object-cover object-top"
          />
        </div>
      ) : (
        <div className="aspect-[16/10] bg-navy" />
      )}

      <div className="space-y-4 p-6 md:p-8">
        <p className="font-[family-name:var(--font-franklin)] text-sm text-charcoal/70">
          {event.dateTime}
        </p>
        <h3 className="font-[family-name:var(--font-franklin)] text-xl font-semibold leading-snug text-charcoal md:text-2xl">
          {event.title}
        </h3>
        <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
          <a
            href={event.ctaHref}
            target="_blank"
            rel="noopener noreferrer"
            className="font-[family-name:var(--font-franklin)] text-sm font-semibold uppercase tracking-wide text-[#0023EC] underline underline-offset-4"
          >
            {event.ctaLabel}
          </a>
          <WebcastBadge type={event.type} />
        </div>
      </div>
    </article>
  );
}

/**
 * EventsList — ice band with two large event cards (Figma IR 06.24.26).
 */
export function EventsList({ block }: { block: EventsListBlock }) {
  const events = block.items.length > 0 ? block.items : EVENT_ITEMS;

  return (
    <Section tone="ice" id="events" className="!py-[80px] md:!py-[100px]">
      <h2
        className="font-display text-[32px] font-light leading-[1.1] text-black md:text-[48px]"
        data-mo=""
      >
        {block.heading}
      </h2>

      <div
        className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-2"
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
