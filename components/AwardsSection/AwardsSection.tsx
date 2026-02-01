'use client';

import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Award, MapPin, Star } from "lucide-react";
import { useLanguage } from "@/lib/context/LanguageContext";
import { getPageTranslation } from "@/lib/translations/pages";
import { useEditor } from "@/lib/context/EditorContext";
import { PageText, PageImage } from "@/components/PageEditor";
import { getPageContent } from "@/lib/utils/pageContent";
import { useGallery } from "@/lib/hooks/useGallery";
import { getGalleryImageByPath } from "@/lib/utils/gallery-helpers";

const DEFAULT_CERTIFICATIONS = [
  { src: "/Sobre Hotel/certificados/logo1-rodape.png", alt: "Certificação 1" },
  { src: "/Sobre Hotel/certificados/logo2-rodape.png", alt: "Certificação 2" },
  { src: "/Sobre Hotel/certificados/logo3-rodape.png", alt: "Certificação 3" },
  { src: "/Sobre Hotel/certificados/logo4-rodape.png", alt: "Certificação 4" },
  { src: "/Sobre Hotel/certificados/logo5-rodape.png", alt: "Certificação 5" },
  { src: "/Sobre Hotel/certificados/logo6-rodape.png", alt: "Certificação 6" },
];

const DEFAULT_AWARDS = [
  { src: "/Sobre Hotel/certificados/ORANGE_MEDIUM_TRAVEL_AWARDS.png", alt: "Travel Awards" },
  { src: "/Sobre Hotel/certificados/LIGHT_MEDIUM_TRAVEL_AWARDS.png", alt: "Travel Awards" },
];

const DEFAULT_TRIPADVISOR_LOGO = "/Sobre Hotel/certificados/tchotel_2022_LL (1).png";

