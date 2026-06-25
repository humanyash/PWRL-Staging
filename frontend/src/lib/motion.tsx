import type { CSSProperties, ReactNode } from "react";

/**
 * Kinetic-layer helpers (design handoff 06.11.26).
 *
 * `phrases` — splits CMS copy into `.mo-phrase` spans (E2/E3 manifesto /
 * pull-quote treatments): each phrase rises with `--mo-i` stagger once the
 * parent [data-mo] enters. The prototype hardcodes editorial split points;
 * with CMS-driven text we split into n near-equal word groups.
 *
 * `countup` — wraps the first numeric token (e.g. "97%", "$1.36B") in a
 * `data-countup` span so pwrl-motion.js counts it up on reveal (E5/E8).
 */

export function moStyle(vars: Record<string, string | number>): CSSProperties {
  return vars as CSSProperties;
}

export function phrases(text: string, n: number): ReactNode {
  const words = text.split(/\s+/).filter(Boolean);
  if (words.length < n * 2) return text;
  const per = Math.ceil(words.length / n);
  const chunks: string[] = [];
  for (let i = 0; i < words.length; i += per) {
    chunks.push(words.slice(i, i + per).join(" "));
  }
  // The space lives BETWEEN the spans: .mo-phrase is inline-block, which
  // would strip a trailing space inside the span and weld words together.
  return chunks.map((chunk, i) => (
    <span key={i}>
      <span className="mo-phrase" style={moStyle({ "--mo-i": i })}>
        {chunk}
      </span>
      {i < chunks.length - 1 ? " " : ""}
    </span>
  ));
}

export function countup(text: string): ReactNode {
  const m = text.match(/^([\s\S]*?)(\$?\d[\d,]*(?:\.\d+)?%?)([\s\S]*)$/);
  if (!m) return text;
  return (
    <>
      {m[1]}
      <span data-countup="">{m[2]}</span>
      {m[3]}
    </>
  );
}
