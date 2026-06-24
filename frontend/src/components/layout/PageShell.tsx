import type { ReactNode } from "react";
import { Header } from "./Header";
import { Footer } from "./Footer";
import type { GlobalSettings } from "@/types/blocks";

/** Wraps page content in the global Header + Footer chrome. */
export function PageShell({
  settings,
  children,
}: {
  settings: GlobalSettings;
  children: ReactNode;
}) {
  return (
    <>
      <Header settings={settings} />
      <main className="flex-1">{children}</main>
      <Footer settings={settings} />
    </>
  );
}

export default PageShell;