export function AwardsSection() {
  const { locale } = useLanguage();
  const editor = useEditor();
  const globalOverrides = editor?.globalOverrides ?? {};
  const t = getPageTranslation(locale, "awards");
  const { photos: galleryPhotos } = useGallery({ page: "global" });

  const getAward = (fieldKey: string, fallback: string) => {
    if (editor?.editMode) {
      return <PageText page="global" section="awards" fieldKey={fieldKey} locale={locale} as="span" />;
    }
    return getPageContent("global", "awards", fieldKey, locale, globalOverrides) || fallback;
  };

  const getAwardImageSrc = (path: string, fallback: string) => {
    return getGalleryImageByPath(galleryPhotos, path) || fallback;
  };

  return (
    <>
      <section 
        className="py-16 lg:py-24 bg-background relative awards-section-no-gradient"
        style={{
          background: 'hsl(var(--background))',
          backgroundImage: 'none !important',
          backgroundRepeat: 'no-repeat !important',
          overflow: 'hidden',
          position: 'relative',
          zIndex: 10,
          isolation: 'isolate',
        }}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Título Principal */}
        <div className="text-center mb-12 lg:mb-16">
          <Badge className="mb-4 text-base px-4 py-2" variant="outline">
            <Award className="h-4 w-4 mr-2" />
            {getAward("badge", t.badge)}
          </Badge>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            <span className="text-primary">{getAward("titleHighlight", t.titleHighlight)}</span> {getAward("titleRest", t.titleRest)}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {getAward("subtitle", t.subtitle)}
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 lg:gap-12 items-center">
          {/* TripAdvisor - Destaque Principal */}
          <div className="lg:col-span-1">
            <Card className="hover:shadow-2xl transition-all duration-300 border-2 border-primary/20">
              <CardContent className="p-8 text-center">
                <div className="relative w-40 h-40 mx-auto mb-6">
                  {editor?.editMode ? (
                    <PageImage
                      src={getAwardImageSrc("gallery:global:awards-tripadvisor:0", DEFAULT_TRIPADVISOR_LOGO)}
                      path="gallery:global:awards-tripadvisor:0"
                      aspectRatio="square"
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <Image
                      src={getAwardImageSrc("gallery:global:awards-tripadvisor:0", DEFAULT_TRIPADVISOR_LOGO)}
                      alt="Travellers' Choice 2022 - TripAdvisor"
                      fill
                      sizes="160px"
                      className="object-contain"
                    />
                  )}
                </div>
                
                <div className="space-y-4">
                  {/* Nota */}
                  <div className="bg-primary/10 rounded-lg p-4">
                    <p className="text-sm text-muted-foreground mb-2">{getAward("tripadvisor.excellent", t.tripadvisor.excellent)}</p>
                    <div className="flex items-center justify-center gap-2">
                      <span className="text-4xl font-bold text-primary">{getAward("tripadvisor.rating", t.tripadvisor.rating)}</span>
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star 
                            key={star} 
                            className={`h-5 w-5 ${star <= 4 ? 'fill-primary text-primary' : 'fill-primary/30 text-primary/30'}`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Localização */}
                  <div className="bg-muted rounded-lg p-4">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <MapPin className="h-5 w-5 text-primary" />
                      <p className="text-sm font-semibold text-foreground">{getAward("tripadvisor.location", t.tripadvisor.location)}</p>
                    </div>
                    <p className="text-3xl font-bold text-primary">{getAward("tripadvisor.locationScore", t.tripadvisor.locationScore)}</p>
                    <p className="text-xs text-muted-foreground mt-1">{getAward("tripadvisor.walkable", t.tripadvisor.walkable)}</p>
                    <p className="text-xs text-muted-foreground">{getAward("tripadvisor.score", t.tripadvisor.score)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Certificações e Prêmios */}
          <div className="lg:col-span-2 space-y-8">
            {/* Travel Awards */}
            <div>
              <h3 className="text-xl font-bold text-foreground mb-6 text-center lg:text-left">
                {getAward("excellenceAwards", t.excellenceAwards)}
              </h3>
              <div className="grid grid-cols-2 gap-6">
                {DEFAULT_AWARDS.map((award, index) => (
                  <Card key={index} className="hover:shadow-lg transition-all duration-300 bg-white dark:bg-gray-900">
                    <CardContent className="p-6 flex items-center justify-center">
                      <div className="relative w-full h-24">
                        {editor?.editMode ? (
                          <PageImage
                            src={getAwardImageSrc(`gallery:global:awards-excellence:${index}`, award.src)}
                            path={`gallery:global:awards-excellence:${index}`}
                            aspectRatio="auto"
                            className="w-full h-full object-contain"
                          />
                        ) : (
                          <Image
                            src={getAwardImageSrc(`gallery:global:awards-excellence:${index}`, award.src)}
                            alt={award.alt}
                            fill
                            sizes="(max-width: 768px) 50vw, 33vw"
                            className="object-contain"
                          />
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Outras Certificações */}
            <div>
              <h3 className="text-xl font-bold text-foreground mb-6 text-center lg:text-left">
                {getAward("otherCertifications", t.otherCertifications)}
              </h3>
              <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
                {DEFAULT_CERTIFICATIONS.map((cert, index) => (
                  <div 
                    key={index}
                    className="bg-white dark:bg-gray-900 rounded-lg p-4 hover:shadow-lg transition-all duration-300 border border-gray-200 dark:border-gray-800 flex items-center justify-center min-h-[80px]"
                  >
                    <div className="relative w-full h-20">
                      {editor?.editMode ? (
                        <PageImage
                          src={getAwardImageSrc(`gallery:global:awards-certifications:${index}`, cert.src)}
                          path={`gallery:global:awards-certifications:${index}`}
                          aspectRatio="auto"
                          className="w-full h-full object-contain"
                        />
                      ) : (
                        <Image
                          src={getAwardImageSrc(`gallery:global:awards-certifications:${index}`, cert.src)}
                          alt={cert.alt}
                          fill
                          className="object-contain"
                          sizes="(max-width: 768px) 33vw, 16vw"
                        />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
    {/* Barreira final para garantir isolamento */}
    <div 
      className="w-full h-1"
      style={{
        background: 'hsl(var(--background))',
        backgroundImage: 'none',
        position: 'relative',
        zIndex: 12,
      }}
    />
    </>
  );
}

