import type { ReactNode } from "react";
import { Container } from "./Container";

type Tone = "light" | "ice" | "navy" | "deep";

const toneClasses: Record<Tone, string> = {
  light: "bg-white text-charcoal",
  ice: "bg-ice text-charcoal",
  navy: "bg-navy text-white",
  /* Live `bg-[#00158D]` — the deep-blue NAV-signup band on /vision. */
  deep: "bg-[#00158D] text-white",
};

/**
 * Standard vertical-rhythm section wrapper with an optional background tone
 * (matching the live site's white / light-blue / navy section alternation).
 */
export function Section({
  children,
  tone = "light",
  id,
  className = "",
  containerClassName = "",
}: {
  children: ReactNode;
  tone?: Tone;
  id?: string;
  className?: string;
  containerClassName?: string;
}) {
  return (
    <section
      id={id}
      className={`relative z-10 scroll-mt-28 py-16 md:py-24 ${toneClasses[tone]} ${className}`}
    >
      <Container className={containerClassName}>{children}</Container>
    </section>
  );
}

export default Section;
