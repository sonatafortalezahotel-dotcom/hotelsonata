"use client";

import { useState } from "react";
import Image from "@/lib/app-image";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Users, Maximize2, Eye, Waves, ChevronLeft, ChevronRight } from "lucide-react";
import { useLanguage } from "@/lib/context/LanguageContext";
import { useCurrency } from "@/lib/hooks/useCurrency";

interface RoomCardProps {
  room: {
    id: number;
    code: string;
    name: string;
    description?: string;
    shortDescription?: string;
    imageUrl: string;
    gallery?: string[] | null;
    size: number; // metros quadrados
    maxGuests: number;
    hasSeaView: boolean;
    hasBalcony: boolean;
    amenities?: string[];
    basePrice?: number;
  };
}

export default function RoomCard({ room }: RoomCardProps) {
  const { locale } = useLanguage();
  const { formatPrice: formatPriceCurrency } = useCurrency();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  // Criar array de imagens: imageUrl + gallery, filtrando strings vazias
  const allImages = [
    room.imageUrl,
    ...(room.gallery || [])
  ].filter((img): img is string => Boolean(img) && typeof img === "string" && img.trim() !== "");

  const formatPrice = (price?: number) => {
    if (!price) return null;
    // O preço vem em centavos do banco, então precisa dividir por 100
    return formatPriceCurrency(price, locale);
  };

  const goToNext = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev + 1) % allImages.length);
  };

  const goToPrevious = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
  };

  const goToImage = (index: number, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIndex(index);
  };

  const labels = {
    pt: {
      seeDetails: "Ver Detalhes",
      reserve: "Reservar",
      seaView: "Vista Mar",
      balcony: "Varanda",
      m2: "m²",
      guests: "hóspedes",
    },
    es: {
      seeDetails: "Ver Detalles",
      reserve: "Reservar",
      seaView: "Vista al Mar",
      balcony: "Balcón",
      m2: "m²",
      guests: "huéspedes",
    },
    en: {
      seeDetails: "See Details",
      reserve: "Book Now",
      seaView: "Ocean View",
      balcony: "Balcony",
      m2: "m²",
      guests: "guests",
    },
  };

  const t = labels[locale as keyof typeof labels] || labels.pt;

  return (
    <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 group">
      <div className="relative w-full group/image">
        <AspectRatio ratio={16 / 9}>
          {allImages.length > 0 && allImages[currentImageIndex] ? (
            <Image
              src={allImages[currentImageIndex]}
              alt={room.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center">
              <span className="text-muted-foreground/50 text-sm">{room.name}</span>
            </div>
          )}
        </AspectRatio>
        
        {/* Navegação do Carrossel - Só aparece se houver mais de 1 imagem */}
        {allImages.length > 1 && (
          <>
            {/* Botão Anterior */}
            <button
              onClick={goToPrevious}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 opacity-0 group-hover/image:opacity-100 transition-opacity z-10"
              aria-label="Imagem anterior"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            
            {/* Botão Próximo */}
            <button
              onClick={goToNext}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 opacity-0 group-hover/image:opacity-100 transition-opacity z-10"
              aria-label="Próxima imagem"
            >
              <ChevronRight className="h-4 w-4" />
            </button>

            {/* Indicadores de Página */}
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
              {allImages.map((_, index) => (
                <button
                  key={index}
                  onClick={(e) => goToImage(index, e)}
                  className={`h-1.5 rounded-full transition-all ${
                    index === currentImageIndex
                      ? "bg-white w-6"
                      : "bg-white/50 w-1.5 hover:bg-white/75"
                  }`}
                  aria-label={`Ir para imagem ${index + 1}`}
                />
              ))}
            </div>

            {/* Contador de Imagens */}
            <div className="absolute top-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded z-10">
              {currentImageIndex + 1} / {allImages.length}
            </div>
          </>
        )}
        
        {/* Badges */}
        <div className="absolute top-4 right-4 flex flex-col gap-2 z-10">
          {room.hasSeaView && (
            <Badge className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg flex items-center gap-1">
              <Waves className="h-3 w-3" />
              {t.seaView}
            </Badge>
          )}
          {room.hasBalcony && (
            <Badge variant="secondary" className="shadow-lg flex items-center gap-1">
              <Eye className="h-3 w-3" />
              {t.balcony}
            </Badge>
          )}
        </div>
      </div>

      <CardHeader>
        <CardTitle className="text-xl lg:text-2xl group-hover:text-primary transition-colors">
          {room.name}
        </CardTitle>
        {room.shortDescription && (
          <CardDescription className="text-base line-clamp-2">
            {room.shortDescription}
          </CardDescription>
        )}
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Informações do Quarto */}
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Maximize2 className="h-4 w-4" />
            <span>{room.size}{t.m2}</span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            <span>Até {room.maxGuests} {t.guests}</span>
          </div>
        </div>

        {/* Amenidades (primeiras 3) */}
        {room.amenities && room.amenities.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {room.amenities.slice(0, 3).map((amenity, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {amenity}
              </Badge>
            ))}
            {room.amenities.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{room.amenities.length - 3}
              </Badge>
            )}
          </div>
        )}

        {/* Preço */}
        {room.basePrice && (
          <div className="pt-2 border-t">
            <p className="text-sm text-muted-foreground">A partir de</p>
            <p className="text-2xl font-bold text-primary">{formatPrice(room.basePrice)}</p>
            <p className="text-xs text-muted-foreground">por noite</p>
          </div>
        )}
      </CardContent>

      <CardFooter className="gap-2">
        <Button asChild variant="outline" className="flex-1">
          <Link href={`/quartos/${room.code}`}>
            {t.seeDetails}
          </Link>
        </Button>
        <Button asChild className="flex-1">
          <Link href={`/reservas?room=${room.code}`}>
            {t.reserve}
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}

