"use client";

import Image from "next/image";
import Link from "next/link";
import { Instagram } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { EditorialCarousel, EditorialSlide } from "@/components/HorizontalScroll";
import { useLanguage } from "@/lib/context/LanguageContext";

interface SocialMediaPost {
  id: number;
  platform: string;
  imageUrl: string;
  link?: string;
}

interface SocialMediaFeedProps {
  posts?: SocialMediaPost[];
}

export default function SocialMediaFeed({
  posts = [],
}: SocialMediaFeedProps) {
  const { locale } = useLanguage();
  const displayPosts = posts;

  if (displayPosts.length === 0) {
    return null;
  }

  return (
    <section className="py-16 lg:py-24 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 lg:mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Nos Acompanhe nas Redes Sociais
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Veja o que está acontecendo no Hotel Sonata de Iracema
          </p>
        </div>

        {/* Carrossel Editorial de Social Media */}
        <EditorialCarousel
          autoplay={true}
          autoplayInterval={4000}
          showNavigation={true}
          showProgress={true}
        >
          {displayPosts.map((post, index) => (
            <Link
              key={post.id}
              href={post.link || "#"}
              target="_blank"
              rel="noopener noreferrer"
              className="block"
            >
              <div className="relative w-full h-[500px] md:h-[600px]">
                <Image
                  src={post.imageUrl}
                  alt={`Post do ${post.platform}`}
                  fill
                  className="object-cover"
                  sizes="100vw"
                />
                {/* Overlay com logo Instagram */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                <div className="absolute bottom-8 left-8 md:left-16">
                  <div className="flex items-center gap-3 text-white">
                    <Instagram className="h-8 w-8 md:h-10 md:w-10" />
                    <span className="text-xl md:text-2xl font-bold">@hotelsonata</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </EditorialCarousel>

        <div className="text-center mt-8 lg:mt-12">
          <Button
            asChild
            size="lg"
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg"
          >
            <Link
              href="https://instagram.com/hotelsonata"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Instagram className="mr-2 h-5 w-5" />
              Seguir no Instagram
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
