import { useState, useEffect } from "react";

export interface Sustainability {
  id: number;
  title: string;
  description: string;
  imageUrl: string | null;
  category: string | null;
  active: boolean;
  order: number;
}

/**
 * Hook para buscar dados de sustentabilidade
 */
export function useSustainability(activeOnly: boolean = true) {
  const [sustainability, setSustainability] = useState<Sustainability[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchSustainability() {
      try {
        setLoading(true);
        const params = new URLSearchParams();
        if (activeOnly) params.append("active", "true");

        const response = await fetch(`/api/sustainability?${params.toString()}`);
        
        if (!response.ok) {
          throw new Error("Erro ao buscar sustentabilidade");
        }

        const data = await response.json();
        setSustainability(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erro desconhecido");
        console.error("Erro ao buscar sustentabilidade:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchSustainability();
  }, [activeOnly]);

  return { sustainability, loading, error };
}

/**
 * Função utilitária para buscar sustentabilidade no servidor (Server Components)
 */
export async function getSustainability(activeOnly: boolean = true): Promise<Sustainability[]> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const params = new URLSearchParams();
    if (activeOnly) params.append("active", "true");

    const response = await fetch(`${baseUrl}/api/sustainability?${params.toString()}`, {
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error("Erro ao buscar sustentabilidade");
    }

    return await response.json();
  } catch (error) {
    console.error("Erro ao buscar sustentabilidade:", error);
    return [];
  }
}

