import { useRef } from 'react';

/**
 * Hook para rastrear fotos já utilizadas e evitar repetições
 * 
 * @example
 * const tracker = usePhotoTracker();
 * const photos = tracker.getUnusedPhotos(galleryPhotos, 'piscina', 4);
 */
export function usePhotoTracker() {
  const usedPhotoIds = useRef<Set<string>>(new Set());
  const usedPhotoUrls = useRef<Set<string>>(new Set());

  /**
   * Obtém fotos não utilizadas de uma categoria específica
   */
  const getUnusedPhotos = (
    photos: Array<{ id?: number | string; imageUrl: string; category?: string; order?: number; title?: string | null }>,
    category: string | string[],
    limit: number,
    options?: {
      allowRelatedCategories?: boolean;
      relatedCategories?: string[];
      strictCategory?: boolean;
    }
  ) => {
    const categories = Array.isArray(category) ? category : [category];
    const { allowRelatedCategories = false, relatedCategories = [], strictCategory = true } = options || {};

    // Filtrar fotos por categoria
    let filtered = photos.filter(photo => {
      if (!photo.imageUrl) return false;
      
      // Verificar se já foi usada
      const isUsed = photo.id 
        ? usedPhotoIds.current.has(String(photo.id))
        : usedPhotoUrls.current.has(photo.imageUrl);
      
      if (isUsed) return false;

      // Verificar categoria
      const matchesCategory = categories.includes(photo.category || '');
      if (matchesCategory) return true;

      // Se permitir categorias relacionadas
      if (allowRelatedCategories && relatedCategories.length > 0) {
        return relatedCategories.includes(photo.category || '');
      }

      return false;
    });

    // Ordenar por order (menor primeiro) e depois por id
    filtered = filtered.sort((a, b) => {
      const orderA = a.order ?? 999;
      const orderB = b.order ?? 999;
      if (orderA !== orderB) return orderA - orderB;
      
      const idA = a.id ? String(a.id) : '';
      const idB = b.id ? String(b.id) : '';
      return idA.localeCompare(idB);
    });

    // Pegar apenas o limite necessário
    const result = filtered.slice(0, limit);

    // Marcar como usadas
    result.forEach(photo => {
      if (photo.id) {
        usedPhotoIds.current.add(String(photo.id));
      }
      if (photo.imageUrl) {
        usedPhotoUrls.current.add(photo.imageUrl);
      }
    });

    return result;
  };

  /**
   * Obtém uma única foto não utilizada (útil para hero/destaque)
   */
  const getUnusedPhoto = (
    photos: Array<{ id?: number | string; imageUrl: string; category?: string; order?: number; title?: string | null }>,
    category: string | string[],
    options?: {
      allowRelatedCategories?: boolean;
      relatedCategories?: string[];
    }
  ) => {
    const result = getUnusedPhotos(photos, category, 1, options);
    return result[0] || null;
  };

  /**
   * Marca uma foto como usada manualmente
   */
  const markAsUsed = (photo: { id?: number | string; imageUrl?: string }) => {
    if (photo.id) {
      usedPhotoIds.current.add(String(photo.id));
    }
    if (photo.imageUrl) {
      usedPhotoUrls.current.add(photo.imageUrl);
    }
  };

  /**
   * Verifica se uma foto já foi usada
   */
  const isUsed = (photo: { id?: number | string; imageUrl?: string }) => {
    if (photo.id && usedPhotoIds.current.has(String(photo.id))) return true;
    if (photo.imageUrl && usedPhotoUrls.current.has(photo.imageUrl)) return true;
    return false;
  };

  /**
   * Reseta o rastreamento (útil para mudar de página/seção)
   */
  const reset = () => {
    usedPhotoIds.current.clear();
    usedPhotoUrls.current.clear();
  };

  /**
   * Obtém estatísticas de uso
   */
  const getStats = () => {
    return {
      usedCount: usedPhotoIds.current.size + usedPhotoUrls.current.size,
      usedIds: Array.from(usedPhotoIds.current),
      usedUrls: Array.from(usedPhotoUrls.current),
    };
  };

  return {
    getUnusedPhotos,
    getUnusedPhoto,
    markAsUsed,
    isUsed,
    reset,
    getStats,
  };
}

/**
 * Função utilitária para obter categorias relacionadas
 * Útil para fallbacks inteligentes
 */
export function getRelatedCategories(category: string): string[] {
  const categoryMap: Record<string, string[]> = {
    // Piscina
    'piscina': ['geral'],
    'piscina-vista-mar': ['piscina', 'geral'],
    
    // Gastronomia
    'gastronomia': ['restaurante', 'cafe'],
    'restaurante': ['gastronomia', 'cafe'],
    'cafe': ['gastronomia', 'restaurante'],
    'cafe-da-manha': ['cafe', 'gastronomia'],
    
    // Quartos
    'quarto': ['recepcao'],
    'recepcao': ['quarto'],
    
    // Lazer
    'spa': ['academia'],
    'academia': ['spa'],
    'lazer': ['esporte'],
    'esporte': ['lazer'],
    'beach-tennis': ['esporte', 'lazer'],
    'bikes': ['lazer', 'esporte'],
    
    // Sustentabilidade
    'sustentabilidade': ['geral'],
    'inclusao': ['sustentabilidade', 'geral'],
    'acoes-sociais': ['sustentabilidade', 'geral'],
    
    // Localização
    'localizacao': ['geral'],
    'pontos-turisticos': ['localizacao', 'geral'],
    
    // Eventos
    'eventos': ['recepcao', 'geral'],
    'corporativo': ['eventos', 'recepcao'],
    'casamento': ['eventos', 'recepcao'],
    'social': ['eventos', 'recepcao'],
  };

  return categoryMap[category] || [];
}

/**
 * Função para priorizar fotos por contexto de uso
 * Hero > Galeria > Cards > Fallback
 */
export function prioritizePhotosByContext(
  photos: Array<{ id?: number | string; imageUrl: string; category?: string; order?: number; title?: string | null }>,
  context: 'hero' | 'gallery' | 'card' | 'fallback',
  category: string | string[],
  limit: number
): Array<{ id?: number | string; imageUrl: string; category?: string; order?: number; title?: string | null }> {
  const categories = Array.isArray(category) ? category : [category];
  
  // Filtrar por categoria
  let filtered = photos.filter(photo => 
    categories.includes(photo.category || '') && photo.imageUrl
  );

  // Ordenar por ordem
  filtered = filtered.sort((a, b) => {
    const orderA = a.order ?? 999;
    const orderB = b.order ?? 999;
    return orderA - orderB;
  });

  // Aplicar limite
  return filtered.slice(0, limit);
}

