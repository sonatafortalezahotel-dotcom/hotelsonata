import { useState, useEffect, useCallback } from "react";
import { registerGalleryRefetch } from "@/lib/galleryRefetch";

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

  // Dependências primitivas para evitar loop: options é objeto e muda de referência a cada render.
  // Usar só primitivos no callback e nas deps para fetchGallery não ser recriada a cada render.
  const category = typeof options === "string" ? options : options?.category;
  const pageKey = typeof options === "string" ? undefined : options?.page;
  const section = typeof options === "string" ? undefined : options?.section;
  const limitVal = typeof options === "string" ? limit : (options?.limit ?? limit);

  const fetchGallery = useCallback(async (forceRefresh?: boolean) => {
    try {
      setLoading(true);
      const params = new URLSearchParams();

      if (category != null) params.append("category", category);
      if (pageKey != null) params.append("page", pageKey);
      if (section != null) params.append("section", section);
      if (limitVal != null) params.append("limit", String(limitVal));

      params.append("active", "true");
      if (forceRefresh) params.set("_t", String(Date.now()));

      const response = await fetch(`/api/gallery?${params.toString()}`, { cache: "no-store" });

      if (!response.ok) {
        throw new Error("Erro ao buscar galeria");
      }

      const data = await response.json();
      setPhotos(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro desconhecido");
      console.error("Erro ao buscar galeria:", err);
    } finally {
      setLoading(false);
    }
  }, [category, pageKey, section, limitVal]);

  useEffect(() => {
    fetchGallery();
  }, [fetchGallery]);

  // Apenas callback registrado: EditorContext e EditModeBanner chamam notifyGalleryUpdated(),
  // evitando refetch duplicado (antes havia callback + listener do evento no window).
  // A Home usa listener do evento "gallery-updated" no window para seu próprio refetch.
  useEffect(() => {
    const refetch = () => fetchGallery(true);
    const unregister = registerGalleryRefetch(refetch);
    return unregister;
  }, [fetchGallery]);

  return { photos, loading, error, refetch: fetchGallery };
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

    // Detectar se está rodando no servidor ou cliente
    const isServer = typeof window === "undefined";
    const baseUrl = isServer 
      ? (process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000")
      : ""; // No cliente, usar URL relativa

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

