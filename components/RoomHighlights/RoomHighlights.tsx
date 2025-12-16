"use client";

import { 
  Waves, 
  Eye, 
  Users, 
  Maximize2, 
  Bed, 
  Wifi, 
  Wind, 
  Tv, 
  Coffee,
  Shield,
  Key,
  Clock,
  MapPin,
  Car,
  UtensilsCrossed
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/lib/context/LanguageContext";
import { cn } from "@/lib/utils";

interface RoomHighlightsProps {
  room: {
    hasSeaView: boolean;
    hasBalcony: boolean;
    maxGuests: number;
    size: number | null;
    basePrice?: number | null;
  };
  className?: string;
}

const highlightIcons = {
  seaView: Waves,
  balcony: Eye,
  guests: Users,
  size: Maximize2,
  bed: Bed,
  wifi: Wifi,
  ac: Wind,
  tv: Tv,
  breakfast: Coffee,
  security: Shield,
  key: Key,
  checkin: Clock,
  location: MapPin,
  parking: Car,
  restaurant: UtensilsCrossed,
};

export default function RoomHighlights({ room, className }: RoomHighlightsProps) {
  const { locale } = useLanguage();

  const labels = {
    pt: {
      highlights: "Destaques",
      seaView: "Vista para o Mar",
      balcony: "Varanda Privativa",
      guests: "Até {count} hóspedes",
      size: "{size} m²",
      bed: "Cama King Size",
      wifi: "WiFi Grátis",
      ac: "Ar Condicionado",
      tv: "TV Smart",
      breakfast: "Café da Manhã Incluído",
      security: "Segurança 24h",
      key: "Check-in Expresso",
      checkin: "Check-in a partir das 14h",
      location: "Localização Privilegiada",
      parking: "Estacionamento",
      restaurant: "Restaurante no Hotel",
    },
    es: {
      highlights: "Destacados",
      seaView: "Vista al Mar",
      balcony: "Balcón Privado",
      guests: "Hasta {count} huéspedes",
      size: "{size} m²",
      bed: "Cama King Size",
      wifi: "WiFi Gratis",
      ac: "Aire Acondicionado",
      tv: "TV Smart",
      breakfast: "Desayuno Incluido",
      security: "Seguridad 24h",
      key: "Check-in Express",
      checkin: "Check-in desde las 14h",
      location: "Ubicación Privilegiada",
      parking: "Estacionamiento",
      restaurant: "Restaurante en el Hotel",
    },
    en: {
      highlights: "Highlights",
      seaView: "Ocean View",
      balcony: "Private Balcony",
      guests: "Up to {count} guests",
      size: "{size} m²",
      bed: "King Size Bed",
      wifi: "Free WiFi",
      ac: "Air Conditioning",
      tv: "Smart TV",
      breakfast: "Breakfast Included",
      security: "24h Security",
      key: "Express Check-in",
      checkin: "Check-in from 2pm",
      location: "Prime Location",
      parking: "Parking",
      restaurant: "Hotel Restaurant",
    },
  };

  const t = labels[locale as keyof typeof labels] || labels.pt;

  const highlights = [
    room.hasSeaView && {
      icon: highlightIcons.seaView,
      label: t.seaView,
      color: "bg-blue-50 text-blue-700 border-blue-200",
    },
    room.hasBalcony && {
      icon: highlightIcons.balcony,
      label: t.balcony,
      color: "bg-green-50 text-green-700 border-green-200",
    },
    {
      icon: highlightIcons.guests,
      label: t.guests.replace("{count}", room.maxGuests.toString()),
      color: "bg-purple-50 text-purple-700 border-purple-200",
    },
    room.size && {
      icon: highlightIcons.size,
      label: t.size.replace("{size}", room.size.toString()),
      color: "bg-orange-50 text-orange-700 border-orange-200",
    },
    {
      icon: highlightIcons.bed,
      label: t.bed,
      color: "bg-pink-50 text-pink-700 border-pink-200",
    },
    {
      icon: highlightIcons.wifi,
      label: t.wifi,
      color: "bg-indigo-50 text-indigo-700 border-indigo-200",
    },
    {
      icon: highlightIcons.ac,
      label: t.ac,
      color: "bg-cyan-50 text-cyan-700 border-cyan-200",
    },
    {
      icon: highlightIcons.tv,
      label: t.tv,
      color: "bg-red-50 text-red-700 border-red-200",
    },
    {
      icon: highlightIcons.breakfast,
      label: t.breakfast,
      color: "bg-amber-50 text-amber-700 border-amber-200",
    },
    {
      icon: highlightIcons.security,
      label: t.security,
      color: "bg-emerald-50 text-emerald-700 border-emerald-200",
    },
    {
      icon: highlightIcons.key,
      label: t.key,
      color: "bg-teal-50 text-teal-700 border-teal-200",
    },
    {
      icon: highlightIcons.location,
      label: t.location,
      color: "bg-violet-50 text-violet-700 border-violet-200",
    },
  ].filter(Boolean) as Array<{
    icon: React.ComponentType<{ className?: string }>;
    label: string;
    color: string;
  }>;

  return (
    <Card className={cn("border-2", className)}>
      <CardContent className="p-6">
        <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
          <span className="w-1 h-6 bg-primary rounded-full"></span>
          {t.highlights}
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {highlights.map((highlight, index) => {
            const Icon = highlight.icon;
            return (
              <div
                key={index}
                className={cn(
                  "flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-all hover:scale-105",
                  highlight.color
                )}
              >
                <Icon className="h-6 w-6" />
                <span className="text-xs font-medium text-center leading-tight">
                  {highlight.label}
                </span>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

