/** Cache público para APIs de leitura (edge/CDN na Vercel). */
export const PUBLIC_CACHE_60 = {
  "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
} as const;

export const PUBLIC_CACHE_300 = {
  "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
} as const;
