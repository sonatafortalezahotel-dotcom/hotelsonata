/**
 * Constantes para organização de imagens por página e seção
 * Define onde cada imagem aparece no site de forma clara e didática
 */

export type PageType = "home" | "lazer" | "gastronomia" | "esg" | "contato" | "reservas";

export interface PageSection {
  id: string;
  name: string;
  description: string;
  whereAppears: string; // Descrição clara de onde aparece
  recommendedImages: number;
  imageTypes?: string[]; // Tipos de imagem recomendados
}

export const PAGE_SECTIONS: Record<PageType, PageSection[]> = {
  home: [
    {
      id: "hero-carousel",
      name: "Carrossel Principal (Hero)",
      description: "⚠️ ATENÇÃO: O carrossel hero é gerenciado em 'Destaques' (highlights), não aqui! Esta seção aceita apenas imagens fixas. Para vídeos ou carrossel dinâmico, use /admin/highlights",
      whereAppears: "Topo da homepage - Carrossel de imagens/vídeos em destaque com textos sobrepostos. Gerenciado em 'Destaques' no menu admin.",
      recommendedImages: 0,
      imageTypes: ["NOTA: Use /admin/highlights para gerenciar o hero com vídeos"]
    },
    {
      id: "experiencias-piscina",
      name: "Card Experiências - Piscina",
      description: "Imagens para o card de Piscina Vista Mar na seção Experiências Visuais",
      whereAppears: "Homepage - Seção 'Experiências Visuais' - Card da Piscina (carrossel de 4 imagens)",
      recommendedImages: 4,
      imageTypes: ["Piscina", "Vista mar", "Ambiente"]
    },
    {
      id: "experiencias-gastronomia",
      name: "Card Experiências - Gastronomia",
      description: "Imagens para o card de Gastronomia na seção Experiências Visuais",
      whereAppears: "Homepage - Seção 'Experiências Visuais' - Card de Gastronomia (carrossel de 4 imagens)",
      recommendedImages: 4,
      imageTypes: ["Pratos", "Restaurante", "Café da manhã"]
    },
    {
      id: "experiencias-quartos",
      name: "Card Experiências - Quartos",
      description: "Imagens para o card de Quartos na seção Experiências Visuais",
      whereAppears: "Homepage - Seção 'Experiências Visuais' - Card de Quartos (carrossel de 3 imagens)",
      recommendedImages: 3,
      imageTypes: ["Quartos", "Recepção", "Interiores"]
    },
    {
      id: "experiencias-spa",
      name: "Card Experiências - Spa & Bem-Estar",
      description: "Imagens para o card de Spa na seção Experiências Visuais",
      whereAppears: "Homepage - Seção 'Experiências Visuais' - Card de Spa (carrossel de 3 imagens)",
      recommendedImages: 3,
      imageTypes: ["Spa", "Academia", "Bem-estar"]
    },
    {
      id: "experiencias-beach-tennis",
      name: "Card Experiências - Beach Tennis",
      description: "Imagens para o card de Beach Tennis na seção Experiências Visuais",
      whereAppears: "Homepage - Seção 'Experiências Visuais' - Card de Beach Tennis (carrossel de 2 imagens)",
      recommendedImages: 2,
      imageTypes: ["Esportes", "Lazer", "Atividades"]
    },
    {
      id: "experiencias-sustentabilidade",
      name: "Card Experiências - Sustentabilidade",
      description: "Imagens para o card de Sustentabilidade na seção Experiências Visuais",
      whereAppears: "Homepage - Seção 'Experiências Visuais' - Card de Sustentabilidade (carrossel de 2 imagens)",
      recommendedImages: 2,
      imageTypes: ["Sustentabilidade", "Ambiente", "Ações sociais"]
    },
    {
      id: "photo-story",
      name: "Photo Story - Um Dia no Hotel",
      description: "Imagens para a seção Photo Story que conta um dia no hotel",
      whereAppears: "Homepage - Seção 'Um Dia no Hotel' - Timeline visual com 8 momentos do dia",
      recommendedImages: 8,
      imageTypes: ["Momentos do dia", "Vida no hotel", "Experiências"]
    },
    {
      id: "galeria-momentos",
      name: "Galeria - Momentos Inesquecíveis",
      description: "Galeria de imagens gerais da homepage",
      whereAppears: "Homepage - Seção 'Momentos Inesquecíveis' - Grid com 9 imagens",
      recommendedImages: 9,
      imageTypes: ["Diversos", "Melhores momentos", "Vida no hotel"]
    },
    {
      id: "localizacao-pontos",
      name: "Localização - Pontos Turísticos",
      description: "Imagens dos pontos turísticos próximos ao hotel",
      whereAppears: "Homepage - Seção 'Localização' - Cards dos pontos turísticos (4 imagens)",
      recommendedImages: 4,
      imageTypes: ["Pontos turísticos", "Arredores", "Localização"]
    }
  ],
  lazer: [
    {
      id: "hero-lazer",
      name: "Hero - Imagem Principal",
      description: "Imagem de destaque no topo da página de Lazer",
      whereAppears: "Página Lazer - Topo da página com título e subtítulo sobrepostos",
      recommendedImages: 1,
      imageTypes: ["Piscina vista mar", "Panorâmica", "Alta resolução"]
    },
    {
      id: "galeria-piscina",
      name: "Galeria - Piscina Vista Mar",
      description: "Imagens da piscina com vista para o mar",
      whereAppears: "Página Lazer - Seção dedicada à piscina (grid de 6 imagens)",
      recommendedImages: 6,
      imageTypes: ["Piscina", "Vista mar", "Ambiente"]
    },
    {
      id: "photo-story-lazer",
      name: "Photo Story - Atividades do Dia",
      description: "Timeline visual das atividades de lazer",
      whereAppears: "Página Lazer - Seção 'Atividades do Dia' (4 momentos)",
      recommendedImages: 4,
      imageTypes: ["Atividades", "Momentos", "Lazer"]
    },
    {
      id: "galeria-academia",
      name: "Galeria - Academia & Fitness",
      description: "Imagens da academia e área de fitness",
      whereAppears: "Página Lazer - Seção de Academia (grid de 4 imagens)",
      recommendedImages: 4,
      imageTypes: ["Academia", "Equipamentos", "Fitness"]
    },
    {
      id: "galeria-atividades",
      name: "Galeria - Atividades ao Ar Livre",
      description: "Imagens de atividades esportivas e ao ar livre",
      whereAppears: "Página Lazer - Seção de Atividades (4 imagens: 2 esportes, 2 lazer)",
      recommendedImages: 4,
      imageTypes: ["Beach tennis", "Bicicletas", "Esportes", "Lazer"]
    },
    {
      id: "galeria-spa",
      name: "Galeria - Spa & Relaxamento",
      description: "Imagens do spa e áreas de relaxamento",
      whereAppears: "Página Lazer - Seção de Spa (grid de 4 imagens)",
      recommendedImages: 4,
      imageTypes: ["Spa", "Massagem", "Relaxamento"]
    },
    {
      id: "cards-atividades",
      name: "Cards de Atividades",
      description: "Imagens para os cards informativos de cada atividade",
      whereAppears: "Página Lazer - Cards com informações das atividades (5 cards com carrosséis)",
      recommendedImages: 15, // 3 por card aproximadamente
      imageTypes: ["Diversos", "Atividades específicas"]
    },
    {
      id: "localizacao-lazer",
      name: "Localização - Contexto",
      description: "Imagem de contexto da localização privilegiada",
      whereAppears: "Página Lazer - Seção sobre localização privilegiada (1 imagem grande)",
      recommendedImages: 1,
      imageTypes: ["Vista", "Localização", "Arredores"]
    }
  ],
  gastronomia: [
    {
      id: "hero-gastronomia",
      name: "Hero - Imagem Principal",
      description: "Imagem de destaque no topo da página de Gastronomia",
      whereAppears: "Página Gastronomia - Topo da página com título e subtítulo sobrepostos",
      recommendedImages: 1,
      imageTypes: ["Restaurante", "Prato", "Ambiente", "Alta resolução"]
    },
    {
      id: "card-cafe-manha",
      name: "Card - Café da Manhã",
      description: "Imagens para o card de Café da Manhã",
      whereAppears: "Página Gastronomia - Card informativo do Café da Manhã (carrossel de 4 imagens)",
      recommendedImages: 4,
      imageTypes: ["Café da manhã", "Pratos", "Bebidas", "Ambiente"]
    },
    {
      id: "card-restaurante",
      name: "Card - Restaurante",
      description: "Imagens para o card do Restaurante",
      whereAppears: "Página Gastronomia - Card informativo do Restaurante (carrossel de 5 imagens)",
      recommendedImages: 5,
      imageTypes: ["Pratos", "Restaurante", "Ambiente", "Chef"]
    },
    {
      id: "galeria-cafe",
      name: "Galeria - Café da Manhã",
      description: "Galeria de imagens do café da manhã",
      whereAppears: "Página Gastronomia - Galeria de pratos do café (grid de 6 imagens)",
      recommendedImages: 6,
      imageTypes: ["Pratos", "Café", "Frutas", "Tapioca"]
    },
    {
      id: "photo-story-gastronomia",
      name: "Photo Story - Experiência Gastronômica",
      description: "Timeline visual da experiência gastronômica",
      whereAppears: "Página Gastronomia - Seção 'Experiência Gastronômica' (4 momentos)",
      recommendedImages: 4,
      imageTypes: ["Restaurante", "Pratos", "Chef", "Café da manhã"]
    },
    {
      id: "galeria-restaurante",
      name: "Galeria - Restaurante e Pratos",
      description: "Galeria de imagens do restaurante e pratos principais",
      whereAppears: "Página Gastronomia - Galeria do restaurante (grid de 6 imagens)",
      recommendedImages: 6,
      imageTypes: ["Pratos", "Restaurante", "Ambiente", "Chef"]
    }
  ],
  esg: [
    {
      id: "hero-esg",
      name: "Hero - Imagem Principal",
      description: "Imagem de destaque no topo da página ESG",
      whereAppears: "Página ESG - Topo da página com título e subtítulo sobrepostos",
      recommendedImages: 1,
      imageTypes: ["Sustentabilidade", "Ambiente", "Ações sociais", "Alta resolução"]
    },
    {
      id: "galeria-praticas",
      name: "Galeria - Práticas Sustentáveis",
      description: "Imagens das práticas sustentáveis do hotel",
      whereAppears: "Página ESG - Galeria de práticas sustentáveis (grid de 6 imagens)",
      recommendedImages: 6,
      imageTypes: ["Sustentabilidade", "Reciclagem", "Energia", "Água", "Meio ambiente"]
    },
    {
      id: "photo-story-impacto",
      name: "Photo Story - Impacto Social e Ambiental",
      description: "Timeline visual do impacto social e ambiental",
      whereAppears: "Página ESG - Seção 'Impacto Social e Ambiental' (4 momentos)",
      recommendedImages: 4,
      imageTypes: ["Ações sociais", "Sustentabilidade", "Inclusão", "Comunidade"]
    },
    {
      id: "acoes-sociais",
      name: "Ações Sociais - Imagem Destaque",
      description: "Imagem de destaque para a seção de ações sociais",
      whereAppears: "Página ESG - Seção 'Compromisso Social' (imagem grande com texto)",
      recommendedImages: 1,
      imageTypes: ["Ações sociais", "Comunidade", "Pessoas", "Impacto"]
    }
  ],
  contato: [
    {
      id: "hero-contato",
      name: "Hero - Imagem Principal",
      description: "Imagem de destaque no topo da página de Contato",
      whereAppears: "Página Contato - Topo da página com título e subtítulo sobrepostos",
      recommendedImages: 1,
      imageTypes: ["Recepção", "Hotel", "Ambiente acolhedor", "Alta resolução"]
    },
    {
      id: "galeria-equipe",
      name: "Galeria - Nossa Equipe Aguarda Você",
      description: "Imagens mostrando os diferentes setores da equipe",
      whereAppears: "Página Contato - Seção 'Nossa Equipe' (3 cards: Recepção, Gastronomia, Lazer)",
      recommendedImages: 3,
      imageTypes: ["Recepção", "Restaurante", "Lazer", "Equipe"]
    },
    {
      id: "galeria-localizacao",
      name: "Galeria - Como Chegar",
      description: "Imagens da localização e arredores",
      whereAppears: "Página Contato - Seção 'Como Chegar' (grid de 4 imagens + mapa)",
      recommendedImages: 4,
      imageTypes: ["Hotel", "Arredores", "Localização", "Pontos turísticos"]
    }
  ],
  reservas: [
    {
      id: "hero-reservas",
      name: "Hero - Imagem de Fundo",
      description: "Imagem de fundo no topo da página de Reservas",
      whereAppears: "Página Reservas - Topo da página com título e subtítulo sobrepostos",
      recommendedImages: 1,
      imageTypes: ["Quartos", "Hotel", "Vista mar", "Alta resolução"]
    }
  ]
};

/**
 * Obtém todas as seções de uma página
 */
export function getPageSections(page: PageType): PageSection[] {
  return PAGE_SECTIONS[page] || [];
}

/**
 * Obtém uma seção específica
 */
export function getSection(page: PageType, sectionId: string): PageSection | undefined {
  return PAGE_SECTIONS[page]?.find(s => s.id === sectionId);
}

/**
 * Valida se uma página é válida
 */
export function isValidPage(page: string): page is PageType {
  return page in PAGE_SECTIONS;
}

