"use client";

import { useEffect, useRef, useState } from "react";

/**
 * InvestingChannel stock widget loader. The live site preloads
 * `https://u5.investingchannel.com/static/uat.js` and the widget unit is
 * keyed to the client's InvestingChannel account.
 *
 * This component injects the same script and renders the mount container.
 * `widgetId` parameterizes the unit (from Strapi / fixtures); until the
 * client's IC unit snippet is confirmed, a quiet fallback note shows if the
 * widget doesn't paint within a few seconds.
 */
export function InvestingChannelWidget({ widgetId }: { widgetId?: string }) {
  const mountRef = useRef<HTMLDivElement>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const id = "ic-uat-script";
    if (!document.getElementById(id)) {
      const s = document.createElement("script");
      s.id = id;
      s.src = "https://u5.investingchannel.com/static/uat.js";
      s.async = true;
      s.onerror = () => setFailed(true);
      document.head.appendChild(s);
    }
    // If nothing mounts after 6s, show the fallback note.
    const t = setTimeout(() => {
      if (mountRef.current && mountRef.current.childElementCount === 0) {
        setFailed(true);
      }
    }, 6000);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="mt-8 min-h-48">
      <div
        ref={mountRef}
        data-ic-widget={widgetId ?? "investingchannel"}
        className="min-h-48"
      />
      {failed ? (
        <p className="mt-2 font-[family-name:var(--font-franklin)] text-sm font-light text-charcoal/50">
          Live stock data is temporarily unavailable. View PWRL on{" "}
          <a
            href="https://www.nasdaq.com/market-activity/stocks/pwrl"
            target="_blank"
            rel="noopener noreferrer"
            className="text-electric-blue hover:underline"
          >
            Nasdaq
          </a>
          .
        </p>
      ) : null}
    </div>
  );
}

export default InvestingChannelWidget;
