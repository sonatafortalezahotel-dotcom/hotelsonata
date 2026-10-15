"use client";

import Script from "next/script";

const ASKSUITE_SRC =
  "https://cdn.asksuite.com/infochat.js?dataConfig=https://control.asksuite.com/api/companies/hotel-sonata-de-iracema";

export function AsksuiteLoader() {
  return (
    <Script
      id="script-infochat"
      src={ASKSUITE_SRC}
      strategy="afterInteractive"
    />
  );
}
