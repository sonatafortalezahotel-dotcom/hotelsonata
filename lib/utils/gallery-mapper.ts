/**
 * Sistema de mapeamento e compatibilidade entre categorias antigas e novo sistema de páginas/seções
 * Permite que imagens cadastradas com o sistema antigo continuem funcionando
 */

/**
 * Mapeamento de categorias antigas para páginas e seções novas
 */
export const CATEGORY_TO_PAGE_SECTION: Record<string, { page: string; sections: string[] }> = {
  // Piscina
  piscina: {
    page: "home",
    sections: ["experiencias-piscina", "galeria-momentos", "photo-story"]
  },
  
  // Gastronomia
  gastronomia: {
    page: "home",
    sections: ["experiencias-gastronomia", "galeria-momentos"]
  },
  restaurante: {
    page: "gastronomia",
    sections: ["hero-gastronomia", "card-restaurante", "galeria-restaurante", "photo-story-gastronomia"]
  },
  cafe: {
    page: "gastronomia",
    sections: ["card-cafe-manha", "galeria-cafe"]
  },
  
  // Quartos
  quarto: {
    page: "home",
    sections: ["experiencias-quartos", "galeria-momentos"]
  },
  recepcao: {
    page: "home",
    sections: ["experiencias-quartos", "galeria-momentos"]
  },
  
  // Lazer
  spa: {
    page: "lazer",
    sections: ["galeria-spa", "cards-atividades"]
  },
  academia: {
    page: "lazer",
    sections: ["galeria-academia", "cards-atividades"]
  },
  lazer: {
    page: "lazer",
    sections: ["galeria-atividades", "cards-atividades"]
  },
  esporte: {
    page: "lazer",
    sections: ["galeria-atividades", "experiencias-beach-tennis"]
  },
  
  // Sustentabilidade
  sustentabilidade: {
    page: "esg",
    sections: ["galeria-praticas", "experiencias-sustentabilidade"]
  },
  
  // Geral/Localização
  geral: {
    page: "home",
    sections: ["galeria-momentos", "localizacao-pontos"]
  },
  localizacao: {
    page: "home",
    sections: ["localizacao-pontos"]
  }
};

/**
 * Obtém a página e seções sugeridas para uma categoria antiga
 */
export function getPageSectionFromCategory(category: string | null | undefined): { page: string; sections: string[] } | null {
  if (!category) return null;
  return CATEGORY_TO_PAGE_SECTION[category] || null;
}

/**
 * Busca imagens com fallback inteligente:
 * 1. Tenta buscar por page/section (sistema novo) - PRIORIDADE MÁXIMA
 * 2. Se não encontrar, busca por category (sistema antigo) com mapeamento
 * 3. Retorna as imagens encontradas
 * 
 * NOTA IMPORTANTE: Se uma imagem tiver tanto page/section quanto category,
 * a API retorna apenas quando buscar por page/section (sistema novo tem prioridade).
 */
export async function fetchGalleryWithFallback(
  page?: string,
  section?: string,
  category?: string,
  limit?: number
): Promise<any[]> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  
  // Prioridade 1: Sistema novo (page/section) - SEMPRE TEM PRIORIDADE
  if (page && section) {
    const params = new URLSearchParams();
    params.append("page", page);
    params.append("section", section);
    if (limit) params.append("limit", limit.toString());
    params.append("active", "true");
    
    const response = await fetch(`${baseUrl}/api/gallery?${params.toString()}`, {
      cache: "no-store",
    });
    
    if (response.ok) {
      const images = await response.json();
      if (images && images.length > 0) {
        return images;
      }
    }
  }
  
  // Prioridade 2: Apenas página (pode ter seções mistas ou sistema antigo)
  if (page) {
    const params = new URLSearchParams();
    params.append("page", page);
    if (limit) params.append("limit", limit.toString());
    params.append("active", "true");
    
    const response = await fetch(`${baseUrl}/api/gallery?${params.toString()}`, {
      cache: "no-store",
    });
    
    if (response.ok) {
      const images = await response.json();
      if (images && images.length > 0) {
        return images;
      }
    }
  }
  
  // Prioridade 3: Sistema antigo (category) - APENAS se não encontrar pelo sistema novo
  // IMPORTANTE: A API retorna apenas imagens que NÃO têm page/section preenchidos
  if (category) {
    const params = new URLSearchParams();
    params.append("category", category);
    if (limit) params.append("limit", limit.toString());
    params.append("active", "true");
    
    const response = await fetch(`${baseUrl}/api/gallery?${params.toString()}`, {
      cache: "no-store",
    });
    
    if (response.ok) {
      const images = await response.json();
      // Filtrar para garantir que retornamos apenas imagens do sistema antigo
      // (que não têm page/section)
      return images.filter((img: any) => !img.page && !img.section);
    }
  }
  
  return [];
}

/**
 * Função auxiliar para buscar imagens por categoria com fallback
 * Mantém compatibilidade com código antigo
 */
export async function fetchGalleryByCategory(
  category: string,
  limit?: number
): Promise<any[]> {
  // Primeiro tenta mapear para página/seção
  const mapping = getPageSectionFromCategory(category);
  
  if (mapping && mapping.sections.length > 0) {
    // Tenta buscar pela primeira seção mapeada
    const images = await fetchGalleryWithFallback(
      mapping.page,
      mapping.sections[0],
      category,
      limit
    );
    
    if (images.length > 0) {
      return images;
    }
  }
  
  // Fallback: busca direto por categoria
  return fetchGalleryWithFallback(undefined, undefined, category, limit);
}

/**
 * Verifica se uma imagem está usando sistema antigo (category) ou novo (page/section)
 */
export function isLegacyImage(image: any): boolean {
  return !image.page && !image.section && !!image.category;
}

/**
 * Sugere página e seção para uma imagem antiga baseado na categoria
 */
export function suggestPageSectionForImage(image: any): { page: string | null; section: string | null } {
  if (!isLegacyImage(image)) {
    return {
      page: image.page || null,
      section: image.section || null
    };
  }
  
  const mapping = getPageSectionFromCategory(image.category);
  if (mapping) {
    return {
      page: mapping.page,
      section: mapping.sections[0] || null
    };
  }
  
  return { page: null, section: null };
}

