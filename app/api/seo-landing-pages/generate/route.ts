import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { seoLandingPages } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { generateSlug, generateSlugCombinations, capitalizeKeywords } from "@/lib/utils/slug";

/**
 * API para gerar landing pages automaticamente baseadas em combinações de palavras-chave
 * 
 * Exemplo de uso:
 * POST /api/seo-landing-pages/generate
 * {
 *   "keywords": ["hotel", "fortaleza", "vista mar", "praia de iracema"],
 *   "locale": "pt",
 *   "template": "rooms" // ou "packages", "general"
 * }
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { keywords, locale = "pt", template = "general" } = body;

    if (!keywords || !Array.isArray(keywords) || keywords.length === 0) {
      return NextResponse.json(
        { error: "Keywords deve ser um array não vazio" },
        { status: 400 }
      );
    }

    // Gerar slugs de todas as combinações
    const slugs = generateSlugCombinations(keywords, 4); // Máximo 4 palavras por slug

    console.log(`[${locale}] Geradas ${slugs.length} combinações de slugs`);

    // Buscar slugs existentes de forma otimizada
    const existingPages = await db
      .select({ slug: seoLandingPages.slug })
      .from(seoLandingPages)
      .where(eq(seoLandingPages.locale, locale));

    // Usar Set para busca O(1) ao invés de O(n) com includes
    const existingSlugsSet = new Set(existingPages.map((p) => p.slug));
    console.log(`[${locale}] Encontradas ${existingSlugsSet.size} páginas existentes`);

    // Filtrar slugs que não existem
    const newSlugs = slugs.filter((slug) => !existingSlugsSet.has(slug));
    console.log(`[${locale}] ${newSlugs.length} slugs novos para criar`);

    if (newSlugs.length === 0) {
      return NextResponse.json({
        message: "Todas as combinações já existem",
        generated: 0,
        total: slugs.length,
      });
    }

    // Buscar uma imagem padrão da galeria para usar nas landing pages
    let defaultImage: string | null = null;
    try {
      const { gallery } = await import("@/lib/db/schema");
      const galleryImage = await db
        .select({ imageUrl: gallery.imageUrl })
        .from(gallery)
        .where(eq(gallery.active, true))
        .limit(1);
      
      if (galleryImage.length > 0) {
        defaultImage = galleryImage[0].imageUrl;
      }
    } catch (err) {
      console.error("Erro ao buscar imagem padrão:", err);
    }

    // Gerar landing pages para cada slug
    const landingPages = newSlugs.map((slug) => {
      const slugKeywords = slug.split("-");
      const keywordsCapitalized = capitalizeKeywords(slugKeywords.join(" "), locale);
      const title = generateTitleFromSlug(slug, template, locale, keywordsCapitalized);
      const description = generateDescriptionFromSlug(
        slug,
        template,
        locale,
        keywordsCapitalized
      );
      const keywordsStr = slugKeywords.map(k => capitalizeKeywords(k, locale)).join(", ");

      return {
        slug,
        locale,
        title,
        description,
        keywords: keywordsStr,
        h1: keywordsCapitalized,
        ogImage: defaultImage,
        contentType: template,
        priority: "0.7",
        changeFrequency: "weekly",
        active: true,
      };
    });

    // Inserir em lote (limitar a 50 por vez para não sobrecarregar e evitar timeout)
    const batchSize = 50;
    const batches = [];
    for (let i = 0; i < landingPages.length; i += batchSize) {
      batches.push(landingPages.slice(i, i + batchSize));
    }

    console.log(`[${locale}] Processando ${batches.length} lotes de até ${batchSize} páginas cada`);

    let totalInserted = 0;
    for (let i = 0; i < batches.length; i++) {
      const batch = batches[i];
      try {
        console.log(`[${locale}] Inserindo lote ${i + 1}/${batches.length} (${batch.length} páginas)...`);
        await db.insert(seoLandingPages).values(batch);
        totalInserted += batch.length;
        console.log(`[${locale}] ✅ Lote ${i + 1} inserido com sucesso`);
      } catch (insertError) {
        console.error(`[${locale}] Erro ao inserir lote ${i + 1} de ${batch.length} páginas:`, insertError);
        // Tentar inserir uma por uma para identificar qual está causando problema
        for (const page of batch) {
          try {
            await db.insert(seoLandingPages).values(page);
            totalInserted += 1;
          } catch (singleError) {
            console.error(`[${locale}] Erro ao inserir página ${page.slug}:`, singleError);
            // Continuar com as outras páginas mesmo se uma falhar
          }
        }
      }
    }

    console.log(`[${locale}] ✅ Processamento concluído: ${totalInserted} páginas inseridas`);

    return NextResponse.json({
      message: "Landing pages geradas com sucesso",
      generated: totalInserted,
      total: slugs.length,
      existing: existingSlugsSet.size,
      slugs: newSlugs.slice(0, 10), // Retornar apenas os primeiros 10 como exemplo
    });
  } catch (error) {
    console.error("Erro ao gerar landing pages:", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      { 
        error: "Erro ao gerar landing pages",
        details: errorMessage,
        stack: error instanceof Error ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}

/**
 * Gera título baseado no slug e template com capitalização
 */
