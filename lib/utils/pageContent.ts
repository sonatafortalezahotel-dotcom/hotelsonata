import { Locale } from "@/lib/context/LanguageContext";
import { pageTranslations } from "@/lib/translations/pages";

export type PageKey = "hotel" | "lazer" | "quartos" | "gastronomia" | "eventos" | "esg" | "contato" | "home" | "global" | "reservas" | "pacotes" | "trabalhe";

export interface PageContentMap {
  [key: string]: string;
}

function getNested(obj: unknown, path: string): string | undefined {
  if (obj == null) return undefined;
  const parts = path.split(".");
  let current: unknown = obj;
  for (const part of parts) {
    if (current == null || typeof current !== "object") return undefined;
    current = (current as Record<string, unknown>)[part];
  }
  if (typeof current === "string") return current;
  if (current != null) return String(current);
  return undefined;
}

function getNestedRaw(obj: unknown, path: string): unknown {
  if (obj == null) return undefined;
  const parts = path.split(".");
  let current: unknown = obj;
  for (const part of parts) {
    if (current == null || typeof current !== "object") return undefined;
    current = (current as Record<string, unknown>)[part];
  }
  return current;
}

function getPageTranslationKey(page: PageKey): keyof typeof pageTranslations.pt {
  const map: Record<PageKey, keyof typeof pageTranslations.pt> = {
    hotel: "hotel",
    lazer: "leisure",
    quartos: "rooms",
    gastronomia: "gastronomy",
    eventos: "events",
    esg: "esg",
    contato: "contact",
    home: "home",
    global: "global",
    reservas: "reservations",
    pacotes: "packages",
    trabalhe: "careers",
  };
  return map[page] ?? "hotel";
}

/**
 * Retorna o texto da página: override (do editor) se existir, senão tradução estática.
 */
export function getPageContent(
  page: PageKey,
  section: string,
  fieldKey: string,
  locale: Locale,
  overrides: PageContentMap
): string {
  const overrideKey = `${section}.${fieldKey}`;
  if (overrides[overrideKey] !== undefined && overrides[overrideKey] !== "") {
    return overrides[overrideKey];
  }
  const pageKey = getPageTranslationKey(page);
  const t = pageTranslations[locale]?.[pageKey];
  if (!t) return "";
  let sectionObj = (t as Record<string, unknown>)[section];
  if (sectionObj === undefined) {
    const localeObj = pageTranslations[locale] as Record<string, unknown> | undefined;
    sectionObj = localeObj?.[section];
  }
  const value = getNested(sectionObj, fieldKey);
  return value ?? "";
}

/**
 * Retorna a lista de tags da página: override (JSON array) se existir, senão array da tradução.
 */
export function getPageContentTags(
  page: PageKey,
  section: string,
  fieldKey: string,
  locale: Locale,
  overrides: PageContentMap
): string[] {
  const overrideKey = `${section}.${fieldKey}`;
  const rawOverride = overrides[overrideKey];
  if (rawOverride !== undefined && rawOverride !== "") {
    try {
      const parsed = JSON.parse(rawOverride) as unknown;
      if (Array.isArray(parsed) && parsed.every((x) => typeof x === "string")) return parsed;
    } catch {
      /* ignore */
    }
  }
  const pageKey = getPageTranslationKey(page);
  const t = pageTranslations[locale]?.[pageKey];
  if (!t) return [];
  let sectionObj = (t as Record<string, unknown>)[section];
  if (sectionObj === undefined) {
    const localeObj = pageTranslations[locale] as Record<string, unknown> | undefined;
    sectionObj = localeObj?.[section];
  }
  const raw = getNestedRaw(sectionObj, fieldKey);
  if (Array.isArray(raw) && raw.every((x) => typeof x === "string")) return raw;
  return [];
}

/**
 * Retorna o nome do ícone da página: override (do editor) se existir, senão o valor padrão.
 * Usado para ícones editáveis no editor visual; o nome é resolvido para componente via icon-registry.
 */
export function getPageContentIcon(
  section: string,
  fieldKey: string,
  overrides: PageContentMap,
  defaultName: string
): string {
  const overrideKey = `${section}.${fieldKey}`;
  if (overrides[overrideKey] !== undefined && overrides[overrideKey] !== "") {
    return overrides[overrideKey];
  }
  return defaultName;
}
