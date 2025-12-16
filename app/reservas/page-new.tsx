"use client";

import { useEffect, useState, useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { format, parse, differenceInDays } from "date-fns";
import { ptBR } from "date-fns/locale/pt-BR";
import { Loader2, Filter, Grid, List } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/lib/context/LanguageContext";
import { HeroWithImage } from "@/components/HeroWithImage";
import { getRooms } from "@/lib/hooks/useRooms";
import RoomCardEnhanced from "@/components/RoomCard/RoomCardEnhanced";
import { RoomFilters, RoomFiltersType } from "@/components/RoomFilters";
import { RoomSort, SortOption } from "@/components/RoomSort";
import { Lightbox } from "@/components/Lightbox";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface Room {
  id: number;
  code: string;
  name: string | null;
  description: string | null;
  shortDescription: string | null;
  size: number | null;
  maxGuests: number;
  hasSeaView: boolean;
  hasBalcony: boolean;
  amenities: string[] | null;
  translatedAmenities: string[] | null;
  basePrice: number | null;
  imageUrl: string | null;
  gallery: string[] | null;
  available?: boolean;
}

export default function ReservasPage() {
  const { locale } = useLanguage();
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [checkIn, setCheckIn] = useState<Date | null>(null);
  const [checkOut, setCheckOut] = useState<Date | null>(null);
  const [adults, setAdults] = useState("2");
  const [children, setChildren] = useState("0");
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<RoomFiltersType>({});
  const [sortBy, setSortBy] = useState<SortOption>("price-asc");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [lightboxImages, setLightboxImages] = useState<string[]>([]);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const labels = {
    pt: {
      title: "Buscar Quartos",
      subtitle: "Encontre o quarto perfeito para sua estadia",
      noRooms: "Nenhum quarto disponível",
      noRoomsDescription: "Tente ajustar suas datas ou filtros",
      loading: "Carregando quartos...",
      filters: "Filtros",
      sort: "Ordenar",
      viewGrid: "Visualização em grade",
      viewList: "Visualização em lista",
      results: "resultados encontrados",
      availableRooms: "quartos disponíveis",
    },
    es: {
      title: "Buscar Habitaciones",
      subtitle: "Encuentre la habitación perfecta para su estadía",
      noRooms: "No hay habitaciones disponibles",
      noRoomsDescription: "Intente ajustar sus fechas o filtros",
      loading: "Cargando habitaciones...",
      filters: "Filtros",
      sort: "Ordenar",
      viewGrid: "Vista de cuadrícula",
      viewList: "Vista de lista",
      results: "resultados encontrados",
      availableRooms: "habitaciones disponibles",
    },
    en: {
      title: "Search Rooms",
      subtitle: "Find the perfect room for your stay",
      noRooms: "No rooms available",
      noRoomsDescription: "Try adjusting your dates or filters",
      loading: "Loading rooms...",
      filters: "Filters",
      sort: "Sort",
      viewGrid: "Grid view",
      viewList: "List view",
      results: "results found",
      availableRooms: "available rooms",
    },
  };

  const t = labels[locale as keyof typeof labels] || labels.pt;

  // Carregar parâmetros da URL
  useEffect(() => {
    const checkInParam = searchParams.get("checkin");
    const checkOutParam = searchParams.get("checkout");
    const adultsParam = searchParams.get("adults");
    const childrenParam = searchParams.get("children");

    if (checkInParam) {
      const date = parse(checkInParam, "yyyy-MM-dd", new Date());
      if (!isNaN(date.getTime())) setCheckIn(date);
    }
    if (checkOutParam) {
      const date = parse(checkOutParam, "yyyy-MM-dd", new Date());
      if (!isNaN(date.getTime())) setCheckOut(date);
    }
    if (adultsParam) setAdults(adultsParam);
    if (childrenParam) setChildren(childrenParam);
  }, [searchParams]);

  // Buscar quartos e verificar disponibilidade
  useEffect(() => {
    async function fetchRoomsAndAvailability() {
      try {
        setLoading(true);
        
        // Buscar quartos
        const roomsData = await getRooms(true, locale);
        setRooms(roomsData as Room[]);
        
        // Se houver datas, verificar disponibilidade
        if (checkIn && checkOut) {
          const checkInStr = format(checkIn, "yyyy-MM-dd");
          const checkOutStr = format(checkOut, "yyyy-MM-dd");
          
          const response = await fetch(
            `/api/reservations?checkin=${checkInStr}&checkout=${checkOutStr}&adults=${adults}`
          );
          
          if (response.ok) {
            const data = await response.json();
            
            // Atualizar disponibilidade dos quartos
            const roomsWithAvailability = roomsData.map((room: Room) => {
              const availableRoom = data.rooms.find(
                (r: any) => r.id === room.id
              );
              return {
                ...room,
                available: availableRoom?.available ?? false,
                totalPrice: availableRoom?.available 
                  ? (room.basePrice || 0) * data.nights 
                  : undefined,
                nights: data.nights,
              };
            });
            
            setRooms(roomsWithAvailability);
          }
        }
      } catch (error) {
        console.error("Erro ao buscar quartos:", error);
        toast.error(
          locale === "en"
            ? "Error loading rooms"
            : locale === "es"
            ? "Error al cargar habitaciones"
            : "Erro ao carregar quartos"
        );
      } finally {
        setLoading(false);
      }
    }
    fetchRoomsAndAvailability();
  }, [locale, checkIn, checkOut, adults]);

  // Filtrar e ordenar quartos
  const filteredAndSortedRooms = useMemo(() => {
    let filtered = [...rooms];

    // Filtrar por disponibilidade (se houver datas)
    if (checkIn && checkOut) {
      filtered = filtered.filter((room) => room.available !== false);
    }

    // Filtrar por preço
    if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
      filtered = filtered.filter((room) => {
        const price = room.basePrice || 0;
        const min = filters.minPrice ?? 0;
        const max = filters.maxPrice ?? Infinity;
        return price >= min && price <= max;
      });
    }

    // Filtrar por características
    if (filters.hasSeaView === true) {
      filtered = filtered.filter((room) => room.hasSeaView);
    }
    if (filters.hasBalcony === true) {
      filtered = filtered.filter((room) => room.hasBalcony);
    }

    // Filtrar por amenidades
    if (filters.amenities && filters.amenities.length > 0) {
      filtered = filtered.filter((room) => {
        const roomAmenities = room.translatedAmenities || room.amenities || [];
        return filters.amenities!.some((amenity) =>
          roomAmenities.some((ra) =>
            ra.toLowerCase().includes(amenity.toLowerCase())
          )
        );
      });
    }

    // Ordenar
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "price-asc":
          return (a.basePrice || 0) - (b.basePrice || 0);
        case "price-desc":
          return (b.basePrice || 0) - (a.basePrice || 0);
        case "name-asc":
          return (a.name || "").localeCompare(b.name || "");
        case "popular":
          // Por enquanto, ordenar por disponibilidade (disponíveis primeiro)
          if (a.available === true && b.available !== true) return -1;
          if (a.available !== true && b.available === true) return 1;
          return 0;
        default:
          return 0;
      }
    });

    return filtered;
  }, [rooms, filters, sortBy, checkIn, checkOut]);

  // Coletar todas as amenidades disponíveis
  const availableAmenities = useMemo(() => {
    const amenitySet = new Set<string>();
    rooms.forEach((room) => {
      const amenities = room.translatedAmenities || room.amenities || [];
      amenities.forEach((amenity) => amenitySet.add(amenity));
    });
    return Array.from(amenitySet).sort();
  }, [rooms]);

  // Calcular preço máximo
  const maxPrice = useMemo(() => {
    if (rooms.length === 0) return 100000; // R$ 1000 em centavos
    return Math.max(...rooms.map((r) => r.basePrice || 0), 100000);
  }, [rooms]);

  const handleImageClick = (images: string[], index: number) => {
    setLightboxImages(images);
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  const checkInStr = checkIn ? format(checkIn, "yyyy-MM-dd") : "";
  const checkOutStr = checkOut ? format(checkOut, "yyyy-MM-dd") : "";

  return (
    <>
      {/* Hero Section */}
      <HeroWithImage
        title={t.title}
        subtitle={t.subtitle}
        image=""
        imageAlt="Buscar Quartos"
        height="medium"
        overlay="medium"
      />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="max-w-7xl mx-auto">
          {/* Barra de Controles */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
            <div className="flex items-center gap-4">
              <div className="text-sm text-muted-foreground">
                {filteredAndSortedRooms.length} {t.results}
              </div>
            </div>
            <div className="flex items-center gap-4 w-full md:w-auto">
              <RoomSort value={sortBy} onValueChange={setSortBy} className="flex-1 md:flex-initial" />
              <div className="flex border rounded-md">
                <Button
                  variant={viewMode === "grid" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                  className="rounded-r-none"
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                  className="rounded-l-none"
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-4 gap-8">
            {/* Sidebar - Filtros */}
            <div className="lg:col-span-1">
              <RoomFilters
                filters={filters}
                onFiltersChange={setFilters}
                maxPrice={maxPrice}
                availableAmenities={availableAmenities}
              />
            </div>

            {/* Lista de Quartos */}
            <div className="lg:col-span-3">
              {loading ? (
                <div className="flex items-center justify-center py-24">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  <span className="ml-3 text-muted-foreground">{t.loading}</span>
                </div>
              ) : filteredAndSortedRooms.length === 0 ? (
                <Card>
                  <CardContent className="py-24 text-center">
                    <p className="text-lg font-semibold mb-2">{t.noRooms}</p>
                    <p className="text-muted-foreground">{t.noRoomsDescription}</p>
                  </CardContent>
                </Card>
              ) : (
                <div
                  className={cn(
                    "grid gap-6",
                    viewMode === "grid"
                      ? "grid-cols-1 md:grid-cols-2"
                      : "grid-cols-1"
                  )}
                >
                  {filteredAndSortedRooms.map((room) => (
                    <RoomCardEnhanced
                      key={room.id}
                      room={room}
                      checkIn={checkInStr}
                      checkOut={checkOutStr}
                      onImageClick={handleImageClick}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Lightbox */}
      <Lightbox
        images={lightboxImages}
        initialIndex={lightboxIndex}
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
      />
    </>
  );
}

