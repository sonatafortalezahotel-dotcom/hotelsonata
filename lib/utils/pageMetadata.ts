import { Metadata } from "next";
import { getSEOMetadata, generateMetadata as generateSEOMetadata } from "./seo";

const SITE_URL = process.env.NEXT_PUBLIC_APP_URL || "https://hotelsonata.com.br";

interface PageMetadataOptions {
  page: string;
  locale?: string;
  defaultTitle: string;
  defaultDescription: string;
  defaultKeywords?: string[];
  path?: string;
}

/**
 * Gera metadata para uma página específica
 */
export async function generatePageMetadata(
  options: PageMetadataOptions
): Promise<Metadata> {
  const {
    page,
    locale = "pt",
    defaultTitle,
    defaultDescription,
    defaultKeywords = [],
    path,
  } = options;

  // Busca SEO do banco de dados
  const seoData = await getSEOMetadata(page, locale);

  // Se não encontrar no banco, usa valores padrão
  const finalSEO = seoData || {
    title: defaultTitle,
    description: defaultDescription,
    keywords: defaultKeywords.join(", "),
  };

  const pagePath = path || (locale === "pt" ? `/${page}` : `/${locale}/${page}`);

  return generateSEOMetadata(finalSEO, {
    locale,
    path: pagePath,
    siteUrl: SITE_URL,
    additionalKeywords: defaultKeywords,
  });
}

