"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Waves, Eye, X } from "lucide-react";
import { useLanguage } from "@/lib/context/LanguageContext";
import { useCurrency } from "@/lib/hooks/useCurrency";
import { cn } from "@/lib/utils";

export interface RoomFilters {
  minPrice?: number;
  maxPrice?: number;
  hasSeaView?: boolean;
  hasBalcony?: boolean;
  amenities?: string[];
}

interface RoomFiltersProps {
  filters: RoomFilters;
  onFiltersChange: (filters: RoomFilters) => void;
  maxPrice?: number;
  availableAmenities?: string[];
  className?: string;
}

export default function RoomFilters({
  filters,
  onFiltersChange,
  maxPrice = 100000, // em centavos (R$ 1000)
  availableAmenities = [],
  className,
}: RoomFiltersProps) {
  const { locale } = useLanguage();
  const { formatPrice: formatPriceCurrency } = useCurrency();
  const [localFilters, setLocalFilters] = useState<RoomFilters>(filters);

  const labels = {
    pt: {
      title: "Filtros",
      price: "Preço",
      features: "Características",
      amenities: "Amenidades",
      seaView: "Vista Mar",
      balcony: "Varanda",
      clear: "Limpar Filtros",
    },
    es: {
      title: "Filtros",
      price: "Precio",
      features: "Características",
      amenities: "Amenidades",
      seaView: "Vista al Mar",
      balcony: "Balcón",
      clear: "Limpiar Filtros",
    },
    en: {
      title: "Filters",
      price: "Price",
      features: "Features",
      amenities: "Amenities",
      seaView: "Ocean View",
      balcony: "Balcony",
      clear: "Clear Filters",
    },
  };

  const t = labels[locale as keyof typeof labels] || labels.pt;

  const handlePriceChange = (values: number[]) => {
    const newFilters = {
      ...localFilters,
      minPrice: values[0],
      maxPrice: values[1],
    };
    setLocalFilters(newFilters);
    onFiltersChange(newFilters); // Aplicar automaticamente
  };

  const handleFeatureChange = (feature: "hasSeaView" | "hasBalcony", checked: boolean) => {
    const newFilters = {
      ...localFilters,
      [feature]: checked ? true : undefined,
    };
    setLocalFilters(newFilters);
    onFiltersChange(newFilters); // Aplicar automaticamente
  };

  const handleAmenityChange = (amenity: string, checked: boolean) => {
    const currentAmenities = localFilters.amenities || [];
    const newFilters = {
      ...localFilters,
      amenities: checked
        ? [...currentAmenities, amenity]
        : currentAmenities.filter((a) => a !== amenity),
    };
    setLocalFilters(newFilters);
    onFiltersChange(newFilters); // Aplicar automaticamente
  };

  const handleClear = () => {
    const cleared: RoomFilters = {};
    setLocalFilters(cleared);
    onFiltersChange(cleared);
  };

  const hasActiveFilters = 
    localFilters.minPrice !== undefined ||
    localFilters.maxPrice !== undefined ||
    localFilters.hasSeaView === true ||
    localFilters.hasBalcony === true ||
    (localFilters.amenities && localFilters.amenities.length > 0);

  const formatPrice = (price: number) => {
    return formatPriceCurrency(price, locale);
  };

  return (
    <Card className={cn("sticky top-24", className)}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{t.title}</CardTitle>
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClear}
              className="h-8 px-2"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Preço */}
        <div className="space-y-4">
          <Label className="text-base font-semibold">{t.price}</Label>
          <Slider
            min={0}
            max={maxPrice}
            step={1000}
            value={[
              localFilters.minPrice || 0,
              localFilters.maxPrice || maxPrice,
            ]}
            onValueChange={handlePriceChange}
            className="w-full"
          />
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>{formatPrice(localFilters.minPrice || 0)}</span>
            <span>{formatPrice(localFilters.maxPrice || maxPrice)}</span>
          </div>
        </div>

        {/* Características */}
        <div className="space-y-3">
          <Label className="text-base font-semibold">{t.features}</Label>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="seaView"
                checked={localFilters.hasSeaView === true}
                onCheckedChange={(checked) =>
                  handleFeatureChange("hasSeaView", checked === true)
                }
              />
              <Label
                htmlFor="seaView"
                className="flex items-center gap-2 cursor-pointer font-normal"
              >
                <Waves className="h-4 w-4" />
                {t.seaView}
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="balcony"
                checked={localFilters.hasBalcony === true}
                onCheckedChange={(checked) =>
                  handleFeatureChange("hasBalcony", checked === true)
                }
              />
              <Label
                htmlFor="balcony"
                className="flex items-center gap-2 cursor-pointer font-normal"
              >
                <Eye className="h-4 w-4" />
                {t.balcony}
              </Label>
            </div>
          </div>
        </div>

        {/* Amenidades */}
        {availableAmenities.length > 0 && (
          <div className="space-y-3">
              <Label className="text-base font-semibold">{t.amenities}</Label>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {availableAmenities.map((amenity) => (
                  <div key={amenity} className="flex items-center space-x-2">
                    <Checkbox
                      id={`amenity-${amenity}`}
                      checked={
                        localFilters.amenities?.includes(amenity) || false
                      }
                      onCheckedChange={(checked) =>
                        handleAmenityChange(amenity, checked === true)
                      }
                    />
                    <Label
                      htmlFor={`amenity-${amenity}`}
                      className="cursor-pointer font-normal text-sm"
                    >
                      {amenity}
                    </Label>
                  </div>
                ))}
              </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

