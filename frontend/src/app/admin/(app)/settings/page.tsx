import { SettingsEditor } from "@/components/admin/SettingsEditor";
import { getAdminSettings } from "@/lib/admin/data";

export const dynamic = "force-dynamic";

const EMPTY = {
  banner: null,
  logo: null,
  nav: [],
  footer_links: [],
  socials: [],
  disclaimers: [],
  legal_text: "",
};

export default async function AdminSettings() {
  const settings = (await getAdminSettings()) ?? EMPTY;
  return <SettingsEditor settings={settings} />;
}
