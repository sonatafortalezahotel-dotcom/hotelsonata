import { format } from "date-fns";
import type { Locale } from "@/lib/i18n";

/**
 * Configurações da integração com Omnibees
 */
const OMNIBEES_CONFIG = {
  baseUrl: "https://book.omnibees.com/hotelresults",
  hotelCode: "1688", // Código do hotel na Omnibees
  searchCode: "2712", // Código de busca
  currencyId: "16", // 16 = BRL (Real Brasileiro)
} as const;

/**
 * Mapeia o locale do site para o formato de idioma da Omnibees
 */
function mapLocaleToOmnibeesLang(locale: Locale): string {
  const localeMap: Record<Locale, string> = {
    pt: "pt-PT",
    es: "es",
    en: "en",
  };
  return localeMap[locale] || "pt-PT";
}

/**
 * Formata uma data para o formato DDMMYYYY usado pela Omnibees
 */
function formatDateForOmnibees(date: Date): string {
  return format(date, "ddMMyyyy");
}

export interface OmnibeesSearchParams {
  checkIn: Date;
  checkOut: Date;
  adults: string | number;
  children?: string | number;
  promoCode?: string;
  locale?: Locale;
  rooms?: number;
}

/**
 * Constrói a URL da Omnibees com os parâmetros de busca
 */
export function buildOmnibeesUrl(params: OmnibeesSearchParams): string {
  const {
    checkIn,
    checkOut,
    adults,
    children = "0",
    promoCode = "",
    locale = "pt",
    rooms = 1,
  } = params;

  const urlParams = new URLSearchParams({
    CheckIn: formatDateForOmnibees(checkIn),
    CheckOut: formatDateForOmnibees(checkOut),
    Code: promoCode || "",
    NRooms: rooms.toString(),
    ad: adults.toString(),
    c: OMNIBEES_CONFIG.hotelCode,
    ch: children.toString(),
    currencyId: OMNIBEES_CONFIG.currencyId,
    hotel_folder: "",
    lang: mapLocaleToOmnibeesLang(locale),
    q: OMNIBEES_CONFIG.searchCode,
  });

  return `${OMNIBEES_CONFIG.baseUrl}?${urlParams.toString()}`;
}
