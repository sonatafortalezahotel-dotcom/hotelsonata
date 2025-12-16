"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Badge } from "@/components/ui/badge";
import { Waves, Bike, Dumbbell, Trophy, MapPin, Heart, Sparkles } from "lucide-react";
import { useLanguage } from "@/lib/context/LanguageContext";
import { getPageTranslation } from "@/lib/translations/pages";
import { AmenityCard } from "@/components/AmenityCard";
import { HeroWithImage } from "@/components/HeroWithImage";
import { ImageGalleryGrid } from "@/components/ImageGalleryGrid";
import { PhotoStory } from "@/components/PhotoStory";
import { getLeisure } from "@/lib/hooks/useLeisure";
import { getGallery } from "@/lib/hooks/useGallery";
import { getGalleryImageTitle } from "@/lib/utils";
import { usePhotoTracker } from "@/lib/hooks/usePhotoTracker";

export default function LazerPage() {
  const { locale } = useLanguage();
  const t = getPageTranslation(locale, "leisure");
  const tServices = getPageTranslation(locale, "leisureServices");
  const photoTracker = usePhotoTracker();
  const [leisure, setLeisure] = useState<any[]>([]);
  const [galleryPhotos, setGalleryPhotos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      const [leisureData, galleryData] = await Promise.all([
        getLeisure(true, locale),
        getGallery()
      ]);
      setLeisure(leisureData);
      setGalleryPhotos(galleryData);
      setLoading(false);
    }
    fetchData();
  }, [locale]);

  // Mapear dados do banco para o formato esperado
  const leisureActivities = [
    {
      icon: Waves,
      title: tServices.pool.title,
      description: tServices.pool.description,
      images: (() => {
        const pool = leisure.find(l => l.type === "piscina");
        if (pool?.gallery && Array.isArray(pool.gallery)) return pool.gallery;
        return photoTracker.getUnusedPhotos(galleryPhotos, "piscina", 5)
          .map(p => p.imageUrl)
          .filter(Boolean);
      })(),
      schedule: leisure.find(l => l.type === "piscina")?.schedule || tServices.pool.schedule,
      badge: tServices.pool.badge,
      tags: tServices.pool.tags
    },
    {
      icon: Dumbbell,
      title: tServices.fitness.title,
      description: tServices.fitness.description,
      images: (() => {
        const fitness = leisure.find(l => l.type === "academia" || l.type === "fitness");
        if (fitness?.gallery && Array.isArray(fitness.gallery)) return fitness.gallery;
        return photoTracker.getUnusedPhotos(galleryPhotos, "academia", 4)
          .map(p => p.imageUrl)
          .filter(Boolean);
      })(),
      schedule: leisure.find(l => l.type === "academia")?.schedule || tServices.fitness.schedule,
      badge: tServices.fitness.badge,
      tags: tServices.fitness.tags
    },
    {
      icon: Bike,
      title: tServices.bikes.title,
      description: tServices.bikes.description,
      images: (() => {
        const bikes = leisure.find(l => l.type === "bikes" || l.type === "bicicleta");
        if (bikes?.gallery && Array.isArray(bikes.gallery)) return bikes.gallery;
        return photoTracker.getUnusedPhotos(galleryPhotos, ["lazer", "bikes"], 2)
          .map(p => p.imageUrl)
          .filter(Boolean);
      })(),
      badge: tServices.bikes.badge,
      tags: tServices.bikes.tags
    },
    {
      icon: Trophy,
      title: tServices.beachTennis.title,
      description: tServices.beachTennis.description,
      images: (() => {
        const beachTennis = leisure.find(l => l.type === "beach-tennis" || l.type === "esporte");
        if (beachTennis?.gallery && Array.isArray(beachTennis.gallery)) return beachTennis.gallery;
        return photoTracker.getUnusedPhotos(galleryPhotos, "esporte", 2)
          .map(p => p.imageUrl)
          .filter(Boolean);
      })(),
      badge: tServices.beachTennis.badge,
      tags: tServices.beachTennis.tags
    },
    {
      icon: Sparkles,
      title: tServices.massage.title,
      description: tServices.massage.description,
      images: (() => {
        const spa = leisure.find(l => l.type === "spa" || l.type === "massagem");
        if (spa?.gallery && Array.isArray(spa.gallery)) return spa.gallery;
        return photoTracker.getUnusedPhotos(galleryPhotos, "spa", 4)
          .map(p => p.imageUrl)
          .filter(Boolean);
      })(),
      badge: tServices.massage.badge,
      tags: tServices.massage.tags
    },
  ];

  return (
    <>
      {/* Hero Section com Imagem */}
      <HeroWithImage
        title={t.hero.title}
        subtitle={t.hero.subtitle}
        image={leisure.find(l => l.type === "piscina")?.imageUrl || photoTracker.getUnusedPhoto(galleryPhotos, "piscina")?.imageUrl || ""}
        imageAlt="Piscina Vista Mar - Hotel Sonata de Iracema"
        icon={<Heart className="h-16 w-16" />}
        badge="Lazer & Bem-Estar"
        height="large"
        overlay="medium"
      />

      {/* Galeria - Piscina Vista Mar */}
      <section className="py-16 lg:py-24 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 lg:mb-16">
            <Badge className="mb-4 bg-blue-600 hover:bg-blue-700 text-base px-4 py-2">
              <Waves className="h-4 w-4 mr-2 inline" />
              {t.gallery.pool.badge}
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              {t.gallery.pool.title}
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              {t.gallery.pool.subtitle}
            </p>
          </div>
          
          <ImageGalleryGrid
            images={photoTracker.getUnusedPhotos(galleryPhotos, "piscina", 6)
              .map((photo, index) => {
                const title = getGalleryImageTitle(photo, index + 1);
                return {
                  src: photo.imageUrl,
                  alt: title,
                  title: title
                };
              })
              .filter(img => img.src)}
            columns={3}
            aspectRatio="landscape"
          />
        </div>
      </section>

      {/* PhotoStory - Atividades do Dia */}
      <PhotoStory
        title={t.photoStory.title}
        subtitle={t.photoStory.subtitle}
        backgroundColor="white"
        items={[
          {
            image: leisure.find(l => l.type === "academia")?.imageUrl || photoTracker.getUnusedPhoto(galleryPhotos, "academia")?.imageUrl || "",
            title: t.photoStory.items.gym.title,
            description: t.photoStory.items.gym.description,
            time: t.photoStory.items.gym.time
          },
          {
            image: leisure.find(l => l.type === "beach-tennis")?.imageUrl || photoTracker.getUnusedPhoto(galleryPhotos, "esporte")?.imageUrl || "",
            title: t.photoStory.items.tennis.title,
            description: t.photoStory.items.tennis.description,
            time: t.photoStory.items.tennis.time
          },
          {
            image: leisure.find(l => l.type === "bikes")?.imageUrl || photoTracker.getUnusedPhoto(galleryPhotos, "lazer")?.imageUrl || "",
            title: t.photoStory.items.bike.title,
            description: t.photoStory.items.bike.description,
            time: t.photoStory.items.bike.time
          },
          {
            image: leisure.find(l => l.type === "spa")?.imageUrl || photoTracker.getUnusedPhoto(galleryPhotos, "spa")?.imageUrl || "",
            title: t.photoStory.items.spa.title,
            description: t.photoStory.items.spa.description,
            time: t.photoStory.items.spa.time
          },
        ].filter(item => item.image)}
      />

      {/* Galeria - Academia & Fitness */}
      <section className="py-16 lg:py-24 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 lg:mb-16">
            <Badge className="mb-4 bg-orange-600 hover:bg-orange-700 text-base px-4 py-2">
              <Dumbbell className="h-4 w-4 mr-2 inline" />
              {t.gallery.fitness.badge}
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              {t.gallery.fitness.title}
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              {t.gallery.fitness.subtitle}
            </p>
          </div>
          
          <ImageGalleryGrid
            images={photoTracker.getUnusedPhotos(galleryPhotos, "academia", 4)
              .map((photo, index) => {
                const title = getGalleryImageTitle(photo, index + 1);
                return {
                  src: photo.imageUrl,
                  alt: title,
                  title: title
                };
              })
              .filter(img => img.src)}
            columns={2}
            aspectRatio="landscape"
          />
        </div>
      </section>

      {/* Galeria - Atividades ao Ar Livre */}
      <section className="py-16 lg:py-24 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 lg:mb-16">
            <Badge className="mb-4 bg-green-600 hover:bg-green-700 text-base px-4 py-2">
              <Trophy className="h-4 w-4 mr-2 inline" />
              {t.gallery.activities.badge}
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              {t.gallery.activities.title}
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              {t.gallery.activities.subtitle}
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <ImageGalleryGrid
              images={photoTracker.getUnusedPhotos(galleryPhotos, "esporte", 2)
                .map((photo, index) => {
                  const title = getGalleryImageTitle(photo, index + 1);
                  return {
                    src: photo.imageUrl,
                    alt: title,
                    title: title
                  };
                })
                .filter(img => img.src)}
              columns={2}
              aspectRatio="square"
            />
            <ImageGalleryGrid
              images={photoTracker.getUnusedPhotos(galleryPhotos, ["lazer", "bikes"], 2)
                .map((photo, index) => {
                  const title = getGalleryImageTitle(photo, index + 3);
                  return {
                    src: photo.imageUrl,
                    alt: title,
                    title: title
                  };
                })
                .filter(img => img.src)}
              columns={2}
              aspectRatio="square"
            />
          </div>
        </div>
      </section>

      {/* Galeria - Spa & Relaxamento */}
      <section className="py-16 lg:py-24 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 lg:mb-16">
            <Badge className="mb-4 bg-purple-600 hover:bg-purple-700 text-base px-4 py-2">
              <Sparkles className="h-4 w-4 mr-2 inline" />
              {t.gallery.spa.badge}
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              {t.gallery.spa.title}
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              {t.gallery.spa.subtitle}
            </p>
          </div>
          
          <ImageGalleryGrid
            images={photoTracker.getUnusedPhotos(galleryPhotos, "spa", 4)
              .map((photo, index) => {
                const title = getGalleryImageTitle(photo, index + 1);
                return {
                  src: photo.imageUrl,
                  alt: title,
                  title: title
                };
              })
              .filter(img => img.src)}
            columns={2}
            aspectRatio="landscape"
          />
        </div>
      </section>

      {/* Atividades - Resumo com Cards */}
      <section className="py-16 lg:py-24 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 lg:mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              {t.section.title}
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              {t.section.subtitle}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {leisureActivities.map((activity, index) => (
              <AmenityCard
                key={index}
                title={activity.title}
                description={activity.description}
                images={activity.images}
                icon={activity.icon}
                schedule={activity.schedule}
                badge={activity.badge}
                tags={activity.tags}
              />
            ))}
          </div>

          <div className="mt-12 text-center">
            <p className="text-muted-foreground mb-4">
              {tServices.footer.text}
            </p>
            <a 
              href="/contato"
              className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-11 px-8"
            >
              {tServices.footer.contactButton}
            </a>
          </div>
        </div>
      </section>

      {/* Localização Privilegiada */}
      <section className="py-16 lg:py-24 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full mb-6">
                <MapPin className="h-5 w-5 text-primary" />
                <span className="font-semibold text-primary">{t.location.badge}</span>
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-6">
                {t.location.title}
              </h2>
              <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                {t.location.description}
              </p>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <MapPin className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">{t.locationPrivileged.near}</p>
                    <p className="text-sm text-muted-foreground">{t.locationPrivileged.nearDescription}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Waves className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">{t.locationPrivileged.seaFront}</p>
                    <p className="text-sm text-muted-foreground">{t.locationPrivileged.seaFrontDescription}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative">
              <AspectRatio ratio={4 / 5}>
                {(() => {
                  const locationPhoto = photoTracker.getUnusedPhoto(galleryPhotos, "localizacao", {
                    allowRelatedCategories: true,
                    relatedCategories: ["geral"]
                  });
                  const imageUrl = locationPhoto?.imageUrl;
                  return imageUrl && imageUrl.trim() !== "" ? (
                    <Image
                      src={imageUrl}
                      alt="Localização privilegiada"
                      fill
                      className="object-cover rounded-lg shadow-2xl"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/40 rounded-lg" />
                  );
                })()}
              </AspectRatio>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 lg:py-24 bg-gradient-to-br from-blue-600/90 to-blue-700 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6">
            {t.cta.title}
          </h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto text-white/90">
            {t.cta.subtitle}
          </p>
          <a 
            href="/"
            className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 bg-white text-blue-700 hover:bg-white/90 h-11 px-8"
          >
            {t.cta.bookNow}
          </a>
        </div>
      </section>
    </>
  );
}