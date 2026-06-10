"use client";

import Script from "next/script";
import { useEffect, useState } from "react";

const ASKSUITE_SRC =
  "https://cdn.asksuite.com/infochat.js?dataConfig=https://control.asksuite.com/api/companies/hotel-sonata-de-iracema";

const DESKTOP_MEDIA_QUERY = "(min-width: 1024px)";

export function AsksuiteLoader() {
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(DESKTOP_MEDIA_QUERY);
    const syncViewport = () => setIsDesktop(media.matches);

    syncViewport();
    media.addEventListener("change", syncViewport);

    return () => media.removeEventListener("change", syncViewport);
  }, []);

  if (!isDesktop) {
    return null;
  }

  return (
    <Script
      id="script-infochat"
      src={ASKSUITE_SRC}
      strategy="afterInteractive"
    />
  );
}
