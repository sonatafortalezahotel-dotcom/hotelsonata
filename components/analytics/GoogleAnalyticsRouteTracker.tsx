"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";

type GtagParams = Record<string, string | number | boolean | undefined>;

declare global {
  interface Window {
    gtag?: (command: string, targetId: string, params?: GtagParams) => void;
  }
}

export function GoogleAnalyticsRouteTracker({ measurementId }: { measurementId: string }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const isFirst = useRef(true);

  useEffect(() => {
    if (isFirst.current) {
      isFirst.current = false;
      return;
    }

    if (typeof window !== "undefined" && window.gtag) {
      const query = searchParams?.toString();
      const pagePath = query ? `${pathname}?${query}` : pathname;

      window.gtag("config", measurementId, { page_path: pagePath });
    }
  }, [measurementId, pathname, searchParams]);

  return null;
}
