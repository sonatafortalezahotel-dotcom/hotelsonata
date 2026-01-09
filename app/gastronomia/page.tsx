"use client";

import { useEffect, useState, useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { Clock, Award, Coffee, UtensilsCrossed, ChefHat } from "lucide-react";
import { useLanguage } from "@/lib/context/LanguageContext";
import { getPageTranslation } from "@/lib/translations/pages";
import Image from "next/image";
import { AmenityCard } from "@/components/AmenityCard";
import { HeroWithImage } from "@/components/HeroWithImage";
import { MasonrySwap } from "@/components/HorizontalScroll";
import { PhotoStory } from "@/components/PhotoStory";
import { getGastronomy } from "@/lib/hooks/useGastronomy";
import { getGallery } from "@/lib/hooks/useGallery";
import { getGalleryImageTitle } from "@/lib/utils";

export default function GastronomiaPage() {
  const { locale } = useLanguage();
  const t = getPageTranslation(locale, "gastronomy");
  const [gastronomy, setGastronomy] = useState<any[]>([]);
  const [galleryPhotos, setGalleryPhotos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Buscar todas as imagens usando useMemo
  const gastronomiaImages = useMemo(() => {
    const normalize = (value: any) =>
      (value || "").toString().toLowerCase().trim();

    const getPhotosBySection = (section: string, limit?: number) => {
      const filtered = galleryPhotos
        .filter((img: any) => {
          if (!img?.active) return false;
          if (!img.imageUrl || typeof img.imageUrl !== "string") return false;
          if (!img.imageUrl.trim()) return false;

          const page = normalize(img.page);
          const sec = normalize(img.section);

          return page === "gastronomia" && sec === section.toLowerCase().trim();
        })
        .sort((a: any, b: any) => (a.order || 0) - (b.order || 0));

      if (typeof limit === "number") {
        return filtered.slice(0, limit);
      }
      return filtered;
    };

    const heroPhoto = getPhotosBySection("hero-gastronomia", 1)[0] || null;
    const cardCafeManha = getPhotosBySection("card-cafe-manha", 4);
    const cardRestaurante = getPhotosBySection("card-restaurante", 5);
    const galeriaCafe = getPhotosBySection("galeria-cafe", 6);
    const galeriaRestaurante = getPhotosBySection("galeria-restaurante", 6);
    const photoStoryPhotos = getPhotosBySection("photo-story-gastronomia", 4);

    return {
      hero: heroPhoto?.imageUrl || null,
      cardCafeManha,
      cardRestaurante,
      galeriaCafe,
      galeriaRestaurante,
      photoStory: {
        restaurante: photoStoryPhotos[0]?.imageUrl || null,
        cafe1: photoStoryPhotos[1]?.imageUrl || null,
        cafe2: photoStoryPhotos[2]?.imageUrl || null,
        cafe3: photoStoryPhotos[3]?.imageUrl || null,
      },
    };
  }, [galleryPhotos]);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      const [gastronomyData, galleryData] = await Promise.all([
        getGastronomy(true, locale),
        getGallery()
      ]);
      setGastronomy(gastronomyData);
      setGalleryPhotos(galleryData);
      setLoading(false);
    }
    fetchData();
  }, [locale]);

  return (
    <>
      {/* Hero Section com Imagem */}
      <HeroWithImage
        title={t.hero.title}
        subtitle={t.hero.subtitle}
        image={gastronomy.find(g => g.type === "restaurante")?.imageUrl || gastronomiaImages.hero || undefined}
        imageAlt="Restaurante Hotel Sonata de Iracema"
        icon={<UtensilsCrossed className="h-16 w-16" />}
        badge="Sabores Regionais"
        height="large"
        overlay="medium"
      />

      {/* Gastronomia - Cards com Galerias */}
      <section className="py-16 lg:py-24 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
            {/* Café da Manhã */}
            <AmenityCard
              title={t.breakfast.title}
              description={t.breakfast.description}
              images={(() => {
                const cafe = gastronomy.find(g => g.type === "cafe" || g.type === "cafe-da-manha");
                if (cafe?.gallery && Array.isArray(cafe.gallery)) {
                  return cafe.gallery.filter((url: any) => url && typeof url === "string" && url.trim() !== "");
                }
                return gastronomiaImages.cardCafeManha
                  .map((p) => p.imageUrl)
                  .filter((url: any) => url && typeof url === "string" && url.trim() !== "");
              })()}
              icon={Coffee}
              schedule={gastronomy.find(g => g.type === "cafe")?.schedule || `${t.breakfast.scheduleWeekday} / ${t.breakfast.scheduleWeekend}`}
              badge={t.breakfast.badge}
              tags={[
                t.gallery.items.tapioca,
                t.gallery.items.fruits,
                t.gallery.items.breads,
                t.gallery.items.coffee,
                t.gallery.items.table
              ]}
            />

            {/* Restaurante */}
            <AmenityCard
              title={t.restaurant.title}
              description={t.restaurant.description}
              images={(() => {
                const restaurante = gastronomy.find(g => g.type === "restaurante");
                if (restaurante?.gallery && Array.isArray(restaurante.gallery)) {
                  return restaurante.gallery.filter((url: any) => url && typeof url === "string" && url.trim() !== "");
                }
                return gastronomiaImages.cardRestaurante
                  .map((p) => p.imageUrl)
                  .filter((url: any) => url && typeof url === "string" && url.trim() !== "");
              })()}
              icon={UtensilsCrossed}
              schedule={gastronomy.find(g => g.type === "restaurante")?.schedule || `${t.restaurant.lunch} / ${t.restaurant.dinner}`}
              badge={t.gallery.items.ocean}
              tags={[
                t.gallery.items.flavor,
                t.gallery.items.ocean,
                "Internacional"
              ]}
            />
          </div>

          {/* Destaques do Café da Manhã */}
          <div className="mt-16 bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-950/20 dark:to-amber-900/20 rounded-2xl p-8 lg:p-12">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-amber-600 rounded-full flex items-center justify-center">
                <Award className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-2xl lg:text-3xl font-bold text-foreground">
                {t.breakfast.highlightsTitle}
              </h3>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="flex items-start gap-2">
                <span className="text-amber-600 mt-1">✓</span>
                <span className="text-muted-foreground">{t.highlightsList.tapioca}</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-amber-600 mt-1">✓</span>
                <span className="text-muted-foreground">{t.highlightsList.fruits}</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-amber-600 mt-1">✓</span>
                <span className="text-muted-foreground">{t.highlightsList.breads}</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-amber-600 mt-1">✓</span>
                <span className="text-muted-foreground">{t.highlightsList.coffee}</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-amber-600 mt-1">✓</span>
                <span className="text-muted-foreground">{t.highlightsList.vegan}</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-amber-600 mt-1">✓</span>
                <span className="text-muted-foreground">{t.highlightsList.view}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Galeria de Pratos - Café da Manhã - GRID 1x4 */}
      <section className="py-16 lg:py-24 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 lg:mb-16">
            <Badge className="mb-4 bg-amber-600 hover:bg-amber-700 text-base px-4 py-2">
              <Coffee className="h-4 w-4 mr-2 inline" />
              {t.gallery.breakfast.badge}
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              {t.gallery.breakfast.title}
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              {t.gallery.breakfast.subtitle}
            </p>
          </div>
        </div>

        {/* Mobile: Stack */}
        <div className="grid grid-cols-1 gap-0 lg:hidden">
          {gastronomiaImages.galeriaCafe
            .slice(0, 4)
            .map((photo, index) => (
              <div key={index} className="group relative overflow-hidden">
                <div className="relative w-full h-[400px]">
                  <Image
                    src={photo.imageUrl}
                    alt={`Café da manhã ${index + 1}`}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                    sizes="100vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                </div>
              </div>
            ))}
        </div>

        {/* Desktop: 4 colunas */}
        <div className="hidden lg:grid lg:grid-cols-4 gap-0">
          {gastronomiaImages.galeriaCafe
            .slice(0, 4)
            .map((photo, index) => (
              <div key={index} className="group relative overflow-hidden">
                <div className="relative w-full h-[500px]">
                  <Image
                    src={photo.imageUrl}
                    alt={`Café da manhã ${index + 1}`}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                    sizes="25vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                </div>
              </div>
            ))}
        </div>
      </section>

      {/* PhotoStory - Experiência Gastronômica */}
      <PhotoStory
        title={t.photoStory.title}
        subtitle={t.photoStory.subtitle}
        backgroundColor="white"
        items={[
          {
            image: gastronomy.find(g => g.type === "restaurante")?.imageUrl || gastronomiaImages.photoStory.restaurante || null,
            title: t.photoStory.items.restaurant.title,
            description: t.photoStory.items.restaurant.description,
          },
          {
            image: gastronomiaImages.photoStory.cafe1 || null,
            title: t.photoStory.items.seafood.title,
            description: t.photoStory.items.seafood.description,
          },
          {
            image: gastronomiaImages.photoStory.cafe2 || null,
            title: t.photoStory.items.chef.title,
            description: t.photoStory.items.chef.description,
          },
          {
            image: gastronomy.find(g => g.type === "cafe")?.imageUrl || gastronomiaImages.photoStory.cafe3 || null,
            title: t.photoStory.items.breakfast.title,
            description: t.photoStory.items.breakfast.description,
          },
        ]}
      />

      {/* Galeria do Restaurante e Pratos - MASONRY ANIMADO */}
      <section className="py-16 lg:py-24 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 lg:mb-16">
            <Badge className="mb-4 bg-orange-600 hover:bg-orange-700 text-base px-4 py-2">
              <ChefHat className="h-4 w-4 mr-2 inline" />
              {t.gallery.restaurant.badge}
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              {t.gallery.restaurant.title}
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              {t.gallery.restaurant.subtitle}
            </p>
          </div>
          
          <MasonrySwap
            images={gastronomiaImages.galeriaRestaurante
              .map(photo => photo.imageUrl)
              .filter(img => img && typeof img === "string" && img.trim() !== "")}
            interval={4500}
          />
        </div>
      </section>

      {/* Room Service */}
      <section className="py-16 lg:py-24 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-6">
            {t.roomService.title}
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            {t.roomService.description}
          </p>
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-primary/10 rounded-lg">
            <Clock className="h-5 w-5 text-primary" />
            <span className="font-semibold text-foreground">{t.roomService.available}</span>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 lg:py-24 bg-gradient-to-br from-amber-600/90 to-amber-700 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6">
            {t.cta.title}
          </h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto text-white/90">
            {t.cta.subtitle}
          </p>
          <a 
            href="/"
            className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 bg-white text-amber-700 hover:bg-white/90 h-11 px-8"
          >
            {t.cta.bookNow}
          </a>
        </div>
      </section>
    </>
  );
}