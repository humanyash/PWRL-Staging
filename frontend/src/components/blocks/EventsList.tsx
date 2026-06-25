import { Section } from "@/components/ui/Section";
import { EVENT_ITEMS } from "@/lib/education";
import type { EventItemBlock, EventsListBlock } from "@/types/blocks";

function EventCard({ event }: { event: EventItemBlock }) {
  return (
    <article
      className="event-card overflow-hidden rounded-lg bg-white shadow-sm"
      data-mo=""
    >
      <a
        href={event.ctaHref}
        target="_blank"
        rel="noopener noreferrer"
        className="grid h-full grid-rows-[auto_1fr] no-underline"
      >
        {event.brandPanel ? (
          <div className="flex aspect-video flex-col items-center justify-center bg-[#085CF0] px-8 text-center text-white">
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
          <div className="relative aspect-video overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={event.image.src}
              alt={event.image.alt}
              className="absolute inset-0 h-full w-full object-cover object-top"
            />
          </div>
        ) : (
          <div className="aspect-video bg-navy" />
        )}

        <div className="flex flex-col gap-2 p-4">
          <p className="font-[family-name:var(--font-franklin)] text-xs text-[#0023EC]">
            {event.dateTime}
          </p>
          <h3 className="line-clamp-3 text-pretty font-[family-name:var(--font-franklin)] text-lg font-semibold leading-snug text-charcoal">
            {event.title}
          </h3>
          <p className="mt-auto pt-1 font-[family-name:var(--font-franklin)] text-sm text-charcoal/60">
            {event.ctaLabel}
          </p>
        </div>
      </a>
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
