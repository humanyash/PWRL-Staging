"use client";

import React, { useEffect, useMemo, useRef } from "react";

/**
 * AnimatedSphere — the live site's dotted-sphere "dynamic build"
 * (AUDIT.md R10-2), replicated from the live client bundle:
 *
 * Geometry: concentric rings (radius 3·ring) of dots starting at 12
 * o'clock, ⌊2π·ring⌋ dots per ring (min 6), generated until ≥386 dots
 * (11 rings); dot radius shrinks 1.05 → 0.6 outward; viewBox -36…72.
 *
 * rAF phase machine (loop ≈ 200 + 500·rings + 10000 ms):
 *  1. radial-highlight — the TOP dot of each ring turns #0023EB,
 *     one ring per 500ms, center outward;
 *  2. blink — 3×1s: highlighted dots pulse (scale 1 + 0.32·sin) during
 *     the first 500ms of each second;
 *  3. pause — 1s;
 *  4. arc-spread — 2s ease-out-cubic: a 95% concentric arc sweeps around
 *     each highlighted ring (stroke-dasharray, offset C/4 to start at
 *     top) while the dot field fades at opacity 1−3·progress;
 *  5. hold — 1s;
 *  6. dissolve — 1.2s crossfade: arc overlay fades out while the base
 *     dot field fades back in, then the cycle restarts.
 *
 * prefers-reduced-motion renders the static dot field only.
 */

const COLOR_BASE = "#B0E9FE";
const COLOR_HI = "#0023EB";

interface Dot {
  cx: number;
  cy: number;
  ring: number;
  radius: number;
  isTopDot: boolean;
}

function dotRadius(ring: number, ringCount: number): number {
  return (0.7 - ((ring - 1) / Math.max(ringCount - 1, 1)) * 0.3) * 1.5;
}

function buildDots(): { dots: Dot[]; ringCount: number } {
  const TWO_PI = 2 * Math.PI;
  const dots: Dot[] = [];
  let ring = 1;
  while (dots.length < 386) {
    const r = 3 * ring;
    const count = Math.max(Math.floor((TWO_PI * r) / 3), 6);
    for (let i = 0; i < count; i++) {
      const a = -Math.PI / 2 + (TWO_PI * i) / count;
      dots.push({
        cx: Number((r * Math.cos(a)).toFixed(6)),
        cy: Number((r * Math.sin(a)).toFixed(6)),
        ring,
        radius: 0, // filled after ringCount known
        isTopDot: i === 0,
      });
    }
    ring++;
  }
  const ringCount = ring - 1;
  for (const d of dots) d.radius = dotRadius(d.ring, ringCount);
  return { dots, ringCount };
}

interface Phase {
  phase:
    | "radial-highlight"
    | "blink"
    | "pause"
    | "arc-spread"
    | "hold"
    | "dissolve";
  phaseStartTime: number;
  highlightedRingCount: number;
  blinkScale: number;
  arcProgress: number;
  dissolveProgress: number;
  initialized: boolean;
}

const freshPhase = (): Phase => ({
  phase: "radial-highlight",
  phaseStartTime: -1,
  highlightedRingCount: 0,
  blinkScale: 1,
  arcProgress: 0,
  dissolveProgress: 0,
  initialized: false,
});

function smoothstep(t: number): number {
  return t * t * (3 - 2 * t);
}

function step(s: Phase, now: number, rings: number) {
  if (!s.initialized) {
    s.phaseStartTime = now;
    s.initialized = true;
  }
  let t = now - s.phaseStartTime;
  if (t > 200 + 500 * rings + 11200) {
    s.phase = "radial-highlight";
    s.phaseStartTime = now;
    s.highlightedRingCount = 0;
    s.blinkScale = 1;
    s.arcProgress = 0;
    s.dissolveProgress = 0;
    t = 0;
  }
  switch (s.phase) {
    case "radial-highlight": {
      const n = Math.floor(t / 500);
      if (n >= rings) {
        s.highlightedRingCount = rings;
        s.phase = "blink";
        s.phaseStartTime = now;
      } else {
        s.highlightedRingCount = n + 1;
      }
      break;
    }
    case "blink":
      if (Math.floor(t / 1000) >= 3) {
        s.blinkScale = 1;
        s.phase = "pause";
        s.phaseStartTime = now;
      } else {
        const e = t % 1000;
        s.blinkScale = e < 500 ? 1 + 0.32 * Math.sin((e / 500) * Math.PI) : 1;
      }
      break;
    case "pause":
      if (t >= 1000) {
        s.phase = "arc-spread";
        s.phaseStartTime = now;
      }
      break;
    case "arc-spread":
      if (t >= 2000) {
        s.arcProgress = 1;
        s.phase = "hold";
        s.phaseStartTime = now;
      } else {
        s.arcProgress = 1 - Math.pow(1 - t / 2000, 3);
      }
      break;
    case "hold":
      if (t >= 1000) {
        s.phase = "dissolve";
        s.phaseStartTime = now;
        s.dissolveProgress = 0;
      }
      break;
    case "dissolve": {
      const DISSOLVE_MS = 1200;
      if (t >= DISSOLVE_MS) {
        s.phase = "radial-highlight";
        s.phaseStartTime = now;
        s.highlightedRingCount = 0;
        s.blinkScale = 1;
        s.arcProgress = 0;
        s.dissolveProgress = 0;
      } else {
        s.dissolveProgress = smoothstep(t / DISSOLVE_MS);
      }
      break;
    }
  }
}

