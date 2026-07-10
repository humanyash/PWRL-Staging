"use client";

import { useState, useTransition } from "react";
import { FieldControl, FieldLabel, ImageField } from "@/components/admin/fields";
import { SaveBar } from "@/components/admin/SaveBar";
import { saveSettings } from "@/app/admin/actions";
import type { AdminSettingsRow } from "@/lib/admin/data";

const inputCls =
  "w-full rounded-md border border-[#26262b] bg-[#0f0f12] px-3 py-2 text-sm text-white outline-none focus:border-[#4a4a55]";

function Card({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-6 rounded-xl border border-[#1e1e22] bg-[#111114] p-6">
      <h2 className="mb-4 text-sm font-semibold text-white">{title}</h2>
      {children}
    </div>
  );
}

export function SettingsEditor({ settings }: { settings: AdminSettingsRow }) {
  const [banner, setBanner] = useState(settings.banner ?? { text: "", href: "", enabled: false });
  const [logo, setLogo] = useState(settings.logo ?? null);
  const [nav, setNav] = useState<unknown[]>(settings.nav ?? []);
  const [footerLinks, setFooterLinks] = useState<unknown[]>(settings.footer_links ?? []);
  const [socials, setSocials] = useState<unknown[]>(settings.socials ?? []);
  const [disclaimers, setDisclaimers] = useState<string[]>(settings.disclaimers ?? []);
  const [legalText, setLegalText] = useState(settings.legal_text ?? "");
  const [pending, start] = useTransition();
  const [status, setStatus] = useState<
    { kind: "ok" | "error"; message: string } | null
  >(null);

  function save() {
    setStatus(null);
    start(async () => {
      const res = await saveSettings({
        banner: banner.text ? banner : null,
        logo,
        nav,
        footer_links: footerLinks,
        socials,
        disclaimers,
        legal_text: legalText || null,
      });
      setStatus(
        res.ok
          ? { kind: "ok", message: "Saved — live on the site." }
          : { kind: "error", message: res.error },
      );
    });
  }

  return (
    <div>
      <h1
        className="mb-8 text-2xl text-white"
        style={{ fontFamily: "var(--font-display)" }}
      >
        Settings
      </h1>

      <Card title="Announcement banner">
        <label className="mb-4 inline-flex cursor-pointer items-center gap-2 text-sm text-white">
          <input
            type="checkbox"
            checked={banner.enabled ?? false}
            onChange={(e) => setBanner({ ...banner, enabled: e.target.checked })}
          />
          Show banner
        </label>
        <div className="flex flex-col gap-4">
          <div>
            <FieldLabel>Text</FieldLabel>
            <textarea
              className={`${inputCls} min-h-[64px] resize-y`}
              value={banner.text ?? ""}
              onChange={(e) => setBanner({ ...banner, text: e.target.value })}
            />
          </div>
          <div>
            <FieldLabel>Link (optional)</FieldLabel>
            <input
              className={inputCls}
              value={banner.href ?? ""}
              onChange={(e) => setBanner({ ...banner, href: e.target.value })}
            />
          </div>
        </div>
      </Card>

      <Card title="Logo">
        <ImageField value={logo} onChange={(v) => setLogo(v)} />
      </Card>

      <Card title="Navigation">
        <FieldControl fieldKey="nav" value={nav} onChange={(v) => setNav(v as unknown[])} />
      </Card>

      <Card title="Footer links">
        <FieldControl
          fieldKey="footerLinks"
          value={footerLinks}
          onChange={(v) => setFooterLinks(v as unknown[])}
        />
      </Card>

      <Card title="Social links">
        <FieldControl
          fieldKey="socials"
          value={socials}
          onChange={(v) => setSocials(v as unknown[])}
        />
      </Card>

      <Card title="Disclaimers">
        <FieldControl
          fieldKey="disclaimers"
          value={disclaimers}
          onChange={(v) => setDisclaimers(v as string[])}
        />
      </Card>

      <Card title="Copyright / legal line">
        <input
          className={inputCls}
          value={legalText}
          onChange={(e) => setLegalText(e.target.value)}
        />
      </Card>

      <SaveBar onSave={save} pending={pending} status={status} />
    </div>
  );
}
