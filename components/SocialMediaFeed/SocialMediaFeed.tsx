"use client";

import Image from "next/image";
import Link from "next/link";
import { Instagram } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AspectRatio } from "@/components/ui/aspect-ratio";
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

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-6 gap-4 md:gap-6 lg:gap-8 max-w-7xl mx-auto">
          {displayPosts.map((post) => (
            <Link
              key={post.id}
              href={post.link || "#"}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative rounded-lg overflow-hidden hover:scale-105 transition-transform duration-300 shadow-md hover:shadow-xl"
            >
              <AspectRatio ratio={1}>
                <Image
                  src={post.imageUrl}
                  alt={`Post do ${post.platform}`}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 16vw"
                  className="object-cover"
                />
              </AspectRatio>
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                <Instagram className="h-6 w-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </Link>
          ))}
        </div>

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
