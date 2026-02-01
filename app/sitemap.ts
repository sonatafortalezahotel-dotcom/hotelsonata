import { MetadataRoute } from "next";
import { db } from "@/lib/db";
import { seoMetadata, seoLandingPages } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

const SITE_URL = process.env.NEXT_PUBLIC_APP_URL || "https://hotelsonata.com.br";
const locales = ["pt", "en", "es"];

// Páginas estáticas do site
const staticPages = [
  { path: "", priority: 1.0, changefreq: "daily" },
  { path: "/hotel", priority: 0.9, changefreq: "weekly" },
  { path: "/quartos", priority: 0.9, changefreq: "weekly" },
  { path: "/gastronomia", priority: 0.8, changefreq: "weekly" },
  { path: "/lazer", priority: 0.8, changefreq: "weekly" },
  { path: "/eventos", priority: 0.8, changefreq: "weekly" },
  { path: "/esg", priority: 0.7, changefreq: "monthly" },
  { path: "/contato", priority: 0.7, changefreq: "monthly" },
  { path: "/pacotes", priority: 0.9, changefreq: "daily" },
  { path: "/blog", priority: 0.8, changefreq: "daily" },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const urls: MetadataRoute.Sitemap = [];

  // Adiciona páginas estáticas com todas as versões de idioma
  for (const page of staticPages) {
    for (const locale of locales) {
      const path = locale === "pt" ? page.path : `/${locale}${page.path}`;
      const url = `${SITE_URL}${path}`;

      // Busca metadata SEO para determinar lastModified
      let lastModified = new Date();
      try {
        const metadata = await db
          .select()
          .from(seoMetadata)
          .where(eq(seoMetadata.page, page.path === "" ? "home" : page.path.slice(1)))
          .limit(1);

        if (metadata.length > 0 && metadata[0].updatedAt) {
          lastModified = new Date(metadata[0].updatedAt);
        }
      } catch (error) {
        console.error(`Erro ao buscar metadata para ${page.path}:`, error);
      }

      urls.push({
        url,
        lastModified,
        changeFrequency: page.changefreq as
          | "always"
          | "hourly"
          | "daily"
          | "weekly"
          | "monthly"
          | "yearly"
          | "never",
        priority: page.priority,
        alternates: {
          languages: Object.fromEntries(
            locales.map((loc) => [
              loc === "pt" ? "pt-BR" : loc === "en" ? "en-US" : "es-ES",
              loc === "pt" ? `${SITE_URL}${page.path}` : `${SITE_URL}/${loc}${page.path}`,
            ])
          ),
        },
      });
    }
  }

  // Adiciona páginas dinâmicas de quartos (se houver)
  try {
    const { rooms } = await import("@/lib/db/schema");
    const allRooms = await db.select().from(rooms);

    for (const room of allRooms) {
      if (room.code) {
        for (const locale of locales) {
          const path = locale === "pt" ? `/quartos/${room.code}` : `/${locale}/quartos/${room.code}`;
          urls.push({
            url: `${SITE_URL}${path}`,
            lastModified: room.updatedAt ? new Date(room.updatedAt) : new Date(),
            changeFrequency: "weekly",
            priority: 0.8,
            alternates: {
              languages: Object.fromEntries(
                locales.map((loc) => [
                  loc === "pt" ? "pt-BR" : loc === "en" ? "en-US" : "es-ES",
                  loc === "pt"
                    ? `${SITE_URL}/quartos/${room.code}`
                    : `${SITE_URL}/${loc}/quartos/${room.code}`,
                ])
              ),
            },
          });
        }
      }
    }
  } catch (error) {
    console.error("Erro ao buscar quartos para sitemap:", error);
  }

  // Adiciona páginas dinâmicas de pacotes (se houver)
  try {
    const { packages } = await import("@/lib/db/schema");
    const allPackages = await db.select().from(packages);

    for (const pkg of allPackages) {
      if (pkg.id) {
        for (const locale of locales) {
          const path = locale === "pt" ? `/pacotes/${pkg.id}` : `/${locale}/pacotes/${pkg.id}`;
          urls.push({
            url: `${SITE_URL}${path}`,
            lastModified: pkg.updatedAt ? new Date(pkg.updatedAt) : new Date(),
            changeFrequency: "daily",
            priority: 0.9,
            alternates: {
              languages: Object.fromEntries(
                locales.map((loc) => [
                  loc === "pt" ? "pt-BR" : loc === "en" ? "en-US" : "es-ES",
                  loc === "pt"
                    ? `${SITE_URL}/pacotes/${pkg.id}`
                    : `${SITE_URL}/${loc}/pacotes/${pkg.id}`,
                ])
              ),
            },
          });
        }
      }
    }
  } catch (error) {
    console.error("Erro ao buscar pacotes para sitemap:", error);
  }

  // Adiciona landing pages dinâmicas de SEO
  try {
    const allLandingPages = await db
      .select()
      .from(seoLandingPages)
      .where(eq(seoLandingPages.active, true));

    for (const landingPage of allLandingPages) {
      const path =
        landingPage.locale === "pt"
          ? `/${landingPage.slug}`
          : `/${landingPage.locale}/${landingPage.slug}`;

      urls.push({
        url: `${SITE_URL}${path}`,
        lastModified: landingPage.updatedAt
          ? new Date(landingPage.updatedAt)
          : new Date(),
        changeFrequency: (landingPage.changeFrequency ||
          "weekly") as MetadataRoute.Sitemap[number]["changeFrequency"],
        priority: parseFloat(landingPage.priority || "0.7"),
        alternates: {
          languages: Object.fromEntries(
            locales.map((loc) => [
              loc === "pt" ? "pt-BR" : loc === "en" ? "en-US" : "es-ES",
              loc === "pt"
                ? `${SITE_URL}/${landingPage.slug}`
                : `${SITE_URL}/${loc}/${landingPage.slug}`,
            ])
          ),
        },
      });
    }
  } catch (error) {
    console.error("Erro ao buscar landing pages para sitemap:", error);
  }

  // Blog: índice + posts publicados
  try {
    const { blogPosts } = await import("@/lib/db/schema");
    for (const locale of locales) {
      const blogPath = locale === "pt" ? "/blog" : `/${locale}/blog`;
      urls.push({
        url: `${SITE_URL}${blogPath}`,
        lastModified: new Date(),
        changeFrequency: "daily",
        priority: 0.8,
        alternates: {
          languages: Object.fromEntries(
            locales.map((loc) => [
              loc === "pt" ? "pt-BR" : loc === "en" ? "en-US" : "es-ES",
              loc === "pt" ? `${SITE_URL}/blog` : `${SITE_URL}/${loc}/blog`,
            ])
          ),
        },
      });
    }
    const publishedPosts = await db
      .select({ slug: blogPosts.slug, locale: blogPosts.locale, updatedAt: blogPosts.updatedAt })
      .from(blogPosts)
      .where(eq(blogPosts.status, "published"));
    for (const post of publishedPosts) {
      const path =
        post.locale === "pt" ? `/blog/${post.slug}` : `/${post.locale}/blog/${post.slug}`;
      urls.push({
        url: `${SITE_URL}${path}`,
        lastModified: post.updatedAt ? new Date(post.updatedAt) : new Date(),
        changeFrequency: "weekly" as const,
        priority: 0.7,
        alternates: {
          languages: Object.fromEntries(
            locales.map((loc) => [
              loc === "pt" ? "pt-BR" : loc === "en" ? "en-US" : "es-ES",
              loc === "pt"
                ? `${SITE_URL}/blog/${post.slug}`
                : `${SITE_URL}/${loc}/blog/${post.slug}`,
            ])
          ),
        },
      });
    }
  } catch (error) {
    console.error("Erro ao buscar blog para sitemap:", error);
  }

  return urls;
}

