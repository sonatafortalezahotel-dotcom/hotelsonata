"use client";

import Image from "next/image";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { EditorialCarousel, EditorialSlide } from "@/components/HorizontalScroll";
import NordestinoPattern from "@/components/NordestinoPattern";
import { useLanguage } from "@/lib/context/LanguageContext";
import { useEditor } from "@/lib/context/EditorContext";
import { PageText, PageImage } from "@/components/PageEditor";
import { getPageContent } from "@/lib/utils/pageContent";
import { getGalleryImageByPath } from "@/lib/utils/gallery-helpers";

interface SustainabilityItem {
  id: number;
  title: string;
  description: string;
  imageUrl?: string;
  category?: string;
}

interface SustainabilitySectionProps {
  items?: SustainabilityItem[];
  galleryPhotos?: Array<{ imageUrl: string; page?: string | null; section?: string | null; order?: number }>;
}

export default function SustainabilitySection({
  items = [],
  galleryPhotos = [],
}: SustainabilitySectionProps) {
  const { locale } = useLanguage();
  const editor = useEditor();
  const overrides = editor?.overrides ?? {};
  const displayItems = items;

  if (displayItems.length === 0 && !editor?.editMode) {
    return null;
  }

  const itemsToShow = displayItems.length > 0
    ? displayItems
    : [{ id: 0, title: "", description: "", imageUrl: "" }];

  return (
    <section 
      className="py-10 lg:py-24 bg-background relative overflow-hidden"
      style={{
        background: 'hsl(var(--background))',
        backgroundImage: 'none',
        backgroundRepeat: 'no-repeat',
      }}
    >
      {/* Padrão decorativo nordestino sutil */}
      <NordestinoPattern variant="lace" opacity={0.025} />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-8 lg:mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            {editor?.editMode ? (
              <PageText page="home" section="sustainabilitySection" fieldKey="title" locale={locale as "pt" | "es" | "en"} as="span" />
            ) : (
              getPageContent("home", "sustainabilitySection", "title", locale as "pt" | "es" | "en", overrides) || "Sustentabilidade e Inclusão"
            )}
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            {editor?.editMode ? (
              <PageText page="home" section="sustainabilitySection" fieldKey="subtitle" locale={locale as "pt" | "es" | "en"} as="span" />
            ) : (
              getPageContent("home", "sustainabilitySection", "subtitle", locale as "pt" | "es" | "en", overrides) || "Comprometidos com um futuro melhor para todos"
            )}
          </p>
        </div>

        {/* Carrossel Editorial Fullwidth */}
        <EditorialCarousel
          autoplay={false}
          showNavigation={true}
          showProgress={true}
        >
          {itemsToShow.map((item, index) => (
            <EditorialSlide
              key={item.id}
              image={
                editor?.editMode ? (
                  <PageImage
                    src={getGalleryImageByPath(galleryPhotos, `gallery:home:sustainability:${index}`) || item.imageUrl || ""}
                    path={`gallery:home:sustainability:${index}`}
                    aspectRatio="auto"
                    className="absolute inset-0 w-full h-full"
                  />
                ) : (
                  item.imageUrl || "/placeholder-sustainability.jpg"
                )
              }
              title={
                editor?.editMode ? (
                  <PageText page="home" section="sustainabilitySection" fieldKey={`items.${index}.title`} locale={locale as "pt" | "es" | "en"} as="span" />
                ) : (
                  getPageContent("home", "sustainabilitySection", `items.${index}.title`, locale as "pt" | "es" | "en", overrides) || item.title
                )
              }
              subtitle={
                editor?.editMode ? (
                  <PageText page="home" section="sustainabilitySection" fieldKey="title" locale={locale as "pt" | "es" | "en"} as="span" />
                ) : (
                  getPageContent("home", "sustainabilitySection", "title", locale as "pt" | "es" | "en", overrides) || "Sustentabilidade e Inclusão"
                )
              }
              description={
                editor?.editMode ? (
                  <PageText page="home" section="sustainabilitySection" fieldKey={`items.${index}.description`} locale={locale as "pt" | "es" | "en"} as="span" />
                ) : (
                  getPageContent("home", "sustainabilitySection", `items.${index}.description`, locale as "pt" | "es" | "en", overrides) || item.description
                )
              }
              textPosition={index % 2 === 0 ? "bottom-left" : "bottom-right"}
              overlay="medium"
            />
          ))}
        </EditorialCarousel>
      </div>
    </section>
  );
}
