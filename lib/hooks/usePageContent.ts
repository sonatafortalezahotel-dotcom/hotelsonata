"use client";

import { useState, useEffect, useCallback } from "react";

export type PageKey = "hotel" | "lazer" | "quartos" | "gastronomia" | "eventos" | "esg" | "contato" | "home" | "global" | "reservas" | "pacotes" | "trabalhe";

export interface PageContentMap {
  [key: string]: string;
}

export function usePageContent(
  page: PageKey | null,
  locale: string = "pt"
): { overrides: PageContentMap; loading: boolean; error: string | null; refetch: () => Promise<void> } {
  const [overrides, setOverrides] = useState<PageContentMap>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOverrides = useCallback(async () => {
    if (!page) {
      setOverrides({});
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/page-content?page=${page}&locale=${locale}`, { cache: "no-store" });
      if (!res.ok) throw new Error("Erro ao buscar conteúdo");
      const data = await res.json();
      setOverrides(typeof data === "object" && data !== null ? data : {});
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro desconhecido");
      setOverrides({});
    } finally {
      setLoading(false);
    }
  }, [page, locale]);

  useEffect(() => {
    fetchOverrides();
  }, [fetchOverrides]);

  return { overrides, loading, error, refetch: fetchOverrides };
}
