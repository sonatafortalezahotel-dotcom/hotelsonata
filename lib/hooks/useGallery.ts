import { useState, useEffect } from "react";

export interface GalleryPhoto {
  id: number;
  title: string | null;
  imageUrl: string;
  category: string | null; // Sistema antigo (compatibilidade)
  page: string | null; // Sistema novo
  section: string | null; // Sistema novo
  description: string | null; // Sistema novo
  order: number;
  active: boolean;
}

/**
 * Hook para buscar fotos da galeria do banco de dados
 * Suporta tanto sistema antigo (category) quanto novo (page/section)
 */
export function useGallery(
  options?: {
    category?: string; // Sistema antigo
    page?: string; // Sistema novo
    section?: string; // Sistema novo
    limit?: number;
  } | string, // Compatibilidade: pode passar category diretamente
  limit?: number
) {
  const [photos, setPhotos] = useState<GalleryPhoto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchGallery() {
      try {
        setLoading(true);
        const params = new URLSearchParams();
        
        // Suporta duas formas de chamada para compatibilidade
        if (typeof options === "string") {
          // Forma antiga: useGallery("piscina", 10)
          params.append("category", options);
          if (limit) params.append("limit", limit.toString());
        } else if (options) {
          // Forma nova: useGallery({ page: "home", section: "hero" })
          if (options.category) params.append("category", options.category);
          if (options.page) params.append("page", options.page);
          if (options.section) params.append("section", options.section);
          if (options.limit) params.append("limit", options.limit.toString());
        }
        
        params.append("active", "true");

        const response = await fetch(`/api/gallery?${params.toString()}`);
        
        if (!response.ok) {
          throw new Error("Erro ao buscar galeria");
        }

        const data = await response.json();
        setPhotos(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erro desconhecido");
        console.error("Erro ao buscar galeria:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchGallery();
  }, [options, limit]);

  return { photos, loading, error };
}

/**
 * Hook para buscar uma foto específica por categoria
 */
export function useGalleryByCategory(category: string) {
  return useGallery(category);
}

/**
 * Função utilitária para buscar galeria no servidor (Server Components)
 * Suporta tanto sistema antigo (category) quanto novo (page/section)
 */
export async function getGallery(
  options?: {
    category?: string; // Sistema antigo
    page?: string; // Sistema novo
    section?: string; // Sistema novo
    limit?: number;
  } | string, // Compatibilidade: pode passar category diretamente
  limit?: number
): Promise<GalleryPhoto[]> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const params = new URLSearchParams();
    
    // Suporta duas formas de chamada para compatibilidade
    if (typeof options === "string") {
      // Forma antiga: getGallery("piscina", 10)
      params.append("category", options);
      if (limit) params.append("limit", limit.toString());
    } else if (options) {
      // Forma nova: getGallery({ page: "home", section: "hero" })
      if (options.category) params.append("category", options.category);
      if (options.page) params.append("page", options.page);
      if (options.section) params.append("section", options.section);
      if (options.limit) params.append("limit", options.limit.toString());
    }
    
    params.append("active", "true");

    const response = await fetch(`${baseUrl}/api/gallery?${params.toString()}`, {
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error("Erro ao buscar galeria");
    }

    return await response.json();
  } catch (error) {
    console.error("Erro ao buscar galeria:", error);
    return [];
  }
}

