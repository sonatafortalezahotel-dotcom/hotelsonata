import pt from "@/locales/pt.json";
import es from "@/locales/es.json";
import en from "@/locales/en.json";

export type Locale = "pt" | "es" | "en";

export const defaultLocale: Locale = "pt";

export const locales: Locale[] = ["pt", "es", "en"];

const translations = {
  pt,
  es,
  en,
};

export function getTranslation(locale: Locale, key: string): string {
  const translationsAny = translations as any;
  return (
    translationsAny[locale]?.[key] || translationsAny[defaultLocale][key]
  );
}
