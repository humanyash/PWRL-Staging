"use client";

import { useEffect, useRef, useState } from "react";
import { moStyle } from "@/lib/motion";

/**
 * DonutChart — interactive port of the live site's CustomPieChart
 * (AUDIT.md R10-1, logic extracted from the live client bundle):
 *  - geometry: innerRadius 92 / outerRadius 145, paddingAngle 2°, NO stroke;
 *    recharts orientation — first slice starts at 3 o'clock and sweeps
 *    counterclockwise; data pre-sorted descending.
 *  - default state: ALL slices carry the inactive gradient — each slice's
 *    color interpolates #76AAF7 → #E4F7FD by its descending-value rank.
 *  - hover (or click/tap toggle): the slice fills #085CF0 and the active
 *    shape renders — name + % centered in the donut hole, an outer ring
 *    arc (outer+6 → outer+10), and a leader line (outer+8 → outer+24,
 *    then 20px horizontal) ending in a 2.5px dot + 13px/600 % label.
 *  - `hideDecimals` (Sectors) rounds the %, Exposure keeps two decimals.
 *  - When `linkTableId` is set, hovering a table row highlights the slice
 *    (and vice versa) via shared React hover state.
 */

const ACTIVE = "#085CF0";
const GRAD_FROM = "#76AAF7";
const GRAD_TO = "#E4F7FD";
const CX = 160;
const CY = 160;
const R_OUT = 145;
const R_IN = 92;
const PAD = 1; // degrees between slices (reduced from 2 to minimise the visible gap between large adjacent slices)
/** Padding around the 320×320 chart so leader-line labels aren't clipped. */
const VB_PAD = 90;
const VB = 320 + VB_PAD * 2;

function lerpHex(a: string, b: string, t: number): string {
  const pa = [1, 3, 5].map((i) => parseInt(a.slice(i, i + 2), 16));
  const pb = [1, 3, 5].map((i) => parseInt(b.slice(i, i + 2), 16));
  return `rgb(${pa.map((v, i) => Math.round(v + (pb[i] - v) * t)).join(", ")})`;
}

/** Recharts angle space: 0° at 3 o'clock, counterclockwise positive. */
const pt = (r: number, deg: number): [number, number] => {
  const rad = (-deg * Math.PI) / 180;
  return [CX + r * Math.cos(rad), CY + r * Math.sin(rad)];
};

function arcPath(rOut: number, rIn: number, a0: number, a1: number): string {
  const [x0, y0] = pt(rOut, a0);
  const [x1, y1] = pt(rOut, a1);
  const [x2, y2] = pt(rIn, a1);
  const [x3, y3] = pt(rIn, a0);
  const large = a1 - a0 > 180 ? 1 : 0;
  return `M${x0},${y0} A${rOut},${rOut} 0 ${large} 0 ${x1},${y1} L${x2},${y2} A${rIn},${rIn} 0 ${large} 1 ${x3},${y3} Z`;
}

