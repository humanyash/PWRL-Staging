"use client";

export function SaveBar({
  onSave,
  pending,
  status,
  extra,
}: {
  onSave: () => void;
  pending: boolean;
  status: { kind: "ok" | "error"; message: string } | null;
  extra?: React.ReactNode;
}) {
  return (
    <div className="sticky bottom-0 z-10 -mx-8 mt-10 flex items-center justify-between border-t border-[#1e1e22] bg-[#0b0b0d]/95 px-8 py-4 backdrop-blur">
      <div className="text-sm">
        {status ? (
          <span
            className={
              status.kind === "ok" ? "text-emerald-400" : "text-red-400"
            }
          >
            {status.message}
          </span>
        ) : (
          <span className="text-[#6f6f78]">Changes save immediately.</span>
        )}
      </div>
      <div className="flex items-center gap-3">
        {extra}
        <button
          type="button"
          onClick={onSave}
          disabled={pending}
          className="rounded-md bg-white px-5 py-2 text-sm font-semibold text-black transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          {pending ? "Saving…" : "Save"}
        </button>
      </div>
    </div>
  );
}
