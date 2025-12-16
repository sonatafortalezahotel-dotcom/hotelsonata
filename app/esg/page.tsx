"use client";

import { useEffect, useState, useMemo } from "react";
import Image from "next/image";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Leaf, Users, Heart, Recycle, Droplets, Sun } from "lucide-react";
import { useLanguage } from "@/lib/context/LanguageContext";
import { getPageTranslation } from "@/lib/translations/pages";
import { HeroWithImage } from "@/components/HeroWithImage";
import { ImageGalleryGrid } from "@/components/ImageGalleryGrid";
import { PhotoStory } from "@/components/PhotoStory";
import { getSustainability } from "@/lib/hooks/useSustainability";
import { getGallery } from "@/lib/hooks/useGallery";

export default function ESGPage() {
  const { locale } = useLanguage();
  const t = getPageTranslation(locale, "esg");
  const [sustainability, setSustainability] = useState<any[]>([]);
  const [galleryPhotos, setGalleryPhotos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Buscar todas as imagens usando useMemo
  const esgImages = useMemo(() => {
    if (!galleryPhotos || galleryPhotos.length === 0) {
      return {
        hero: null,
        galeria: [],
        photoStory: {
          obrasLocais: null,
          sustentabilidade: null,
          sustentabilidade2: null,
          acoesSociais: null,
        },
        acoesSociais: null,
      };
    }

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
          return page === "esg" && sec === section.toLowerCase().trim();
        })
        .sort((a: any, b: any) => (a.order || 0) - (b.order || 0));

      if (typeof limit === "number") {
        return filtered.slice(0, limit);
      }
      return filtered;
    };

    const heroPhoto = getPhotosBySection("hero-esg", 1)[0] || null;
    const galeriaPraticas = getPhotosBySection("galeria-praticas", 6);
    const photoStoryPhotos = getPhotosBySection("photo-story-impacto", 4);
    const acoesSociaisPhoto = getPhotosBySection("acoes-sociais", 1)[0] || null;

    return {
      hero: heroPhoto?.imageUrl || null,
      galeria: galeriaPraticas,
      photoStory: {
        obrasLocais: photoStoryPhotos[0]?.imageUrl || null,
        sustentabilidade: photoStoryPhotos[1]?.imageUrl || null,
        sustentabilidade2: photoStoryPhotos[2]?.imageUrl || null,
        acoesSociais: photoStoryPhotos[3]?.imageUrl || null,
      },
      acoesSociais: acoesSociaisPhoto?.imageUrl || null,
    };
  }, [galleryPhotos]);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      const [sustainabilityData, galleryData] = await Promise.all([
        getSustainability(true),
        getGallery()
      ]);
      setSustainability(sustainabilityData);
      setGalleryPhotos(galleryData);
      setLoading(false);
    }
    fetchData();
  }, []);

  const sustainabilityActions = [
    {
      icon: Recycle,
      title: t.actions.waste.title,
      description: t.actions.waste.description,
      actions: t.actions.waste.items
    },
    {
      icon: Droplets,
      title: t.actions.water.title,
      description: t.actions.water.description,
      actions: t.actions.water.items
    },
    {
      icon: Sun,
      title: t.actions.energy.title,
      description: t.actions.energy.description,
      actions: t.actions.energy.items
    },
    {
      icon: Leaf,
      title: t.actions.local.title,
      description: t.actions.local.description,
      actions: t.actions.local.items
    }
  ];

  const inclusionActions = [
    {
      icon: Users,
      title: t.inclusionActions.accessibility.title,
      description: t.inclusionActions.accessibility.description,
      actions: t.inclusionActions.accessibility.items
    },
    {
      icon: Heart,
      title: t.inclusionActions.diversity.title,
      description: t.inclusionActions.diversity.description,
      actions: t.inclusionActions.diversity.items
    }
  ];

  return (
    <>
      {/* Hero Section com Imagem */}
      <HeroWithImage
        title={t.hero.title}
        subtitle={t.hero.subtitle}
        image={sustainability[0]?.imageUrl || esgImages.hero || undefined}
        imageAlt={t.hero.imageAlt}
        icon={<Leaf className="h-16 w-16" />}
        badge={t.hero.badge}
        height="large"
        overlay="medium"
      />

      {/* Galeria - Práticas Sustentáveis */}
      <section className="py-16 lg:py-24 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 lg:mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              {t.practices.title}
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              {t.practices.subtitle}
            </p>
          </div>
          
          <ImageGalleryGrid
            images={esgImages.galeria
              .map((photo, index) => {
                const galleryKeys = Object.keys(t.gallery) as Array<keyof typeof t.gallery>;
                const key = galleryKeys[index % galleryKeys.length];
                const galleryItem = key ? (t.gallery[key] as { alt?: string; title?: string }) : null;
                const photoTitle = (photo as any).title;
                return {
                  src: photo.imageUrl,
                  alt: photoTitle || galleryItem?.alt || `Foto ${index + 1}`,
                  title: photoTitle || galleryItem?.title || `Foto ${index + 1}`
                };
              })
              .filter(img => img.src)}
            columns={3}
            aspectRatio="landscape"
          />
        </div>
      </section>

      {/* Sustentabilidade Ambiental */}
      <section className="py-16 lg:py-24 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 lg:mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              {t.sustainability.title}
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {t.sustainability.subtitle}
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {sustainabilityActions.map((item, index) => {
              const Icon = item.icon;
              return (
                <Card key={index} className="hover:shadow-xl transition-all duration-300">
                  <CardHeader>
                    <div className="p-3 bg-green-600/10 rounded-lg w-fit mb-4">
                      <Icon className="h-8 w-8 text-green-600" />
                    </div>
                    <CardTitle className="text-2xl">{item.title}</CardTitle>
                    <CardDescription className="text-base">
                      {item.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {item.actions.map((action, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
                          <span className="h-1.5 w-1.5 rounded-full bg-green-600 flex-shrink-0 mt-1.5" />
                          {action}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Inclusão e Diversidade */}
      <section className="py-16 lg:py-24 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 lg:mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              {t.inclusion.title}
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {t.inclusion.subtitle}
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {inclusionActions.map((item, index) => {
              const Icon = item.icon;
              return (
                <Card key={index} className="hover:shadow-xl transition-all duration-300">
                  <CardHeader>
                    <div className="p-3 bg-blue-600/10 rounded-lg w-fit mb-4">
                      <Icon className="h-8 w-8 text-blue-600" />
                    </div>
                    <CardTitle className="text-2xl">{item.title}</CardTitle>
                    <CardDescription className="text-base">
                      {item.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {item.actions.map((action, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
                          <span className="h-1.5 w-1.5 rounded-full bg-blue-600 flex-shrink-0 mt-1.5" />
                          {action}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* PhotoStory - Impacto Social e Ambiental */}
      <PhotoStory
        title={t.commitment.title}
        subtitle={t.commitment.subtitle}
        backgroundColor="white"
        items={[
          {
            image: sustainability.find(s => s.category === "obras-locais")?.imageUrl || esgImages.photoStory.obrasLocais || null,
            title: t.impactPhotoStory.localProd.title,
            description: t.impactPhotoStory.localProd.description,
          },
          {
            image: sustainability.find(s => s.category === "sustentabilidade")?.imageUrl || esgImages.photoStory.sustentabilidade || null,
            title: t.impactPhotoStory.mobility.title,
            description: t.impactPhotoStory.mobility.description,
          },
          {
            image: sustainability.filter(s => s.category === "sustentabilidade")[1]?.imageUrl || esgImages.photoStory.sustentabilidade2 || null,
            title: t.impactPhotoStory.resources.title,
            description: t.impactPhotoStory.resources.description,
          },
          {
            image: sustainability.find(s => s.category === "acoes-sociais")?.imageUrl || esgImages.photoStory.acoesSociais || null,
            title: t.impactPhotoStory.team.title,
            description: t.impactPhotoStory.team.description,
          },
        ].filter(item => item.image)}
      />

      {/* Ações Sociais */}
      <section className="py-16 lg:py-24 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="relative aspect-[4/5] overflow-hidden rounded-2xl shadow-2xl">
              {(() => {
                const imageUrl = sustainability.find(s => s.category === "acoes-sociais")?.imageUrl || esgImages.acoesSociais;
                return imageUrl && imageUrl.trim() !== "" ? (
                  <Image
                    src={imageUrl}
                    alt="Compromisso Social"
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-green-600/20 to-emerald-600/20" />
                );
              })()}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-8 left-8 right-8 text-white">
                <h3 className="text-3xl font-bold mb-2">{t.social.together}</h3>
                <p className="text-white/90">{t.social.togetherSubtitle}</p>
              </div>
            </div>

            <div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-6">
                {t.social.title}
              </h2>
              <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                {t.social.description}
              </p>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="h-10 w-10 rounded-full bg-orange-600/10 flex items-center justify-center flex-shrink-0">
                    <Heart className="h-5 w-5 text-orange-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">{t.social.support.title}</p>
                    <p className="text-sm text-muted-foreground">
                      {t.social.support.description}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="h-10 w-10 rounded-full bg-orange-600/10 flex items-center justify-center flex-shrink-0">
                    <Users className="h-5 w-5 text-orange-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">{t.social.jobs.title}</p>
                    <p className="text-sm text-muted-foreground">
                      {t.social.jobs.description}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="h-10 w-10 rounded-full bg-orange-600/10 flex items-center justify-center flex-shrink-0">
                    <Leaf className="h-5 w-5 text-orange-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">{t.social.suppliers.title}</p>
                    <p className="text-sm text-muted-foreground">
                      {t.social.suppliers.description}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Certificações */}
      <section className="py-16 lg:py-24 bg-gradient-to-br from-green-600/5 to-green-600/10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-6">
            {t.certifications.title}
          </h2>
          <p className="text-lg text-muted-foreground mb-12 max-w-2xl mx-auto">
            {t.certifications.subtitle}
          </p>
          
          {/* Aqui você pode adicionar logos de certificações quando disponíveis */}
          <div className="flex flex-wrap justify-center gap-8 items-center opacity-60">
            <div className="text-muted-foreground">Certificações em processo...</div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 lg:py-24 bg-gradient-to-br from-green-600/90 to-green-700 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6">
            {t.cta.title}
          </h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto text-white/90">
            {t.cta.subtitle}
          </p>
          <a 
            href="/"
            className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 bg-white text-green-700 hover:bg-white/90 h-11 px-8"
          >
            {t.cta.button}
          </a>
        </div>
      </section>
    </>
  );
}