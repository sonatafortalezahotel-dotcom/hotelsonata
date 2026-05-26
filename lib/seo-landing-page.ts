import { cache } from "react";
import { unstable_cache } from "next/cache";
import { db } from "@/lib/db";
import { seoLandingPages } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";

const LOCALES = ["en", "es", "pt"] as const;

export function parseLandingSlug(slugArray: string[]) {
  const firstSegment = slugArray[0];
  const isLocale = LOCALES.includes(firstSegment as (typeof LOCALES)[number]);
  const locale = isLocale ? firstSegment : "pt";
  const actualSlug = isLocale ? slugArray.slice(1).join("/") : slugArray.join("/");
  return { locale, actualSlug, fullSlug: locale !== "pt" ? `${locale}/${actualSlug}` : actualSlug };
}

async function fetchLandingPageRow(actualSlug: string, locale: string) {
  let rows = await db
    .select()
    .from(seoLandingPages)
    .where(
      and(
        eq(seoLandingPages.slug, actualSlug),
        eq(seoLandingPages.locale, locale),
        eq(seoLandingPages.active, true)
      )
    )
    .limit(1);

  if (rows.length === 0 && locale !== "pt") {
    rows = await db
      .select()
      .from(seoLandingPages)
      .where(
        and(
          eq(seoLandingPages.slug, actualSlug),
          eq(seoLandingPages.locale, "pt"),
          eq(seoLandingPages.active, true)
        )
      )
      .limit(1);
  }

  return rows[0] ?? null;
}

/** Dedupe na mesma requisição (metadata + page) e cache ISR entre requisições. */
export const getLandingPageBySlug = cache(async (actualSlug: string, locale: string) =>
  unstable_cache(
    () => fetchLandingPageRow(actualSlug, locale),
    ["seo-landing-page", actualSlug, locale],
    { revalidate: 300, tags: ["seo-landing-pages"] }
  )()
);
