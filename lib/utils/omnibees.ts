import { format } from "date-fns";
import type { Locale } from "@/lib/i18n";
import {
  distributeGuests,
  getGuestDistributionErrorMessage,
  type GuestDistributionResult,
} from "@/lib/utils/guestDistribution";

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
  /** Quartos solicitados na UI; se menor que o necessário, a URL não é gerada */
  rooms?: number;
  /** Idade padrão enviada ao Omnibees quando não há seletor de idades (parâmetro ag) */
  defaultChildAge?: number;
}

export class OmnibeesGuestDistributionError extends Error {
  readonly distributionError: Exclude<GuestDistributionResult, { ok: true }>;

  constructor(distributionError: Exclude<GuestDistributionResult, { ok: true }>) {
    const code = distributionError.errorCode;
    super(getGuestDistributionErrorMessage(code, "pt"));
    this.name = "OmnibeesGuestDistributionError";
    this.distributionError = distributionError;
  }
}

/** Idade padrão para o parâmetro ag quando o site não coleta idades das crianças */
const DEFAULT_CHILD_AGE = 8;

function formatChildAgesPerRoom(
  rooms: { adults: number; children: number }[],
  defaultAge: number
): string {
  return rooms
    .map((room) =>
      room.children > 0
        ? Array.from({ length: room.children }, () => String(defaultAge)).join(";")
        : ""
    )
    .join(",");
}

/**
 * Constrói a URL da Omnibees com os parâmetros de busca.
 * ad e ch são por quarto (valores separados por vírgula), conforme documentação Omnibees.
 */
export function buildOmnibeesUrl(params: OmnibeesSearchParams): string {
  const {
    checkIn,
    checkOut,
    adults,
    children = "0",
    promoCode = "",
    locale = "pt",
    rooms: requestedRooms,
    defaultChildAge = DEFAULT_CHILD_AGE,
  } = params;

  const totalAdults = parseInt(String(adults), 10);
  const totalChildren = parseInt(String(children), 10);

  if (Number.isNaN(totalAdults) || Number.isNaN(totalChildren)) {
    throw new OmnibeesGuestDistributionError({ ok: false, errorCode: "INVALID_COMBINATION" });
  }

  const distribution = distributeGuests(
    totalAdults,
    totalChildren,
    requestedRooms && requestedRooms > 0 ? requestedRooms : undefined
  );

  if (!distribution.ok) {
    throw new OmnibeesGuestDistributionError(distribution);
  }

  const { rooms: roomList } = distribution;
  const hasChildren = roomList.some((r) => r.children > 0);

  const urlParams = new URLSearchParams({
    CheckIn: formatDateForOmnibees(checkIn),
    CheckOut: formatDateForOmnibees(checkOut),
    Code: promoCode || "",
    NRooms: String(roomList.length),
    ad: roomList.map((r) => r.adults).join(","),
    c: OMNIBEES_CONFIG.hotelCode,
    ch: roomList.map((r) => r.children).join(","),
    currencyId: OMNIBEES_CONFIG.currencyId,
    hotel_folder: "",
    lang: mapLocaleToOmnibeesLang(locale),
    q: OMNIBEES_CONFIG.searchCode,
  });

  if (hasChildren) {
    urlParams.set("ag", formatChildAgesPerRoom(roomList, defaultChildAge));
  }

  return `${OMNIBEES_CONFIG.baseUrl}?${urlParams.toString()}`;
}

export function getOmnibeesDistributionErrorMessage(
  error: unknown,
  locale: Locale = "pt"
): string | null {
  if (error instanceof OmnibeesGuestDistributionError) {
    return getGuestDistributionErrorMessage(error.distributionError.errorCode, locale);
  }
  return null;
}
