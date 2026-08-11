"use client";

import Script from "next/script";
import { useEffect } from "react";

type GoogleAdsConversionProps = {
  /** Formato: AW-XXXXXXXXX/rótulo */
  sendTo: string;
};

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

function fireConversion(sendTo: string) {
  if (typeof window === "undefined") return false;

  window.dataLayer = window.dataLayer || [];
  if (typeof window.gtag !== "function") {
    window.gtag = function gtag(...args: unknown[]) {
      window.dataLayer?.push(args);
    };
  }

  window.gtag("event", "conversion", { send_to: sendTo });
  return true;
}

/**
 * Dispara a conversão do Google Ads na página configurada.
 * Usa Script executável + fallback no client (o script RSC puro não rodava).
 */
export function GoogleAdsConversion({ sendTo }: GoogleAdsConversionProps) {
  useEffect(() => {
    if (fireConversion(sendTo)) return;

    const timer = window.setInterval(() => {
      if (fireConversion(sendTo)) {
        window.clearInterval(timer);
      }
    }, 250);

    const stop = window.setTimeout(() => window.clearInterval(timer), 8000);
    return () => {
      window.clearInterval(timer);
      window.clearTimeout(stop);
    };
  }, [sendTo]);

  return (
    <Script id={`google-ads-conversion-${sendTo.replace(/[^a-zA-Z0-9]/g, "-")}`} strategy="afterInteractive">
      {`
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('event', 'conversion', {'send_to': '${sendTo}'});
      `}
    </Script>
  );
}
