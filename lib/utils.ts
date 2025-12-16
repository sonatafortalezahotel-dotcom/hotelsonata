import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Extrai o ID do vídeo de uma URL do YouTube
 * Suporta múltiplos formatos:
 * - https://www.youtube.com/watch?v=VIDEO_ID
 * - https://youtube.com/watch?v=VIDEO_ID
 * - https://youtu.be/VIDEO_ID
 * - https://www.youtu.be/VIDEO_ID
 * - https://youtube.com/embed/VIDEO_ID
 * - https://www.youtube.com/embed/VIDEO_ID
 */
export function extractYouTubeVideoId(url: string): string | null {
  if (!url || typeof url !== 'string') return null;

  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
    /^([a-zA-Z0-9_-]{11})$/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
  }

  return null;
}

/**
 * Extrai o ID do vídeo de uma URL do Vimeo
 * Suporta:
 * - https://vimeo.com/VIDEO_ID
 * - https://player.vimeo.com/video/VIDEO_ID
 */
export function extractVimeoVideoId(url: string): string | null {
  if (!url || typeof url !== 'string') return null;

  const patterns = [
    /(?:vimeo\.com\/|player\.vimeo\.com\/video\/)(\d+)/,
    /^(\d+)$/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
  }

  return null;
}

/**
 * Detecta o tipo de URL de vídeo
 * Retorna 'youtube', 'vimeo', ou 'direct' (URL direta de vídeo)
 */
export function getVideoUrlType(url: string): 'youtube' | 'vimeo' | 'direct' | null {
  if (!url || typeof url !== 'string') return null;

  if (extractYouTubeVideoId(url)) {
    return 'youtube';
  }

  if (extractVimeoVideoId(url)) {
    return 'vimeo';
  }

  // Verifica se é uma URL direta de vídeo (termina com extensão de vídeo)
  const videoExtensions = /\.(mp4|webm|ogg|mov|avi|wmv|flv|mkv)(\?.*)?$/i;
  if (videoExtensions.test(url)) {
    return 'direct';
  }

  // Se não se encaixa em nenhum padrão conhecido, assume que é direto
  // (pode ser uma URL de CDN ou outro serviço)
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return 'direct';
  }

  return null;
}

/**
 * Gera um título/alt text baseado na categoria da imagem da galeria
 * Se a imagem já tiver título, retorna ele. Caso contrário, gera um baseado na categoria
 */
export function getGalleryImageTitle(
  photo: { title?: string | null; category?: string | null },
  index?: number
): string {
  // Se já tem título, usa ele
  if (photo.title && photo.title.trim()) {
    return photo.title;
  }

  // Mapeamento de categorias para títulos genéricos
  const categoryTitles: Record<string, string> = {
    piscina: "Piscina",
    recepcao: "Recepção",
    restaurante: "Restaurante",
    quarto: "Quarto",
    gastronomia: "Gastronomia",
    cafe: "Café",
    lazer: "Lazer",
    esporte: "Esporte",
    spa: "Spa",
    eventos: "Eventos",
    geral: "Hotel Sonata de Iracema",
    localizacao: "Localização",
  };

  // Se tem categoria conhecida, usa o título da categoria
  if (photo.category && categoryTitles[photo.category.toLowerCase()]) {
    return categoryTitles[photo.category.toLowerCase()];
  }

  // Fallback genérico
  return index !== undefined ? `Foto ${index + 1}` : "Foto do hotel";
}