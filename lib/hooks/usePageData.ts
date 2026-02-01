"use client";

import { useState, useEffect, useCallback } from "react";

export type PageKey = "hotel" | "lazer" | "quartos" | "gastronomia" | "eventos" | "esg" | "contato" | "home" | "global" | "reservas" | "pacotes" | "trabalhe";

export interface PageDataResult {
  gallery: any[];
  rooms: any[];
  events: any[];
  leisure: any[];
  gastronomy: any[];
  sustainability: any[];
  settings: any[] | null;
  highlights: any[];
  packages: any[];
  certifications: any[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

const PAGE_KEYS: PageKey[] = [
  "hotel",
  "lazer",
  "quartos",
  "gastronomia",
  "eventos",
  "esg",
  "contato",
  "home",
  "global",
  "reservas",
  "pacotes",
  "trabalhe",
];

function getGalleryPageParam(pageKey: PageKey): string | null {
  switch (pageKey) {
    case "hotel":
      return "home";
    case "lazer":
      return "lazer";
    case "quartos":
      return "home";
    case "gastronomia":
      return "gastronomia";
    case "eventos":
      return "eventos";
    case "esg":
      return "esg";
    case "contato":
      return "contato";
    case "home":
      return "home";
    case "global":
      return null;
    case "reservas":
    case "pacotes":
    case "trabalhe":
      return null;
    default:
      return null;
  }
}

export function usePageData(pageKey: PageKey, locale: string = "pt"): PageDataResult {
  const [gallery, setGallery] = useState<any[]>([]);
  const [rooms, setRooms] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [leisure, setLeisure] = useState<any[]>([]);
  const [gastronomy, setGastronomy] = useState<any[]>([]);
  const [sustainability, setSustainability] = useState<any[]>([]);
  const [settings, setSettings] = useState<any[] | null>(null);
  const [highlights, setHighlights] = useState<any[]>([]);
  const [packages, setPackages] = useState<any[]>([]);
  const [certifications, setCertifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (!pageKey) return;
    setLoading(true);
    setError(null);
    try {
      const galleryPage = getGalleryPageParam(pageKey);
      const galleryUrl = galleryPage
        ? `/api/gallery?page=${galleryPage}&active=all`
        : "/api/gallery?active=all";

      const urls: Record<string, string> = {
        gallery: galleryUrl,
        rooms: "/api/rooms?active=true",
        events: "/api/events?active=true",
        leisure: "/api/leisure?active=true",
        gastronomy: "/api/gastronomy?active=true",
        sustainability: "/api/sustainability?active=true",
        settings: "/api/settings",
        highlights: "/api/highlights",
        packages: "/api/packages",
        certifications: "/api/certifications",
      };

      const results = await Promise.allSettled([
        fetch(urls.gallery).then((r) => (r.ok ? r.json() : [])),
        fetch(urls.rooms).then((r) => (r.ok ? r.json() : [])),
        fetch(urls.events).then((r) => (r.ok ? r.json() : [])),
        fetch(urls.leisure).then((r) => (r.ok ? r.json() : [])),
        fetch(urls.gastronomy).then((r) => (r.ok ? r.json() : [])),
        fetch(urls.sustainability).then((r) => (r.ok ? r.json() : [])),
        fetch(urls.settings).then((r) => (r.ok ? r.json() : null)),
        fetch(urls.highlights).then((r) => (r.ok ? r.json() : [])),
        fetch(urls.packages).then((r) => (r.ok ? r.json() : [])),
        fetch(urls.certifications).then((r) => (r.ok ? r.json() : [])),
      ]);

      const [
        galleryRes,
        roomsRes,
        eventsRes,
        leisureRes,
        gastronomyRes,
        sustainabilityRes,
        settingsRes,
        highlightsRes,
        packagesRes,
        certificationsRes,
      ] = results;

      setGallery(fulfilled(galleryRes) ? galleryRes.value : []);
      setRooms(fulfilled(roomsRes) ? roomsRes.value : []);
      setEvents(fulfilled(eventsRes) ? eventsRes.value : []);
      setLeisure(fulfilled(leisureRes) ? leisureRes.value : []);
      setGastronomy(fulfilled(gastronomyRes) ? gastronomyRes.value : []);
      setSustainability(fulfilled(sustainabilityRes) ? sustainabilityRes.value : []);
      setSettings(fulfilled(settingsRes) ? settingsRes.value : null);
      setHighlights(fulfilled(highlightsRes) ? highlightsRes.value : []);
      setPackages(fulfilled(packagesRes) ? packagesRes.value : []);
      setCertifications(fulfilled(certificationsRes) ? certificationsRes.value : []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao carregar dados");
      console.error("usePageData error:", err);
    } finally {
      setLoading(false);
    }
  }, [pageKey]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    gallery,
    rooms,
    events,
    leisure,
    gastronomy,
    sustainability,
    settings,
    highlights,
    packages,
    certifications,
    loading,
    error,
    refetch: fetchData,
  };
}

function fulfilled<T>(result: PromiseSettledResult<T>): result is PromiseFulfilledResult<T> {
  return result.status === "fulfilled";
}

export { PAGE_KEYS };
