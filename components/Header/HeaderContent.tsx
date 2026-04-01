"use client";

import { useState, useEffect, useRef, useCallback, useMemo, useId } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, X, Instagram, Facebook, MessageCircle, Globe, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { useScrollBehavior } from "@/hooks/useScrollBehavior";
import ThemeToggle from "@/components/ThemeToggle";
import { useLanguage } from "@/lib/context/LanguageContext";
import { useEditor } from "@/lib/context/EditorContext";
import { PageText } from "@/components/PageEditor";
import { ScrollArea } from "@/components/ui/scroll-area";
import { getPageContent } from "@/lib/utils/pageContent";

interface HeaderContentProps {
  usePrimaryBackground?: boolean;
}

export default function HeaderContent({ usePrimaryBackground = false }: HeaderContentProps) {
  const [isMounted, setIsMounted] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLanguageMenuOpen, setIsLanguageMenuOpen] = useState(false);
  const { isScrolled, scrollY } = useScrollBehavior(50);
  const languageMenuRef = useRef<HTMLDivElement>(null);
  const { locale, setLocale, t } = useLanguage();
  const pathname = usePathname();
  const urlLocale = pathname && /^\/(en|es)(?:\/|$)/.test(pathname) ? (pathname.split("/")[1] as "en" | "es") : "pt";
  const displayLocale = isMounted ? locale : urlLocale;

  // Garantir que o componente seja montado apenas no cliente para evitar erro de hidratação
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Fecha dropdown de idioma ao clicar fora
  useEffect(() => {
    if (!isLanguageMenuOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.language-selector')) {
        setIsLanguageMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isLanguageMenuOpen]);

  // Navegação por teclado - Escape fecha menus
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        if (isLanguageMenuOpen) {
          setIsLanguageMenuOpen(false);
        }
        if (isMobileMenuOpen) {
          setIsMobileMenuOpen(false);
        }
      }
    };

    if (isLanguageMenuOpen || isMobileMenuOpen) {
      document.addEventListener("keydown", handleEscape);
      return () => document.removeEventListener("keydown", handleEscape);
    }
  }, [isLanguageMenuOpen, isMobileMenuOpen]);

  const handleLanguageKeyDown = useCallback((event: React.KeyboardEvent) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      setIsLanguageMenuOpen(!isLanguageMenuOpen);
    }
  }, [isLanguageMenuOpen]);

  const editor = useEditor();
  const globalOverrides = editor?.globalOverrides ?? {};
  const menuItems = [
    { fieldKey: "nav.hotel", href: "/hotel" },
    { fieldKey: "nav.lazer", href: "/lazer" },
    { fieldKey: "nav.quartos", href: "/quartos" },
    { fieldKey: "nav.gastronomia", href: "/gastronomia" },
    { fieldKey: "nav.eventos", href: "/eventos" },
    { fieldKey: "nav.noticias", href: "/noticias" },
    { fieldKey: "nav.esg", href: "/esg" },
    { fieldKey: "nav.contato", href: "/contato" },
  ];
  const getNavLabel = (fieldKey: string) => {
    if (editor?.editMode) {
      return <PageText page="global" section="header" fieldKey={fieldKey} locale={locale} as="span" />;
    }
    return getPageContent("global", "header", fieldKey, displayLocale, globalOverrides) || "";
  };

  const languages = [
    { code: "pt" as const, name: "PT", label: "Português", flag: "🇧🇷" },
    { code: "es" as const, name: "ES", label: "Español", flag: "🇪🇸" },
    { code: "en" as const, name: "EN", label: "English", flag: "🇬🇧" },
  ];

  const currentLanguage = useMemo(
    () => languages.find((lang) => lang.code === displayLocale) || languages[0],
    [displayLocale]
  );

  const headerClasses = cn(
    "fixed top-0 left-0 right-0 z-[60] transition-all duration-300",
    usePrimaryBackground || isScrolled
      ? "bg-primary shadow-lg"
      : "bg-primary/95 backdrop-blur-sm"
  );

  const textColor = "text-primary-foreground";
  const languageButtonHover = "hover:bg-primary-foreground/10 hover:text-primary-foreground active:bg-primary-foreground/15";

  return (
    <header 
      className={headerClasses}
      role="banner"
      aria-label="Cabeçalho principal"
    >
      <div className="container mx-auto min-w-0 max-w-full px-4 sm:px-6 lg:px-8">
        <div className="header-row flex items-center justify-between h-28 min-w-0">
          {/* Logo: altura da faixa (h-28) + largura extra para o wordmark renderizar maior */}
          <Link 
            href="/"
            className="flex items-center h-full flex-shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-foreground focus-visible:ring-offset-2 focus-visible:ring-offset-primary rounded-lg transition-transform hover:scale-105"
            aria-label="Página inicial"
          >
            <div className="header-logo relative h-28 w-[min(11rem,46vw)] sm:w-36 md:w-40 lg:w-44 xl:w-48 flex-shrink-0">
              <Image
                src="/Logo/logo-soneto (1).png"
                alt="Logo"
                fill
                className="object-contain object-left"
                priority
                sizes="(max-width: 640px) 128px, (max-width: 1024px) 160px, 192px"
              />
            </div>
          </Link>

          {/* Mobile Menu Button */}
          <div className="flex lg:hidden items-center gap-2">
            <ThemeToggle
              variant="ghost"
              className={cn(textColor, languageButtonHover)}
              size="icon"
            />
            {isMounted ? (
              <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className={cn(textColor, languageButtonHover)}
                  aria-label="Abrir menu"
                >
                  {isMobileMenuOpen ? (
                    <X className="h-7 w-7" />
                  ) : (
                    <Menu className="h-7 w-7" />
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[min(400px,100vw-2rem)] sm:w-[400px] p-0">
                <SheetHeader>
                  <SheetTitle className="sr-only">Menu de navegação</SheetTitle>
                </SheetHeader>
                <ScrollArea className="h-full w-full px-6 py-8">
                  <nav className="flex flex-col gap-1" role="navigation" aria-label="Menu principal">
                    {menuItems.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="min-h-[44px] flex items-center px-4 py-3 text-xl font-semibold hover:text-primary hover:bg-accent/50 active:bg-accent transition-colors rounded-lg -mx-2"
                      >
                        {getNavLabel(item.fieldKey)}
                      </Link>
                    ))}
                  </nav>

                  {/* Mobile Language Selector */}
                  <div className="mt-6 pt-6 border-t border-border">
                    <div className="flex items-center gap-2 mb-3 px-4">
                      <Globe className="h-5 w-5 text-muted-foreground" />
                      <span className="text-sm font-semibold text-muted-foreground">
                        Idioma
                      </span>
                    </div>
                    <div className="flex flex-col gap-2 px-4">
                      {languages.map((lang) => (
                        <button
                          key={lang.code}
                          onClick={() => {
                            setLocale(lang.code);
                            setIsMobileMenuOpen(false);
                          }}
                          className={cn(
                            "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200",
                            locale === lang.code
                              ? "bg-primary text-primary-foreground font-semibold shadow-sm"
                              : "bg-accent text-foreground hover:bg-accent/80 hover:text-primary active:bg-accent/60"
                          )}
                          aria-selected={locale === lang.code}
                        >
                          <span className="text-lg">{lang.flag}</span>
                          <span className="flex-1">{lang.label}</span>
                          {locale === lang.code && (
                            <span className="text-xs opacity-70">✓</span>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                </ScrollArea>
                </SheetContent>
              </Sheet>
            ) : (
              <Button
                variant="ghost"
                size="icon"
                className={cn(textColor, languageButtonHover)}
                aria-label="Abrir menu"
                onClick={() => setIsMobileMenuOpen(true)}
              >
                <Menu className="h-7 w-7" />
              </Button>
            )}
          </div>

          {/* Desktop Navigation - compacta em lg (1024px) para caber em resoluções críticas */}
          <nav className="hidden lg:flex items-center gap-3 lg:gap-3 xl:gap-5 2xl:gap-6" role="navigation" aria-label="Menu principal">
            {menuItems.map((item) => {
              const pathWithoutLocale = pathname?.replace(/^\/(en|es)(?=\/|$)/, "") || "";
              const isCurrent = pathWithoutLocale === item.href || (item.href !== "/" && pathWithoutLocale.startsWith(item.href + "/"));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "relative text-sm xl:text-base font-semibold transition-colors group min-w-0 whitespace-nowrap",
                    textColor,
                    isCurrent && "underline underline-offset-4"
                  )}
                  aria-current={isCurrent ? "page" : undefined}
                >
                  <span>
                    {getNavLabel(item.fieldKey)}
                  </span>
                  <span
                    className="absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 w-0 transition-all duration-300 group-hover:w-3/4 bg-primary-foreground"
                    aria-hidden="true"
                  />
                </Link>
              );
            })}

            <ThemeToggle
              variant="ghost"
              size="icon"
              className={cn(textColor, languageButtonHover)}
            />

            {/* Language Selector */}
            <div className="relative group language-selector min-w-0" ref={languageMenuRef}>
              <Button
                variant="ghost"
                size="sm"
                className={cn(
                  "gap-2 px-2 lg:gap-2 lg:px-2.5 xl:gap-2.5 xl:px-3 min-h-[44px]",
                  textColor,
                  languageButtonHover,
                  isLanguageMenuOpen && "bg-primary-foreground/15"
                )}
                onClick={() => setIsLanguageMenuOpen(!isLanguageMenuOpen)}
                onKeyDown={handleLanguageKeyDown}
                aria-label="Selecionar idioma"
                aria-expanded={isLanguageMenuOpen}
                aria-haspopup="true"
              >
                <Globe className="h-4 w-4 xl:h-[1.125rem] xl:w-[1.125rem] flex-shrink-0" />
                <span className="text-sm xl:text-base font-semibold">{currentLanguage.name}</span>
                <ChevronDown className={cn(
                  "h-4 w-4 transition-transform duration-200 flex-shrink-0",
                  isLanguageMenuOpen && "rotate-180"
                )} />
              </Button>
              
              {/* Language Dropdown */}
              {isLanguageMenuOpen && (
                <>
                  <div 
                    className="fixed inset-0" 
                    style={{ zIndex: 9998 }}
                    onClick={() => setIsLanguageMenuOpen(false)}
                    aria-hidden="true"
                  />
                  <div 
                    style={{
                      position: "absolute",
                      top: "calc(100% + 0.5rem)",
                      right: 0,
                      minWidth: "14rem",
                      backgroundColor: "hsl(var(--background))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "0.5rem",
                      boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                      zIndex: 9999,
                    }}
                  >
                    <div style={{ padding: "0.5rem 0" }}>
                      {languages.map((lang) => (
                        <button
                          key={lang.code}
                          onClick={() => {
                            setLocale(lang.code);
                            setIsLanguageMenuOpen(false);
                          }}
                          className={cn(
                            "w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors relative",
                            locale === lang.code
                              ? "bg-primary/5 text-primary font-semibold"
                              : "text-foreground hover:text-primary"
                          )}
                          style={{
                            cursor: "pointer",
                            textAlign: "left",
                          }}
                          aria-selected={locale === lang.code}
                        >
                          {locale === lang.code && (
                            <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary rounded-r-full" />
                          )}
                          
                          <span className="text-base" style={{ minWidth: "1.5rem" }}>
                            {lang.flag}
                          </span>
                          
                          <div className="flex-1">
                            <div className="font-medium">{lang.label}</div>
                            <div className="text-xs text-muted-foreground">{lang.code.toUpperCase()}</div>
                          </div>
                          
                          {locale === lang.code && (
                            <div 
                              className="absolute top-1/2 -translate-y-1/2"
                              style={{ right: "1.25rem" }}
                            >
                              <span className="text-xs opacity-70">✓</span>
                            </div>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
}

