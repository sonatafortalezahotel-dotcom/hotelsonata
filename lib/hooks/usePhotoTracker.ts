import { useRef, useMemo } from 'react';

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
   * Suporta tanto sistema antigo (category) quanto novo (page/section)
   */
  const getUnusedPhotos = (
    photos: Array<{ 
      id?: number | string; 
      imageUrl: string; 
      category?: string | null; 
      page?: string | null;
      section?: string | null;
      order?: number; 
      title?: string | null 
    }>,
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

    // Mapeamento de categorias antigas para page/section do sistema novo
    // Mapeia categorias para múltiplas seções possíveis
    const categoryToPageSection: Record<string, { page: string; sections: string[] }[]> = {
      'piscina': [
        { page: 'home', sections: ['experiencias-piscina'] },
        { page: 'lazer', sections: ['hero-lazer', 'galeria-piscina', 'photo-story-lazer'] },
      ],
      'gastronomia': [
        { page: 'home', sections: ['experiencias-gastronomia'] },
        { page: 'gastronomia', sections: ['hero-gastronomia', 'card-restaurante', 'card-cafe-manha', 'galeria-cafe', 'galeria-restaurante', 'photo-story-gastronomia'] },
      ],
      'restaurante': [
        { page: 'gastronomia', sections: ['card-restaurante', 'galeria-restaurante', 'photo-story-gastronomia'] },
        { page: 'home', sections: ['experiencias-gastronomia'] },
      ],
      'cafe': [
        { page: 'gastronomia', sections: ['card-cafe-manha', 'galeria-cafe', 'photo-story-gastronomia'] },
        { page: 'home', sections: ['experiencias-gastronomia'] },
      ],
      'cafe-da-manha': [
        { page: 'gastronomia', sections: ['card-cafe-manha', 'galeria-cafe'] },
      ],
      'quarto': [
        { page: 'home', sections: ['experiencias-quartos'] },
        { page: 'reservas', sections: ['hero-reservas'] },
      ],
      'recepcao': [
        { page: 'contato', sections: ['hero-contato', 'galeria-equipe'] },
        { page: 'home', sections: ['experiencias-quartos'] },
      ],
      'spa': [
        { page: 'home', sections: ['experiencias-spa'] },
        { page: 'lazer', sections: ['galeria-spa', 'photo-story-lazer'] },
      ],
      'academia': [
        { page: 'lazer', sections: ['galeria-academia', 'photo-story-lazer'] },
        { page: 'home', sections: ['experiencias-spa'] },
      ],
      'lazer': [
        { page: 'lazer', sections: ['hero-lazer', 'galeria-piscina', 'galeria-atividades', 'galeria-academia', 'galeria-spa', 'photo-story-lazer', 'cards-atividades', 'localizacao-lazer'] },
        { page: 'home', sections: ['experiencias-beach-tennis', 'photo-story'] },
      ],
      'esporte': [
        { page: 'home', sections: ['experiencias-beach-tennis'] },
        { page: 'lazer', sections: ['galeria-atividades', 'cards-atividades', 'photo-story-lazer'] },
      ],
      'beach-tennis': [
        { page: 'home', sections: ['experiencias-beach-tennis'] },
        { page: 'lazer', sections: ['galeria-atividades'] },
      ],
      'bikes': [
        { page: 'lazer', sections: ['galeria-atividades', 'cards-atividades'] },
      ],
      'sustentabilidade': [
        { page: 'home', sections: ['experiencias-sustentabilidade'] },
        { page: 'esg', sections: ['hero-esg', 'galeria-praticas', 'photo-story-impacto', 'acoes-sociais'] },
      ],
      'localizacao': [
        { page: 'home', sections: ['localizacao-pontos'] },
        { page: 'contato', sections: ['galeria-localizacao'] },
        { page: 'lazer', sections: ['localizacao-lazer'] },
      ],
      'pontos-turisticos': [
        { page: 'home', sections: ['localizacao-pontos'] },
        { page: 'contato', sections: ['galeria-localizacao'] },
      ],
      'geral': [
        { page: 'home', sections: ['galeria-momentos', 'photo-story'] },
        { page: 'lazer', sections: ['photo-story-lazer'] },
        { page: 'gastronomia', sections: ['photo-story-gastronomia'] },
        { page: 'esg', sections: ['photo-story-impacto'] },
      ],
    };

    // Filtrar fotos por categoria (sistema antigo) ou page/section (sistema novo)
    let filtered = photos.filter(photo => {
      if (!photo.imageUrl) return false;
      
      // Verificar se já foi usada
      const isUsed = photo.id 
        ? usedPhotoIds.current.has(String(photo.id))
        : usedPhotoUrls.current.has(photo.imageUrl);
      
      if (isUsed) return false;

      // SISTEMA NOVO: Verificar por page/section
      if (photo.page && photo.section) {
        for (const cat of categories) {
          const mappings = categoryToPageSection[cat];
          if (mappings) {
            for (const mapping of mappings) {
              if (mapping.page === photo.page && mapping.sections.includes(photo.section)) {
                return true;
              }
            }
          }
        }
      }

      // SISTEMA ANTIGO: Verificar por category (compatibilidade)
      const matchesCategory = categories.includes(photo.category || '');
      if (matchesCategory) return true;

      // Se permitir categorias relacionadas
      if (allowRelatedCategories && relatedCategories.length > 0) {
        // Verificar por page/section nas categorias relacionadas
        for (const relatedCat of relatedCategories) {
          const mappings = categoryToPageSection[relatedCat];
          if (mappings) {
            for (const mapping of mappings) {
              if (photo.page === mapping.page && mapping.sections.includes(photo.section || '')) {
                return true;
              }
            }
          }
        }
        // Verificar por category nas categorias relacionadas
        if (relatedCategories.includes(photo.category || '')) {
          return true;
        }
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
    photos: Array<{ 
      id?: number | string; 
      imageUrl: string; 
      category?: string | null;
      page?: string | null;
      section?: string | null;
      order?: number; 
      title?: string | null 
    }>,
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
   * Obtém fotos não utilizadas por page/section (sistema novo)
   */
  const getUnusedPhotosByPageSection = (
    photos: Array<{ 
      id?: number | string; 
      imageUrl: string; 
      page?: string | null;
      section?: string | null;
      order?: number; 
      title?: string | null 
    }>,
    page: string,
    sections: string | string[],
    limit: number
  ) => {
    const sectionArray = Array.isArray(sections) ? sections : [sections];
    
    // Filtrar fotos por page/section
    let filtered = photos.filter(photo => {
      // Validação básica: deve ter imageUrl válido
      if (!photo.imageUrl || typeof photo.imageUrl !== 'string' || !photo.imageUrl.trim()) {
        return false;
      }
      
      // Verificar se já foi usada
      const isUsedById = photo.id ? usedPhotoIds.current.has(String(photo.id)) : false;
      const isUsedByUrl = usedPhotoUrls.current.has(photo.imageUrl);
      const isUsed = isUsedById || isUsedByUrl;
      
      if (isUsed) {
        return false;
      }

      // Verificar se corresponde ao page/section solicitado
      // Comparação case-insensitive e remove espaços
      const photoPage = (photo.page || '').toLowerCase().trim();
      const photoSection = (photo.section || '').toLowerCase().trim();
      const targetPage = page.toLowerCase().trim();
      const targetSections = sectionArray.map(s => s.toLowerCase().trim());
      
      // Deve corresponder à página E à seção
      // Verifica se a página corresponde e se a seção está no array de seções alvo
      const pageMatches = photoPage === targetPage;
      const sectionMatches = photoSection && targetSections.includes(photoSection);
      
      if (pageMatches && sectionMatches) {
        return true;
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

    // Debug temporário para quartos - sempre logar quando for quartos
    if (page === 'home' && sectionArray.includes('experiencias-quartos')) {
      console.log('🔍 [QUARTOS] getUnusedPhotosByPageSection chamado:', {
        totalPhotos: photos.length,
        filteredCount: filtered.length,
        resultCount: result.length,
        sectionArray,
        usedIdsCount: usedPhotoIds.current.size,
        usedUrlsCount: usedPhotoUrls.current.size
      });
    }

    // Debug detalhado quando não encontra resultado
    if (page === 'home' && sectionArray.includes('experiencias-quartos') && result.length === 0 && photos.length > 0) {
      const matchingPhotos = photos.filter(p => {
        const pPage = (p.page || '').toLowerCase().trim();
        const pSection = (p.section || '').toLowerCase().trim();
        return pPage === 'home' && pSection === 'experiencias-quartos';
      });
      
      // Verificar cada etapa do filtro
      const debugSteps = matchingPhotos.map(p => {
        const hasImageUrl = !!(p.imageUrl && typeof p.imageUrl === 'string' && p.imageUrl.trim());
        const isUsedById = p.id ? usedPhotoIds.current.has(String(p.id)) : false;
        const isUsedByUrl = p.imageUrl ? usedPhotoUrls.current.has(p.imageUrl) : false;
        const isUsed = isUsedById || isUsedByUrl;
        const pPage = (p.page || '').toLowerCase().trim();
        const pSection = (p.section || '').toLowerCase().trim();
        const targetPage = page.toLowerCase().trim();
        const targetSections = sectionArray.map(s => s.toLowerCase().trim());
        const pageMatches = pPage === targetPage;
        const sectionMatches = pSection && targetSections.includes(pSection);
        
        return {
          id: p.id,
          page: p.page,
          section: p.section,
          imageUrl: p.imageUrl?.substring(0, 50),
          hasImageUrl,
          isUsedById,
          isUsedByUrl,
          isUsed,
          pageMatches,
          sectionMatches,
          passesFilter: hasImageUrl && !isUsed && pageMatches && sectionMatches
        };
      });
      
      console.log('🔍 Debug getUnusedPhotosByPageSection (quartos):', {
        totalPhotos: photos.length,
        matchingPhotos: matchingPhotos.length,
        matchingDetails: debugSteps,
        filteredCount: filtered.length,
        resultCount: result.length,
        usedIds: Array.from(usedPhotoIds.current),
        usedUrls: Array.from(usedPhotoUrls.current).map(u => u.substring(0, 50))
      });
    }

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
   * Obtém uma única foto não utilizada por page/section (sistema novo)
   */
  const getUnusedPhotoByPageSection = (
    photos: Array<{ 
      id?: number | string; 
      imageUrl: string; 
      page?: string | null;
      section?: string | null;
      order?: number; 
      title?: string | null 
    }>,
    page: string,
    section: string
  ) => {
    const result = getUnusedPhotosByPageSection(photos, page, section, 1);
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

  // Usar useMemo para estabilizar a referência do objeto retornado
  // Isso evita re-renderizações desnecessárias quando usado como dependência
  return useMemo(() => ({
    getUnusedPhotos,
    getUnusedPhoto,
    getUnusedPhotosByPageSection,
    getUnusedPhotoByPageSection,
    markAsUsed,
    isUsed,
    reset,
    getStats,
  }), []); // Array vazio porque as funções usam refs que são estáveis
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

