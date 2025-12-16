"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Users, Maximize2, Eye, Waves, ChevronLeft, ChevronRight, Loader2, AlertCircle, CheckCircle2 } from "lucide-react";
import { useLanguage } from "@/lib/context/LanguageContext";
import { useCurrency } from "@/lib/hooks/useCurrency";
import { cn } from "@/lib/utils";

interface RoomCardEnhancedProps {
  room: {
    id: number;
    code: string;
    name: string | null;
    description?: string | null;
    shortDescription?: string | null;
    imageUrl: string | null;
    gallery?: string[] | null;
    size?: number | null;
    maxGuests: number;
    hasSeaView: boolean;
    hasBalcony: boolean;
    amenities?: string[] | null;
    translatedAmenities?: string[] | null;
    basePrice?: number | null;
    available?: boolean;
    totalPrice?: number;
    nights?: number;
  };
  checkIn?: string;
  checkOut?: string;
  onImageClick?: (images: string[], index: number) => void;
  className?: string;
}

export default function RoomCardEnhanced({ 
  room, 
  checkIn, 
  checkOut, 
  onImageClick,
  className 
}: RoomCardEnhancedProps) {
  const { locale } = useLanguage();
  const { formatPrice: formatPriceCurrency } = useCurrency();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  // Criar array de imagens: imageUrl + gallery, filtrando strings vazias
  const allImages = [
    room.imageUrl,
    ...(room.gallery || [])
  ].filter((img): img is string => Boolean(img) && typeof img === "string" && img.trim() !== "");

  const formatPrice = (price?: number | null) => {
    if (!price) return null;
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

  const handleImageClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onImageClick && allImages.length > 0) {
      onImageClick(allImages, currentImageIndex);
    }
  };

  const labels = {
    pt: {
      seeDetails: "Ver Detalhes",
      reserve: "Reservar Agora",
      seaView: "Vista Mar",
      balcony: "Varanda",
      m2: "m²",
      guests: "hóspedes",
      perNight: "por noite",
      total: "Total",
      available: "Disponível",
      unavailable: "Indisponível",
      fewUnits: "Poucas unidades",
      popular: "Mais reservado",
      from: "A partir de",
    },
    es: {
      seeDetails: "Ver Detalles",
      reserve: "Reservar Ahora",
      seaView: "Vista al Mar",
      balcony: "Balcón",
      m2: "m²",
      guests: "huéspedes",
      perNight: "por noche",
      total: "Total",
      available: "Disponible",
      unavailable: "No Disponible",
      fewUnits: "Pocas unidades",
      popular: "Más reservado",
      from: "Desde",
    },
    en: {
      seeDetails: "See Details",
      reserve: "Book Now",
      seaView: "Ocean View",
      balcony: "Balcony",
      m2: "m²",
      guests: "guests",
      perNight: "per night",
      total: "Total",
      available: "Available",
      unavailable: "Unavailable",
      fewUnits: "Few units left",
      popular: "Most booked",
      from: "From",
    },
  };

  const t = labels[locale as keyof typeof labels] || labels.pt;
  const isAvailable = room.available !== false; // Default true se não verificado
  const amenities = room.translatedAmenities || room.amenities || [];

  // Construir URL de reserva com parâmetros
  const reservationUrl = checkIn && checkOut 
    ? `/reservas?checkin=${checkIn}&checkout=${checkOut}&room=${room.code}`
    : `/reservas?room=${room.code}`;

  return (
    <Card className={cn(
      "overflow-hidden transition-all duration-300 group",
      !isAvailable && "opacity-60",
      className
    )}>
      <div className={cn(
        "relative w-full group/image",
        !isAvailable && "after:absolute after:inset-0 after:bg-black/50 after:z-10"
      )}>
        <AspectRatio ratio={16 / 9}>
          {allImages.length > 0 && allImages[currentImageIndex] ? (
            <Image
              src={allImages[currentImageIndex]}
              alt={room.name || "Quarto"}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500 cursor-pointer"
              onClick={handleImageClick}
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center">
              <span className="text-muted-foreground/50 text-sm">{room.name || "Quarto"}</span>
            </div>
          )}
        </AspectRatio>
        
        {/* Navegação do Carrossel - Só aparece se houver mais de 1 imagem */}
        {allImages.length > 1 && (
          <>
            <button
              onClick={goToPrevious}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 opacity-0 group-hover/image:opacity-100 transition-opacity z-20"
              aria-label="Imagem anterior"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            
            <button
              onClick={goToNext}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 opacity-0 group-hover/image:opacity-100 transition-opacity z-20"
              aria-label="Próxima imagem"
            >
              <ChevronRight className="h-4 w-4" />
            </button>

            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5 z-20">
              {allImages.map((_, index) => (
                <button
                  key={index}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setCurrentImageIndex(index);
                  }}
                  className={cn(
                    "h-1.5 rounded-full transition-all",
                    index === currentImageIndex
                      ? "bg-white w-6"
                      : "bg-white/50 w-1.5 hover:bg-white/75"
                  )}
                  aria-label={`Ir para imagem ${index + 1}`}
                />
              ))}
            </div>

            <div className="absolute top-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded z-20">
              {currentImageIndex + 1} / {allImages.length}
            </div>
          </>
        )}
        
        {/* Badges de Status */}
        <div className="absolute top-4 right-4 flex flex-col gap-2 z-20">
          {!isAvailable && (
            <Badge variant="destructive" className="shadow-lg">
              <AlertCircle className="h-3 w-3 mr-1" />
              {t.unavailable}
            </Badge>
          )}
          {isAvailable && room.available === true && (
            <Badge className="bg-green-600 hover:bg-green-700 text-white shadow-lg">
              <CheckCircle2 className="h-3 w-3 mr-1" />
              {t.available}
            </Badge>
          )}
        </div>

        {/* Badges de Características */}
        <div className="absolute top-4 left-4 flex flex-col gap-2 z-20">
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
          {room.name || "Quarto"}
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
          {room.size && (
            <div className="flex items-center gap-1">
              <Maximize2 className="h-4 w-4" />
              <span>{room.size}{t.m2}</span>
            </div>
          )}
          <div className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            <span>
              {locale === "en" 
                ? `Up to ${room.maxGuests} ${t.guests}`
                : locale === "es"
                ? `Hasta ${room.maxGuests} ${t.guests}`
                : `Até ${room.maxGuests} ${t.guests}`}
            </span>
          </div>
        </div>

        {/* Amenidades (primeiras 3) */}
        {amenities.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {amenities.slice(0, 3).map((amenity, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {amenity}
              </Badge>
            ))}
            {amenities.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{amenities.length - 3}
              </Badge>
            )}
          </div>
        )}

        {/* Preço */}
        {room.basePrice && (
          <div className="pt-2 border-t">
            {room.totalPrice && room.nights ? (
              <>
                <p className="text-sm text-muted-foreground">
                  {formatPrice(room.basePrice)} {t.perNight}
                </p>
                <p className="text-lg font-semibold text-primary">
                  {t.total}: {formatPrice(room.totalPrice)}
                </p>
                <p className="text-xs text-muted-foreground">
                  {room.nights} {locale === "en" ? "nights" : locale === "es" ? "noches" : "noites"}
                </p>
              </>
            ) : (
              <>
                <p className="text-sm text-muted-foreground">{t.from}</p>
                <p className="text-2xl font-bold text-primary">{formatPrice(room.basePrice)}</p>
                <p className="text-xs text-muted-foreground">{t.perNight}</p>
              </>
            )}
          </div>
        )}
      </CardContent>

      <CardFooter className="gap-2">
        <Button 
          asChild 
          variant="outline" 
          className="flex-1"
          disabled={!isAvailable}
        >
          <Link href={`/quartos/${room.code}`}>
            {t.seeDetails}
          </Link>
        </Button>
        <Button 
          asChild 
          className="flex-1"
          disabled={!isAvailable}
        >
          <Link href={reservationUrl}>
            {t.reserve}
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}

