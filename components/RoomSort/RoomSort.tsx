"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useLanguage } from "@/lib/context/LanguageContext";

export type SortOption = "price-asc" | "price-desc" | "popular" | "name-asc";

interface RoomSortProps {
  value: SortOption;
  onValueChange: (value: SortOption) => void;
  className?: string;
}

export default function RoomSort({
  value,
  onValueChange,
  className,
}: RoomSortProps) {
  const { locale } = useLanguage();

  const labels = {
    pt: {
      sortBy: "Ordenar por",
      priceAsc: "Preço: Menor para Maior",
      priceDesc: "Preço: Maior para Menor",
      popular: "Mais Reservados",
      nameAsc: "Nome: A-Z",
    },
    es: {
      sortBy: "Ordenar por",
      priceAsc: "Precio: Menor a Mayor",
      priceDesc: "Precio: Mayor a Menor",
      popular: "Más Reservados",
      nameAsc: "Nombre: A-Z",
    },
    en: {
      sortBy: "Sort by",
      priceAsc: "Price: Low to High",
      priceDesc: "Price: High to Low",
      popular: "Most Booked",
      nameAsc: "Name: A-Z",
    },
  };

  const t = labels[locale as keyof typeof labels] || labels.pt;

  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger className={className}>
        <SelectValue placeholder={t.sortBy} />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="price-asc">{t.priceAsc}</SelectItem>
        <SelectItem value="price-desc">{t.priceDesc}</SelectItem>
        <SelectItem value="popular">{t.popular}</SelectItem>
        <SelectItem value="name-asc">{t.nameAsc}</SelectItem>
      </SelectContent>
    </Select>
  );
}