export function AnimatedSphere({
  className = "mx-auto h-[200px] w-[200px] md:h-[300px] md:w-[300px]",
  revealDelayMs,
}: {
  className?: string;
  /** Kinetic layer: scroll-reveal fade + bloom delay (.sphere-img). */
  revealDelayMs?: number;
}) {
  const svgRef = useRef<SVGSVGElement>(null);
  const baseRef = useRef<SVGGElement>(null);
  const raf = useRef(0);
  const state = useRef<Phase>(freshPhase());
  const { dots, ringCount } = useMemo(buildDots, []);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    state.current = freshPhase();
    const render = () => {
      const svg = svgRef.current;
      const s = state.current;
      if (!svg) return;

      let baseOpacity = 1;
      let overlayOpacity = 0;

      if (s.phase === "arc-spread") {
        baseOpacity = Math.max(0, 1 - 3 * s.arcProgress);
        overlayOpacity = 1;
      } else if (s.phase === "hold") {
        baseOpacity = 0;
        overlayOpacity = 1;
      } else if (s.phase === "dissolve") {
        baseOpacity = s.dissolveProgress;
        overlayOpacity = 1 - s.dissolveProgress;
      }

      baseRef.current?.setAttribute("opacity", String(baseOpacity));

      for (let ring = 1; ring <= ringCount; ring++) {
        const hl = svg.querySelector(`[data-highlight-ring="${ring}"]`);
        if (hl) {
          const lit = ring <= s.highlightedRingCount;
          const r = dotRadius(ring, ringCount);
          let hlOpacity = 0;
          if (lit) {
            if (s.phase === "radial-highlight" || s.phase === "blink" || s.phase === "pause") {
              hlOpacity = 1;
            } else {
              hlOpacity = overlayOpacity;
            }
          }
          hl.setAttribute("opacity", String(hlOpacity));
          hl.setAttribute(
            "r",
            String(s.phase === "blink" && lit ? r * s.blinkScale : r),
          );
        }
        const arc = svg.querySelector(`[data-arc-ring="${ring}"]`);
        if (arc) {
          const showArc =
            (s.phase === "arc-spread" ||
              s.phase === "hold" ||
              s.phase === "dissolve") &&
            s.arcProgress > 0 &&
            ring <= s.highlightedRingCount;
          if (showArc) {
            const c = 2 * Math.PI * (3 * ring);
            const len = 0.95 * c * s.arcProgress;
            arc.setAttribute("opacity", String(overlayOpacity));
            arc.setAttribute("stroke-dasharray", `${len} ${c - len}`);
            arc.setAttribute("stroke-dashoffset", String(c / 4));
          } else {
            arc.setAttribute("opacity", "0");
          }
        }
      }
    };
    const tick = (now: number) => {
      step(state.current, now, ringCount);
      render();
      raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
  }, [ringCount]);

  const topDots = useMemo(
    () =>
      Array.from({ length: ringCount }, (_, i) =>
        dots.find((d) => d.ring === i + 1 && d.isTopDot),
      ).filter(Boolean) as Dot[],
    [dots, ringCount],
  );

  return (
    <svg
      ref={svgRef}
      className={`sphere-img ${className}`}
      viewBox="-36 -36 72 72"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
      {...(revealDelayMs !== undefined
        ? {
            "data-mo": "fade",
            style: { "--mo-d": `${revealDelayMs}ms` } as React.CSSProperties,
          }
        : {})}
    >
      <g ref={baseRef}>
        <circle cx={0} cy={0} r={dotRadius(1, ringCount)} fill={COLOR_BASE} />
        {dots.map((d, i) => (
          <circle key={i} cx={d.cx} cy={d.cy} r={d.radius} fill={COLOR_BASE} />
        ))}
      </g>
      {topDots.map((d) => (
        <circle
          key={`hl-${d.ring}`}
          data-highlight-ring={d.ring}
          cx={d.cx}
          cy={d.cy}
          r={d.radius}
          fill={COLOR_HI}
          opacity={0}
        />
      ))}
      {Array.from({ length: ringCount }, (_, i) => {
        const ring = i + 1;
        return (
          <circle
            key={`arc-${ring}`}
            data-arc-ring={ring}
            cx={0}
            cy={0}
            r={3 * ring}
            fill="none"
            stroke={COLOR_HI}
            strokeWidth={2 * dotRadius(ring, ringCount)}
            strokeDasharray="0 9999"
            strokeLinecap="round"
            opacity={0}
          />
        );
      })}
    </svg>
  );
}

export default AnimatedSphere;
