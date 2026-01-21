"use client";

import Image from "next/image";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import NordestinoPattern from "@/components/NordestinoPattern";
import { EditorialCarousel, EditorialSlide } from "@/components/HorizontalScroll";
import { useLanguage } from "@/lib/context/LanguageContext";

interface Room {
  id: number;
  code: string;
  name: string;
  description?: string;
  shortDescription?: string;
  imageUrl: string;
}

interface PackagesSectionProps {
  rooms?: Room[];
}

export default function PackagesSection({
  rooms = [],
}: PackagesSectionProps) {
  const { locale } = useLanguage();
  
  // Filtrar apenas os quartos que queremos mostrar: suite-master (Superior), luxo, e standard
  const filteredRooms = rooms.filter(room => 
    room.code === "suite-master" ||
    room.code === "luxo" ||
    room.code === "standard"
  );

  // Ordenar: Quarto Superior (suite-master), Quarto Luxo, Quarto Standard
  const sortedItems = [...filteredRooms].sort((a, b) => {
    const order = ["suite-master", "luxo", "standard"];
    const aIndex = order.indexOf(a.code);
    const bIndex = order.indexOf(b.code);
    return (aIndex === -1 ? 999 : aIndex) - (bIndex === -1 ? 999 : bIndex);
  });

  return (
    <section className="py-16 lg:py-24 bg-background relative overflow-hidden">
      {/* Padrão decorativo nordestino sutil */}
      <NordestinoPattern variant="tile" opacity={0.02} />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-12 lg:mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Fique no Sonata!
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Escolha a experiência perfeita para sua estadia
          </p>
        </div>

        {sortedItems.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">
              Em breve teremos opções disponíveis!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-0">
            {sortedItems.map((room, index) => (
              <Link
                key={room.id}
                href={`/quartos/${room.code}`}
                className="group relative overflow-hidden"
              >
                {/* Imagem de Fundo */}
                <div className="relative w-full h-[400px] md:h-[500px] lg:h-[600px]">
                  <Image
                    src={room.imageUrl}
                    alt={room.name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                  
                  {/* Overlay Gradiente */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                  
                  {/* Texto Sobreposto */}
                  <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-8 lg:p-10">
                    <h3 className="text-white text-3xl md:text-4xl lg:text-5xl font-bold mb-3 drop-shadow-2xl">
                      {room.name}
                    </h3>
                    {(room.shortDescription || room.description) && (
                      <p className="text-white/90 text-base md:text-lg max-w-md leading-relaxed mb-4">
                        {room.shortDescription || room.description}
                      </p>
                    )}
                    
                    {/* CTA aparece no hover */}
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <span className="inline-block px-6 py-3 bg-white text-primary font-semibold rounded-full hover:bg-primary hover:text-white transition-colors">
                        Ver Detalhes →
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