function generateTitleFromSlug(
  slug: string,
  template: string,
  locale: string,
  keywordsCapitalized: string
): string {
  const hotelName = "Hotel Sonata de Iracema";

  const templates: Record<string, Record<string, string>> = {
    rooms: {
      pt: `${keywordsCapitalized} - Quartos ${hotelName}`,
      en: `${keywordsCapitalized} - Rooms ${hotelName}`,
      es: `${keywordsCapitalized} - Habitaciones ${hotelName}`,
    },
    packages: {
      pt: `${keywordsCapitalized} - Pacotes ${hotelName}`,
      en: `${keywordsCapitalized} - Packages ${hotelName}`,
      es: `${keywordsCapitalized} - Paquetes ${hotelName}`,
    },
    general: {
      pt: `${keywordsCapitalized} - ${hotelName}`,
      en: `${keywordsCapitalized} - ${hotelName}`,
      es: `${keywordsCapitalized} - ${hotelName}`,
    },
  };

  return (
    templates[template]?.[locale] ||
    templates.general[locale] ||
    `${keywordsCapitalized} - ${hotelName}`
  );
}

/**
 * Gera descrição baseada no slug e template com capitalização
 */
function generateDescriptionFromSlug(
  slug: string,
  template: string,
  locale: string,
  keywordsCapitalized: string
): string {
  const templates: Record<string, Record<string, string>> = {
    rooms: {
      pt: `Descubra nossos quartos ${keywordsCapitalized} no Hotel Sonata de Iracema, Fortaleza. Reserve agora e aproveite a melhor experiência de hospedagem.`,
      en: `Discover our ${keywordsCapitalized} rooms at Hotel Sonata de Iracema, Fortaleza. Book now and enjoy the best accommodation experience.`,
      es: `Descubra nuestras habitaciones ${keywordsCapitalized} en Hotel Sonata de Iracema, Fortaleza. Reserve ahora y disfrute de la mejor experiencia de alojamiento.`,
    },
    packages: {
      pt: `Pacotes promocionais ${keywordsCapitalized} no Hotel Sonata de Iracema, Fortaleza. Ofertas especiais e melhores tarifas. Reserve já!`,
      en: `Promotional packages ${keywordsCapitalized} at Hotel Sonata de Iracema, Fortaleza. Special offers and best rates. Book now!`,
      es: `Paquetes promocionales ${keywordsCapitalized} en Hotel Sonata de Iracema, Fortaleza. Ofertas especiales y mejores tarifas. ¡Reserve ya!`,
    },
    general: {
      pt: `${keywordsCapitalized} no Hotel Sonata de Iracema, Fortaleza. A tradição de acolher, o prazer de se renovar. Reserve agora!`,
      en: `${keywordsCapitalized} at Hotel Sonata de Iracema, Fortaleza. The tradition of welcoming, the pleasure of renewing. Book now!`,
      es: `${keywordsCapitalized} en Hotel Sonata de Iracema, Fortaleza. La tradición de acoger, el placer de renovarse. ¡Reserve ahora!`,
    },
  };

  return (
    templates[template]?.[locale] ||
    templates.general[locale] ||
    `${keywordsCapitalized} - Hotel Sonata de Iracema`
  );
}