const fmt = new Intl.NumberFormat("en-US", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export function DonutChart({
  data,
  hideDecimals = false,
  id,
  linkTableId,
  className = "aspect-square size-full max-h-[520px] max-w-full min-h-[320px] sm:min-h-[400px] md:min-h-[480px]",
}: {
  data: { name: string; value: number }[];
  hideDecimals?: boolean;
  /** Kinetic layer: id for the .mo-donut box (e.g. "exposure-donut"). */
  id?: string;
  /** Kinetic layer E7: table to link for the hover dialogue. */
  linkTableId?: string;
  className?: string;
}) {
  const [hovered, setHovered] = useState<number | null>(null);
  const active = hovered ?? null;
  const svgRef = useRef<SVGSVGElement>(null);

  const pctLabel = (v: number) =>
    hideDecimals ? `${Math.round(v)}%` : `${fmt.format(v)}%`;

  // Table ↔ chart linked hover (shared React state + row wash).
  useEffect(() => {
    if (!linkTableId) return;
    const table = document.getElementById(linkTableId);
    const svg = svgRef.current;
    if (!table || !svg) return;

    const rows = Array.from(table.querySelectorAll<HTMLTableRowElement>("tbody tr"));
    const cleanups: (() => void)[] = [];

    rows.forEach((tr) => {
      const name = tr.getAttribute("data-name");
      const enter = () => {
        const idx = data.findIndex((d) => d.name === name);
        if (idx >= 0) setHovered(idx);
      };
      const leave = () => setHovered(null);
      tr.addEventListener("mouseenter", enter);
      tr.addEventListener("mouseleave", leave);
      cleanups.push(() => {
        tr.removeEventListener("mouseenter", enter);
        tr.removeEventListener("mouseleave", leave);
      });
    });

    return () => cleanups.forEach((fn) => fn());
  }, [linkTableId, data]);

  // Dim non-active slices, highlight row, scroll list to the active company.
  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;
    const activeName = active != null ? data[active]?.name : null;

    svg.classList.toggle("focus", active != null);
    svg.querySelectorAll("path[data-name]").forEach((p) => {
      p.classList.toggle(
        "hot",
        activeName != null && p.getAttribute("data-name") === activeName,
      );
    });

    if (!linkTableId) return;
    const table = document.getElementById(linkTableId);
    if (!table) return;

    table.querySelectorAll("tbody tr").forEach((tr) => {
      tr.classList.toggle(
        "hot",
        activeName != null && tr.getAttribute("data-name") === activeName,
      );
    });

    if (!activeName) return;
    const row = table.querySelector<HTMLTableRowElement>(
      `tbody tr[data-name="${CSS.escape(activeName)}"]`,
    );
    const scroller = table.closest<HTMLElement>(".alloc-scroll");
    if (!row || !scroller) return;

    const rowTop = row.offsetTop;
    const rowBottom = rowTop + row.offsetHeight;
    const viewTop = scroller.scrollTop;
    const viewBottom = viewTop + scroller.clientHeight;
    if (rowTop < viewTop || rowBottom > viewBottom) {
      scroller.scrollTo({
        top: Math.max(0, rowTop - scroller.clientHeight / 2 + row.offsetHeight / 2),
        behavior: "smooth",
      });
    }
  }, [active, data, linkTableId]);

  const total = data.reduce((s, d) => s + d.value, 0);
  const rank = new Map<number, number>();
  data
    .map((d, i) => ({ i, v: d.value }))
    .sort((a, b) => b.v - a.v)
    .forEach(({ i }, r) => rank.set(i, r));
  const inactiveFill = (i: number) =>
    lerpHex(
      GRAD_FROM,
      GRAD_TO,
      data.length <= 1 ? 0 : (rank.get(i) ?? 0) / (data.length - 1),
    );

  let angle = 0;
  const slices = data.map((d, i) => {
    const sweep = (d.value / total) * 360;
    const a0 = angle + PAD / 2;
    const a1 = angle + Math.max(sweep - PAD / 2, PAD / 2 + 0.1);
    const mid = angle + sweep / 2;
    angle += sweep;
    return { d, i, a0, a1, mid };
  });

  const act = active != null ? slices[active] : null;

  return (
    <div className="flex h-full w-full items-center justify-center">
      <div
        id={id}
        className={`mo-donut w-full overflow-visible ${className}`}
        style={moStyle({ "--mo-d": "150ms" })}
      >
        <svg
          ref={svgRef}
          viewBox={`${-VB_PAD} ${-VB_PAD} ${VB} ${VB}`}
          className="h-full w-full overflow-visible"
          onMouseLeave={() => setHovered(null)}
        >
          {slices.map((s) => (
            <path
              key={s.d.name}
              data-name={s.d.name}
              d={arcPath(s.i === active ? R_OUT + 6 : R_OUT, R_IN, s.a0, s.a1)}
              fill={s.i === active ? ACTIVE : inactiveFill(s.i)}
              style={{ cursor: "pointer", transition: "fill 150ms" }}
              onMouseEnter={() => setHovered(s.i)}
            >
              <title>{`${s.d.name}: ${pctLabel(s.d.value)}`}</title>
            </path>
          ))}

          {/* Invisible circle over the donut hole — clears hover when the
              mouse drifts off the ring into the empty center, preventing
              the leader line from sticking when nothing is active. */}
          <circle
            cx={CX}
            cy={CY}
            r={R_IN - 1}
            fill="transparent"
            style={{ cursor: "default" }}
            onMouseEnter={() => setHovered(null)}
          />

          {act ? (
            <g pointerEvents="none">
              <foreignObject
                x={CX - R_IN + 10}
                y={CY - R_IN + 10}
                width={(R_IN - 10) * 2}
                height={(R_IN - 10) * 2}
              >
                <div
                  style={{
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    textAlign: "center",
                    lineHeight: 1.2,
                  }}
                >
                  <span
                    style={{ color: "#111827", fontSize: 16, fontWeight: 600 }}
                  >
                    {act.d.name}
                  </span>
                  <span
                    style={{
                      color: "#6B7280",
                      fontSize: 14,
                      fontWeight: 500,
                      marginTop: 4,
                    }}
                  >
                    {pctLabel(act.d.value)}
                  </span>
                </div>
              </foreignObject>

              <path
                d={arcPath(R_OUT + 10, R_OUT + 6, act.a0, act.a1)}
                fill={ACTIVE}
              />

              {(() => {
                const rad = (-act.mid * Math.PI) / 180;
                const sin = Math.sin(rad);
                const cos = Math.cos(rad);
                const sx = CX + (R_OUT + 8) * cos;
                const sy = CY + (R_OUT + 8) * sin;
                const mx = CX + (R_OUT + 24) * cos;
                const my = CY + (R_OUT + 24) * sin;
                const dir = cos >= 0 ? 1 : -1;
                const ex = mx + dir * 16;
                const labelX = ex + dir * 10;
                const labelAnchor = cos >= 0 ? "start" : "end";
                return (
                  <>
                    <path
                      d={`M${sx},${sy}L${mx},${my}L${ex},${my}`}
                      stroke={ACTIVE}
                      strokeWidth={1.5}
                      fill="none"
                    />
                    <circle cx={ex} cy={my} r={2.5} fill={ACTIVE} />
                    <text
                      x={labelX}
                      y={my}
                      textAnchor={labelAnchor}
                      dominantBaseline="middle"
                      fill="#111827"
                      fontSize={13}
                      fontWeight={600}
                    >
                      {pctLabel(act.d.value)}
                    </text>
                  </>
                );
              })()}
            </g>
          ) : null}
        </svg>
      </div>
    </div>
  );
}

export default DonutChart;
