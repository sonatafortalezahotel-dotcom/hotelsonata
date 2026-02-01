import { Metadata } from "next";
import { db } from "@/lib/db";
import { seoMetadata } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";

export interface SEOData {
  title: string;
  description: string;
  keywords?: string;
  ogImage?: string;
  canonicalUrl?: string;
}

const DEFAULT_SITE_NAME = "Hotel Sonata de Iracema";
const DEFAULT_SITE_URL = process.env.NEXT_PUBLIC_APP_URL || "https://hotelsonata.com.br";
const DEFAULT_TWITTER_HANDLE = "@hotelsonata"; // Ajustar conforme necessário

/**
 * Busca metadados SEO do banco de dados
 */
export async function getSEOMetadata(
  page: string,
  locale: string = "pt"
): Promise<SEOData | null> {
  try {
    const result = await db
      .select()
      .from(seoMetadata)
      .where(and(eq(seoMetadata.page, page), eq(seoMetadata.locale, locale)))
      .limit(1);

    if (result.length === 0) {
      return null;
    }

    const data = result[0];
    return {
      title: data.title,
      description: data.description,
      keywords: data.keywords || undefined,
      ogImage: data.ogImage || undefined,
      canonicalUrl: data.canonicalUrl || undefined,
    };
  } catch (error) {
    console.error(`Erro ao buscar SEO metadata para ${page}/${locale}:`, error);
    return null;
  }
}

/**
 * Gera metadata completa para Next.js com Open Graph, Twitter Cards e mais
 */
export function generateMetadata(
  seoData: SEOData,
  options: {
    locale?: string;
    path?: string;
    type?: "website" | "article";
    siteName?: string;
    siteUrl?: string;
    twitterHandle?: string;
    additionalKeywords?: string[];
  } = {}
): Metadata {
  const {
    locale = "pt",
    path = "",
    type = "website",
    siteName = DEFAULT_SITE_NAME,
    siteUrl = DEFAULT_SITE_URL,
    twitterHandle = DEFAULT_TWITTER_HANDLE,
    additionalKeywords = [],
  } = options;

  // URL canônica
  const canonical = seoData.canonicalUrl || `${siteUrl}${path}`;
  
  // Imagem Open Graph (1200x630px recomendado)
  const ogImage = seoData.ogImage || `${siteUrl}/og-image.jpg`;
  const ogImageUrl = ogImage.startsWith("http") ? ogImage : `${siteUrl}${ogImage}`;

  // Keywords combinadas
  const keywords = [
    ...(seoData.keywords ? seoData.keywords.split(",").map(k => k.trim()) : []),
    ...additionalKeywords,
  ].filter(Boolean);

  // Título completo
  const fullTitle = seoData.title.includes(siteName)
    ? seoData.title
    : `${seoData.title} | ${siteName}`;

  // Locale mapping
  const localeMap: Record<string, string> = {
    pt: "pt_BR",
    en: "en_US",
    es: "es_ES",
  };
  const ogLocale = localeMap[locale] || "pt_BR";

  return {
    title: {
      default: fullTitle,
      template: `%s | ${siteName}`,
    },
    description: seoData.description,
    keywords: keywords.length > 0 ? keywords : undefined,
    
    // Open Graph
    openGraph: {
      type,
      locale: ogLocale,
      url: canonical,
      title: fullTitle,
      description: seoData.description,
      siteName,
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: fullTitle,
        },
      ],
    },

    // Twitter Cards
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description: seoData.description,
      images: [ogImageUrl],
      creator: twitterHandle,
      site: twitterHandle,
    },

    // Canonical URL
    alternates: {
      canonical,
    },

    // Robots
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },

    // Metadata adicional
    metadataBase: new URL(siteUrl),
    applicationName: siteName,
    referrer: "origin-when-cross-origin",
    authors: [{ name: siteName }],
    creator: siteName,
    publisher: siteName,
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
  };
}

/**
 * Gera hreflang alternates para internacionalização SEO
 */
export function generateHreflangAlternates(
  path: string,
  siteUrl: string = DEFAULT_SITE_URL
): { languages: Record<string, string> } {
  const locales = ["pt", "en", "es"];
  const languages: Record<string, string> = {};

  locales.forEach((locale) => {
    const localePath = locale === "pt" ? path : `/${locale}${path}`;
    languages[locale] = `${siteUrl}${localePath}`;
  });

  return { languages };
}

/**
 * Gera Structured Data (JSON-LD) para Hotel
 */
