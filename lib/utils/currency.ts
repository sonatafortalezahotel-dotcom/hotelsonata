/**
 * Utilitários para formatação de moeda e conversão
 * 
 * Regras:
 * - PT-BR: Exibe sempre em R$ (BRL)
 * - Outros idiomas (ES, EN): Exibe sempre em USD com conversão do dólar oficial
 */

import type { Locale } from "@/lib/context/LanguageContext";

// Cache da cotação do dólar (válido por 1 hora)
let dollarRateCache: { rate: number; timestamp: number } | null = null;
const CACHE_DURATION = 60 * 60 * 1000; // 1 hora em milissegundos

/**
 * Busca a cotação oficial do dólar (USD) do Banco Central do Brasil
 * Usa a rota API interna para evitar problemas de CORS
 * @returns Taxa de câmbio USD/BRL ou null em caso de erro
 */
export async function fetchDollarRate(): Promise<number | null> {
  try {
    // Verificar cache primeiro
    if (dollarRateCache && Date.now() - dollarRateCache.timestamp < CACHE_DURATION) {
      return dollarRateCache.rate;
    }

    // Usar rota API interna para evitar problemas de CORS
    const isServer = typeof window === "undefined";
    const baseUrl = isServer 
      ? (process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000")
      : "";
    
    const response = await fetch(`${baseUrl}/api/currency/dollar-rate`, {
      next: { revalidate: 3600 }, // Revalidar a cada hora
    });

    if (!response.ok) {
      console.error("Erro ao buscar cotação do dólar:", response.statusText);
      // Se houver cache, usar o cache mesmo expirado
      if (dollarRateCache) {
        return dollarRateCache.rate;
      }
      return null;
    }

    const data = await response.json();

    if (!data || !data.rate || isNaN(data.rate) || data.rate <= 0) {
      console.error("Resposta da API inválida:", data);
      if (dollarRateCache) {
        return dollarRateCache.rate;
      }
      return null;
    }

    const rate = parseFloat(data.rate);

    // Atualizar cache
    dollarRateCache = {
      rate,
      timestamp: Date.now(),
    };

    return rate;
  } catch (error) {
    console.error("Erro ao buscar cotação do dólar:", error);
    // Se houver cache, usar o cache mesmo em caso de erro
    if (dollarRateCache) {
      return dollarRateCache.rate;
    }
    return null;
  }
}

/**
 * Converte um valor em centavos de BRL para USD
 * @param priceInCents Preço em centavos de BRL
 * @param dollarRate Taxa de câmbio USD/BRL
 * @returns Preço em centavos de USD
 */
export function convertBRLToUSD(priceInCents: number, dollarRate: number): number {
  // Converter centavos para reais, dividir pela taxa, converter para centavos de dólar
  const priceInReais = priceInCents / 100;
  const priceInUSD = priceInReais / dollarRate;
  return Math.round(priceInUSD * 100); // Arredondar para centavos
}

/**
 * Formata um preço baseado no locale
 * - PT-BR: Exibe em R$ (BRL)
 * - Outros: Exibe em USD com conversão
 * 
 * @param priceInCents Preço em centavos de BRL (valor do banco de dados)
 * @param locale Locale atual
 * @param dollarRate Taxa de câmbio USD/BRL (opcional, será buscada se não fornecida)
 * @returns String formatada do preço
 */
export async function formatPrice(
  priceInCents: number | null | undefined,
  locale: Locale,
  dollarRate?: number | null
): Promise<string> {
  if (priceInCents === null || priceInCents === undefined) {
    return locale === "pt" ? "Consulte" : locale === "es" ? "Consultar" : "Contact us";
  }

  // PT-BR: Exibir sempre em R$
  if (locale === "pt") {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(priceInCents / 100);
  }

  // Outros idiomas: Exibir sempre em USD
  let rate = dollarRate;

  // Se não foi fornecida a taxa, buscar
  if (rate === null || rate === undefined) {
    rate = await fetchDollarRate();
  }

  // Se não conseguiu buscar a taxa, usar uma taxa padrão (fallback)
  if (rate === null || rate <= 0) {
    console.warn("Usando taxa de câmbio padrão (5.0) devido a erro na API");
    rate = 5.0; // Taxa padrão de fallback
  }

  const priceInUSDCents = convertBRLToUSD(priceInCents, rate);
  const localeString = locale === "es" ? "es-US" : "en-US";

  return new Intl.NumberFormat(localeString, {
    style: "currency",
    currency: "USD",
  }).format(priceInUSDCents / 100);
}

/**
 * Hook síncrono para formatação de preços (usa cache da taxa)
 * Para uso em componentes client-side que precisam de formatação síncrona
 * 
 * @param priceInCents Preço em centavos de BRL
 * @param locale Locale atual
 * @param dollarRate Taxa de câmbio USD/BRL (deve ser buscada antes e passada como prop)
 * @returns String formatada do preço
 */
export function formatPriceSync(
  priceInCents: number | null | undefined,
  locale: Locale,
  dollarRate?: number | null
): string {
  if (priceInCents === null || priceInCents === undefined) {
    return locale === "pt" ? "Consulte" : locale === "es" ? "Consultar" : "Contact us";
  }

  // PT-BR: Exibir sempre em R$
  if (locale === "pt") {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(priceInCents / 100);
  }

  // Outros idiomas: Exibir sempre em USD
  let rate = dollarRate;

  // Tentar usar cache
  if ((rate === null || rate === undefined) && dollarRateCache) {
    rate = dollarRateCache.rate;
  }

  // Se ainda não tem taxa, usar fallback
  if (rate === null || rate === undefined || rate <= 0) {
    console.warn("Usando taxa de câmbio padrão (5.0) - busque a taxa antes de usar formatPriceSync");
    rate = 5.0; // Taxa padrão de fallback
  }

  const priceInUSDCents = convertBRLToUSD(priceInCents, rate);
  const localeString = locale === "es" ? "es-US" : "en-US";

  return new Intl.NumberFormat(localeString, {
    style: "currency",
    currency: "USD",
  }).format(priceInUSDCents / 100);
}

