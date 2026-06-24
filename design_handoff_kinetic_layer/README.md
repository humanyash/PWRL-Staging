# Handoff: PWRL Kinetic Layer (motion + interaction system)

## Overview

A complete hover / scroll / cursor motion layer for the pwrl.com rebuild
(`frontend/` — Next.js App Router + Tailwind v4). The site is pixel-audited
against the approved design; this layer is **purely additive**: transforms,
opacity, masks and pseudo-element glows only. Zero layout shift — every
resting state remains pixel-identical to the static build.

Committed configuration (06.11.26): **Standard intensity, Lumen cursor glow
(#085CF0), magnetic pull (0.3) + sheen buttons, per-line hero rise, Ken Burns
+ parallax on.**

## About the files in this bundle — READ FIRST

This bundle contains TWO kinds of files. Do not treat them the same way:

### 1. Production-intent drop-in code (`motion/`) — integrate as-is
- `motion/motion.css` — the global motion system (tokens, scroll reveals,
  cursor-glow recipes, buttons, data moments, reduced-motion kills)
- `motion/motion-bespoke.css` — per-component signature treatments, loaded
  AFTER motion.css; every block is independently deletable
- `motion/pwrl-motion.js` — dependency-free utility (~14KB): one
  IntersectionObserver + rect-scan fallback, one rAF-throttled pointermove,
  count-ups, sector-wheel spin, parallax, scrollspy, page-transition veil

These were written for this repo: no framework dependency, no build step,
server components stay server components. The integration contract is data
attributes and classes only.

### 2. Design references (`reference_pages/`, `Motion Spec.html`, `Enhancement Audit.html`)
The six HTML pages are **prototypes, not production code**. They re-create
the repo's components in plain HTML so the motion layer could be developed
against real markup. **Their value to you is the annotations**: grep them for
`data-mo`, `data-mo-stagger`, `data-mo-hero`, `mo-card`, `mo-btn`,
`mo-phrase`, etc., and replicate those exact attributes/classes on the
corresponding JSX in `frontend/src/components/blocks/`. They will not render
standalone from inside this folder (they reference project-root assets).

`Motion Spec.html` is the design contract (tokens, recipes, component map,
reduced-motion/mobile behavior). `Enhancement Audit.html` documents the 14
enhancement items (E1–E14) and their rationale.

## Fidelity

**High-fidelity.** Timings, easings, distances, colors and stagger values are
final and committed. Recreate behavior exactly; the spec's token table is the
source of truth.

## Integration steps (Next.js App Router + Tailwind v4)

1. Copy `motion/motion.css` → `frontend/src/app/motion.css` and
   `motion/motion-bespoke.css` → `frontend/src/app/motion-bespoke.css`.
   `@import` both from `globals.css` AFTER the theme block, global first.
2. Copy `motion/pwrl-motion.js` → `frontend/public/pwrl-motion.js` and load
   once in `app/layout.tsx`:
   `<Script src="/pwrl-motion.js" strategy="afterInteractive" />`
3. Annotate the block components (see map below) with the data attributes /
   classes exactly as the reference pages show. No component needs to become
   a client component for the motion layer itself.
4. Without the script, nothing is ever hidden: all pre-states are gated on
   `html[data-mo-on]`, which only the script sets. SSR, print, crawlers and
   no-JS all see the resting state.

### Next.js-specific notes
- **Page-transition veil**: `pwrl-motion.js` intercepts full-page link
  navigations (fade-to-navy exit, veil lift on arrival). With App Router
  client-side routing, `location.href` navigation still works but forgoes
  RSC prefetching. Recommended adaptation: keep the veil mechanic but trigger
  it from a small client component wrapping `next/link` clicks, and lift the
  veil + call `PWRLMotion.replay()`-equivalent re-init (`init()` is
  idempotent) on `usePathname()` change. The veil CSS (`.mo-veil`) works
  unchanged.
- **Client-side route changes**: after any soft navigation, call
  `window.PWRLMotion.init()` to re-index staggers and re-observe new DOM.
- **SEC filings / FAQ / disclaimers**: legal surfaces get NO playful
  treatment by design — functional fades at most. The prototype's filings
  table is placeholder data; keep the live EDGAR feed (`lib/edgar.ts`).

## Annotation contract (component map)

| Repo component (`src/components/blocks|ui|layout`) | Annotations to add | Reference page |
|---|---|---|
| `layout/Header.tsx` | Header arrival is automatic (`.site-header` selector — match or alias to the fixed header root). Dropdown panels: `.mo-dropdown` on the panel wrapper, `.mo-dropdown-parent` on the `<li>` | any page |
| `Hero.tsx` | Wrap hero section content in `data-mo-hero`. Static headings: each line in `<span class="mo-mask"><span class="mo-line" style="--mo-i:n">`. Home rotator: leave untouched; `h1` gets `class="mo-arrive" style="--mo-arrive-d:150ms"`. Body/CTAs: `data-mo` + `--mo-d` (380/540ms). Media wrapper: `.mo-settle`, media element: `.mo-parallax` | Home, Fund |
| `Intro.tsx` | `data-mo` on headings/copy, `data-mo-stagger` on grids, `data-mo="draw"` on the mint divider, `.intro-item` icon pop is automatic, `.mo-phrase` spans on the manifesto statements (E2) | Home |
| `PullQuote.tsx` | `.mo-kenwrap` on the slide stack (Ken Burns + offscreen gating), `.mo-phrase` spans on the quote (E3) | Home |
| `Timeline.tsx` | `data-mo` on cards (`.tl-card` pops at 0.94 automatically), `data-mo="draw"` on connectors, `data-mo="fade"` on years + beam, `<span class="beam-sweep" data-mo="fade">` over the beam cell (E1) | Home |
| `Truths.tsx` | `data-mo-stagger` on the rows wrapper, `data-mo` per row (`.truth-row` num-pop + thread are automatic), sphere: `data-mo="fade"` (bloom is automatic), wrap `97%` in `<span data-countup>` (E5) | Vision |
| `ValueProps.tsx` / `ProcessSteps.tsx` | `data-mo-stagger` + `data-mo` per item, `.intro-item` class for icon pop; /trade adds `<span class="steps-line" data-mo="draw-x">` (E10) | Vision, Trade |
| `TeamGrid.tsx` / `BoardGrid.tsx` / `PersonCardItem.tsx` | `.mo-card` on the card button, `.mo-photo` + `display:block` frame around the photo. Dialog: `.bio-overlay`/`.scrim`/`.bio-dialog` classes get open/close choreography via the `.open` class (E6) | Vision, IR |
| `StatsBlock.tsx` | `.mo-stat` + `data-mo` per stat, `data-countup` on values (E5/E8-style) | Vision |
| `PortfolioBlock.tsx` / `DonutChart.tsx` | `.mo-donut` on chart box (`--mo-d:150ms`), `data-name` on each `<path>` and `<tr>`, rows: `data-mo` + `--mo-i` (cap 8) + `--mo-stagger:30ms` on the table (E8). Hover dialogue (E7): port `linkDonut()` from `reference_pages/Fund.html` inline script (~30 lines) into the chart's client component | Fund |
| `SectorWheel.tsx` | `.mo-wheel` on stage + `data-mo="fade"` (ring draw + disc cascade are automatic); keep stock CSS spin as fallback — the JS velocity-spin takes over via `.mo-wheel-js` | Fund |
| `StockInfo.tsx` | `data-mo-stagger` on grid, `data-mo` per row (rule wipes automatic), `data-countup` on NAV/fee values | Fund |
| `PlatformTabs.tsx` | `.mo-card` on tiles, `.mo-arrow` on arrows; re-set `--mo-i` on visible tiles after tab switch (see `site/pwrl-pages.js` `bindTabs`) | Trade |
| `RichText.tsx` (gradient/CEF) | `data-mo` on h3/p INSIDE `.cef-item` (not the item itself — its border draws via `:has(.mo-in)`, E11) | Trade |
| `NewsList.tsx` | `.mo-card` on card links, `data-mo-stagger` on strip; edge-fade `.has-more` + first-view nudge: port from `site/pwrl-pages.js` `bindNews` (E12) | IR |
| `DocumentList.tsx` | `.mo-card` on doc rows, `data-mo` + stagger; `.mo-arrow`/pdf-slide automatic. FilingsTable: `data-mo="fade"` on the wrapper ONLY | IR |
| `FormBlock.tsx` | Contact: wrap each control in `<div class="mo-field">` + `data-mo`; on successful submit add `.mo-confirm` to the button and `.show` to the status line (E13) | Contact |
| `AnchorNav.tsx` | Nothing — scrollspy auto-attaches to `.anchor-nav` with `a[href*="#"]` links (E14). Hover underline needs the `.nav-swap` span structure | Fund/Vision/Trade/IR |
| Footer | `.mo-link` on links only. Disclaimers untouched | any |

## Design tokens (committed values)

| Token | Value | Role |
|---|---|---|
| `--mo-dur-tap` | 140ms | hover responses |
| `--mo-dur-fast` | 260ms | small reveals, dropdowns |
| `--mo-dur-base` | 380ms | standard scroll reveal |
| `--mo-dur-slow` | 600ms | hero rises, signature moments |
| `--mo-dur-draw` | 750ms | line draws, arc sweeps |
| `--mo-ease-out` | `cubic-bezier(.16,1,.3,1)` | default (expo-style, no overshoot) |
| `--mo-ease-inout` | `cubic-bezier(.65,0,.35,1)` | draws/sweeps |
| `--mo-dist` | 24px (12px touch) | reveal travel |
| `--mo-pop` | 0.97 | scale snap on rises (1 = off) |
| `--mo-stagger` | 70ms | per-item delay |
| `--mo-lift` | 3px | card hover lift |
| `--mo-glow` | 0.25 | glow alpha; color `#085CF0` light / `#B0E9FD` on navy |
| magnet strength | 0.3 (≈1.8px max pull) | JS-driven button pull |

Brand palette: navy `#060B35`, electric `#0023EC`, action `#085CF0`,
mint `#23FBC5`, sky `#B0E9FD`, ice `#E4F7FD`, charcoal `#242424`.

## Hard constraints (carry these into code review)

1. Animate only `transform` and `opacity` (+ masks / pseudo-element opacity).
   Never animate `box-shadow` or geometry properties.
2. Reveals fire once, on first view. Above-the-fold never waits for scroll.
3. `prefers-reduced-motion` disables everything (both stylesheets carry kill
   blocks; the QA attr `data-mo-reduced` mirrors them 1:1).
4. Touch: reveals stay (12px travel), cursor effects degrade to `:active`
   lift + glow.
5. Legal surfaces (disclaimers, FAQ risk copy, filings content) stay still.

## JS public API

`window.PWRLMotion = { init, set, replay, state }`
- `init(opts?)` — idempotent; call after dynamic DOM/route changes
- `set({ speed, stagger, distance, lift, glow, glowRGB, glowMode, magnetMode,
  magnetStrength, heroMode, kenburns, parallax, reduced, touch, enabled })`
- `replay()` — re-runs reveals for everything on screen

## Assets

All imagery in the prototypes was mirrored from the repo's own
`frontend/public/remote-assets/` and `frontend/public/brand|media/` — nothing
new was introduced. Fonts: IvyPresto Headline via the existing Typekit kit
(`use.typekit.net/usg7ynr.css`), Libre Franklin + Inter via Google Fonts
(already configured in `app/layout.tsx`).

## Files in this bundle

- `motion/motion.css` — global system (drop-in)
- `motion/motion-bespoke.css` — per-component signatures (drop-in)
- `motion/pwrl-motion.js` — runtime utility (drop-in)
- `site-reference/pwrl-pages.js` — prototype page behaviors; port `bindTabs`
  tile re-indexing, `bindNews` edge affordance, `bindForms` confirm classes
  into the corresponding client components
- `reference_pages/*.html` — the six annotated prototype pages (read for
  annotations; run them from the original project root if you want them live)
- `Motion Spec.html` — the design contract (self-contained)
- `Enhancement Audit.html` — E1–E14 rationale (self-contained)
