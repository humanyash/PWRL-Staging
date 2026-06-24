/**
 * Font-substitute comparison for the PWRL rebuild.
 *
 * The live site uses Adobe Typekit kit `xyr7qcs` which serves a single display
 * family: `ivypresto-headline` (a high-contrast Didone serif). We don't have
 * the kit license, so this page renders the actual PWRL hero strings in three
 * free Google Fonts candidates side-by-side so the user can pick a final match.
 *
 * Candidates:
 *   1. Cormorant Garamond — closest in proportion + contrast
 *   2. Playfair Display    — heavier, more web-familiar Didone
 *   3. DM Serif Display    — wider, modern Didone
 *
 * Body text comparison uses Inter (matches the bundled Next.js font on the
 * live site).
 */

const HERO_PHRASES = [
  "Only for big thinkers.",
  "Only for Mars seekers.",
  "Only for world changers.",
  "Only for everyone.",
];

const HERO_TAGLINE =
  "18 leading private tech companies. One Nasdaq-listed stock.";

const SECTION_HEAD = "Decades of breaking through barriers.";

const INTRO_PROSE =
  "Powerlaw Corp. provides exposure to private technology companies through a single public security with daily liquidity, monthly NAV reporting, and quarterly portfolio disclosure.";

type CandidateProps = {
  name: string;
  fontClass: string;
  notes: string;
};

function Candidate({ name, fontClass, notes }: CandidateProps) {
  return (
    <section className="border-t border-neutral-200 pt-12 pb-16">
      <div className="mb-8 flex items-baseline justify-between">
        <h2 className="text-sm font-semibold uppercase tracking-widest text-neutral-500">
          {name}
        </h2>
        <p className="text-xs text-neutral-400">{notes}</p>
      </div>

      <div className="space-y-12">
        {/* Hero — rotating phrases, large display */}
        <div>
          <p className="mb-2 text-[10px] uppercase tracking-widest text-neutral-400">
            Hero — rotating phrase
          </p>
          <div className={`${fontClass} text-7xl leading-[0.95] tracking-tight`}>
            {HERO_PHRASES.map((p) => (
              <div key={p} className="mb-2 italic">
                {p}
              </div>
            ))}
          </div>
        </div>

        {/* Hero tagline */}
        <div>
          <p className="mb-2 text-[10px] uppercase tracking-widest text-neutral-400">
            Hero tagline
          </p>
          <h1
            className={`${fontClass} text-4xl leading-tight tracking-tight`}
          >
            {HERO_TAGLINE}
          </h1>
        </div>

        {/* Section heading */}
        <div>
          <p className="mb-2 text-[10px] uppercase tracking-widest text-neutral-400">
            Section heading
          </p>
          <h3
            className={`${fontClass} text-3xl italic leading-tight tracking-tight`}
          >
            {SECTION_HEAD}
          </h3>
        </div>

        {/* Body prose stays in Inter — we're only choosing the display face */}
        <div>
          <p className="mb-2 text-[10px] uppercase tracking-widest text-neutral-400">
            Body (Inter, fixed)
          </p>
          <p className="font-[family-name:var(--font-inter)] max-w-2xl text-lg leading-relaxed text-neutral-700">
            {INTRO_PROSE}
          </p>
        </div>
      </div>
    </section>
  );
}

export default function FontComparePage() {
  return (
    <main className="mx-auto max-w-5xl px-6 py-16">
      <header className="mb-12 border-b border-neutral-200 pb-8">
        <p className="mb-2 text-xs uppercase tracking-widest text-neutral-500">
          PWRL rebuild · font substitution
        </p>
        <h1 className="font-[family-name:var(--font-inter)] text-3xl font-semibold tracking-tight text-neutral-900">
          ivypresto-headline → Google Fonts candidates
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-neutral-600">
          The live site uses a paid Adobe Font. These three free alternatives
          all share the same Didone (high-contrast serif) character. Pick one
          and the rest of the build will lock it in everywhere the live site
          uses ivypresto-headline.
        </p>
      </header>

      <Candidate
        name="Candidate 1 — Cormorant Garamond"
        fontClass="font-[family-name:var(--font-cormorant)]"
        notes="Closest in proportion and contrast — the safest pixel-match."
      />
      <Candidate
        name="Candidate 2 — Playfair Display"
        fontClass="font-[family-name:var(--font-playfair)]"
        notes="Heavier strokes, more web-familiar. Reads more authoritative."
      />
      <Candidate
        name="Candidate 3 — DM Serif Display"
        fontClass="font-[family-name:var(--font-dm-serif)]"
        notes="Wider, more modern Didone. Distinctive but less classical."
      />

      <footer className="mt-16 border-t border-neutral-200 pt-8 text-sm text-neutral-500">
        <p>
          Tell me which one and I&apos;ll roll it into the rebuild as the
          display face for all headings, hero copy, and italic accents.
        </p>
      </footer>
    </main>
  );
}
