/**
 * Utilitários para geração de slugs SEO-friendly
 */

/**
 * Gera um slug a partir de uma string
 * Exemplo: "Hotel em Fortaleza" -> "hotel-em-fortaleza"
 */
export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD") // Normaliza caracteres acentuados
    .replace(/[\u0300-\u036f]/g, "") // Remove diacríticos
    .replace(/[^\w\s-]/g, "") // Remove caracteres especiais
    .replace(/\s+/g, "-") // Substitui espaços por hífens
    .replace(/-+/g, "-") // Remove hífens duplicados
    .replace(/^-+|-+$/g, ""); // Remove hífens do início e fim
}

/**
 * Gera um slug único adicionando um sufixo numérico se necessário
 */
export function generateUniqueSlug(
  baseSlug: string,
  existingSlugs: string[],
  maxAttempts: number = 100
): string {
  let slug = baseSlug;
  let attempt = 0;

  while (existingSlugs.includes(slug) && attempt < maxAttempts) {
    attempt++;
    slug = `${baseSlug}-${attempt}`;
  }

  return slug;
}

/**
 * Gera múltiplos slugs a partir de combinações de palavras-chave
 * Exemplo: ["hotel", "fortaleza", "vista mar"] -> ["hotel-fortaleza", "hotel-vista-mar", "fortaleza-vista-mar", "hotel-fortaleza-vista-mar"]
 */
export function generateSlugCombinations(
  keywords: string[],
  maxLength: number = 5
): string[] {
  const slugs: string[] = [];
  const normalizedKeywords = keywords.map((k) => generateSlug(k));

  // Gera combinações de 1 até maxLength palavras
  for (let length = 1; length <= Math.min(maxLength, normalizedKeywords.length); length++) {
    // Gera todas as combinações de 'length' elementos
    const combinations = getCombinations(normalizedKeywords, length);
    combinations.forEach((combo) => {
      slugs.push(combo.join("-"));
    });
  }

  return slugs;
}

/**
 * Gera todas as combinações de um array
 */
function getCombinations<T>(arr: T[], length: number): T[][] {
  if (length === 1) return arr.map((item) => [item]);
  if (length === arr.length) return [arr];

  const combinations: T[][] = [];

  for (let i = 0; i <= arr.length - length; i++) {
    const head = arr[i];
    const tailCombinations = getCombinations(arr.slice(i + 1), length - 1);
    tailCombinations.forEach((combo) => {
      combinations.push([head, ...combo]);
    });
  }

  return combinations;
}

/**
 * Valida se um slug é válido
 */
export function isValidSlug(slug: string): boolean {
  // Slug deve ter entre 1 e 100 caracteres
  if (slug.length < 1 || slug.length > 100) return false;

  // Slug deve conter apenas letras minúsculas, números e hífens
  if (!/^[a-z0-9-]+$/.test(slug)) return false;

  // Slug não deve começar ou terminar com hífen
  if (slug.startsWith("-") || slug.endsWith("-")) return false;

  // Slug não deve ter hífens duplicados
  if (slug.includes("--")) return false;

  return true;
}

/**
 * Extrai palavras-chave de um slug
 * Exemplo: "hotel-em-fortaleza-vista-mar" -> ["hotel", "fortaleza", "vista", "mar"]
 */
export function extractKeywordsFromSlug(slug: string): string[] {
  return slug.split("-").filter((word) => word.length > 0);
}

/**
 * Capitaliza palavras-chave de forma inteligente
 * Exemplo: "hotel em fortaleza" -> "Hotel em Fortaleza"
 * Palavras pequenas (em, de, da, do, etc) ficam minúsculas no meio
 */
export function capitalizeKeywords(text: string, locale: string = "pt"): string {
  if (!text || text.trim().length === 0) return text;
  
  // Palavras que devem ficar minúsculas no meio (exceto primeira palavra)
  const smallWords: Record<string, string[]> = {
    pt: ["em", "de", "da", "do", "das", "dos", "a", "o", "e", "com", "para", "por"],
    en: ["in", "on", "at", "to", "for", "of", "the", "a", "an", "and", "or", "with"],
    es: ["en", "de", "del", "la", "el", "y", "con", "para", "por", "a", "o"],
  };

  const smallWordsList = smallWords[locale] || smallWords.pt;

  return text
    .trim()
    .split(/\s+/) // Divide por espaços (múltiplos espaços tratados)
    .map((word, index) => {
      // Remove caracteres especiais do início/fim para processar
      const cleanWord = word.replace(/^[^\w]+|[^\w]+$/g, "");
      if (!cleanWord) return word; // Se não tem palavra, retorna original
      
      const lowerWord = cleanWord.toLowerCase();
      
      // Primeira palavra sempre capitaliza
      if (index === 0) {
        const capitalized = cleanWord.charAt(0).toUpperCase() + cleanWord.slice(1).toLowerCase();
        // Preserva caracteres especiais do início/fim
        return word.replace(cleanWord, capitalized);
      }
      
      // Palavras pequenas ficam minúsculas no meio
      if (smallWordsList.includes(lowerWord)) {
        return word.replace(cleanWord, lowerWord);
      }
      
      // Demais palavras capitalizam
      const capitalized = cleanWord.charAt(0).toUpperCase() + cleanWord.slice(1).toLowerCase();
      return word.replace(cleanWord, capitalized);
    })
    .join(" ");
}

/**
 * Capitaliza todas as palavras (Title Case)
 * Exemplo: "hotel em fortaleza" -> "Hotel Em Fortaleza"
 */
export function capitalizeAllWords(text: string): string {
  return text
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

