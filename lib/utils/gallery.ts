/**
 * Utilitários para trabalhar com a galeria de fotos
 */

export interface GalleryPhoto {
  id: number;
  title: string | null;
  imageUrl: string;
  category: string | null;
  order: number;
  active: boolean;
}

/**
 * Busca fotos da galeria por categoria
 */
export async function getGalleryByCategory(category: string, limit?: number): Promise<GalleryPhoto[]> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const params = new URLSearchParams();
    params.append("category", category);
    params.append("active", "true");
    if (limit) params.append("limit", limit.toString());

    const response = await fetch(`${baseUrl}/api/gallery?${params.toString()}`, {
      cache: "no-store",
    });

    if (!response.ok) {
      console.error(`Erro ao buscar galeria da categoria ${category}`);
      return [];
    }

    return await response.json();
  } catch (error) {
    console.error(`Erro ao buscar galeria da categoria ${category}:`, error);
    return [];
  }
}

/**
 * Busca todas as fotos da galeria
 */
export async function getAllGallery(limit?: number): Promise<GalleryPhoto[]> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const params = new URLSearchParams();
    params.append("active", "true");
    if (limit) params.append("limit", limit.toString());

    const response = await fetch(`${baseUrl}/api/gallery?${params.toString()}`, {
      cache: "no-store",
    });

    if (!response.ok) {
      console.error("Erro ao buscar galeria");
      return [];
    }

    return await response.json();
  } catch (error) {
    console.error("Erro ao buscar galeria:", error);
    return [];
  }
}

/**
 * Extrai URLs de imagens de um array de fotos da galeria
 */
export function extractImageUrls(photos: GalleryPhoto[]): string[] {
  return photos.map(photo => photo.imageUrl).filter(Boolean);
}

/**
 * Cria um fallback para quando não há imagens no banco
 * Retorna um array vazio para que o componente possa lidar com isso
 */
export function getImageUrlsWithFallback(
  photos: GalleryPhoto[],
  fallback: string[] = []
): string[] {
  const urls = extractImageUrls(photos);
  return urls.length > 0 ? urls : fallback;
}

