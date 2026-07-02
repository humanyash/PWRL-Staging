/**
 * PWRL design tokens — extracted from the live site's saved HTML
 * (`_inventory/html/*.html`) by mining inline Tailwind arbitrary classes
 * (`bg-[#085CF0]`, `text-[#0023EC]`, `bg-[#E4F7FD]`, `bg-[#060B35]`, …) and
 * the custom `text-charcoal` theme color.
 *
 * Frequency of each hex in the saved markup is noted to justify the role
 * each color plays. These are the source of truth; the Tailwind `@theme`
 * block in `globals.css` mirrors the key ones so they're usable as utility
 * classes (e.g. `bg-navy`, `text-charcoal`).
 */

export const colors = {
  // Brand blues
  brandBlue: "#085CF0", // primary CTA / link blue
  electricBlue: "#0023EB", // saturated accent (also seen as #0023EC)
  electricBlueAlt: "#0023EC",
  deepBlue: "#00158D", // dark-blue panels (bg-[#00158D])
  periwinkle: "#5D75FF", // secondary accent (168 occurrences)
  linkBlue: "#76AAF7",

  // Navy — dark section background (bg-[#060B35], 41 occurrences)
  navy: "#060B35",

  // Sky / ice — the signature light blues
  sky: "#B0E9FE", // most-used accent (820 occurrences); on-navy text + fills
  skyAlt: "#B0E9FD", // near-duplicate variant the CMS emits
  ice: "#E4F7FD", // light section background (bg-[#E4F7FD], 50 occurrences)

  // Neutrals
  charcoal: "#171717", // custom Tailwind `text-charcoal` (104 occurrences) — primary body text
  gray: "#757575", // muted text (text-[#757575])
  white: "#FFFFFF",
  black: "#000000",
} as const;

/**
 * Semantic aliases — what each color is *for*, so components read intent.
 */
export const semantic = {
  text: colors.charcoal,
  textMuted: colors.gray,
  textInverse: colors.white,
  link: colors.brandBlue,
  bgPage: colors.white,
  bgIce: colors.ice, // light-blue section
  bgNavy: colors.navy, // dark section
  accentSky: colors.sky,
  accentBlue: colors.electricBlue,
} as const;

/**
 * Radii — from `rounded-*` usage in the markup (2xl, 3xl, xl, full common).
 */
export const radii = {
  md: "0.375rem", // rounded-md
  lg: "0.5rem", // rounded-lg
  xl: "0.75rem", // rounded-xl
  "2xl": "1rem", // rounded-2xl (34 uses)
  "3xl": "1.5rem", // rounded-3xl (22 uses)
  full: "9999px",
} as const;

/**
 * Font-size scale — from arbitrary `text-[Npx]` usage in the markup.
 * 64px = hero display, 32px = section heads, 18px = lead, 14/12/10 = UI/labels.
 */
export const fontSizes = {
  display: "4rem", // 64px (text-[64px])
  h2: "2rem", // 32px (text-[32px])
  h3: "1.5rem", // 24px
  lead: "1.25rem", // 20px
  body: "1.125rem", // 18px (text-[18px])
  ui: "0.875rem", // 14px (text-[14px], most common UI size)
  small: "0.75rem", // 12px (text-[12px])
  micro: "0.625rem", // 10px (text-[10px], eyebrow/labels)
} as const;

/**
 * Spacing scale (rem) — standard 4px-base scale the live Tailwind build uses.
 */
export const spacing = {
  xs: "0.5rem",
  sm: "1rem",
  md: "1.5rem",
  lg: "2rem",
  xl: "3rem",
  "2xl": "4rem",
  "3xl": "6rem",
  section: "5rem", // typical vertical section padding
} as const;

export const fonts = {
  /** Body / UI — Libre Franklin (var set in layout.tsx). */
  body: "var(--font-franklin-sans)",
  /** Display — Adobe Typekit's ivypresto-headline (loaded via <link> in layout.tsx). */
  display: "\"ivypresto-headline\"",
} as const;

export const tokens = {
  colors,
  semantic,
  radii,
  fontSizes,
  spacing,
  fonts,
} as const;

export default tokens;
