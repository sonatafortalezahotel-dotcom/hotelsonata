import { useState, useEffect } from "react";

export interface Package {
  id: number;
  name: string;
  description: string;
  imageUrl: string | null;
  price: number;
  startDate: string | null;
  endDate: string | null;
  active: boolean;
  order: number;
}

/**
 * Hook para buscar pacotes promocionais
 */
export function usePackages(activeOnly: boolean = true) {
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchPackages() {
      try {
        setLoading(true);
        const params = new URLSearchParams();
        if (activeOnly) params.append("active", "true");

        const response = await fetch(`/api/packages?${params.toString()}`);
        
        if (!response.ok) {
          throw new Error("Erro ao buscar pacotes");
        }

        const data = await response.json();
        setPackages(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erro desconhecido");
        console.error("Erro ao buscar pacotes:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchPackages();
  }, [activeOnly]);

  return { packages, loading, error };
}

/**
 * Função utilitária para buscar pacotes no servidor (Server Components)
 */
export async function getPackages(activeOnly: boolean = true): Promise<Package[]> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const params = new URLSearchParams();
    if (activeOnly) params.append("active", "true");

    const response = await fetch(`${baseUrl}/api/packages?${params.toString()}`, {
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error("Erro ao buscar pacotes");
    }

    return await response.json();
  } catch (error) {
    console.error("Erro ao buscar pacotes:", error);
    return [];
  }
}

