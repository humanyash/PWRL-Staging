# Homepage Audit — draft vs. live (from side-by-side PDF captures, 2026-06-10)

> STATUS: ALL ITEMS REMEDIATED & VERIFIED 2026-06-10 (DOM checks + geometry
> probe + full-page render vs. capture). CMS re-ingest for the mint CTA enum
> queued behind the backend redeploy.

Method: full-page captures of both sites compared section by section.
Each item gets fixed → verified → checked off. Done = empty list, not "feels done."

## A. Header / nav — MODERATE
- [x] Live: desktop nav shows 4 items (OUR VISION, THE FUND, HOW TO TRADE,
      INVESTOR RELATIONS) + a **hamburger** at far right; CONTACT lives in the
      hamburger menu. Draft shows CONTACT inline and no hamburger.

## B. "Get the latest." band — MODERATE
- [x] **Sign Up button is MINT** on live (and labeled "Sign Up"); draft has
      blue "Sign up".

## C. Intro section content distribution — MAJOR (regression I introduced)
- [x] Live's gradient "Introducing Powerlaw Corp." section holds ONLY
      paragraphs 1–2 around the "We believe…" statement. Paragraphs 3–6 belong
      to the *next* section (see D). My "restore all 6 paragraphs into the
      intro" yesterday over-stuffed this section — visible in the draft
      capture as paragraphs washing out white-on-white in the gradient tail.
      The earlier 2,143-char DOM measurement was the whole <section>, which
      *contains* the two-column block — both prior readings misattributed it.
- [x] **Mint vertical line divider** between paragraph 1 and the "We believe…"
      statement — missing in draft.

## D. "Private Tech. Nasdaq Listed. Only for everyone." — MAJOR (biggest gap)
- [x] Live: full **two-column layout** on white:
      - LEFT: heading (2 lines) + paragraph 3 ("offers the access…") +
        paragraph 4 ("built to change that…") + **READ OUR PROSPECTUS**
        (blue button, links to the SEC prospectus).
      - RIGHT: **ACCESS** (line-icon in circle + uppercase label) + paragraph 5
        ("Private markets have been institutional-only…"); **WISDOM** (icon +
        label) + paragraph 6 ("The wisdom of venture capital…").
      Draft: only a centered heading + bare icon labels — no paragraphs, no
      prospectus button, wrong layout entirely.

## E. Quote panel — MODERATE
- [x] Live shows an **EXPLORE OUR VISION** mint button under the quote;
      draft has none.
- [x] Draft capture shows a black panel (slideshow's t<1s startup gap or
      print timing); verify a slide is always visible from t=0 (set the first
      slide's initial opacity to 1 until its first cycle).

## F. "A History of Firsts" infographic — MAJOR
- [x] Live renders **years on the beam: 2010, 2016, 2022, 2025, 2026** (white
      serif, sized up for 2026) plus an italic caption "Powerlaw Corp. debuts
      on Nasdaq under ticker: PWRL". Draft has no years/caption.
- [x] Infographic scale/placement: live shows the full funnel beam crossing
      the section mid-band with cards clearly above/below it; draft's graphic
      is oversized/cropped and the "RAISE Global Established" card overlaps
      the dark beam (illegible dark-on-dark).
- [x] Card/beam interleave: live = 3 cards above the beam (one wide right),
      2 below; draft positions need re-measuring against the live capture.

## G. Footer — MODERATE
- [x] Live: nav links in **two uppercase columns** (OUR VISION/THE FUND/HOW TO
      TRADE | INVESTOR RELATIONS/CONTACT); draft has one lowercase row.
- [x] Live: **social icons as glyphs** (square icon row); draft shows text
      labels ("LinkedIn Instagram …").
- [x] Live: "© Powerlaw Corp. All Rights Reserved. | Privacy Policy | Terms &
      Conditions" sits directly under the logo block (top of the legal area);
      draft puts © at the very bottom.

## H. Hero — MINOR
- [x] Live body copy wraps at ~2 lines (wider max-width) vs draft's 3;
      align max-width. (Headline rotator not comparable in static captures —
      fading by design.)

## Notes
- Items C and D interact: fixing the paragraph distribution feeds the
  two-column section its content.
- CMS impact: C/D change the home page's section content → re-ingest after.
- Out of scope for this audit: other pages (user-supplied captures cover the
  homepage only). Same census method should be applied to the other 5 pages
  afterward.

---

# Round 2 — draft2.0 vs. live (2026-06-10)

## R2-1. Gradient section height — MAJOR (user flag)
- [x] Live: the blue zone extends well below paragraph 2 — copy is fully
      legible on blue, TRADE PWRL sits in the blue→white transition, and the
      white tail is generous empty space. Draft2.0: section too short, so the
      75%-white gradient stop lands ON paragraph 2 (washes out white-on-white
      again) and the button floats in white. Fix: substantially more bottom
      padding so content occupies the upper ~70% of the gradient.

## R2-2. Quote panel blue overlay — MODERATE (user flag)
- [x] Live: cityscape variants carry a strong blue/indigo overlay — text pops,
      image reads as brand-blue duotone. Draft2.0: image nearly raw/grayscale,
      white quote text fights busy bright areas. Fix: blue overlay layer
      between slides and text.

## R2-3. Timeline year/caption positioning — MODERATE (user flag)
- [x] 2010 clipped at the left viewport edge (needs inset).
- [x] Years should sit vertically centered in the beam band.
- [x] Caption ("…debuts on Nasdaq under ticker: PWRL") overlaps card text;
      live places it inside the beam, right-of-center above 2026.

## R2-4. Footer logo size — MINOR (user flag)
- [x] Live footer logo is large (~210px wide); draft renders 140px.

## R2-5. Intro paragraph 2 legibility — folds into R2-1 (same root cause).
## R2-6. Quote text/line measure — re-check after overlay (contrast may
      resolve it); live wraps the quote on 3 lines at similar width. — MINOR

