import { useState, useEffect } from "react";

export interface Leisure {
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
 * Hook para buscar dados de lazer
 */
export function useLeisure(activeOnly: boolean = true, locale: string = "pt") {
  const [leisure, setLeisure] = useState<Leisure[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchLeisure() {
      try {
        setLoading(true);
        const params = new URLSearchParams();
        params.append("locale", locale);
        if (activeOnly) params.append("active", "true");

        const response = await fetch(`/api/leisure?${params.toString()}`);
        
        if (!response.ok) {
          throw new Error("Erro ao buscar lazer");
        }

        const data = await response.json();
        setLeisure(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erro desconhecido");
        console.error("Erro ao buscar lazer:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchLeisure();
  }, [activeOnly, locale]);

  return { leisure, loading, error };
}

/**
 * Função utilitária para buscar lazer no servidor (Server Components)
 */
export async function getLeisure(activeOnly: boolean = true, locale: string = "pt"): Promise<Leisure[]> {
  try {
    // Detectar se está rodando no servidor ou cliente
    const isServer = typeof window === 'undefined';
    
    // Usar a mesma lógica do useGallery: URL relativa no cliente, absoluta no servidor
    const baseUrl = isServer 
      ? (process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000")
      : ""; // No cliente, usar URL relativa (funciona em dev e produção)
    
    const params = new URLSearchParams();
    params.append("locale", locale);
    if (activeOnly) params.append("active", "true");

    const response = await fetch(`${baseUrl}/api/leisure?${params.toString()}`, {
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error("Erro ao buscar lazer");
    }

    return await response.json();
  } catch (error) {
    console.error("Erro ao buscar lazer:", error);
    return [];
  }
}

