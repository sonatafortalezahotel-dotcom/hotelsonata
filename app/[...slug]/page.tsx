import { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import { db } from "@/lib/db";
import { seoLandingPages } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import { generateMetadata as generateSEOMetadata } from "@/lib/utils/seo";
import { StructuredData } from "@/components/SEO/StructuredData";
import { generateBreadcrumbStructuredData } from "@/lib/utils/seo";
import { capitalizeKeywords } from "@/lib/utils/slug";
import { GallerySection } from "@/components/GallerySection/GallerySection";

const SITE_URL = process.env.NEXT_PUBLIC_APP_URL || "https://hotelsonata.com.br";

interface PageProps {
  params: Promise<{ slug: string[] }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const slugArray = resolvedParams.slug;
  
  // Detectar locale do primeiro segmento do slug
  // O middleware não faz rewrite para rotas catch-all, então o locale está no slug
  const locales = ["en", "es", "pt"];
  const firstSegment = slugArray[0];
  const isLocale = locales.includes(firstSegment);
  const locale = isLocale ? firstSegment : "pt";
  
  // Se o locale estava no slug, removê-lo para obter o slug real
  const actualSlug = isLocale ? slugArray.slice(1).join("/") : slugArray.join("/");

  try {
    // Primeiro, tentar buscar no locale específico
    let landingPage = await db
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

    // Se não encontrou no locale específico e não é PT, tentar buscar em PT como fallback
    if (landingPage.length === 0 && locale !== "pt") {
      landingPage = await db
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

    if (landingPage.length === 0) {
      return {
        title: "Página não encontrada",
        description: "A página solicitada não foi encontrada.",
      };
    }

    const page = landingPage[0];
    // Se o locale não é pt, adicionar ao slug para o canonical
    const fullSlug = locale !== "pt" ? `${locale}/${actualSlug}` : actualSlug;
    const canonical = page.canonicalUrl || `${SITE_URL}/${fullSlug}`;

    // Capitalizar título e descrição para metadados (Google)
    const capitalizedTitle = capitalizeKeywords(page.title, locale);
    const capitalizedDescription = capitalizeKeywords(page.description, locale);
    const capitalizedKeywords = page.keywords
      .split(",")
      .map((k) => capitalizeKeywords(k.trim(), locale))
      .join(", ");

    return generateSEOMetadata(
      {
        title: capitalizedTitle,
        description: capitalizedDescription,
        keywords: capitalizedKeywords,
        ogImage: page.ogImage || undefined,
        canonicalUrl: canonical,
      },
      {
        locale,
        path: `/${fullSlug}`,
        siteUrl: SITE_URL,
        additionalKeywords: capitalizedKeywords.split(", "),
      }
    );
  } catch (error) {
    console.error("Erro ao buscar landing page:", error);
    return {
      title: "Erro",
      description: "Erro ao carregar página.",
    };
  }
}

export async function generateStaticParams() {
  try {
    // Buscar todas as landing pages ativas
    const landingPages = await db
      .select({ slug: seoLandingPages.slug, locale: seoLandingPages.locale })
      .from(seoLandingPages)
      .where(eq(seoLandingPages.active, true));

    // Gerar params para cada landing page
    return landingPages.map((page) => {
      const slugParts = page.slug.split("/");
      // Se locale não for pt, adicionar como primeiro segmento
      if (page.locale !== "pt") {
        return { slug: [page.locale, ...slugParts] };
      }
      return { slug: slugParts };
    });
  } catch (error) {
    console.error("Erro ao gerar static params:", error);
    return [];
  }
}

export default async function LandingPage({ params }: PageProps) {
  const resolvedParams = await params;
  const slugArray = resolvedParams.slug;
  
  // Verificar se o array de slug está vazio
  if (!slugArray || slugArray.length === 0) {
    notFound();
  }
  
  // Detectar locale do primeiro segmento do slug
  // O middleware não faz rewrite para rotas catch-all, então o locale está no slug
  const locales = ["en", "es", "pt"];
  const firstSegment = slugArray[0];
  const isLocale = locales.includes(firstSegment);
  const locale = isLocale ? firstSegment : "pt";
  
  // Se o locale estava no slug, removê-lo para obter o slug real
  const actualSlug = isLocale ? slugArray.slice(1).join("/") : slugArray.join("/");
  
  if (process.env.NODE_ENV === "development") {
    console.log(`[LandingPage] slugArray:`, slugArray);
    console.log(`[LandingPage] Locale detectado: ${locale}, actualSlug: ${actualSlug}`);
  }

  // Verificar se o slug está vazio após remover o locale
  if (!actualSlug || actualSlug.trim().length === 0) {
    if (process.env.NODE_ENV === "development") {
      console.warn(`[LandingPage] Slug vazio após processamento`);
    }
    notFound();
  }

  try {
    // Primeiro, tentar buscar no locale específico
    if (process.env.NODE_ENV === "development") {
      console.log(`[LandingPage] Buscando: slug="${actualSlug}", locale="${locale}"`);
    }
    
    let landingPage = await db
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

    if (process.env.NODE_ENV === "development") {
      console.log(`[LandingPage] Resultado da busca no locale ${locale}: ${landingPage.length} página(s) encontrada(s)`);
    }

    // Se não encontrou no locale específico e não é PT, tentar buscar em PT como fallback
    if (landingPage.length === 0 && locale !== "pt") {
      if (process.env.NODE_ENV === "development") {
        console.log(`[LandingPage] Tentando fallback para PT: slug="${actualSlug}"`);
      }
      landingPage = await db
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
      
      if (process.env.NODE_ENV === "development") {
        console.log(`[LandingPage] Resultado do fallback PT: ${landingPage.length} página(s) encontrada(s)`);
      }
    }

    // Se ainda não encontrou, tentar buscar sem filtro de active (para debug)
    if (landingPage.length === 0) {
      const debugPage = await db
        .select()
        .from(seoLandingPages)
        .where(
          and(
            eq(seoLandingPages.slug, actualSlug),
            eq(seoLandingPages.locale, locale)
          )
        )
        .limit(1);
      
      if (debugPage.length > 0) {
        // Página existe mas está inativa
        console.warn(`[LandingPage] Página encontrada mas inativa: slug=${actualSlug}, locale=${locale}`);
      } else {
        // Verificar se existe com slug similar
        const similarPages = await db
          .select({ slug: seoLandingPages.slug, locale: seoLandingPages.locale })
          .from(seoLandingPages)
          .where(eq(seoLandingPages.locale, locale))
          .limit(10);
        
        console.warn(`[LandingPage] Página não encontrada: slug=${actualSlug}, locale=${locale}`);
        console.warn(`[LandingPage] Páginas disponíveis no locale ${locale}:`, similarPages.map(p => p.slug));
      }
      
      notFound();
    }

    const page = landingPage[0];

    // Capitalizar conteúdo para exibição na landing page
    const capitalizedH1 = page.h1 
      ? capitalizeKeywords(page.h1, locale)
      : capitalizeKeywords(page.title, locale);
    const capitalizedTitle = capitalizeKeywords(page.title, locale);
    const capitalizedDescription = capitalizeKeywords(page.description, locale);

    // Atualizar contador de visualizações (async, não bloqueia renderização)
    db.update(seoLandingPages)
      .set({
        viewCount: (page.viewCount || 0) + 1,
        lastViewedAt: new Date(),
      })
      .where(eq(seoLandingPages.id, page.id))
      .catch((err) => console.error("Erro ao atualizar view count:", err));

    // Structured Data
    // Se o locale não é pt, adicionar ao slug para o breadcrumb
    const fullSlug = locale !== "pt" ? `${locale}/${actualSlug}` : actualSlug;
    const breadcrumbData = generateBreadcrumbStructuredData([
      { name: "Home", url: SITE_URL },
      { name: capitalizedH1, url: `${SITE_URL}/${fullSlug}` },
    ]);

    // Buscar imagens padrão da galeria organizadas por seção e idioma
    let heroImages: any[] = [];
    let galleryImages: any[] = [];
    let galleryQuartos: any[] = [];
    let galleryGastronomia: any[] = [];
    let galleryLazer: any[] = [];
    let galleryGeral: any[] = [];
    let galleryLocalizacao: any[] = [];
    
    try {
      const { gallery } = await import("@/lib/db/schema");
      const galleryTable = gallery;
      
      // Determinar tipo de conteúdo baseado nas keywords e contentType
      const keywords = page.keywords.split(",").map((k) => k.trim().toLowerCase());
      const contentType = page.contentType || "general";
      
      // Função para determinar seções baseado no tipo de conteúdo
      const getSectionsForContent = (contentType: string, locale: string) => {
        const sections: string[] = [];
        
        // Hero sempre aparece
        sections.push(`seo-hero-padrao-${locale}`);
        
        // Seções baseadas no tipo de conteúdo
        if (contentType === "rooms" || keywords.some(k => k.includes("quarto") || k.includes("acomodação") || k.includes("suite"))) {
          sections.push(`seo-galeria-quartos-${locale}`);
        }
        
        if (contentType === "gastronomy" || keywords.some(k => k.includes("gastronomia") || k.includes("restaurante") || k.includes("café") || k.includes("cafe"))) {
          sections.push(`seo-galeria-gastronomia-${locale}`);
        }
        
        if (keywords.some(k => k.includes("lazer") || k.includes("piscina") || k.includes("spa") || k.includes("academia") || k.includes("beach"))) {
          sections.push(`seo-galeria-lazer-${locale}`);
        }
        
        if (keywords.some(k => k.includes("localização") || k.includes("localizacao") || k.includes("fortaleza") || k.includes("praia") || k.includes("iracema"))) {
          sections.push(`seo-galeria-localizacao-${locale}`);
        }
        
        // Galeria geral sempre aparece (fallback)
        sections.push(`seo-galeria-geral-${locale}`);
        
        return sections;
      };
      
      const sections = getSectionsForContent(contentType, locale);
      
      // Buscar imagens de cada seção
      for (const section of sections) {
        const sectionImages = await db
          .select()
          .from(galleryTable)
          .where(
            and(
              eq(galleryTable.page, "seo-landing-page"),
              eq(galleryTable.section, section),
              eq(galleryTable.active, true)
            )
          )
          .orderBy(galleryTable.order);
        
        // Organizar por tipo de seção
        if (section.includes("hero")) {
          heroImages = sectionImages;
        } else if (section.includes("quartos")) {
          galleryQuartos = sectionImages;
        } else if (section.includes("gastronomia")) {
          galleryGastronomia = sectionImages;
        } else if (section.includes("lazer")) {
          galleryLazer = sectionImages;
        } else if (section.includes("localizacao")) {
          galleryLocalizacao = sectionImages;
        } else if (section.includes("geral")) {
          galleryGeral = sectionImages;
        }
      }
      
      // Combinar todas as galerias (exceto hero) em uma galeria principal
      galleryImages = [
        ...galleryQuartos,
        ...galleryGastronomia,
        ...galleryLazer,
        ...galleryLocalizacao,
        ...galleryGeral,
      ].slice(0, 12); // Máximo 12 imagens na galeria principal
      
      // Se não encontrou imagens padrão, usar fallback do sistema antigo
      if (heroImages.length === 0 && galleryImages.length === 0) {
        const allGalleryImages = await db
          .select()
          .from(galleryTable)
          .where(eq(galleryTable.active, true))
          .limit(10);
        
        heroImages = allGalleryImages.slice(0, 1);
        galleryImages = allGalleryImages.slice(1, 7);
      }
    } catch (err) {
      console.error("Erro ao buscar imagens da galeria:", err);
    }

    // Buscar quartos relacionados se houver
    let relatedRooms: any[] = [];
    if (page.relatedRoomIds) {
      try {
        const roomIds = JSON.parse(page.relatedRoomIds as string);
        if (Array.isArray(roomIds) && roomIds.length > 0) {
          const { rooms, roomTranslations } = await import("@/lib/db/schema");
          relatedRooms = await db
            .select({
              id: rooms.id,
              code: rooms.code,
              name: roomTranslations.name,
              description: roomTranslations.description,
              imageUrl: rooms.imageUrl,
              basePrice: rooms.basePrice,
            })
            .from(rooms)
            .leftJoin(
              roomTranslations,
              and(
                eq(roomTranslations.roomId, rooms.id),
                eq(roomTranslations.locale, locale)
              )
            )
            .where(eq(rooms.id, roomIds[0])); // Simplificado, pode melhorar
        }
      } catch (err) {
        console.error("Erro ao buscar quartos relacionados:", err);
      }
    }

    return (
      <>
        <StructuredData data={breadcrumbData} />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
          <article className="max-w-4xl mx-auto">
            {/* Imagem Hero (prioridade: hero padrão > ogImage > primeira imagem da galeria) */}
            {(heroImages.length > 0 || page.ogImage || galleryImages.length > 0) && (
              <div className="mb-8 rounded-lg overflow-hidden shadow-lg relative aspect-video">
                <Image
                  src={heroImages[0]?.imageUrl || page.ogImage || galleryImages[0]?.imageUrl}
                  alt={capitalizedH1}
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 1152px"
                />
              </div>
            )}

            {/* H1 - Capitalizado */}
            <h1 className="text-4xl lg:text-5xl font-bold mb-6">
              {capitalizedH1}
            </h1>

            {/* Conteúdo */}
            {page.content ? (
              <div
                className="prose prose-lg max-w-none mb-12"
                dangerouslySetInnerHTML={{ __html: page.content }}
              />
            ) : (
              <div className="prose prose-lg max-w-none mb-12">
                <p className="text-xl text-muted-foreground mb-8">
                  {capitalizedDescription}
                </p>
                <p>
                  {locale === "en"
                    ? "Discover Hotel Sonata de Iracema, located at Iracema Beach, Fortaleza. We offer the best accommodation experience with comfortable rooms, regional gastronomy, and a stunning view of the sea."
                    : locale === "es"
                    ? "Descubra el Hotel Sonata de Iracema, ubicado en la Playa de Iracema, Fortaleza. Ofrecemos la mejor experiencia de alojamiento con habitaciones cómodas, gastronomía regional y una vista impresionante al mar."
                    : "Descubra o Hotel Sonata de Iracema, localizado na Praia de Iracema, Fortaleza. Oferecemos a melhor experiência de hospedagem com quartos confortáveis, gastronomia regional e uma vista deslumbrante para o mar."}
                </p>
              </div>
            )}

            {/* Galerias Organizadas por Categoria */}
            <GallerySection
              images={galleryQuartos}
              title={
                locale === "en"
                  ? "Rooms & Accommodations"
                  : locale === "es"
                  ? "Habitaciones y Alojamientos"
                  : "Quartos e Acomodações"
              }
              altPrefix={`${page.h1 || page.title} - Quarto`}
              columns={4}
            />

            <GallerySection
              images={galleryGastronomia}
              title={
                locale === "en"
                  ? "Gastronomy"
                  : locale === "es"
                  ? "Gastronomía"
                  : "Gastronomia"
              }
              altPrefix={`${page.h1 || page.title} - Gastronomia`}
              columns={4}
            />

            <GallerySection
              images={galleryLazer}
              title={
                locale === "en"
                  ? "Leisure & Activities"
                  : locale === "es"
                  ? "Ocio y Actividades"
                  : "Lazer e Atividades"
              }
              altPrefix={`${page.h1 || page.title} - Lazer`}
              columns={4}
            />

            <GallerySection
              images={galleryLocalizacao}
              title={
                locale === "en"
                  ? "Location & Surroundings"
                  : locale === "es"
                  ? "Ubicación y Alrededores"
                  : "Localização e Arredores"
              }
              altPrefix={`${page.h1 || page.title} - Localização`}
              columns={3}
            />

            {/* Galeria Geral (fallback ou complemento) */}
            <GallerySection
              images={galleryGeral}
              title={
                locale === "en"
                  ? "Hotel Gallery"
                  : locale === "es"
                  ? "Galería del Hotel"
                  : "Galeria do Hotel"
              }
              altPrefix={`${page.h1 || page.title} - Imagem`}
              columns={3}
            />

            {/* Quartos Relacionados */}
            {relatedRooms.length > 0 && (
              <section className="mt-12">
                <h2 className="text-2xl font-bold mb-6">
                  {locale === "en"
                    ? "Related Rooms"
                    : locale === "es"
                    ? "Habitaciones Relacionadas"
                    : "Quartos Relacionados"}
                </h2>
                <div className="grid md:grid-cols-2 gap-6">
                  {relatedRooms.map((room) => (
                    <a
                      key={room.id}
                      href={`/quartos/${room.code}`}
                      className="block p-6 border rounded-lg hover:shadow-lg transition-shadow"
                    >
                      {room.imageUrl && (
                        <img
                          src={room.imageUrl}
                          alt={room.name || "Quarto"}
                          className="w-full h-48 object-cover rounded mb-4"
                        />
                      )}
                      <h3 className="text-xl font-semibold mb-2">
                        {room.name}
                      </h3>
                      {room.description && (
                        <p className="text-muted-foreground mb-4 line-clamp-2">
                          {room.description}
                        </p>
                      )}
                      {room.basePrice && (
                        <p className="text-primary font-bold">
                          A partir de R${(room.basePrice / 100).toFixed(2)}/noite
                        </p>
                      )}
                    </a>
                  ))}
                </div>
              </section>
            )}

            {/* CTA */}
            <div className="mt-12 p-8 bg-primary/10 rounded-lg text-center">
              <h2 className="text-2xl font-bold mb-4">
                {locale === "en"
                  ? "Ready to Book?"
                  : locale === "es"
                  ? "¿Listo para Reservar?"
                  : "Pronto para Reservar?"}
              </h2>
              <p className="text-muted-foreground mb-6">
                {locale === "en"
                  ? "Experience the best of Fortaleza at Hotel Sonata de Iracema"
                  : locale === "es"
                  ? "Experimente lo mejor de Fortaleza en Hotel Sonata de Iracema"
                  : "Viva o melhor de Fortaleza no Hotel Sonata de Iracema"}
              </p>
              <a
                href="/reservas"
                className="inline-block px-8 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-colors"
              >
                {locale === "en"
                  ? "Book Now"
                  : locale === "es"
                  ? "Reservar Ahora"
                  : "Reservar Agora"}
              </a>
            </div>
          </article>
        </div>
      </>
    );
  } catch (error) {
    // Log do erro apenas em desenvolvimento
    if (process.env.NODE_ENV === "development") {
      console.error("[LandingPage] Erro ao carregar landing page:", {
        error: error instanceof Error ? error.message : String(error),
        slugArray: resolvedParams.slug,
      });
    }
    notFound();
  }
}

