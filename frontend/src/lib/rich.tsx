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
export function renderLines(text: string): ReactNode {
  const lines = text.split("\n");
  if (lines.length === 1) return renderRich(text);
  return lines.map((line, i) => (
    <span key={i}>
      {renderRich(line)}
      {i < lines.length - 1 ? <br /> : null}
    </span>
  ));
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
