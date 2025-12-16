import { useState, useEffect } from "react";

export interface Gastronomy {
  id: number;
  type: string;
  title: string | null;
  description: string | null;
  imageUrl: string | null;
  gallery: string[] | null;
  schedule: string | null;
  active: boolean;
  order: number;
}

/**
 * Hook para buscar dados de gastronomia
 */
export function useGastronomy(activeOnly: boolean = true, locale: string = "pt") {
  const [gastronomy, setGastronomy] = useState<Gastronomy[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchGastronomy() {
      try {
        setLoading(true);
        const params = new URLSearchParams();
        params.append("locale", locale);
        if (activeOnly) params.append("active", "true");

        const response = await fetch(`/api/gastronomy?${params.toString()}`);
        
        if (!response.ok) {
          throw new Error("Erro ao buscar gastronomia");
        }

        const data = await response.json();
        setGastronomy(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erro desconhecido");
        console.error("Erro ao buscar gastronomia:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchGastronomy();
  }, [activeOnly, locale]);

  return { gastronomy, loading, error };
}

/**
 * Função utilitária para buscar gastronomia no servidor (Server Components)
 */
export async function getGastronomy(activeOnly: boolean = true, locale: string = "pt"): Promise<Gastronomy[]> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const params = new URLSearchParams();
    params.append("locale", locale);
    if (activeOnly) params.append("active", "true");

    const response = await fetch(`${baseUrl}/api/gastronomy?${params.toString()}`, {
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error("Erro ao buscar gastronomia");
    }

    return await response.json();
  } catch (error) {
    console.error("Erro ao buscar gastronomia:", error);
    return [];
  }
}

