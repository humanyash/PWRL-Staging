/**
 * SectorWheel — the animated "INVESTMENT SECTORS" orbit graphic on live
 * /fund (AUDIT.md R5-6), reproduced from the live inline markup:
 *  - 330×360 stage; #0023EC ring (r=155, stroke 3) centred at 165,180;
 *  - six ice discs carrying sector icon SVGs, positioned on the ring at
 *    live's exact coordinates; the whole assembly spins 20s linear while
 *    each icon counter-spins to stay upright (keyframes in globals.css);
 *  - centre label Franklin 18→24px #0023EC tracking-[0.05em].
 * Icon assets downloaded verbatim to /remote-assets/sector-wheel/.
 */

const ICONS: {
  src: string;
  alt: string;
  x: number;
  y: number;
  disc: number;
  w: number;
  h: number;
}[] = [
  { src: "head", alt: "AI", x: 165, y: 25, disc: 76, w: 51, h: 56 },
  { src: "dna", alt: "Biotech", x: 299.23, y: 102.5, disc: 77, w: 57, h: 57 },
  {
    src: "window",
    alt: "Software",
    x: 299.23,
    y: 257.5,
    disc: 69,
    w: 49,
    h: 43,
  },
  { src: "money_chip", alt: "Fintech", x: 165, y: 335, disc: 70, w: 50, h: 48 },
  {
    src: "shield",
    alt: "Cybersecurity",
    x: 30.77,
    y: 257.5,
    disc: 70,
    w: 44,
    h: 50,
  },
  {
    src: "rocket",
    alt: "Aerospace",
    x: 30.77,
    y: 102.5,
    disc: 76,
    w: 50,
    h: 56,
  },
];

export function SectorWheel({
  background = "#E4F7FD",
}: {
  background?: string;
}) {
  return (
    <div className="flex w-full justify-center">
      {/* Kinetic layer: .wheel-stage/.mo-wheel — ring draw + disc cascade on
          reveal; pwrl-motion.js takes over the spin via .mo-wheel-js (the
          inline CSS animation stays as the no-JS fallback). */}
      <div
        className="wheel-stage mo-wheel"
        data-mo="fade"
        style={{
          width: 330,
          height: 360,
          position: "relative",
          backgroundColor: background,
        }}
      >
        <div
          className="wheel-orbit"
          style={{
            position: "absolute",
            inset: 0,
            transformOrigin: "165px 180px",
            animation: "sector-wheel-spin 20s linear infinite",
          }}
        >
          <svg
            width="330"
            height="360"
            style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
          >
            <circle
              cx="165"
              cy="180"
              r="155"
              fill="none"
              stroke="#0023EC"
              strokeWidth="3"
            />
          </svg>
          {ICONS.map((icon) => (
            <div
              key={icon.src}
              className="wheel-disc"
              style={{
                position: "absolute",
                left: icon.x,
                top: icon.y,
                width: icon.disc,
                height: icon.disc,
                marginLeft: -icon.disc / 2,
                marginTop: -icon.disc / 2,
                borderRadius: "50%",
                backgroundColor: background,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <div
                className="wheel-icon-inner"
                style={{
                  animation: "sector-wheel-counter-spin 20s linear infinite",
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`/remote-assets/sector-wheel/${icon.src}.svg`}
                  width={icon.w}
                  height={icon.h}
                  alt={icon.alt}
                />
              </div>
            </div>
          ))}
        </div>
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <span className="max-w-50 px-4 text-center font-[family-name:var(--font-franklin)] text-lg font-normal uppercase leading-6 tracking-[0.05em] text-[#0023EC] md:text-[24px]">
            INVESTMENT SECTORS
          </span>
        </div>
      </div>
    </div>
  );
}

export default SectorWheel;
