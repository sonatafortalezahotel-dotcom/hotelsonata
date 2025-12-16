"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";

export type Locale = "pt" | "es" | "en";

interface LanguageContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("pt");
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);

    // Tenta detectar o locale da URL primeiro
    const urlLocale = ["pt", "es", "en"].find(
      (l) => pathname?.startsWith(`/${l}/`) || pathname === `/${l}`
    ) as Locale | undefined;

    if (urlLocale) {
      setLocaleState(urlLocale);
      localStorage.setItem("locale", urlLocale);
    } else {
      // Se não tem na URL, tenta do localStorage
      const savedLocale = localStorage.getItem("locale") as Locale;
      if (savedLocale && ["pt", "es", "en"].includes(savedLocale)) {
        setLocaleState(savedLocale);
      }
    }
  }, [pathname]);

  // Função para mudar o idioma
  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
    localStorage.setItem("locale", newLocale);
    
    // Atualizar a URL para refletir o novo idioma
    let newPath = pathname || "/";
    const currentUrlLocale = ["pt", "es", "en"].find(
      (l) => pathname?.startsWith(`/${l}/`) || pathname === `/${l}`
    );

    if (currentUrlLocale) {
      newPath = pathname?.replace(`/${currentUrlLocale}`, "") || "/";
    }
    
    // Garante que o path começa com /
    if (!newPath.startsWith("/")) newPath = "/" + newPath;
    if (newPath === "/") newPath = ""; 

    // Redireciona para a nova URL
    router.push(`/${newLocale}${newPath}`);
  };

  // Função de tradução simples
  const t = (key: string) => {
    const translations: Record<Locale, Record<string, string>> = {
      pt: {
        "home": "Início",
        "hotel": "Hotel",
        "rooms": "Quartos",
        "gastronomy": "Gastronomia",
        "leisure": "Lazer",
        "events": "Eventos",
        "esg": "ESG",
        "contact": "Contato",
        "bookNow": "RESERVAR AGORA",
        "checkIn": "Check-in",
        "checkOut": "Check-out",
        "guests": "Hóspedes",
        "selectDate": "Selecione a data",
        "select": "Selecione",
        "guest": "hóspede",
        "guests_plural": "hóspedes",
      },
      es: {
        "home": "Inicio",
        "hotel": "Hotel",
        "rooms": "Habitaciones",
        "gastronomy": "Gastronomía",
        "leisure": "Ocio",
        "events": "Eventos",
        "esg": "ESG",
        "contact": "Contacto",
        "bookNow": "RESERVAR AHORA",
        "checkIn": "Entrada",
        "checkOut": "Salida",
        "guests": "Huéspedes",
        "selectDate": "Seleccione la fecha",
        "select": "Seleccione",
        "guest": "huésped",
        "guests_plural": "huéspedes",
      },
      en: {
        "home": "Home",
        "hotel": "Hotel",
        "rooms": "Rooms",
        "gastronomy": "Gastronomy",
        "leisure": "Leisure",
        "events": "Events",
        "esg": "ESG",
        "contact": "Contact",
        "bookNow": "BOOK NOW",
        "checkIn": "Check-in",
        "checkOut": "Check-out",
        "guests": "Guests",
        "selectDate": "Select date",
        "select": "Select",
        "guest": "guest",
        "guests_plural": "guests",
      },
    };

    return translations[locale]?.[key] || key;
  };

  // REMOVIDO: O check de !mounted que impedia o Provider de renderizar
  // O Provider deve SEMPRE envolver a aplicação, mesmo no servidor/hidratação inicial.

  return (
    <LanguageContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
