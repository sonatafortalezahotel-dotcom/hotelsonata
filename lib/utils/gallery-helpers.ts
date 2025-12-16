/**
 * Helpers para trabalhar com imagens da galeria
 * Compatível com sistema antigo (category) e novo (page/section)
 */

import { fetchGalleryWithFallback, fetchGalleryByCategory } from "./gallery-mapper";

/**
 * Busca imagens para uma seção específica de uma página
 * Prioriza sistema novo, mas faz fallback para sistema antigo se necessário
 */
export async function getImagesForSection(
  page: string,
  section: string,
  fallbackCategory?: string,
  limit?: number
): Promise<any[]> {
  const images = await fetchGalleryWithFallback(page, section, fallbackCategory, limit);
  
  // Se não encontrou imagens pelo sistema novo e tem fallback, tenta por categoria
  if (images.length === 0 && fallbackCategory) {
    return await fetchGalleryByCategory(fallbackCategory, limit);
  }
  
  return images;
}

/**
 * Busca imagens para múltiplas categorias (sistema antigo)
 * Útil para compatibilidade
 */
export async function getImagesForCategories(
  categories: string[],
  limit?: number
): Promise<any[]> {
  const allImages: any[] = [];
  
  for (const category of categories) {
    const images = await fetchGalleryByCategory(category, limit);
    allImages.push(...images);
  }
  
  // Remove duplicatas por ID
  const uniqueImages = allImages.filter((image, index, self) =>
    index === self.findIndex((img) => img.id === image.id)
  );
  
  return uniqueImages;
}

/**
 * Filtra imagens já usadas para evitar repetição
 */
export function filterUnusedImages(
  images: any[],
  usedIds: Set<number>
): any[] {
  return images.filter((img) => !usedIds.has(img.id));
}

/**
 * Obtém imagens não usadas para uma seção
 */
export async function getUnusedImagesForSection(
  page: string,
  section: string,
  usedIds: Set<number>,
  fallbackCategory?: string,
  limit?: number
): Promise<any[]> {
  const images = await getImagesForSection(page, section, fallbackCategory, limit);
  return filterUnusedImages(images, usedIds);
}

