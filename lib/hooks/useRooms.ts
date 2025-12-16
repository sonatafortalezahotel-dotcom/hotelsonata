import { useState, useEffect } from "react";

export interface Room {
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
  basePrice: number;
  imageUrl: string | null;
  gallery: string[] | null;
  active: boolean;
  order: number;
}

/**
 * Hook para buscar quartos/acomodações
 */
export function useRooms(activeOnly: boolean = true, locale: string = "pt") {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchRooms() {
      try {
        setLoading(true);
        const params = new URLSearchParams();
        params.append("locale", locale);
        if (activeOnly) params.append("active", "true");

        const response = await fetch(`/api/rooms?${params.toString()}`);
        
        if (!response.ok) {
          throw new Error("Erro ao buscar quartos");
        }

        const data = await response.json();
        setRooms(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erro desconhecido");
        console.error("Erro ao buscar quartos:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchRooms();
  }, [activeOnly, locale]);

  return { rooms, loading, error };
}

/**
 * Função utilitária para buscar quartos no servidor (Server Components)
 */
export async function getRooms(activeOnly: boolean = true, locale: string = "pt"): Promise<Room[]> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const params = new URLSearchParams();
    params.append("locale", locale);
    if (activeOnly) params.append("active", "true");

    const response = await fetch(`${baseUrl}/api/rooms?${params.toString()}`, {
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error("Erro ao buscar quartos");
    }

    return await response.json();
  } catch (error) {
    console.error("Erro ao buscar quartos:", error);
    return [];
  }
}