export function generateHotelStructuredData(options: {
  name: string;
  description: string;
  url: string;
  image?: string;
  address?: {
    streetAddress: string;
    addressLocality: string;
    addressRegion: string;
    postalCode: string;
    addressCountry: string;
  };
  telephone?: string;
  priceRange?: string;
  rating?: {
    ratingValue: number;
    reviewCount: number;
  };
}): object {
  const {
    name,
    description,
    url,
    image,
    address,
    telephone,
    priceRange,
    rating,
  } = options;

  const structuredData: any = {
    "@context": "https://schema.org",
    "@type": "Hotel",
    name,
    description,
    url,
    image: image || `${url}/og-image.jpg`,
  };

  if (address) {
    structuredData.address = {
      "@type": "PostalAddress",
      streetAddress: address.streetAddress,
      addressLocality: address.addressLocality,
      addressRegion: address.addressRegion,
      postalCode: address.postalCode,
      addressCountry: address.addressCountry,
    };
  }

  if (telephone) {
    structuredData.telephone = telephone;
  }

  if (priceRange) {
    structuredData.priceRange = priceRange;
  }

  if (rating) {
    structuredData.aggregateRating = {
      "@type": "AggregateRating",
      ratingValue: rating.ratingValue,
      reviewCount: rating.reviewCount,
    };
  }

  return structuredData;
}

/**
 * Gera Structured Data (JSON-LD) para LocalBusiness
 */
export function generateLocalBusinessStructuredData(options: {
  name: string;
  description: string;
  url: string;
  image?: string;
  address: {
    streetAddress: string;
    addressLocality: string;
    addressRegion: string;
    postalCode: string;
    addressCountry: string;
  };
  telephone: string;
  openingHours?: string[];
  priceRange?: string;
}): object {
  const {
    name,
    description,
    url,
    image,
    address,
    telephone,
    openingHours,
    priceRange,
  } = options;

  const structuredData: any = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name,
    description,
    url,
    image: image || `${url}/og-image.jpg`,
    address: {
      "@type": "PostalAddress",
      streetAddress: address.streetAddress,
      addressLocality: address.addressLocality,
      addressRegion: address.addressRegion,
      postalCode: address.postalCode,
      addressCountry: address.addressCountry,
    },
    telephone,
  };

  if (openingHours) {
    structuredData.openingHoursSpecification = openingHours.map((hours) => ({
      "@type": "OpeningHoursSpecification",
      dayOfWeek: hours,
    }));
  }

  if (priceRange) {
    structuredData.priceRange = priceRange;
  }

  return structuredData;
}

/**
 * Gera Structured Data (JSON-LD) para BreadcrumbList
 */
export function generateBreadcrumbStructuredData(
  items: Array<{ name: string; url: string }>
): object {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

/**
 * Gera Structured Data (JSON-LD) para BlogPosting (SEO padrão 2025)
 */
export function generateBlogPostingStructuredData(options: {
  headline: string;
  description?: string;
  image?: string;
  datePublished: string; // ISO 8601
  dateModified: string; // ISO 8601
  url: string; // canonical / mainEntityOfPage
  author?: { name: string; url?: string };
  publisher?: { name: string; logo?: string };
  siteUrl?: string;
}): object {
  const siteUrl = options.siteUrl ?? DEFAULT_SITE_URL;
  const publisherName = options.publisher?.name ?? DEFAULT_SITE_NAME;
  const structuredData: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: options.headline,
    ...(options.description && { description: options.description }),
    image: options.image
      ? (options.image.startsWith("http") ? options.image : `${siteUrl}${options.image}`)
      : `${siteUrl}/og-image.jpg`,
    datePublished: options.datePublished,
    dateModified: options.dateModified,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": options.url,
    },
    author: options.author
      ? {
          "@type": "Person",
          name: options.author.name,
          ...(options.author.url && { url: options.author.url }),
        }
      : {
          "@type": "Organization",
          name: publisherName,
        },
    publisher: {
      "@type": "Organization",
      name: publisherName,
      ...(options.publisher?.logo && {
        logo: {
          "@type": "ImageObject",
          url: options.publisher.logo.startsWith("http")
            ? options.publisher.logo
            : `${siteUrl}${options.publisher.logo}`,
        },
      }),
    },
  };
  return structuredData;
}

/**
 * Opções de metadata para artigos (blog post)
 */
export interface ArticleMetadataOptions {
  publishedTime?: string; // ISO 8601
  modifiedTime?: string; // ISO 8601
  authors?: string[];
  section?: string;
  tags?: string[];
}

/**
 * Gera metadata Next.js para artigo (type: "article") com campos Open Graph de artigo
 */
export function generateArticleMetadata(
  seoData: SEOData,
  options: {
    locale?: string;
    path?: string;
    siteName?: string;
    siteUrl?: string;
    twitterHandle?: string;
    additionalKeywords?: string[];
    article?: ArticleMetadataOptions;
  } = {}
): Metadata {
  const base = generateMetadata(seoData, {
    ...options,
    type: "article",
  });

  const article = options.article;
  if (!article) return base;

  return {
    ...base,
    openGraph: {
      ...base.openGraph,
      type: "article",
      ...(article.publishedTime && { publishedTime: article.publishedTime }),
      ...(article.modifiedTime && { modifiedTime: article.modifiedTime }),
      ...(article.authors && article.authors.length > 0 && { authors: article.authors }),
      ...(article.section && { section: article.section }),
      ...(article.tags && article.tags.length > 0 && { tags: article.tags }),
    },
  };
}

