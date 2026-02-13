"use client";

import { useEffect } from "react";
import { onCLS, onINP, onLCP, onFCP } from "web-vitals";

type Metric = {
  name: string;
  value: number;
  id: string;
  delta: number;
  navigationType: string;
  rating?: string;
};

function sendToAnalytics(metric: Metric) {
  const body = JSON.stringify({
    name: metric.name,
    value: metric.value,
    id: metric.id,
    delta: metric.delta,
    navigationType: metric.navigationType,
    rating: metric.rating,
  });

  if (navigator.sendBeacon) {
    navigator.sendBeacon("/api/web-vitals", body);
  } else {
    fetch("/api/web-vitals", {
      body,
      method: "POST",
      headers: { "Content-Type": "application/json" },
      keepalive: true,
    }).catch(() => {});
  }
}

/**
 * Reports Core Web Vitals (LCP, INP, CLS, FCP) to /api/web-vitals.
 * Add this once in the root layout for site-wide measurement.
 */
export function WebVitalsReporter() {
  useEffect(() => {
    onCLS(sendToAnalytics);
    onINP(sendToAnalytics);
    onLCP(sendToAnalytics);
    onFCP(sendToAnalytics);
  }, []);

  return null;
}
