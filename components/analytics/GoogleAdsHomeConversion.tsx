"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { GOOGLE_ADS_CONVERSIONS } from "./google-ads-config";

declare global {
  interface Window {
    __awHomeConversionFired?: boolean;
  }
}

function fireHomeConversion() {
  if (typeof window === "undefined") return false;
  if (typeof window.gtag !== "function") return false;
  if (window.__awHomeConversionFired) return true;

  window.__awHomeConversionFired = true;
  window.gtag("event", "conversion", {
    send_to: GOOGLE_ADS_CONVERSIONS.homePageView.sendTo,
    value: 1.0,
    currency: "BRL",
  });
  return true;
}

/**
 * Garante o disparo da conversão de page view da home
 * (incluindo navegação client-side no App Router).
 */
export function GoogleAdsHomeConversion() {
  const pathname = usePathname();
  const firedRef = useRef(false);

  useEffect(() => {
    const isHome = pathname === "/" || pathname === "";
    if (!isHome) {
      firedRef.current = false;
      return;
    }
    if (firedRef.current) return;

    if (fireHomeConversion()) {
      firedRef.current = true;
      return;
    }

    const timer = window.setInterval(() => {
      if (fireHomeConversion()) {
        firedRef.current = true;
        window.clearInterval(timer);
      }
    }, 200);

    const stop = window.setTimeout(() => window.clearInterval(timer), 10000);
    return () => {
      window.clearInterval(timer);
      window.clearTimeout(stop);
    };
  }, [pathname]);

  if (pathname !== "/" && pathname !== "") {
    return null;
  }

  const { id, label } = GOOGLE_ADS_CONVERSIONS.homePageView;

  return (
    <noscript>
      <img
        height={1}
        width={1}
        style={{ display: "none" }}
        alt=""
        src={`https://www.googleadservices.com/pagead/conversion/${id}/?label=${label}&guid=ON&script=0`}
      />
    </noscript>
  );
}
