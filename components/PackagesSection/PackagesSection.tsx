"use client";

import Image from "@/lib/app-image";
import Link from "next/link";
import { ReactNode } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import NordestinoPattern from "@/components/NordestinoPattern";
import { EditorialCarousel, EditorialSlide } from "@/components/HorizontalScroll";
import { useLanguage } from "@/lib/context/LanguageContext";
import { useEditor } from "@/lib/context/EditorContext";
import { PageText } from "@/components/PageEditor";
import { getPageContent } from "@/lib/utils/pageContent";

interface Room {
  id: number;
  code: string;
  name: string;
  description?: string;
  shortDescription?: string;
  imageUrl: string;
}

interface Package {
  id: number;
  name: string;
  description?: string;
  imageUrl: string;
  price?: number | null;
  category?: string | null;
}

interface PackagesSectionProps {
  rooms?: Room[];
  packages?: Package[];
  title?: ReactNode;
  subtitle?: ReactNode;
  empty?: ReactNode;
  cta?: ReactNode;
  packagesCta?: ReactNode;
}

const defaultTitle = "Fique no Sonata!";
const defaultSubtitle = "Escolha a experiência perfeita para sua estadia";
const defaultEmpty = "Em breve teremos opções disponíveis!";
const defaultCta = "Ver Detalhes →";
const defaultPackagesCta = "Saiba Mais →";

export default function PackagesSection({
  rooms = [],
  packages = [],
  title,
  subtitle,
  empty,
  cta,
  packagesCta,
}: PackagesSectionProps) {
  const { locale } = useLanguage();
  const editor = useEditor();
  const overrides = editor?.overrides ?? {};
  const ctaContent = cta ?? (editor?.editMode ? (
    <PageText page="home" section="packagesSection" fieldKey="cta" locale={locale as "pt" | "es" | "en"} as="span" />
  ) : (
    getPageContent("home", "packagesSection", "cta", locale as "pt" | "es" | "en", overrides) || defaultCta
  ));
  
  const packagesCtaContent = packagesCta ?? (editor?.editMode ? (
    <PageText page="home" section="packagesSection" fieldKey="packagesCta" locale={locale as "pt" | "es" | "en"} as="span" />
  ) : (
    getPageContent("home", "packagesSection", "packagesCta", locale as "pt" | "es" | "en", overrides) || defaultPackagesCta
  ));
  
  // Exibir todos os quartos e pacotes cadastrados na ordem definida pelo cliente
  const sortedRooms = rooms;
  const sortedPackages = packages;
  
  const hasContent = sortedRooms.length > 0 || sortedPackages.length > 0;

  return (
    <section className="py-10 lg:py-24 bg-background relative overflow-hidden">
      {/* Padrão decorativo nordestino sutil */}
      <NordestinoPattern variant="tile" opacity={0.02} />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-8 lg:mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            {title ?? defaultTitle}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {subtitle ?? defaultSubtitle}
          </p>
        </div>

        {!hasContent ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">
              {empty ?? defaultEmpty}
            </p>
          </div>
        ) : (
          <>
            {/* Grid de Quartos */}
            {sortedRooms.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-0">
                {sortedRooms.map((room) => (
                  <Link
                    key={room.id}
                    href={`/quartos/${room.code}`}
                    className="group relative overflow-hidden"
                  >
                    {/* Imagem de Fundo - qualidade alta para exibição em destaque */}
                    <div className="relative w-full h-[400px] md:h-[500px] lg:h-[600px]">
                      <Image
                        src={room.imageUrl}
                        alt={room.name || room.code || "Quarto"}
                        fill
                        quality={90}
                        priority={sortedRooms.indexOf(room) < 2}
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 640px"
                      />
                      
                      {/* Overlay Gradiente */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                      
                      {/* Texto Sobreposto (nome/descrição vêm das traduções por idioma; quebra de linha após a primeira palavra) */}
                      <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-8 lg:p-10">
                        <h3 className="text-white text-3xl md:text-4xl lg:text-5xl font-bold mb-3 drop-shadow-2xl">
                          {(() => {
                            const name = room.name || room.code || (locale === "es" ? "Habitación" : locale === "en" ? "Room" : "Quarto");
                            const parts = String(name).trim().split(/\s+/);
                            if (parts.length >= 2) {
                              return (
                                <>
                                  <span className="block">{parts[0]}</span>
                                  <span className="block">{parts.slice(1).join(" ")}</span>
                                </>
                              );
                            }
                            return name;
                          })()}
                        </h3>
                        {(room.shortDescription || room.description) && (
                          <p className="text-white/90 text-base md:text-lg max-w-md leading-relaxed mb-4">
                            {room.shortDescription || room.description}
                          </p>
                        )}
                        
                        {/* CTA aparece no hover */}
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <span className="inline-block px-6 py-3 bg-white text-primary font-semibold rounded-full hover:bg-primary hover:text-white transition-colors">
                            {ctaContent}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}

            {/* Grid de Pacotes */}
            {sortedPackages.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-0 mt-0">
                {sortedPackages.map((pkg) => (
                  <Link
                    key={pkg.id}
                    href={`/pacotes/${pkg.id}`}
                    className="group relative overflow-hidden"
                  >
                    {/* Imagem de Fundo */}
                    <div className="relative w-full h-[400px] md:h-[500px] lg:h-[600px]">
                      <Image
                        src={pkg.imageUrl}
                        alt={pkg.name || "Pacote"}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                      
                      {/* Overlay Gradiente */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                      
                      {/* Texto Sobreposto */}
                      <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-8 lg:p-10">
                        {/* Badge de preço se disponível */}
                        {pkg.price && (
                          <span className="inline-block self-start px-4 py-1.5 bg-primary text-white text-sm font-semibold rounded-full mb-3">
                            A partir de R$ {pkg.price}
                          </span>
                        )}
                        <h3 className="text-white text-3xl md:text-4xl lg:text-5xl font-bold mb-3 drop-shadow-2xl">
                          {pkg.name}
                        </h3>
                        {pkg.description && (
                          <p className="text-white/90 text-base md:text-lg max-w-md leading-relaxed mb-4">
                            {pkg.description}
                          </p>
                        )}
                        
                        {/* CTA aparece no hover */}
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <span className="inline-block px-6 py-3 bg-white text-primary font-semibold rounded-full hover:bg-primary hover:text-white transition-colors">
                            {packagesCtaContent}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}
