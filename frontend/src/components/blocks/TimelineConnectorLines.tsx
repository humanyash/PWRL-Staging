"use client";

import { useLayoutEffect, useState } from "react";
import { moStyle } from "@/lib/motion";

/** Fallback geometry at the 1400px design width before client measurement. */
const FALLBACK_LINES = [
  { left: "6.8%", top: 140, height: 278 },
  { left: "38.5%", top: 60, height: 332 },
  { left: "70%", top: 30, height: 306 },
  { left: "22.7%", top: 488, height: 276 },
  { left: "calc(54.5% - 2px)", top: 525, height: 295 },
] as const;

const CONNECTORS = [
  { left: "6.8%", xPct: 0.068, text: "One", direction: "up" as const },
  { left: "38.5%", xPct: 0.385, text: "Scaling", direction: "up" as const },
  { left: "70%", xPct: 0.7, text: "Expansive", direction: "up" as const },
  {
    left: "22.7%",
    xPct: 0.227,
    text: "venture talent",
    direction: "down" as const,
  },
  {
    left: "calc(54.5% - 2px)",
    xPct: 0.545,
    text: "public market",
    direction: "down" as const,
  },
];

type LineStyle = { left: string; top: number; height: number };

function isDarkBlue(r: number, g: number, b: number, a: number) {
  return a > 30 && b > 100 && r < 80 && g < 100 && b > r + 50;
}

function sampleDarkBlueBand(
  img: HTMLImageElement,
  imgRect: DOMRect,
  xPct: number,
): { top: number; bottom: number } | null {
  if (!img.complete || !img.naturalWidth) return null;

  const cw = imgRect.width;
  const ch = imgRect.height;
  const scale = Math.max(cw / img.naturalWidth, ch / img.naturalHeight);
  const rw = img.naturalWidth * scale;
  const rh = img.naturalHeight * scale;
  const offX = (cw - rw) / 2;
  const offY = (ch - rh) / 2;

  const canvas = document.createElement("canvas");
  canvas.width = Math.ceil(cw);
  canvas.height = Math.ceil(ch);
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  ctx.drawImage(img, offX, offY, rw, rh);

  const x = Math.min(Math.max(Math.round(xPct * cw), 0), canvas.width - 1);
  let top: number | null = null;
  let bottom: number | null = null;

  for (let y = 0; y < canvas.height; y++) {
    const [r, g, b, a] = ctx.getImageData(x, y, 1, 1).data;
    if (isDarkBlue(r, g, b, a)) {
      if (top === null) top = y;
      bottom = y;
    }
  }

  if (top === null || bottom === null) return null;

  const offset = imgRect.top;
  return { top: top + offset, bottom: bottom + offset };
}

function findTextTop(
  section: HTMLElement,
  search: string,
): number | null {
  const walker = document.createTreeWalker(section, NodeFilter.SHOW_TEXT);
  let node: Node | null;

  while ((node = walker.nextNode())) {
    const text = node.textContent;
    if (!text?.includes(search)) continue;

    const range = document.createRange();
    const idx = text.indexOf(search);
    range.setStart(node, idx);
    range.setEnd(node, idx + search.length);
    return range.getBoundingClientRect().top;
  }

  return null;
}

function measureLines(): LineStyle[] | null {
  const section = document.getElementById("history");
  const grid = section?.querySelector("[data-timeline-grid]");
  const img = section?.querySelector(
    "[data-timeline-beam]",
  ) as HTMLImageElement | null;

  if (!section || !grid || !img) return null;

  const gridRect = grid.getBoundingClientRect();
  const imgRect = img.getBoundingClientRect();

  const lines: LineStyle[] = [];

  for (const connector of CONNECTORS) {
    const band = sampleDarkBlueBand(img, imgRect, connector.xPct);
    const textTop = findTextTop(section, connector.text);
    if (!band || textTop === null) return null;

    const textGrid = textTop - gridRect.top;
    const bandTopGrid = band.top - gridRect.top;
    const bandBottomGrid = band.bottom - gridRect.top;

    if (connector.direction === "up") {
      const height = Math.round(bandTopGrid - textGrid);
      if (height <= 0) return null;
      lines.push({
        left: connector.left,
        top: Math.round(textGrid),
        height,
      });
    } else {
      const height = Math.round(textGrid - bandBottomGrid);
      if (height <= 0) return null;
      lines.push({
        left: connector.left,
        top: Math.round(bandBottomGrid),
        height,
      });
    }
  }

  return lines;
}

export function TimelineConnectorLines() {
  const [lines, setLines] = useState<LineStyle[]>([...FALLBACK_LINES]);

  useLayoutEffect(() => {
    const section = document.getElementById("history");
    const gridWrap = section?.querySelector("[data-timeline-grid]")
      ?.parentElement;
    const img = section?.querySelector(
      "[data-timeline-beam]",
    ) as HTMLImageElement | null;

    const update = () => {
      const measured = measureLines();
      if (measured) setLines(measured);
    };

    update();

    const ro = gridWrap ? new ResizeObserver(update) : null;
    if (gridWrap && ro) ro.observe(gridWrap);
    img?.addEventListener("load", update);
    window.addEventListener("resize", update);

    return () => {
      ro?.disconnect();
      img?.removeEventListener("load", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  return (
    <>
      {lines.map((line, i) => (
        <span
          key={i}
          className="tl-line absolute w-[3px] bg-[#B0E9FD]"
          data-mo="draw"
          style={{
            left: line.left,
            top: line.top,
            height: line.height,
            ...moStyle({ "--mo-i": i, "--mo-d": "200ms" }),
          }}
        />
      ))}
    </>
  );
}
