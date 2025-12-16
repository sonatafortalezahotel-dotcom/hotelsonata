"use client";

import { useState, useEffect } from "react";
import { fetchDollarRate, formatPriceSync } from "@/lib/utils/currency";
import type { Locale } from "@/lib/context/LanguageContext";

/**
 * Hook para gerenciar cotação do dólar e formatação de preços
 * 
 * Busca a cotação do dólar uma vez e mantém em cache durante a sessão
 */
export function useCurrency() {
  const [dollarRate, setDollarRate] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadDollarRate() {
      try {
        setLoading(true);
        setError(null);
        const rate = await fetchDollarRate();
        if (rate !== null) {
          setDollarRate(rate);
        } else {
          setError("Não foi possível carregar a cotação do dólar");
          // Usar taxa padrão como fallback
          setDollarRate(5.0);
        }
      } catch (err) {
        console.error("Erro ao carregar cotação do dólar:", err);
        setError("Erro ao carregar cotação do dólar");
        // Usar taxa padrão como fallback
        setDollarRate(5.0);
      } finally {
        setLoading(false);
      }
    }

    loadDollarRate();
  }, []);

  /**
   * Formata um preço baseado no locale
   * @param priceInCents Preço em centavos de BRL
   * @param locale Locale atual
   * @returns String formatada do preço
   */
  const formatPrice = (priceInCents: number | null | undefined, locale: Locale): string => {
    return formatPriceSync(priceInCents, locale, dollarRate);
  };

  return {
    dollarRate,
    loading,
    error,
    formatPrice,
  };
}

