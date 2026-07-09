import type { ReactNode } from "react";

/**
 * Minimal inline-rich renderer for fixture/CMS strings.
 * Live markup carries <b> spans (timeline "$276M", hero body, three bold
 * footer disclaimer paragraphs), <em> spans ("Built for everyone",
 * "Questions."), and inline links ("clicking here" → the SEC prospectus).
 * We store those as **bold**, _italic_ and [text](url) markers so the CMS
 * keeps plain editable strings.
 */
const TOKEN =
  /(\*\*[^*]+\*\*|__[\s\S]+?__|_[^_]+_|\[[^\]]+\]\([^)\s]+\))/g;

/** Split on `\n` for editorial line breaks; each line still supports rich markers. */
export function renderLines(
  text: string,
  { block = false }: { block?: boolean } = {},
): ReactNode {
  const lines = text.split("\n");
  if (lines.length === 1) return renderRich(text);
  if (block) {
    return lines.map((line, i) => (
      <span key={i} className="block">
        {renderRich(line)}
      </span>
    ));
  }
  return lines.map((line, i) => (
    <span key={i}>
      {renderRich(line)}
      {i < lines.length - 1 ? <br /> : null}
    </span>
  ));
}

/** Intro tail h3 — always two lines with a single break after "Nasdaq Listed." */
export function introTailHeadingLines(text: string): string[] {
  const trimmed = text.trim();
  const byNewline = trimmed
    .split(/\n+/)
    .map((line) => line.trim())
    .filter(Boolean);
  if (byNewline.length >= 2) {
    return [byNewline[0], byNewline.slice(1).join(" ")];
  }
  const marker = "Nasdaq Listed.";
  const at = trimmed.indexOf(marker);
  if (at >= 0) {
    const end = at + marker.length;
    return [trimmed.slice(0, end).trim(), trimmed.slice(end).trim()].filter(
      Boolean,
    );
  }
  return [trimmed];
}

export function renderRich(text: string): ReactNode {
  const parts = text.split(TOKEN);
  if (parts.length === 1) return text;
  return parts.map((part, i) => {
    if (part.startsWith("__") && part.endsWith("__") && part.length > 4) {
      return <u key={i}>{renderRich(part.slice(2, -2))}</u>;
    }
    if (part.startsWith("**") && part.endsWith("**")) {
      return <b key={i}>{renderRich(part.slice(2, -2))}</b>;
    }
    if (part.startsWith("_") && part.endsWith("_") && part.length > 2) {
      return <em key={i}>{renderRich(part.slice(1, -1))}</em>;
    }
    const link = part.match(/^\[([^\]]+)\]\(([^)\s]+)\)$/);
    if (link) {
      return (
        <a
          key={i}
          href={link[2]}
          target="_blank"
          rel="noopener noreferrer"
          className="underline"
        >
          {link[1]}
        </a>
      );
    }
    return part;
  });
}

/** FAQ answers from Strapi richtext (HTML) or legacy markdown/plain strings. */
export function renderCmsAnswer(text: string): ReactNode {
  if (text.includes("<")) {
    const safe = text
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
      .replace(/on\w+="[^"]*"/gi, "");
    return (
      <span
        className="[&_a]:underline"
        dangerouslySetInnerHTML={{ __html: safe }}
      />
    );
  }
  return renderRich(text);
}
