/**
 * Helpers para trabalhar com imagens da galeria
 * Compatível com sistema antigo (category) e novo (page/section)
 */

import { fetchGalleryWithFallback, fetchGalleryByCategory } from "./gallery-mapper";

/** Foto da galeria com campos usados por getGalleryImageByPath */
export interface GalleryPhotoForPath {
  page?: string | null;
  section?: string | null;
  order?: number;
  imageUrl: string;
}

/**
 * Resolve a URL da imagem a partir do path usado no editor (ex: gallery:hotel:hero:0).
 * Prioriza o registro da galeria com page/section/order correspondentes, para que
 * após salvar no editor e recarregar a página a imagem atualizada seja exibida.
 */
function normalizePageSection(value: string | null | undefined): string {
  return (value ?? "").toString().toLowerCase().trim();
}

export function getGalleryImageByPath(
  photos: GalleryPhotoForPath[] | undefined | null,
  path: string
): string | null {
  if (!path.startsWith("gallery:") || !photos?.length) return null;
  const parts = path.split(":");
  if (parts.length < 4) return null;
  const [, page, section, orderStr] = parts;
  const order = parseInt(orderStr ?? "0", 10) ?? 0;
  const pageNorm = normalizePageSection(page);
  const sectionNorm = normalizePageSection(section);
  const photo = photos.find(
    (p) =>
      normalizePageSection(p.page) === pageNorm &&
      normalizePageSection(p.section) === sectionNorm &&
      (p.order ?? 0) === order
  );
  return photo?.imageUrl ?? null;
}

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

