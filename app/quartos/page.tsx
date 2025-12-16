"use client";

import { useEffect, useState } from "react";
import { useLanguage } from "@/lib/context/LanguageContext";
import { getPageTranslation } from "@/lib/translations/pages";
import RoomsPageContent from "./RoomsPageContent";
import { HeroWithImage } from "@/components/HeroWithImage";
import { ImageGalleryGrid } from "@/components/ImageGalleryGrid";
import { PhotoStory } from "@/components/PhotoStory";
import { Bed, Eye, Sparkles, Waves, Wind } from "lucide-react";
import { getGallery } from "@/lib/hooks/useGallery";
import { getRooms } from "@/lib/hooks/useRooms";
import { getGalleryImageTitle } from "@/lib/utils";
import { usePhotoTracker } from "@/lib/hooks/usePhotoTracker";

export default function RoomsPage() {
  const { locale } = useLanguage();
  const t = getPageTranslation(locale, "rooms");
  const photoTracker = usePhotoTracker();
  const [galleryPhotos, setGalleryPhotos] = useState<any[]>([]);
  const [rooms, setRooms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      const [galleryData, roomsData] = await Promise.all([
        getGallery(),
        getRooms(true, locale)
      ]);
      setGalleryPhotos(galleryData);
      setRooms(roomsData);
      setLoading(false);
    }
    fetchData();
  }, [locale]);

  return (
    <>
      {/* Hero Section - Compensar header fixo */}
      <HeroWithImage
        title={t.hero.title}
        subtitle={t.hero.subtitle}
        image={rooms[0]?.imageUrl || photoTracker.getUnusedPhoto(galleryPhotos, "quarto")?.imageUrl || ""}
        imageAlt="Quartos Hotel Sonata de Iracema"
        icon={<Bed className="h-16 w-16" />}
        badge="Conforto & Aconchego"
        height="large"
        overlay="medium"
      />

      {/* Destaques dos Quartos */}
      <section className="py-16 lg:py-24 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <Bed className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2">{t.highlights.comfort.title}</h3>
              <p className="text-muted-foreground">{t.highlights.comfort.description}</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <Waves className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2">{t.highlights.view.title}</h3>
              <p className="text-muted-foreground">{t.highlights.view.description}</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <Wind className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2">{t.highlights.ac.title}</h3>
              <p className="text-muted-foreground">{t.highlights.ac.description}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Galeria Visual de Quartos */}
      <section className="py-16 lg:py-24 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 lg:mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              {t.gallery.title}
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              {t.gallery.subtitle}
            </p>
          </div>
          
          <ImageGalleryGrid
            images={[
              ...photoTracker.getUnusedPhotos(galleryPhotos, ["quarto", "recepcao"], 6)
                .map((photo, index) => {
                  const title = getGalleryImageTitle(photo, index + 1);
                  return {
                    src: photo.imageUrl,
                    alt: title,
                    title: title
                  };
                }),
              ...rooms.slice(0, 3).map(room => ({
                src: room.imageUrl || "",
                alt: room.name || "",
                title: room.name || ""
              }))
            ].filter(img => img.src)}
            columns={3}
            aspectRatio="landscape"
          />
        </div>
      </section>

      {/* PhotoStory - Detalhes que Fazem Diferença */}
      <PhotoStory
        title={t.photoStory.title}
        subtitle={t.photoStory.subtitle}
        backgroundColor="white"
        items={[
          {
            image: photoTracker.getUnusedPhoto(galleryPhotos, "quarto")?.imageUrl || rooms[0]?.imageUrl || "",
            title: t.photoStory.items.beds.title,
            description: t.photoStory.items.beds.description,
          },
          {
            image: photoTracker.getUnusedPhoto(galleryPhotos, "quarto")?.imageUrl || rooms[1]?.imageUrl || "",
            title: t.photoStory.items.view.title,
            description: t.photoStory.items.view.description,
          },
          {
            image: photoTracker.getUnusedPhoto(galleryPhotos, "quarto")?.imageUrl || rooms[2]?.imageUrl || "",
            title: t.photoStory.items.modern.title,
            description: t.photoStory.items.modern.description,
          },
          {
            image: photoTracker.getUnusedPhoto(galleryPhotos, "quarto")?.imageUrl || rooms[0]?.gallery?.[0] || "",
            title: t.photoStory.items.shared.title,
            description: t.photoStory.items.shared.description,
          },
        ].filter(item => item.image)}
      />

      {/* Rooms Section */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12 lg:mb-16 text-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              {t.section.title}
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {t.section.subtitle}
            </p>
          </div>

          <RoomsPageContent />
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 lg:py-24 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-6">
            {t.cta.title}
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            {t.cta.subtitle}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="#booking-bar" 
              className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-11 px-8"
            >
              {t.cta.bookNow}
            </a>
            <a 
              href="/contato" 
              className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-11 px-8"
            >
              {t.cta.contact}
            </a>
          </div>
        </div>
      </section>
    </>
  );
}