---

# Round 3 — Figma frame 1:139 + fresh live-DOM extraction (2026-06-10)

> STATUS: ALL ITEMS REMEDIATED & VERIFIED 2026-06-10 (DOM probes at 1440px:
> colors/sizes/positions all match live values; full-page headless-Chrome
> capture reviewed section by section; CMS re-ingested and bold markers
> verified rendering as <b> with zero stray markers in visible text).

Sources: Figma "Home Email v2" (fileKey qX2ymIBVu3G47vGMWR2rsB) for geometry,
live powerlawfunds.com/pwrl HTML+CSS (fetched today) as ground truth. Where
they conflict, live wins (Figma is a slightly stale comp: 110px hero h1,
navy two-col headings, 100px icons, "Privacy Policy & Disclaimer" — all
superseded by live's 90px / charcoal / 60px / "Privacy | Terms").

NOTE: the live site has shipped new content since our ingest — several items
below are CONTENT drift requiring fixture + CMS re-ingest, not just CSS.

## R3-1. CTA button system — MAJOR (wrong blue, wrong scale everywhere)
- [x] Live `.cta-blue` is **#085CF0** (hardcoded, not in palette) — our blue
      CTAs use electric-blue #0023EC. Fix all blue buttons.
- [x] Live `.common-cta`: franklin extrabold, radius .25rem, py 10px px 24px
      fs 15px/24px; ≥64rem: py 14px px 36px fs 20px. `.cta-compact`:
      py 10px px 32px fs 14px → 18px ≥64rem. `.cta-mint` text is BLACK
      (not navy). No letter-spacing. Port verbatim into CTA component.

## R3-2. Top banner — MAJOR (content + style drift)
- [x] Live: bg **#085CF0**, text-[20px], py-[10px], fixed z-40, content is an
      underlined link "Read Monthly NAV Update" → Yahoo Finance article.
      Fixture + CMS update.

## R3-3. Header — MAJOR
- [x] Live header background is a static gradient
      `from-black via-black/65 via-50% to-black/0` (not transparent→navy on
      scroll); wrapper hides on scroll via translateY.
- [x] Nav links: gap-x-8 lg:gap-x-16, py-3, uppercase, hover = **bold**
      (invisible-bold-span width trick), each item has a **dropdown submenu**
      (rounded-md bg-neutral-900/95 py-4 px-6 text-sm, anchor links:
      Vision→Strategy/Difference/Team/Heritage/Investing/FAQ;
      Fund→Portfolio/Investment Strategy/Investment Process/FAQ;
      Trade→Where & How/CEF Overview; IR→News/Board/SEC Filings/Fund Docs).
- [x] Utility hamburger dropdown holds Contact (matches our approach) —
      align styles with live menu panel.

## R3-4. Hero — MODERATE (content drift + measure)
- [x] Body copy changed: "**18 leading private tech companies. One
      Nasdaq-listed stock. A public venture capital fund built by venture
      capitalists. Only for everyone.**" (bold), container max-w-240
      (=1080px), leading-8, then `rich-cta pt-6` with **VIEW PORTFOLIO**
      cta-blue → /fund. Fixture + CMS.

## R3-5. "Get the latest." band — MINOR
- [x] h5 is 32px; new subtitle "Sign up to receive NAV alerts, fund updates
      and portfolio news." (font-medium, mt-[24px]); form mt-[24px];
      inputs/buttons are 36px tall, rounded-md, border-white,
      white placeholder; section py-9 (40.5px). Fixture + CMS for subtitle.

## R3-6. Gradient intro structure — MODERATE (replaces R2-1 padding hack)
- [x] Live: ONE `bg-blue-white-gradient` section (pt 40/80, pb 40/80)
      containing: centered textbox 1 (h4 + p, gap-y 24/40) → mint divider
      `mt-[40px] w-[3px] h-[80px]` (ours is 1px × 63px) → textbox 2
      (pt 20/40 pb 40/80: h4 "We believe…" + p + TRADE PWRL mint compact) →
      **the two-column section lives INSIDE the gradient section** (left:
      pt 40/80, h3 charcoal 36/55 + p3 paragraphs + READ OUR PROSPECTUS
      cta-blue compact; right: grid gap-[36px], icons **60×60** (mr-[32px]),
      h5 30px ivy black + p3 black, [&_p]:my-[8px], columns
      `md:flex gap-[40px] items-center`). Replace the pb-[260px] hack and
      separate white section with this exact structure.

## R3-7. Quote panel — MODERATE
- [x] Overlay must be `bg-gradient-to-b from-[#0023EC] to-[#000A96]
      opacity-90 mix-blend-hard-light` (z-10 over slides, content z-20) —
      not flat electric-blue/55 multiply.
- [x] Remove the added “ ” quotation marks (live h3 has none); quote is
      text-balance max-w-11/12; CTA gets mt-[46px]; slide order
      variant 1,4,2,5,3,6,8,7.

## R3-8. Timeline — MAJOR (geometry + missing elements + content drift)
- [x] Collage = full-bleed `w-screen overflow-x-auto` wrapper, inner
      `width:max(100vw,1400px)`, grid `230px/400px/230px` (860 total);
      beam image `object-cover` fills the 400px middle row (not natural
      aspect at arbitrary top).
- [x] Cards: EXACT live inline styles — row 1: (6.8%, 31.7%, top 110),
      (38.5%, 31.5%, top 30), (70%, 30%, top 0); row 3: (22.7%, 31.8%,
      top −50), (54.5%, 45.5%, top 0); padding 24px, inner max-w-85;
      titles franklin bold 24px black; bodies 18px light leading-relaxed
      with **bold spans** ($276M, $1.24 Trillion).
- [x] **Connector lines missing entirely**: 3px-wide #B0E9FD verticals at
      each card's left edge (Figma): x 6.8/38.5/70/22.7/54.5%, grid-space
      tops/heights 177/286, 86/377, 59/404, 431/323, 431/335.
- [x] Years: ALL 48px IvyPresto white (no oversized 2026), beam-row
      top ≈417 grid-space; lefts 7.78/23.9/40/55.7/71.4%. Caption = franklin
      **bold italic 18px**, w 245px, at 71.4% / top ≈371 (above 2026).
- [x] Intro paragraph: 24px (p1) font-light leading-snug black max-w-2xl
      mt-7 — ours is 16px charcoal/80. Content drift: "…and **managed** by
      Powerlaw Fund Adviser, LLC… **institutional** private-company
      secondary markets." Fixture + CMS.
- [x] Heading container: max-w-6xl px-4 (not w-[91.667%]).

## R3-9. Footer — MAJOR (layout + assets)
- [x] Logo `w-[170px] md:w-[292px]` (not 210px).
- [x] © line sits under logo `pt-8 text-[14px] font-light text-[#B0E9FD]`
      (desktop); mobile duplicate `text-[10px] mt-10` at bottom of nav col.
- [x] Nav = single grid `grid-cols-[auto_auto] gap-x-10 gap-y-3` font-semibold
      uppercase 18px white, order: Our Vision / Investor Relations / The Fund
      / Contact / How to Trade / [social row] — socials are the 6th cell.
- [x] Social icons: replace glyph approximations with the **6 verbatim inline
      SVGs** extracted from live (18×18; LinkedIn/Instagram/YouTube white
      glyphs; X/SeekingAlpha/StockTwits #B0E9FD rounded squares).
- [x] Disclaimers: `pt-[36px] text-[12px] md:text-[14px] text-[#B0E9FD]`,
      paragraphs mb-3, NO border-t, several paragraphs **bold** — needs
      bold-marker support + fixture/CMS update.

## R3-10. Cross-cutting
- [x] Add **bold-span support** (render `**…**` → <b>) for hero body,
      timeline bodies, footer disclaimers.
- [x] Re-ingest CMS after fixture updates (banner, hero, form subtitle,
      timeline intro/bodies, disclaimers) — CMS-wins merge would otherwise
      keep serving the stale copy.

---

# Round 4 — /vision: Figma frame 3:196 + live-DOM + user PDF (2026-06-10)

> STATUS: ALL ITEMS REMEDIATED & VERIFIED 2026-06-10 (DOM probes at 1440px
> + full-page headless-Chrome capture vs the user's vision.pdf; backend
> schema deployed to Render; CMS re-ingested — anchor-nav/truths/subheading
> confirmed in published API output).

Policy (per user): live content is most recent; structure + nuanced styles
from Figma; conflicts resolve like Round 3 (live classes win where
extractable — Figma is again stale in places: blue-ellipse hero comp,
"TRADE PWRL" label, #B0E9FD FAQ borders, 26px value labels, "Get Updates").

## R4-1. Hero — MINOR
- [x] Live hero overlay div is EMPTY (no scrim) — our build layers
      bg-navy/45–55 over the (already-treated) image/video. Remove scrims
      site-wide (Hero component).

## R4-2. Anchor sub-nav — MAJOR (missing entirely)
- [x] Live: `nav bg-[#E4F7FD]` under the hero, `ul flex gap-x-16
      justify-center py-3 uppercase`, hover-semibold span trick, anchors
      STRATEGY/DIFFERENCE/TEAM/HERITAGE/INVESTING/FAQ. New CMS section
      (sections.anchor-nav) + component + fixture.

## R4-3. "Two truths" section — MAJOR (wrong layout)
- [x] Current build renders one RichText stack. Live: heading block
      (h3 55px blue-400, mb-40, md:max-w-65%) + two-col items-center
      (gap-40): LEFT = numbered rows (60×60 number images mr-16/32,
      h4 42px ivy black, p 20px light black my-8, rows gap-36); RIGHT =
      dotted-sphere SVG + caption (Franklin BOLD p2, centered,
      max-w-220/320, mt-24, <sup>1</sup>); footnote row mt-40 (14px
      #757575, "1. Source" underlined → NYU power-law paper). New
      sections.truths component; extract the sphere SVG verbatim from live.

## R4-4. Philosophy panel — MODERATE
- [x] Live panel = the quote-slideshow treatment: rounded-xl p-8
      md:aspect-3/1 with the 8 crossfading variants + blue hard-light
      gradient overlay; content lg:max-w-4/5, h2 64px leading-[1.2],
      p Franklin font-medium 16/20. Ours is a flat black panel. Add
      backgroundSlides + overlay + aspect.

## R4-5. Values grid ("One ticker…") — MAJOR
- [x] Section is WHITE on live (ours ice), pt/pb 20/40, heading mb-40:
      h3 36/55 charcoal with ITALIC "Built for everyone" (<em>).
- [x] Items have NO card chrome: icon 60×60 mb-24, label Franklin LIGHT
      24/30 uppercase black, body 14/18 light leading-[1.2] black my-8;
      grid gap-36 md:grid-cols-3; center on mobile, left on md.

## R4-6. Team grid — MAJOR
- [x] Live desktop: `grid-cols-[repeat(auto-fit,180px)] gap-[16px]`
      centered; cards = button p-2 rounded-3xl hover:bg-[#E4F7FD]; photo
      180px SQUARE rounded-2xl; name Franklin bold 18→24px #0023EC,
      FIRST/LAST NAME ON SEPARATE LINES, min-h-[2lh]; role 14/18 below
      (mt-10px); bio opens as dialog. Mobile: ice rounded-3xl card, 4/5
      photo, name 32px, role 24px, "Show bio" uppercase underline expander.
      Ours: generic 3-col 4/5-photo grid with inline expander — rework.

## R4-7. "Our Heritage" stats — MODERATE
- [x] Missing the h5 subheading "More than 875 secondary transactions
      across 16 years of private technology investing." (ivy 24/30 white)
      — add subheading field (schema + fixture + CMS).
- [x] Layout is two-col items-center (gap-40): left = subheading + single
      paragraph (p2 light, gap-y 24/40); right = stats grid
      `repeat(auto-fit,240px)` gap-32: value ivy 64 #B0E9FD leading-none,
      label Franklin 18 light white UPPERCASE mt-16. Footnote mt-40 LEFT,
      14px white. Ours: stacked heading+intro w/ centered 4-col dl — rework.

## R4-8. Investing CTA band — MODERATE
- [x] Missing the TRADE PWRL NOW button (live: cta-blue cta-compact →
      /trade). Fixture + compact render.
- [x] Live rhythm: py-60/80, content gap-y 24/40, p max-w-160 (720px)
      14/18 leading-[1.2].

## R4-9. FAQ — MODERATE
- [x] Heading carries ITALIC "Questions." (<em>); intro p2 with underlined
      mailto link.
- [x] Layout: flex lg:row gap-x-20 — left lg:w-190 (flex-shrinks to ~455px),
      right w-full pt-8 lg:pt-0; ours is a single column.
- [x] Rows: border-y-2 #aaa (border-gray-200) — first row open by default
      with max-height/opacity transition; question Franklin light 18→24;
      answer 14/18 light; "key risks" answer links "prospectus" to SEC.
- [x] Render answers/intro through renderRich (links); add _italic_
      support to renderRich for the heading em spans.

## R4-10. Cross-cutting
- [x] Backend: new components sections.anchor-nav + sections.truths
      (+ truth-item), stats-block.subheading; register in page dynamic
      zone; redeploy; re-ingest vision page + FAQ.

---

# Round 5 — /fund: Figma frame 3:539 + live-DOM + user PDF (2026-06-10)

Figma stale spots (live wins): "Performance" section with X.X% placeholders
(not on live — omitted), 50%-alpha panel bg (live solid #E4F7FD), Figma NAV
$604.2M/$13.97 (live $662.0M/$15.31), alphabetical holdings (live sorted
desc + "Other Net Assets"), 5-item anchor band incl. "performance" (live 4).

> STATUS: ALL ITEMS REMEDIATED & VERIFIED 2026-06-10 (DOM probes at 1440px
> + full-page headless-Chrome capture vs the user's fund.pdf; backend schema
> (shared.key-value, stock-info rows, portfolio panel) deployed to Render;
> CMS re-ingested and confirmed in published API output).

## R5-1. Hero — MODERATE
- [x] Live: TWO h1 lines — "Listed Private Technology." + ITALIC "Built for
      everyone." (hero-wysiwyg <em>). Ours renders the subheading as a small
      display line. Render hero subheading at h1 scale through renderRich
      (_italic_ marker); same pattern serves /trade's two-line hero.

## R5-2. Anchor sub-nav — MAJOR (missing)
- [x] Portfolio / Investment Strategy / Investment Process / FAQ →
      #portfolio #investment_strategy #investment_process #faq.

## R5-3. Portfolio intro + Exposure/Sectors tables + donuts — MAJOR
- [x] Intro = centered textbox section (id=portfolio, pt-40/80 pb-20/40):
      h2 blue-400 40/64 + p2 charcoal, gap-y 24/40.
- [x] Exposure/Sectors = `section-spacing` blocks, container max-w-4xl,
      grid md:grid-cols-2 gap-10 (Sectors mirrored via order classes):
      h3 mb-4; scrollable table `max-h-[300px] md:max-h-[340px]` with sky
      custom scrollbar; sticky "Allocation*" header (12px uppercase
      tracking-[0.2em] semibold, border-b #B0E9FD, bg-white); rows
      border-t #B0E9FD, td py-3 pr-8, text-base charcoal; footnote 14px
      #757575 with "For the detailed Portfolio Schedule, click here."
      (ctfassets PDF link).
- [x] DONUT CHARTS (live = client recharts): SVG donut — data sorted desc,
      largest slice #085CF0, remaining slices interpolate #76AAF7→#E4F7FD,
      paddingAngle 2°, white separators, outer R 80%, container h-80
      sm:h-88 max-w-md.

## R5-4. "How the portfolio gets built." panel — MODERATE
- [x] Live: section-spacing py-15/22; panel bg #E4F7FD with border-t-2
      #085CF0, p-48, grid md:grid-cols-2 gap 24/40: h4 ivy 32/48 black +
      p3 black light. Ours renders centered prose — add RichText "panel"
      tone.

## R5-5. Stock Info — MAJOR (wrong implementation)
- [x] Live is a STATIC two-column grid (max-w-4xl, h2, gap-x-5 gap-y-16px
      mt-10): rows `border-t #085CF0 pt-16px flex justify-between` with
      <strong> label + value (Ticker PWRL / Listing Venue Nasdaq / NAV
      $662.0M / NAV Per Share $15.31 / Adviser / Fee 2.5%); notes mt-24px
      14px #757575. Ours renders an InvestingChannel widget placeholder —
      replace with CMS-editable rows (schema: heading + key-value rows +
      notes; widgetId optional).

## R5-6. Investment Strategy — MAJOR (missing animated wheel)
- [x] Live: ice band py-15/18 px-2, grid md:grid-cols-[8fr_12fr]
      items-center; RIGHT text (.p2 [&_p]:my-4 font-light, h2 pb-1);
      LEFT = ANIMATED SECTOR WHEEL: 330×360, #0023EC ring r=155
      stroke-3, 6 orbiting icon discs (head/dna/window/money_chip/
      shield/rocket SVGs, ice discs ~70-77px) spinning 20s linear with
      counter-spinning icons; center label "INVESTMENT SECTORS" Franklin
      18/24 #0023EC tracking-[0.05em] max-w-50.

## R5-7. Investment Process — MAJOR (wrong structure + content drift)
- [x] Live: white py-15/18, grid md:grid-cols-[10fr_10fr] items-center;
      LEFT h2 + THREE PLAIN PARAGRAPHS (our build invented titled steps —
      replace with live copy verbatim); RIGHT (md:ml-12 md:self-start
      md:mt-20): caption 24px blue-400 light tracking-[0.1em] centered
      max-w-120 with SEMIBOLD spans + <sup>1</sup>, then the dotted-sphere
      SVG (same asset as /vision, 200/300px).

## R5-8. NAV form + FAQ — VERIFY ONLY
- [x] Form band #00158D deep ✓ (fixture already deep); FAQ identical to
      /vision Round 4 component. Verify rendering on /fund.

## R5-9. Cross-cutting
- [x] Backend: shared.key-value + stock-info {heading, rows, notes,
      widgetId optional}; redeploy; re-ingest.

---

# Round 6 — /trade: Figma frame 4:1472 + live-DOM (2026-06-10)

Note: the user-supplied "how to.pdf" turned out to be the /investor-relations
capture (saved for Round 7); visual reference for this round is a fresh
headless-Chrome capture of live /trade. Figma stale spots (live wins):
3-item anchor band incl. "Education Hub" (live has 2), platform names at
26px in a 380px flex-wrap (live: p1 18/24 in a 3-col grid).

> STATUS: ALL ITEMS REMEDIATED & VERIFIED 2026-06-10 (DOM probes incl.
> interactive tab switching; full-page capture vs fresh live /trade
> reference; backend schema deployed; CMS re-ingested — 16 platform items,
> 4 iconed steps, 2 sideItems confirmed in published output).

## R6-1. Hero — VERIFY
- [x] Two h1 lines (no italic) — already supported post-R5; confirm wrap and
      asset (how-to-trade_compressed.png).

## R6-2. Anchor sub-nav — MAJOR (missing)
- [x] Where & How / CEF Overview → #where-how #cef-overview.

## R6-3. "How to Invest in PWRL" steps — MAJOR
- [x] Live: section id=where-how pt/pb 40/80; heading block mb-40 LEFT
      (h4 32/48 charcoal + p2 16/20); grid gap-36 md:grid-cols-4; each step:
      numbered-circle image 60×60 mb-24 ("1 Blue"…"4 Blue" — downloaded),
      BOLD p3 title + p3 light body ([&_p]:my-8), left-aligned.
      Ours: text-only steps without icons — rework ProcessSteps.

## R6-4. Brokerage platforms — MAJOR (tabs missing)
- [x] Live: section-spacing pb-16; centered title block mb-8 (h4 + p);
      TABBED panel rounded-2xl: active tab `font-bold bg-[#E4F7FD]
      rounded-tl-2xl`, inactive `border-t-2 border-r-2 border-[#E4F7FD]
      rounded-tr-2xl`, both `w-full uppercase py-3 px-4 p1`; content
      bg-[#E4F7FD] py-4, grid gap-3 sm:2 lg:3 cols; items = links
      `flex gap-3 rounded-xl px-4 py-3` with 40px logo + `font-bold p1`
      label + "→".
- [x] TWO groups: Self Directed (Schwab, Fidelity, Public, Chase, Robinhood,
      Vanguard, E-Trade, SoFi, WellsTrade) and Financial Advisor Managed
      (Schwab, Merril Lynch, Stifel, Commonwealth, Morgan Stanley, Fidelity,
      Wells Fargo — extracted from the RSC payload; logos downloaded).
      New CMS section sections.platform-tabs. Ours: flat secondary pills.

## R6-5. CEF gradient section — MODERATE
- [x] Live: bg-blue-mint-gradient two-col (`md:flex gap-40 [&>*]:flex-1
      items-start`, both columns pt/pb 40/80): LEFT h4 white + p2 white
      (gap-y 24/40); RIGHT grid gap-36 of two `border-l-2 border-white
      pl-16` items — h5 ivy 24/30 white + p2 white my-8
      (Exchange-Listed Trading / Managed Portfolio). Ours: single-column
      prose — add sideItems to the gradient RichText.

## R6-6. Form band — VERIFY
- [x] #00158D deep, no FAQ on this page.

## R6-7. Cross-cutting
- [x] Backend: sections.platform-tabs (+ platform-item w/ group enum),
      rich-text.sideItems (shared.key-value); register; redeploy; re-ingest.

---

# Round 7 — /investor-relations: Figma 4:1083 + live-DOM + user PDF (2026-06-10)

Figma stale spots (live wins): Events section + 5-item anchor band (live has
4, no Events), press-logo news cards w/ Aug 2025 dates (live: PWRL-branded
thumbs, Jun 2026), short board names ("Ben Black"/"Mike Dinsdale" — live uses
full names), 5 fund documents (live has 9).

> STATUS: ALL ITEMS REMEDIATED & VERIFIED 2026-06-10 (DOM probes: 8-card
> 396px snap carousel w/ thumbnails, working filing filters + title-cased
> EDGAR descriptions w/ form-name map, 180px board cards + dialog, fund-docs
> panel w/ 9 CMS-stored rows; full-page capture vs the user's IR PDF.
> Note: carousel arrow smooth-scroll is frozen only in the backgrounded
> preview tab — verified handler + scrollability directly).

## R7-1. Hero (compact) — MINOR
- [x] Live: `min-h-[300px] md:min-h-[415px] pt-37 pb-24 lg:pt-50 lg:pb-[83px]`
      — our compact uses pt-[140px]/pb-[40px] on mobile; align to 166.5/108px.

## R7-2. Anchor sub-nav — MAJOR (missing)
- [x] News / Board of Directors / SEC Filings / Fund Documents →
      #news #directors #sec-filings #fund-documents.

## R7-3. News carousel — MAJOR
- [x] Live: py-[100px]; heading row flex justify-between items-end (h4 +
      scroll arrows); cards in a `snap-x snap-mandatory overflow-x-auto
      no-scrollbar mt-6 gap-6` strip: article `flex-none w-[280px]
      md:w-[396px]`, rounded-lg, aspect-video image, ice body p-16 gap-2,
      date 12px #0023EC, title 18px semibold franklin line-clamp-3.
      Ours: static bordered grid without images — rework + add the 6
      downloaded thumbnails + client scroll arrows; make news items
      CMS-editable (new sections.news-item component).

## R7-4. Board of Directors — MODERATE
- [x] Live uses the same card system as /vision team (h4 centered,
      `repeat(auto-fit,180px)` ul, my-9, WHITE band). Ours wraps an ice
      Section with a 3-col grid — align with TeamGrid.

## R7-5. SEC Filings — MAJOR
- [x] Live: navy `pt-12 lg:pt-24 pb-[20px]`; h4 mb-32; WORKING filters
      (`Select Year:` / `Filing Type:` labels text-xs md:text-sm semibold;
      selects bg-white border-charcoal rounded px-2 py-1 navy text);
      table (Figma): header row bg-[#E4F7FD] px-24 py-8 semibold 14px
      (Date 112px | Filing Type 112px | Filing Description flex |
      Download / View); rows bg-white border-b #B0E9FD px-24 py-16 gap-36
      14px; 24px PDF icon links the document. Ours: static selects +
      generic table — rework as a client FilingsTable with real
      year/form-type filtering over the EDGAR feed.

## R7-6. Fund Documents — MODERATE
- [x] Live: navy py-18; h4 mb-10; WHITE panel with 8px ice top strip;
      `ul divide-y divide-[#B0E9FD]`; rows `flex justify-between px-6 py-4
      sm:px-25` text-sm; "View PDF" underline + 24px PDF icon (inline svg,
      recolorable). Ours: rounded generic panel — align.

## R7-7. No form band / no FAQ on IR — VERIFY.

## R7-8. Cross-cutting
- [x] Backend: sections.news-item (+ items on news-list) so press items are
      CMS-editable; redeploy; re-ingest.

---

# Round 8 — /contact: Figma 4:943 + live-DOM + user PDF (2026-06-10)

Figma stale spots (live wins): "contact Elle Black" media line (live: 
"contact us"), optional Company Name (live capture shows required *),
visible reCAPTCHA widget (live renders the badge via the HubSpot embed —
our public-API form has no captcha; flagged on the punch list).

> STATUS: ALL ITEMS REMEDIATED & VERIFIED 2026-06-10 (DOM probes: 2-col
> gap-27 grid, charcoal-bordered 15.14px placeholder fields, 7-option
> select, 144px span-2 textarea, right-aligned 180×54 #085CF0 Sign Up;
> staging markers incl. the CMS-driven mailto link confirmed post-ISR).
> ALL SIX PAGES (Rounds 3–8) NOW AUDITED AND CONVERGED.

## R8-1. Hero (compact) — VERIFY
- [x] Same treatment as IR (gradient bg, "Get in touch", pt-37/pb-24 →
      lg pt-50/pb-83) — verify post-R7 paddings.

## R8-2. Contact section layout — MAJOR
- [x] Live: ice section `py-16 lg:py-30`; `flex flex-col lg:flex-row
      lg:gap-10 xl:gap-20`: LEFT `pb-20 lg:w-2/6` p2 light leading-normal
      with blue underlined mailto; RIGHT `lg:w-3/5` form. Ours: centered
      single-column — rework.

## R8-3. Form treatment — MAJOR
- [x] Live (.hubspot-contact-form CSS): grid 2 cols gap-6 (27px);
      NO visible labels — placeholders in-field; inputs/select/textarea
      `rounded-sm border border-charcoal bg-white` charcoal placeholder,
      ~15.1px; first/last 1 col; email/company span-2 → lg span-1;
      select 1 col; message span-2, textarea h-[144px] mt-5;
      submit row span-2 `flex justify-end`; button 180×54 rounded-sm
      bg #085CF0 white BOLD "Sign Up" (hover brightness-90).
- [x] Fixture: Company Name required (live shows *), select placeholder
      "I am... (select one)*", media line as markdown mailto link.

## R8-4. No anchor band / NAV signup / FAQ on contact — VERIFY.

---

# Round 9 — Mobile sweep, all 6 pages @390px (2026-06-10)

Sources: live mobile captures (390px headless) + DOM probes; live JS bundle
for client-only surfaces (mobile menu); Figma mobile frames (section 5:2614)
referenced as overview — per-frame metadata times out, live wins anyway.

> STATUS: ALL ITEMS REMEDIATED & VERIFIED 2026-06-10 (390px DOM probes:
> timeline collage scrolls horizontally w/ years visible; mobile menu
> charcoal panel — slide-in, accordion w/ 6 sub-links, utility Contact,
> Escape-close all verified interactively; root 16px/h1 55px; page heights
> within 2-6% of live with structure aligned in fraction strips).

## R9-1. Home timeline mobile — MAJOR
- [x] Live renders ONE collage at every width — the min-1400px grid simply
      scrolls horizontally on mobile (overflow-x-auto). Our build swapped in
      a custom stacked list below md. Remove the stack; always render the
      collage.

## R9-2. Mobile menu — MAJOR (spec extracted from live bundle)
- [x] Full-screen overlay `fixed inset-0 z-[9999]` (visibility transition);
      panel `absolute inset-0 overflow-y-auto max-h-svh flex flex-col
      justify-between gap-12 bg-charcoal px-4 pb-12 pt-6` sliding from top
      (-translate-y-full → 0, 300ms ease-out); close X (h-6 w-6) top-right
      in a sticky row; Escape closes.
- [x] Nav `px-12`, ul `border-t border-white/15`, items `border-b`:
      with sub-items = `flex items-center gap-4 py-4` + link `flex-1
      text-2xl font-bold uppercase` + rotating h-4 chevron toggle, submenu
      `overflow-hidden text-sm normal-case transition-[max-height,opacity]`
      → `flex flex-col gap-1.5 pb-4` of `text-base` links; without
      sub-items = `flex justify-between py-4 text-base font-semibold
      uppercase` + chevron-right.
- [x] Utility links bottom: `space-y-3 text-base px-12`,
      `block text-white/80 hover:text-white text-lg`.
      Ours: simple navy dropdown — replace.

## R9-3. Page height parity @390px — VERIFY
- [x] DOM totals vs live pixel heights within tolerance after R9-1:
      home +182, vision +487 (4%), fund +548 (6%), trade +153, IR +92,
      contact +142. Visual fraction-aligned strips confirm section-for-
      section structure (tables+donuts stack, team ice cards, heritage
      stats, steps, tabs, CEF, forms, FAQ).

## R9-4. Mobile type spot-checks — VERIFY
- [x] Hero h1 55px @390; root font 16px; anchor bands hidden on mobile
      (live `hidden md:block`); footer mobile © 10px below nav column.

---

# Round 9b — Figma mobile frames cross-check (2026-06-10)

> STATUS: COMPLETE & VERIFIED. Per-frame review of the six mobile viewports
> (home 5:2712, vision 5:2880, fund 5:3026 via screenshot, trade 5:3247,
> IR 5:3419, contact 5:3390) against the build, live ruling on conflicts.

Figma-only content NOT on live (skipped per user rule — live is current):
- "Education Hub" section (watch/listen/read chips + content cards) on
  home and trade frames; "Events" section + 5-item anchor on IR;
  "Performance" placeholders on fund; "Get Updates" placement near footer
  on home (live keeps the band directly after the hero); stale copy
  (Elle Black, Info@TradePowerlaw.com, "Governance Documents",
  $170B market stat, 2×2 heritage stats — live renders 1-col on mobile).

Confirmed-by-Figma (already matching): horizontal-scroll mobile timeline,
stacked value items with centered icons, Bio Card MOBILE stacks,
horizontally-scrollable filings table, single-column platform tabs.

Fixes found and applied:
- [x] NAV signup form: live centers FIXED-width fields (260px mobile /
      288px md, 17px gaps, column→row) — ours stretched flex-1 fields.
      Verified: 260px centered column @390.
- [x] Contact submit: left-aligned on mobile, right-aligned at md+
      (live's justify-end is media-queried). Verified @390.

---

# Round 10 — /fund interactive charts + sphere build (user request, 2026-06-10)

Specs extracted from the live client bundle (dd2658925b44f4ac.js):

## R10-1. Donut charts (Exposure/Sectors) — interactive
- [x] Default state: ALL slices gradient (#76AAF7→#E4F7FD by desc rank) —
      no active slice (our static build wrongly pre-colored the largest
      #085CF0). Geometry: inner 92 / outer 145, paddingAngle 2, NO stroke,
      recharts orientation (start 3 o'clock, counterclockwise).
- [x] Hover (or tap-toggle): slice → #085CF0 + active shape: name (16/600
      #111827) + % (14/500 #6B7280) centered in the donut hole
      (foreignObject within innerRadius−10); outer ring arc (outer+6 →
      outer+10) in slice color; leader line midAngle outer+8→outer+24 then
      ±20px horizontal with 2.5px dot and 13/600 % label; sectors round
      the % (hideDecimals), exposure keeps decimals.

## R10-2. Dotted-sphere "dynamic build" (fund process + vision truths)
- [x] Live = client component, not a static SVG: 11 rings (radius 3·ring,
      ⌊2π·ring⌋ dots ≥386 total, dot r from 1.05 shrinking to 0.6), colors
      #B0E9FE base / #0023EB highlight. rAF phase machine (~15.7s loop):
      radial-highlight (top dot per ring lights blue, 500ms/ring) → blink
      (3×1s pulses, scale 1+0.32·sin) → pause 1s → arc-spread (2s
      ease-out-cubic: 95% concentric arcs sweep from top, dasharray, while
      dots fade at 1−3·progress) → hold 1s → loop. Reduced-motion: static.

## R10-3. Timeline year/caption styles (live-JS truth, supersedes Figma 48px)
- [x] Years: 32px (2026: 40px), font-ivy, letter-spacing .02em, top 55%,
      left = connector x + 24px. Caption: text-sm semibold italic
      text-white/90, top 42%, max-width 340.

---

# Round 11 — Kinetic layer (design handoff 06.11.26, user request)

Integrated `design_handoff_kinetic_layer/` per its README. Committed config:
Standard intensity, Lumen cursor glow (#085CF0), magnetic pull 0.3 + sheen
buttons, per-line hero rise, Ken Burns + parallax on.

- [x] Drop-ins: `motion.css` + `motion-bespoke.css` imported from
      globals.css (after the tailwind import); `pwrl-motion.js` served from
      /public and loaded afterInteractive. Pre-states gate on
      html[data-mo-on] — SSR/no-JS/crawlers see the resting state.
- [x] Next adapter (README "Next.js-specific notes"): pwrl-motion.js patched
      so re-init after soft navigations is listener-safe (on()/offAll(),
      wheel/scrollspy/gateLoops guards) and skips its full-page link
      interception under html[data-mo-router]; MotionRouter client component
      drives the veil on Link clicks + PWRLMotion.init() on pathname change.
- [x] Annotations per the component map: Header (site-header, mo-dropdown),
      Hero (data-mo-hero, mo-settle/mo-parallax, mo-mask/mo-line static,
      mo-arrive rotator), Intro (divider-mint draw, mo-phrase manifesto E2,
      intro-items), PullQuote (mo-kenwrap, mo-phrase E3), Timeline (tl-card/
      tl-line/tl-year, beam-sweep E1), Truths (truth-row, sphere bloom,
      97% countup E5), ValueProps/ProcessSteps (intro-item, steps-line E10),
      Team/Board/PersonCard (mo-card/mo-photo, bio-overlay choreography E6),
      StatsBlock (mo-stat, countups), Portfolio (alloc-table rows E8,
      ice-panel wipe, mo-donut + linkDonut dialogue E7), SectorWheel
      (wheel-stage, JS velocity spin), StockInfo (rule wipes, countups),
      PlatformTabs (mo-card tiles, bindTabs re-index), RichText CEF (E11),
      NewsList (bindNews edge fade + nudge E12), DocumentList (doc-row,
      pdf slide; FilingsTable wrapper fade ONLY), FormBlock (mo-field,
      mo-confirm E13), AnchorNav (nav-swap + scrollspy E14), Footer mo-link.
- [x] Legal surfaces untouched: FAQ answers, filings rows, disclaimers.
- [x] Reduced-motion: both stylesheets' kill blocks active; AnimatedSphere
      already had its static fallback.
- [x] Verified: reveals/staggers on all 6 pages, donut↔table dialogue both
      directions, tab re-index cascade, bio dialog open/close choreography,
      news edge-fade, soft-nav veil + re-init (no duplicate spies/veils),
      phrase-split spacing, resting layout unchanged, prod build clean.
