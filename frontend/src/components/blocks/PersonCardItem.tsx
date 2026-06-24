"use client";

import { useEffect, useState } from "react";
import type { PersonCard } from "@/types/blocks";

/**
 * Person card, rebuilt from live /vision (AUDIT.md R4-6).
 *  - Desktop: `button p-2 rounded-3xl` with a 180px
 *    SQUARE rounded-2xl photo; resting white card, hover ice-blue fill
 *    with underlined name (Figma Bio Card).
 *    SQUARE rounded-2xl photo; name Franklin bold 18→24px #0023EC with
 *    first/last name on separate lines (min-h-[2lh]); role 14/18 below.
 *    Clicking opens the bio in a dialog overlay.
 *  - Mobile: ice (#E4F7FD) rounded-3xl card, 4/5 photo, 32px name,
 *    24px role, underlined uppercase "Show bio" expander.
 */

function SplitName({ name }: { name: string }) {
  const i = name.indexOf(" ");
  if (i < 0) return <>{name}</>;
  return (
    <>
      {name.slice(0, i)}
      <br />
      {name.slice(i + 1)}
    </>
  );
}

function Bio({ person }: { person: PersonCard }) {
  if (person.bioFormat === "bullets" && person.bioBullets) {
    return (
      <ul className="list-disc space-y-1.5 pl-5 text-left">
        {person.bioBullets.map((b, i) => (
          <li key={i}>{b}</li>
        ))}
      </ul>
    );
  }
  return (
    <div className="space-y-3 text-left">
      {(person.bio ?? "").split("\n\n").map((para, i) => (
        <p key={i}>{para}</p>
      ))}
    </div>
  );
}

export function PersonCardItem({ person }: { person: PersonCard }) {
  const [open, setOpen] = useState(false); // mobile expander
  const [dialogOpen, setDialogOpen] = useState(false); // desktop dialog mounted
  // Kinetic layer (E6): .open gates the bio-dialog choreography — added a
  // frame after mount so the entrance transition plays, removed ~220ms
  // before unmount so the exit plays.
  const [dialogShown, setDialogShown] = useState(false);
  const hasBio =
    Boolean(person.bio) || (person.bioBullets && person.bioBullets.length > 0);

  useEffect(() => {
    if (!dialogOpen) return;
    // setTimeout, not rAF: rAF freezes in backgrounded tabs and would leave
    // the dialog stuck invisible behind the .open gate.
    const t = setTimeout(() => setDialogShown(true), 20);
    return () => clearTimeout(t);
  }, [dialogOpen]);

  const closeDialog = () => {
    setDialogShown(false);
    setTimeout(() => setDialogOpen(false), 220);
  };

  useEffect(() => {
    if (!dialogOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeDialog();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dialogOpen]);

  const photo = person.image?.src;

  return (
    <>
      {/* Mobile: ice expandable card. */}
      <div className="md:hidden">
        <div className="w-full rounded-3xl bg-[#E4F7FD] p-4 text-center">
          <button
            type="button"
            className="w-full text-center"
            aria-expanded={open}
            onClick={() => hasBio && setOpen((v) => !v)}
          >
            {photo ? (
              <span className="photo-frame mo-photo relative block overflow-hidden rounded-2xl">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={photo}
                  alt={person.name}
                  className="aspect-[4/5] w-full rounded-2xl object-cover"
                />
              </span>
            ) : (
              <div className="aspect-[4/5] w-full rounded-2xl bg-white" />
            )}
            <h3 className="mt-5 min-h-[2lh] font-[family-name:var(--font-franklin)] text-[32px] font-bold leading-[1.1] text-[#0023EC]">
              <SplitName name={person.name} />
            </h3>
            <p className="mt-2 text-2xl text-charcoal">{person.role}</p>
            {hasBio ? (
              <div className="mt-5 flex w-full items-center justify-center gap-2 text-sm uppercase text-black underline">
                {open ? "Hide bio" : "Show bio"}
              </div>
            ) : null}
          </button>
          {open && hasBio ? (
            <div className="mt-4 font-[family-name:var(--font-franklin)] text-sm font-light leading-relaxed text-charcoal">
              <Bio person={person} />
            </div>
          ) : null}
        </div>
      </div>

      {/* Desktop: 180px square card; bio opens as a dialog. */}
      <div className="hidden md:block">
        <button
          type="button"
          className="person-card group w-full rounded-3xl p-2 text-center outline-none"
          aria-haspopup="dialog"
          aria-expanded={dialogOpen}
          onClick={() => hasBio && setDialogOpen(true)}
        >
          {photo ? (
            <span className="photo-frame relative mx-auto block w-full max-w-[180px] overflow-hidden rounded-2xl">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={photo}
                alt={person.name}
                className="aspect-square w-full rounded-2xl object-cover"
              />
            </span>
          ) : (
            <div className="mx-auto aspect-square w-full max-w-[180px] rounded-2xl bg-ice" />
          )}
          <p className="person-card__name mt-5 min-h-[2lh] font-[family-name:var(--font-franklin)] text-[18px] font-bold leading-[1.1] text-[#0023EC] lg:text-[24px]">
            <SplitName name={person.name} />
          </p>
          <p className="mt-[10px] text-center text-[14px] text-charcoal md:text-[18px]">
            {person.role}
          </p>
        </button>

        {dialogOpen ? (
          <div
            role="dialog"
            aria-modal="true"
            aria-label={`${person.name} bio`}
            className={`bio-overlay ${dialogShown ? "open" : ""} fixed inset-0 z-[60] flex items-center justify-center p-6`}
          >
            <div
              className="scrim absolute inset-0 bg-navy/70"
              onClick={closeDialog}
              aria-hidden
            />
            <div className="bio-dialog relative max-h-[80vh] w-full max-w-2xl overflow-y-auto rounded-3xl bg-white p-8 text-charcoal shadow-2xl">
              <button
                type="button"
                onClick={closeDialog}
                aria-label="Close bio"
                className="absolute right-5 top-4 text-2xl leading-none text-charcoal/60 hover:text-charcoal"
              >
                ×
              </button>
              <div className="flex items-center gap-5">
                {photo ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={photo}
                    alt={person.name}
                    className="h-20 w-20 rounded-2xl object-cover"
                  />
                ) : null}
                <div>
                  <p className="font-[family-name:var(--font-franklin)] text-[24px] font-bold leading-tight text-[#0023EC]">
                    {person.name}
                  </p>
                  <p className="mt-1 text-[18px] text-charcoal">
                    {person.role}
                  </p>
                </div>
              </div>
              <div className="mt-6 font-[family-name:var(--font-franklin)] text-[16px] font-light leading-relaxed">
                <Bio person={person} />
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </>
  );
}

export default PersonCardItem;
