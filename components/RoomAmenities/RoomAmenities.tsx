"use client";

import {
  Wifi,
  Wind,
  Tv,
  Coffee,
  UtensilsCrossed,
  Droplet,
  Shield,
  Car,
  Dumbbell,
  Waves,
  Bed,
  Bath,
  Phone,
  Lock,
  Radio,
  Fan,
  Sun,
  Moon,
  Home,
  Key,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useLanguage } from "@/lib/context/LanguageContext";
import { cn } from "@/lib/utils";

interface RoomAmenitiesProps {
  amenities: string[];
  className?: string;
}

// Mapeamento de amenidades para ícones
const amenityIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  wifi: Wifi,
  "wi-fi": Wifi,
  internet: Wifi,
  "ar condicionado": Wind,
  "ar-condicionado": Wind,
  "air conditioning": Wind,
  ac: Wind,
  tv: Tv,
  televisão: Tv,
  television: Tv,
  "café da manhã": Coffee,
  breakfast: Coffee,
  restaurante: UtensilsCrossed,
  restaurant: UtensilsCrossed,
  água: Droplet,
  water: Droplet,
  segurança: Shield,
  security: Shield,
  estacionamento: Car,
  parking: Car,
  academia: Dumbbell,
  gym: Dumbbell,
  "vista mar": Waves,
  "sea view": Waves,
  cama: Bed,
  bed: Bed,
  banheiro: Bath,
  bathroom: Bath,
  telefone: Phone,
  phone: Phone,
  cofre: Lock,
  safe: Lock,
  rádio: Radio,
  radio: Radio,
  ventilador: Fan,
  fan: Fan,
  sol: Sun,
  sun: Sun,
  lua: Moon,
  moon: Moon,
  quarto: Home,
  room: Home,
  chave: Key,
  key: Key,
};

// Categorias de amenidades
const amenityCategories = {
  basic: ["wifi", "wi-fi", "internet", "tv", "televisão", "television", "ar condicionado", "ar-condicionado", "air conditioning", "ac"],
  comfort: ["cama", "bed", "banheiro", "bathroom", "ventilador", "fan", "cofre", "safe"],
  services: ["café da manhã", "breakfast", "restaurante", "restaurant", "estacionamento", "parking", "segurança", "security"],
  leisure: ["vista mar", "sea view", "academia", "gym"],
};

export default function RoomAmenities({ amenities, className }: RoomAmenitiesProps) {
  const { locale } = useLanguage();

  const labels = {
    pt: {
      title: "O que este quarto oferece",
      basic: "Essenciais",
      comfort: "Conforto",
      services: "Serviços",
      leisure: "Lazer",
      other: "Outros",
    },
    es: {
      title: "Qué ofrece esta habitación",
      basic: "Esenciales",
      comfort: "Comodidad",
      services: "Servicios",
      leisure: "Ocio",
      other: "Otros",
    },
    en: {
      title: "What this room offers",
      basic: "Essentials",
      comfort: "Comfort",
      services: "Services",
      leisure: "Leisure",
      other: "Other",
    },
  };

  const t = labels[locale as keyof typeof labels] || labels.pt;

  // Categorizar amenidades
  const categorizedAmenities: Record<string, string[]> = {
    basic: [],
    comfort: [],
    services: [],
    leisure: [],
    other: [],
  };

  amenities.forEach((amenity) => {
    const lowerAmenity = amenity.toLowerCase();
    let categorized = false;

    for (const [category, keywords] of Object.entries(amenityCategories)) {
      if (keywords.some((keyword) => lowerAmenity.includes(keyword))) {
        categorizedAmenities[category].push(amenity);
        categorized = true;
        break;
      }
    }

    if (!categorized) {
      categorizedAmenities.other.push(amenity);
    }
  });

  const getIcon = (amenity: string) => {
    const lowerAmenity = amenity.toLowerCase();
    for (const [key, Icon] of Object.entries(amenityIcons)) {
      if (lowerAmenity.includes(key)) {
        return Icon;
      }
    }
    return null;
  };

  const renderCategory = (category: string, items: string[]) => {
    if (items.length === 0) return null;

    const categoryLabels: Record<string, string> = {
      basic: t.basic,
      comfort: t.comfort,
      services: t.services,
      leisure: t.leisure,
      other: t.other,
    };

    return (
      <div key={category} className="space-y-3">
        <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
          {categoryLabels[category]}
        </h4>
        <div className="grid md:grid-cols-2 gap-3">
          {items.map((amenity, index) => {
            const Icon = getIcon(amenity);
            return (
              <div key={index} className="flex items-center gap-3">
                {Icon ? (
                  <Icon className="h-5 w-5 text-primary flex-shrink-0" />
                ) : (
                  <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center">
                    <div className="h-2 w-2 rounded-full bg-primary" />
                  </div>
                )}
                <span className="text-sm text-foreground">{amenity}</span>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  if (amenities.length === 0) return null;

  return (
    <Card className={cn(className)}>
      <CardHeader>
        <CardTitle className="text-2xl">{t.title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {Object.entries(categorizedAmenities).map(([category, items]) =>
          renderCategory(category, items)
        )}
      </CardContent>
    </Card>
  );
}

