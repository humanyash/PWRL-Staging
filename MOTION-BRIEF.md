# PWRL Interactive Layer — Design Brief

## What this is

A motion and interaction layer for the Powerlaw Corp. website (pwrl.com rebuild).
The site is visually complete and pixel-matched to the approved design — but it is
static. Page loads are instant and flat, hover states are minimal, and scrolling
reveals content with no choreography. This brief commissions the **kinetic layer**:
hover, scroll, and cursor behavior that makes the site feel alive without changing
a single pixel of its resting state.

Work against the cloned repo (`frontend/` is a self-contained Next.js app — it runs
without the CMS and renders from baked-in fixtures).

## Brand attributes → motion principles

The brand needs to communicate **tech, speed, strength, trust, and intelligence** —
with a measured dose of **play**. Translate those as:

- **Tech & intelligence → precision.** Deliberate easings, orchestrated staggers,
  data that *behaves like data* (numbers count up, chart arcs sweep, lines draw).
  Nothing random, nothing floaty.
- **Speed → economy.** Fast in, faster out. Entrances 300–500ms, hover responses
  under 200ms. The site should feel quick because the motion is quick, never
  because things are flying around.
- **Strength & trust → restraint and weight.** No bounce, no elastic overshoot,
  no rotation gimmicks. Objects move like they have mass: short distances
  (12–24px), confident ease-out curves. The motion system must be *consistent* —
  one vocabulary across all six pages, because consistency reads as
  trustworthiness. This is a regulated, Nasdaq-listed fund; the energy should
  feel like a trading floor, not a startup landing page.
- **Play → the cursor layer.** The fun lives in pointer interaction: reactive
  diffused shadows, glows that track the mouse, magnetic buttons, cards that
  acknowledge you. Playful on touch, serious at rest.

## The core requests

### 1. Cursor-reactive hover system (the headline feature)
Replace the current flat hover states with a unified system:
- **Diffused shadows that react to cursor position** — as the pointer moves
  across a card, a soft shadow/glow shifts as if the card were lit from the
  cursor. Use the brand blues for the glow on light surfaces
  (`#085CF0` / `#0023EC` at low alpha), sky `#B0E9FD` on navy surfaces.
- Subtle lift (translate-y 2–4px max) + shadow deepen on cards.
- Buttons: a magnetic micro-pull toward the cursor and/or a light sheen sweep
  on the blue (`#085CF0`) and mint (`#23FBC5`) CTAs. Arrows in labels
  ("Charles Schwab →") nudge forward on hover.
- Candidate surfaces: news cards, platform tiles, team/board photo cards,
  fund-document rows, value-prop items, FAQ rows, footer links, nav dropdowns.

### 2. Scroll choreography (page builds)
Content should enter as the user scrolls — fade + slide-up reveals with
orchestrated stagger, via IntersectionObserver (or Motion/Framer Motion if
warranted):
- Section headings lead (fade-up 16–24px), body copy and CTAs follow at
  60–90ms stagger.
- Grids cascade: value items, team cards, platform tiles, news cards enter
  left-to-right / top-to-bottom with per-item delay.
- **Data moments get signature treatments:**
  - Heritage stats (`$1.36B`, `134`, `57`, `5,000+`) count up on entry.
  - Donut charts (fund page) sweep their arcs in.
  - Timeline: the beam fades in, the sky connector lines *draw* vertically,
    year markers and cards cascade along the sequence.
  - The dotted sphere and the 97% caption reveal together.
- Hero sections: headline enters first (consider per-line or per-word rise on
  the two-line heroes), body and CTA follow. A whisper of parallax on hero
  imagery is welcome; keep it subtle.
- Reveals fire once, on first view. Above-the-fold content must never wait —
  the hero is visible immediately, animation is garnish on arrival.

### 3. Enliven what already moves
Existing animations to respect and possibly enrich (do not rebuild):
- Homepage hero rotator (27s CSS cycle — "Only for…" suffixes).
- Quote-panel crossfade (8 slides, 4s each) — a very slow Ken Burns drift on
  the slides would add depth.
- Fund-page sector wheel (20s orbit) — could subtly respond to hover
  (ease faster, icons brighten).

## Hard constraints

1. **Zero layout shift.** The resting state of every element must remain
   exactly as designed — this site is pixel-audited against the client's
   Figma and live site. The motion layer is purely additive: transforms,
   opacity, shadows, filters. Nothing that changes box geometry.
2. **Performance.** Animate only `transform` and `opacity` (shadows/glows via
   pseudo-elements with opacity, not animated `box-shadow`). 60fps on
   mid-range hardware. No scroll-jacking, no hijacked wheel events, no
   heavy canvas/WebGL.
3. **`prefers-reduced-motion`** disables all of it (guards already exist in
   `globals.css` for current animations — extend the pattern).
4. **Leave legal alone.** Footer disclaimers, FAQ risk language, SEC filings
   table content get no playful treatment. Functional fade-ins at most.
5. **Mobile:** scroll reveals yes (shorter distances), cursor effects
   degrade gracefully to tap states (lift + shadow on active).
6. Stack: Next.js App Router + Tailwind v4. Most components are server
   components — prefer CSS-driven effects and a small client-side
   IntersectionObserver/pointer utility over converting everything to client
   components.

## Design system reference (already in the repo)

- Colors: navy `#060B35`, electric `#0023EC`, action blue `#085CF0`,
  mint `#23FBC5`, sky `#B0E9FD`, ice `#E4F7FD`, charcoal `#242424`.
- Type: IvyPresto Headline (display), Libre Franklin (UI/body), Inter (forms).
- Tokens and existing keyframes: `frontend/src/app/globals.css`.
- Components: `frontend/src/components/` (blocks + ui). Six pages:
  home, /vision, /fund, /trade, /investor-relations, /contact.

## Deliverables

1. **Motion spec** — the vocabulary: duration/easing/distance/stagger tokens,
   the cursor-shadow recipe, and which treatment applies to which component
   class. (This becomes the contract for implementation.)
2. **Working prototype** of at least the homepage + one data-heavy page
   (/fund) with the full layer applied, built on the cloned repo.
3. **Reduced-motion and mobile behavior** demonstrated, not just described.

## Success criteria

Side-by-side with the current staging site
(https://pwrl-website-theta.vercel.app), the prototype should feel noticeably
more alive, focused, and premium — and a first-time viewer should describe it
with words like "fast," "sharp," "confident" — while a screenshot of any
resting state remains indistinguishable from the current build.
