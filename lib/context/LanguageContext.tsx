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
      try {
        if (typeof window !== "undefined" && window.localStorage) {
          window.localStorage.setItem("locale", urlLocale);
        }
      } catch {
        // Storage pode estar indisponível (iframe, modo privado, etc.)
      }
    } else {
      try {
        if (typeof window !== "undefined" && window.localStorage) {
          const savedLocale = window.localStorage.getItem("locale") as Locale;
          if (savedLocale && ["pt", "es", "en"].includes(savedLocale)) {
            setLocaleState(savedLocale);
          }
        }
      } catch {
        // Storage indisponível neste contexto
      }
    }
  }, [pathname]);

  // Função para mudar o idioma
  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
    try {
      if (typeof window !== "undefined" && window.localStorage) {
        window.localStorage.setItem("locale", newLocale);
      }
    } catch {
      // Storage pode estar indisponível (iframe, modo privado, etc.)
    }
    
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
    
    // Se estiver na home (/), não adiciona locale na URL
    // Apenas atualiza o estado e salva no localStorage
    // O componente vai re-renderizar com o novo idioma
    if (newPath === "/" || newPath === "") {
      // Não faz nada além de atualizar o estado
      // O React vai re-renderizar os componentes que usam o locale
      return;
    }
    
    // Para outras rotas, adiciona o locale na URL
    // Remove a barra inicial se existir para evitar duplicação
    const cleanPath = newPath.startsWith("/") ? newPath.slice(1) : newPath;
    
    // Preserva query string (ex: ?editMode=1) ao trocar idioma
    const search = typeof window !== "undefined" ? window.location.search : "";
    
    // Redireciona para a nova URL com locale
    router.push(`/${newLocale}/${cleanPath}${search}`);
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
