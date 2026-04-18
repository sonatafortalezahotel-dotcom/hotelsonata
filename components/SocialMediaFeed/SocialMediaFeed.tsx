"use client";

import Image from "@/lib/app-image";
import Link from "next/link";
import { Instagram } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { EditorialCarousel, EditorialSlide } from "@/components/HorizontalScroll";
import { useLanguage } from "@/lib/context/LanguageContext";
import { useEditor } from "@/lib/context/EditorContext";
import { PageText, PageImage } from "@/components/PageEditor";
import { cn } from "@/lib/utils";
import { getPageContent } from "@/lib/utils/pageContent";
import { getGalleryImageByPath } from "@/lib/utils/gallery-helpers";

interface SocialMediaPost {
  id: number;
  platform: string;
  imageUrl: string;
  link?: string;
}

interface GalleryPhoto {
  id: number;
  imageUrl: string;
  page?: string | null;
  section?: string | null;
  order?: number;
}

interface SocialMediaFeedProps {
  posts?: SocialMediaPost[];
  galleryPhotos?: Array<{ imageUrl: string; page?: string | null; section?: string | null; order?: number }>;
}

export default function SocialMediaFeed({
  posts = [],
  galleryPhotos = [],
}: SocialMediaFeedProps) {
  const { locale } = useLanguage();
  const editor = useEditor();
  const overrides = editor?.overrides ?? {};
  const displayPosts = posts;

  if (displayPosts.length === 0 && !editor?.editMode) {
    return null;
  }

  const postsToShow = displayPosts.length > 0 ? displayPosts : [{ id: 0, platform: "instagram", imageUrl: "", link: "#" }];

  return (
    <section className="py-10 lg:py-24 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 lg:mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            {editor?.editMode ? (
              <PageText page="home" section="socialMedia" fieldKey="title" locale={locale as "pt" | "es" | "en"} as="span" />
            ) : (
              getPageContent("home", "socialMedia", "title", locale as "pt" | "es" | "en", overrides) || "Nos Acompanhe nas Redes Sociais"
            )}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {editor?.editMode ? (
              <PageText page="home" section="socialMedia" fieldKey="subtitle" locale={locale as "pt" | "es" | "en"} as="span" />
            ) : (
              getPageContent("home", "socialMedia", "subtitle", locale as "pt" | "es" | "en", overrides) || "Veja o que está acontecendo no Hotel Sonata de Iracema"
            )}
          </p>
        </div>

        {/* Carrossel Editorial de Social Media */}
        <EditorialCarousel
          autoplay={true}
          autoplayInterval={4000}
          showNavigation={true}
          showProgress={true}
        >
          {postsToShow.map((post, index) => {
            const slideContent = (
              <div className="relative w-full h-[500px] md:h-[600px]">
                {editor?.editMode ? (
                  <div className="absolute inset-0 [&>div]:absolute [&>div]:inset-0 [&_img]:object-cover [&_img]:w-full [&_img]:h-full">
                    <PageImage
                      src={getGalleryImageByPath(galleryPhotos, `gallery:home:social-media:${index}`) || post.imageUrl || ""}
                      path={`gallery:home:social-media:${index}`}
                      aspectRatio="auto"
                      className="absolute inset-0 w-full h-full"
                    />
                  </div>
                ) : (
                  post.imageUrl ? (
                    <Image
                      src={post.imageUrl}
                      alt={`Post do ${post.platform}`}
                      fill
                      className="object-cover"
                      sizes="100vw"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-purple-600/20 to-pink-600/20 flex items-center justify-center">
                      <Instagram className="h-24 w-24 text-muted-foreground/50" />
                    </div>
                  )
                )}
                {/* Overlay com logo Instagram - pointer-events-none em modo edição para clicar na imagem */}
                <div className={cn("absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent", editor?.editMode && "pointer-events-none")} />
                <div className="absolute bottom-8 left-8 md:left-16">
                  <div className="flex items-center gap-3 text-white">
                    <Instagram className="h-8 w-8 md:h-10 md:w-10" />
                    <span className="text-xl md:text-2xl font-bold">
                      {editor?.editMode ? (
                        <PageText page="home" section="socialMedia" fieldKey="instagramHandle" locale={locale as "pt" | "es" | "en"} as="span" />
                      ) : (
                        getPageContent("home", "socialMedia", "instagramHandle", locale as "pt" | "es" | "en", overrides) || "@hotelsonata"
                      )}
                    </span>
                  </div>
                </div>
              </div>
            );
            const href = getPageContent("home", "socialMedia", "instagramUrl", locale as "pt" | "es" | "en", overrides) || post.link || "https://instagram.com/hotelsonata";
            return editor?.editMode ? (
              <div key={post.id} className="block">
                {slideContent}
              </div>
            ) : (
              <Link
                key={post.id}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="block"
              >
                {slideContent}
              </Link>
            );
          })}
        </EditorialCarousel>

        <div className="text-center mt-8 lg:mt-12">
          <Button
            asChild
            size="lg"
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg"
          >
            <Link
              href={getPageContent("home", "socialMedia", "instagramUrl", locale as "pt" | "es" | "en", overrides) || "https://instagram.com/hotelsonata"}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Instagram className="mr-2 h-5 w-5" />
              {editor?.editMode ? (
                <PageText page="home" section="socialMedia" fieldKey="buttonText" locale={locale as "pt" | "es" | "en"} as="span" />
              ) : (
                getPageContent("home", "socialMedia", "buttonText", locale as "pt" | "es" | "en", overrides) || "Seguir no Instagram"
              )}
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
