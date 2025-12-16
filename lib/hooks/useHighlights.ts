import { useState, useEffect } from "react";

export interface Highlight {
  id: number;
  title: string;
  description: string;
  imageUrl: string | null;
  videoUrl: string | null;
  link: string | null;
  startDate: string | null;
  endDate: string | null;
  active: boolean;
  order: number;
}

/**
 * Hook para buscar destaques do carrossel principal
 */
export function useHighlights(activeOnly: boolean = true) {
  const [highlights, setHighlights] = useState<Highlight[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchHighlights() {
      try {
        setLoading(true);
        const params = new URLSearchParams();
        if (activeOnly) params.append("active", "true");

        const response = await fetch(`/api/highlights?${params.toString()}`);
        
        if (!response.ok) {
          throw new Error("Erro ao buscar destaques");
        }

        const data = await response.json();
        setHighlights(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erro desconhecido");
        console.error("Erro ao buscar destaques:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchHighlights();
  }, [activeOnly]);

  return { highlights, loading, error };
}

/**
 * Função utilitária para buscar destaques no servidor (Server Components)
 */
export async function getHighlights(activeOnly: boolean = true): Promise<Highlight[]> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const params = new URLSearchParams();
    if (activeOnly) params.append("active", "true");

    const response = await fetch(`${baseUrl}/api/highlights?${params.toString()}`, {
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error("Erro ao buscar destaques");
    }

    return await response.json();
  } catch (error) {
    console.error("Erro ao buscar destaques:", error);
    return [];
  }
}

