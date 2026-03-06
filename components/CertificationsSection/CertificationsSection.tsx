"use client";

import Image from "next/image";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { ElegantCarousel } from "@/components/HorizontalScroll";
import { useLanguage } from "@/lib/context/LanguageContext";
import { useEditor } from "@/lib/context/EditorContext";
import { PageText, PageImage } from "@/components/PageEditor";
import { getPageContent } from "@/lib/utils/pageContent";
import { getGalleryImageByPath } from "@/lib/utils/gallery-helpers";

interface Certification {
  id: number;
  name: string;
  imageUrl: string;
  description?: string;
}

interface CertificationsSectionProps {
  certifications?: Certification[];
  galleryPhotos?: Array<{ imageUrl: string; page?: string | null; section?: string | null; order?: number }>;
}

function CertCard({
  cert,
  index,
  editor,
  overrides,
  locale,
  galleryPhotos,
  className,
}: {
  cert: Certification;
  index: number;
  editor: { editMode?: boolean } | null;
  overrides: Record<string, string>;
  locale: string;
  galleryPhotos: Array<{ imageUrl: string; page?: string | null; section?: string | null; order?: number }> | undefined;
  className?: string;
}) {
  const imageSrc = editor?.editMode
    ? (getGalleryImageByPath(galleryPhotos, `gallery:home:certifications:${index}`) || cert.imageUrl)
    : cert.imageUrl;
  const nameContent = editor?.editMode ? (
    <PageText page="home" section="certificationsSection" fieldKey={`items.${index}.name`} locale={locale as "pt" | "es" | "en"} as="span" />
  ) : (
    getPageContent("home", "certificationsSection", `items.${index}.name`, locale as "pt" | "es" | "en", overrides) || cert.name
  );
  const descContent = cert.description
    ? (editor?.editMode ? (
        <PageText page="home" section="certificationsSection" fieldKey={`items.${index}.description`} locale={locale as "pt" | "es" | "en"} as="span" />
      ) : (
        getPageContent("home", "certificationsSection", `items.${index}.description`, locale as "pt" | "es" | "en", overrides) || cert.description
      ))
    : null;

  return (
    <Card className={className}>
      <CardHeader className="pb-4">
        <div className="relative w-24 h-24 lg:w-32 lg:h-32 mx-auto">
          <AspectRatio ratio={1}>
            {editor?.editMode ? (
              <PageImage
                src={imageSrc}
                path={`gallery:home:certifications:${index}`}
                aspectRatio="square"
                className="w-full h-full object-contain"
              />
            ) : (
              <Image
                src={imageSrc}
                alt={typeof nameContent === "string" ? nameContent : cert.name}
                fill
                className="object-contain"
              />
            )}
          </AspectRatio>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <CardTitle className="text-base lg:text-lg mb-2">
          {nameContent}
        </CardTitle>
        {descContent && (
          <CardDescription className="text-sm">
            {descContent}
          </CardDescription>
        )}
      </CardContent>
    </Card>
  );
}

export default function CertificationsSection({
  certifications = [],
  galleryPhotos = [],
}: CertificationsSectionProps) {
  const { locale } = useLanguage();
  const editor = useEditor();
  const overrides = editor?.overrides ?? {};
  const items = certifications;

  if (items.length === 0 && !editor?.editMode) {
    return null;
  }

  const itemsToShow = items.length > 0 ? items : [{ id: 0, name: "", imageUrl: "", description: "" }];

  return (
    <section className="py-16 lg:py-24 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 lg:mb-16 min-w-0">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4 min-w-0 break-words">
            {editor?.editMode ? (
              <PageText page="home" section="certificationsSection" fieldKey="title" locale={locale as "pt" | "es" | "en"} as="span" />
            ) : (
              getPageContent("home", "certificationsSection", "title", locale as "pt" | "es" | "en", overrides) || "Certificações e Selos"
            )}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto min-w-0 break-words">
            {editor?.editMode ? (
              <PageText page="home" section="certificationsSection" fieldKey="subtitle" locale={locale as "pt" | "es" | "en"} as="span" />
            ) : (
              getPageContent("home", "certificationsSection", "subtitle", locale as "pt" | "es" | "en", overrides) || "Reconhecimentos que comprovam nossa qualidade e compromisso"
            )}
          </p>
        </div>

        {/* Mobile/Tablet: Carrossel Elegante */}
        <div className="lg:hidden group">
          <ElegantCarousel
            itemWidth="small"
            showNavigation={true}
            showProgress={true}
            progressType="minimal"
            centerMode={false}
            gap={4}
          >
            {itemsToShow.map((cert, index) => (
              <CertCard
                key={cert.id}
                cert={cert}
                index={index}
                editor={editor}
                overrides={overrides}
                locale={locale}
                galleryPhotos={galleryPhotos}
                className="flex flex-col items-center text-center hover:shadow-lg transition-all duration-300 h-full"
              />
            ))}
          </ElegantCarousel>
        </div>

        {/* Desktop: Grid */}
        <div className="hidden lg:grid lg:grid-cols-4 gap-6 lg:gap-8 max-w-5xl mx-auto">
          {itemsToShow.map((cert, index) => (
            <CertCard
              key={cert.id}
              cert={cert}
              index={index}
              editor={editor}
              overrides={overrides}
              locale={locale}
              galleryPhotos={galleryPhotos}
              className="flex flex-col items-center text-center hover:shadow-lg transition-shadow duration-300"
            />
          ))}
        </div>
      </div>
    </section>
  );
}
