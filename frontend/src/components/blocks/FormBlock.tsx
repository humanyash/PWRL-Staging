"use client";

import React, { useState } from "react";
import { Section } from "@/components/ui/Section";
import { renderRich } from "@/lib/rich";
import type { FormBlock as FormBlockType, FormField } from "@/types/blocks";

/**
 * FormBlock — the two HubSpot-backed forms, rendered natively and submitted
 * through HubSpot's public Forms API (same portal/lists as live).
 *
 * "inline" (NAV signup band): 32px heading + subtitle + 36px bordered
 * fields with a mint Sign Up (live .hubspot-signup-form).
 *
 * contact (AUDIT.md R8-2/3, live .hubspot-contact-form): ice section
 * py-16 lg:py-30, `flex lg:flex-row gap-10 xl:gap-20` — intro copy left
 * (lg:w-2/6, p2 light, blue underlined links), form right (lg:w-3/5):
 * 2-col grid gap-6, NO visible labels (placeholders in-field), fields
 * `rounded-sm border-charcoal bg-white` with charcoal placeholders;
 * email/company span-2 → lg span-1; textarea span-2 h-[144px] mt-5;
 * submit right-aligned 180×54 #085CF0 bold "Sign Up".
 */

async function submitToHubSpot(
  portalId: string,
  formId: string,
  form: HTMLFormElement,
): Promise<boolean> {
  const data = new FormData(form);
  const fields = Array.from(data.entries())
    .filter(([, v]) => typeof v === "string" && v !== "")
    .map(([name, value]) => ({ name, value: String(value) }));
  try {
    const res = await fetch(
      `https://api.hsforms.com/submissions/v3/integration/submit/${portalId}/${formId}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fields,
          context: {
            pageUri: window.location.href,
            pageName: document.title,
          },
        }),
      },
    );
    return res.ok;
  } catch {
    return false;
  }
}

type SubmitState = "idle" | "submitting" | "done" | "error";

const CONTACT_INPUT =
  "w-full rounded-sm border border-charcoal bg-white px-[8.4px] py-[9.25px] font-[family-name:var(--font-franklin)] text-[15.14px] leading-[18.5px] text-charcoal placeholder:text-charcoal outline-none focus:border-[#085CF0]";

function placeholderFor(field: FormField): string {
  return field.placeholder ?? `${field.label}${field.required ? "*" : ""}`;
}

/** Live .hubspot-contact-form column spans per field. */
function contactSpan(field: FormField): string {
  if (field.type === "textarea") return "col-span-2";
  if (field.type === "email" || field.name === "company")
    return "col-span-2 lg:col-span-1";
  return "col-span-2 sm:col-span-1";
}

function ContactField({ field }: { field: FormField }) {
  if (field.type === "textarea") {
    return (
      <textarea
        name={field.name}
        required={field.required}
        placeholder={placeholderFor(field)}
        aria-label={field.label}
        className={`${CONTACT_INPUT} mt-5 h-[144px] resize-none`}
      />
    );
  }
  if (field.type === "select") {
    return (
      <select
        name={field.name}
        required={field.required}
        aria-label={field.label}
        defaultValue=""
        className={CONTACT_INPUT}
      >
        <option value="" disabled>
          {placeholderFor(field)}
        </option>
        {field.options?.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    );
  }
  return (
    <input
      name={field.name}
      type={field.type}
      required={field.required}
      placeholder={placeholderFor(field)}
      aria-label={field.label}
      className={CONTACT_INPUT}
    />
  );
}

export function FormBlock({ block }: { block: FormBlockType }) {
  const [state, setState] = useState<SubmitState>("idle");
  const submitted = state === "done";
  const dark = block.theme === "dark" || block.theme === "deep";
  const isInline =
    block.variant === "inline" ||
    !block.fields ||
    (block.fields.length === 1 && block.fields[0].type === "email");

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (state === "submitting") return;
    const formEl = e.currentTarget;
    if (block.portalId && block.formId) {
      setState("submitting");
      const ok = await submitToHubSpot(block.portalId, block.formId, formEl);
      setState(ok ? "done" : "error");
      if (ok) formEl.reset();
    } else {
      setState("done");
    }
  };

  const statusMessage = submitted ? (
    <p className="contact-status show mt-4 font-[family-name:var(--font-franklin)] text-sm text-charcoal">
      Thank you — your submission has been received.
    </p>
  ) : state === "error" ? (
    <p className="mt-4 font-[family-name:var(--font-franklin)] text-sm text-red-600">
      Something went wrong submitting the form. Please try again, or email
      Info@PWRL.com.
    </p>
  ) : null;

  /* ------------------------------------------------------------ */
  /* Contact layout (live .hubspot-contact-form)                   */
  /* ------------------------------------------------------------ */
  if (!isInline) {
    return (
      <Section tone="ice" id="form" className="!py-16 lg:!py-[135px]">
        <div className="flex flex-col lg:flex-row lg:gap-10 xl:gap-20">
          <div
            className="pb-20 font-[family-name:var(--font-franklin)] text-[16px] font-light leading-normal text-charcoal lg:w-2/6 lg:text-[20px]"
            data-mo-stagger=""
          >
            {block.body?.map((p, i) => (
              <p
                key={i}
                className="mb-4 last:mb-0 [&_a]:text-[#0023EC]"
                data-mo=""
              >
                {renderRich(p)}
              </p>
            ))}
          </div>

          <div className="lg:w-3/5">
            <form
              className="grid grid-cols-2 gap-6"
              data-mo-stagger=""
              onSubmit={onSubmit}
              data-hubspot-portal={block.portalId}
              data-hubspot-form={block.formId}
            >
              {(block.fields ?? []).map((field) => (
                <div
                  key={field.name}
                  className={`mo-field ${contactSpan(field)}`}
                  data-mo=""
                >
                  <ContactField field={field} />
                </div>
              ))}
              {/* Live: submit left-aligned on mobile, right at md+ (R9b). */}
              <div
                className="col-span-2 flex justify-start md:justify-end"
                data-mo=""
              >
                <button
                  type="submit"
                  disabled={state === "submitting"}
                  className={`contact-submit mo-btn h-[54px] w-[180px] rounded-sm bg-[#085CF0] font-[family-name:var(--font-franklin)] text-[15.14px] font-bold text-white transition disabled:opacity-60 ${submitted ? "mo-confirm" : ""}`}
                >
                  {state === "submitting"
                    ? "Sending…"
                    : submitted
                      ? "Thanks!"
                      : "Sign Up"}
                </button>
              </div>
            </form>
            {statusMessage}
          </div>
        </div>
      </Section>
    );
  }

  /* ------------------------------------------------------------ */
  /* NAV signup band (live .hubspot-signup-form)                   */
  /* ------------------------------------------------------------ */
  return (
    <Section
      tone={block.theme === "deep" ? "deep" : dark ? "navy" : "ice"}
      id="email"
      className="!py-9"
    >
      <div className="flex flex-col items-center gap-9 lg:flex-row lg:justify-center">
        {block.body?.length ? (
          <div className="max-w-80 text-balance text-center font-[family-name:var(--font-franklin)] text-[16px] font-light leading-[1.375] text-white md:text-[20px] lg:max-w-[420px] lg:text-left">
            {block.body.map((p, i) => (
              <p key={i} className="-ml-[30px]" data-mo="" style={{ "--mo-i": i } as React.CSSProperties}>
                {p}
              </p>
            ))}
          </div>
        ) : block.heading ? (
          <div className="max-w-2xl text-center lg:text-left">
            <h2
              className="font-display text-[32px] font-light tracking-tight text-white"
              data-mo=""
            >
              {block.heading}
            </h2>
          </div>
        ) : null}

        {/* Live .hubspot-signup-form: column + centered on mobile with
            260px fields, row with 288px fields at md; 17px gaps (R9b). */}
        <form
          className="flex w-full flex-col items-center justify-center gap-[17px] sm:flex-row lg:w-auto"
          data-mo=""
          style={{ "--mo-i": 2 } as React.CSSProperties}
          onSubmit={onSubmit}
          data-hubspot-portal={block.portalId}
          data-hubspot-form={block.formId}
        >
          {(block.fields ?? []).map((field) => (
            <input
              key={field.name}
              name={field.name}
              type={field.type === "email" ? "email" : "text"}
              required={field.required}
              placeholder={field.placeholder ?? field.label}
              className="h-9 w-[200px] rounded-md border border-white bg-transparent px-[18px] text-[15.75px] text-white placeholder:text-white outline-none focus:border-sky md:h-11"
            />
          ))}
          <button
            type="submit"
            disabled={state === "submitting"}
            className={`mo-btn h-9 shrink-0 rounded-md bg-mint px-6 font-[family-name:var(--font-franklin)] text-[15px] font-bold text-black transition disabled:opacity-60 md:h-11 ${submitted ? "mo-confirm" : ""}`}
          >
            {state === "submitting"
              ? "Sending…"
              : submitted
                ? "Thanks!"
                : "Sign Up"}
          </button>
        </form>
      </div>

      {submitted ? (
        <p className="mx-auto mt-4 max-w-2xl text-center font-[family-name:var(--font-franklin)] text-sm text-sky">
          Thank you — your submission has been received.
        </p>
      ) : state === "error" ? (
        <p className="mx-auto mt-4 max-w-2xl text-center font-[family-name:var(--font-franklin)] text-sm text-red-400">
          Something went wrong submitting the form. Please try again, or email
          Info@PWRL.com.
        </p>
      ) : null}
    </Section>
  );
}

export default FormBlock;
