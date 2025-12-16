import { useState, useEffect } from "react";

export interface Event {
  id: number;
  type: string;
  title: string | null;
  description: string | null;
  imageUrl: string | null;
  capacity: number | null;
  active: boolean;
  order: number;
}

/**
 * Hook para buscar tipos de eventos
 */
export function useEvents(activeOnly: boolean = true, locale: string = "pt") {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchEvents() {
      try {
        setLoading(true);
        const params = new URLSearchParams();
        params.append("locale", locale);
        if (activeOnly) params.append("active", "true");

        const response = await fetch(`/api/events?${params.toString()}`);
        
        if (!response.ok) {
          throw new Error("Erro ao buscar eventos");
        }

        const data = await response.json();
        setEvents(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erro desconhecido");
        console.error("Erro ao buscar eventos:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchEvents();
  }, [activeOnly, locale]);

  return { events, loading, error };
}

/**
 * Função utilitária para buscar eventos no servidor (Server Components)
 */
export async function getEvents(activeOnly: boolean = true, locale: string = "pt"): Promise<Event[]> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const params = new URLSearchParams();
    params.append("locale", locale);
    if (activeOnly) params.append("active", "true");

    const response = await fetch(`${baseUrl}/api/events?${params.toString()}`, {
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error("Erro ao buscar eventos");
    }

    return await response.json();
  } catch (error) {
    console.error("Erro ao buscar eventos:", error);
    return [];
  }
}

