"use client";

import { useState, useEffect } from "react";
import { Check, ChevronsUpDown, X, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";

interface AmenitiesComboboxProps {
  value: string[];
  onChange: (amenities: string[]) => void;
  label?: string;
  placeholder?: string;
}

export function AmenitiesCombobox({
  value,
  onChange,
  label = "Amenidades",
  placeholder = "Buscar ou adicionar amenidade...",
}: AmenitiesComboboxProps) {
  const [open, setOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [availableAmenities, setAvailableAmenities] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  // Buscar amenidades existentes do banco
  useEffect(() => {
    async function fetchAmenities() {
      try {
        const response = await fetch("/api/amenities");
        if (response.ok) {
          const data = await response.json();
          setAvailableAmenities(data);
        }
      } catch (error) {
        console.error("Erro ao buscar amenidades:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchAmenities();
  }, []);

  // Normalizar texto para evitar duplicações
  const normalizeText = (text: string) => {
    return text
      .trim()
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, ""); // Remove acentos
  };

  // Verificar se amenidade já existe (case-insensitive)
  const amenityExists = (amenity: string) => {
    const normalized = normalizeText(amenity);
    return value.some((a) => normalizeText(a) === normalized);
  };

  // Adicionar amenidade
  const addAmenity = (amenity: string) => {
    const trimmed = amenity.trim();
    if (!trimmed || amenityExists(trimmed)) return;

    onChange([...value, trimmed]);
    setSearchValue("");
    setOpen(false);

    // Adicionar à lista de disponíveis se não existir
    if (!availableAmenities.includes(trimmed)) {
      setAvailableAmenities([...availableAmenities, trimmed].sort((a, b) =>
        a.localeCompare(b, "pt-BR")
      ));
    }
  };

  // Remover amenidade
  const removeAmenity = (index: number) => {
    onChange(value.filter((_, i) => i !== index));
  };

  // Filtrar amenidades disponíveis que não estão selecionadas
  const filteredAmenities = availableAmenities.filter(
    (amenity) =>
      !amenityExists(amenity) &&
      normalizeText(amenity).includes(normalizeText(searchValue))
  );

  // Verificar se o texto digitado é uma nova amenidade
  const isNewAmenity =
    searchValue.trim() &&
    !amenityExists(searchValue) &&
    !availableAmenities.some(
      (a) => normalizeText(a) === normalizeText(searchValue)
    );

  return (
    <div className="space-y-2">
      {label && <Label>{label}</Label>}
      
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between"
          >
            <span className="text-muted-foreground">{placeholder}</span>
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0" align="start">
          <Command>
            <CommandInput
              placeholder="Digite para buscar..."
              value={searchValue}
              onValueChange={setSearchValue}
            />
            <CommandList>
              {loading ? (
                <div className="py-6 text-center text-sm text-muted-foreground">
                  Carregando...
                </div>
              ) : (
                <>
                  <CommandEmpty>
                    {isNewAmenity ? (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="w-full justify-start"
                        onClick={() => addAmenity(searchValue)}
                      >
                        <Plus className="mr-2 h-4 w-4" />
                        Adicionar "{searchValue}"
                      </Button>
                    ) : (
                      "Nenhuma amenidade encontrada"
                    )}
                  </CommandEmpty>
                  <CommandGroup>
                    {filteredAmenities.map((amenity) => (
                      <CommandItem
                        key={amenity}
                        value={amenity}
                        onSelect={() => addAmenity(amenity)}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            amenityExists(amenity) ? "opacity-100" : "opacity-0"
                          )}
                        />
                        {amenity}
                      </CommandItem>
                    ))}
                    {isNewAmenity && filteredAmenities.length > 0 && (
                      <>
                        <div className="border-t my-1" />
                        <CommandItem
                          value={searchValue}
                          onSelect={() => addAmenity(searchValue)}
                          className="text-primary"
                        >
                          <Plus className="mr-2 h-4 w-4" />
                          Adicionar "{searchValue}"
                        </CommandItem>
                      </>
                    )}
                  </CommandGroup>
                </>
              )}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {/* Amenidades selecionadas */}
      {value.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-3 p-3 border rounded-lg bg-muted/50">
          {value.map((amenity, index) => (
            <Badge
              key={index}
              variant="secondary"
              className="flex items-center gap-1 pr-1"
            >
              {amenity}
              <button
                type="button"
                onClick={() => removeAmenity(index)}
                className="ml-1 hover:bg-destructive/20 rounded-full p-0.5 transition-colors"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}

      <p className="text-xs text-muted-foreground">
        {value.length === 0
          ? "Busque amenidades existentes ou adicione novas"
          : `${value.length} amenidade${value.length > 1 ? "s" : ""} selecionada${value.length > 1 ? "s" : ""}`}
      </p>
    </div>
  );
}
