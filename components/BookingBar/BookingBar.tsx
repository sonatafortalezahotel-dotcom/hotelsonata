"use client";

import { useState, useEffect } from "react";
import { Calendar as CalendarIcon, Users, Search, Loader2, ChevronDown, Tag, ChevronUp } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale/pt-BR";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/lib/context/LanguageContext";
import { toast } from "sonner";

interface BookingBarProps {
  isHomePage?: boolean;
}

export default function BookingBar({ isHomePage = false }: BookingBarProps) {
  const { locale } = useLanguage();
  const [checkIn, setCheckIn] = useState<Date>();
  const [checkOut, setCheckOut] = useState<Date>();
  const [adults, setAdults] = useState("2");
  const [children, setChildren] = useState("0");
  const [promoCode, setPromoCode] = useState("");
  const [isVisible, setIsVisible] = useState(true); // Sempre visível inicialmente
  const [isLoading, setIsLoading] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false); // Estado para expandir/colapsar no mobile

  // Set mounted state to prevent hydration mismatch with Radix UI IDs
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Detectar scroll na home para mostrar/ocultar a barra
  useEffect(() => {
    if (!isHomePage) {
      // Nas outras páginas, sempre visível
      setIsVisible(true);
      return;
    }

    // Na home, controlar visibilidade com scroll
    const handleScroll = () => {
      // Mostrar barra quando passar de 80vh (aproximadamente após o hero)
      const scrollThreshold = window.innerHeight * 0.8;
      setIsVisible(window.scrollY > scrollThreshold);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Checar posição inicial

    return () => window.removeEventListener('scroll', handleScroll);
  }, [isHomePage]);

  const labels = {
    pt: {
      checkIn: "Check-in",
      checkOut: "Check-out",
      adults: "Adultos",
      children: "Crianças",
      guests: "Hóspedes",
      promoCode: "CUPOM",
      reserve: "PESQUISAR",
      selectDate: "Selecione a data",
    },
    es: {
      checkIn: "Entrada",
      checkOut: "Salida",
      adults: "Adultos",
      children: "Niños",
      guests: "Huéspedes",
      promoCode: "CUPÓN",
      reserve: "BUSCAR",
      selectDate: "Seleccione la fecha",
    },
    en: {
      checkIn: "Check-in",
      checkOut: "Check-out",
      adults: "Adults",
      children: "Children",
      guests: "Guests",
      promoCode: "COUPON",
      reserve: "SEARCH",
      selectDate: "Select date",
    },
  };

  const t = labels[locale as keyof typeof labels] || labels.pt;
  const dateLocale = locale === "pt" ? ptBR : undefined;

  // Formatar hóspedes igual ao ReservationForm
  const adultsCount = parseInt(adults);
  const childrenCount = parseInt(children);
  const formattedGuests = locale === "pt" 
    ? `${adultsCount} ${adultsCount === 1 ? "ADULTO" : "ADULTOS"}, ${childrenCount} ${childrenCount === 1 ? "CRIANÇA" : "CRIANÇAS"}`
    : locale === "es"
    ? `${adultsCount} ${adultsCount === 1 ? "ADULTO" : "ADULTOS"}, ${childrenCount} ${childrenCount === 1 ? "NIÑO" : "NIÑOS"}`
    : `${adultsCount} ${adultsCount === 1 ? "ADULT" : "ADULTS"}, ${childrenCount} ${childrenCount === 1 ? "CHILD" : "CHILDREN"}`;

  const handleReserve = () => {
    if (!checkIn || !checkOut) {
      toast.error(
        locale === "en"
          ? "Please select check-in and check-out dates"
          : locale === "es"
          ? "Por favor seleccione las fechas de entrada y salida"
          : "Por favor, selecione as datas de check-in e check-out"
      );
      return;
    }

    if (checkOut <= checkIn) {
      toast.error(
        locale === "en"
          ? "Check-out must be after check-in"
          : locale === "es"
          ? "La salida debe ser después de la entrada"
          : "O check-out deve ser após o check-in"
      );
      return;
    }

    setIsLoading(true);
    
    try {
      const checkInStr = format(checkIn, "yyyy-MM-dd");
      const checkOutStr = format(checkOut, "yyyy-MM-dd");
      const params = new URLSearchParams({
        checkin: checkInStr,
        checkout: checkOutStr,
        adults: adults,
        children: children,
      });
      
      if (promoCode.trim()) {
        params.append("promo", promoCode.trim());
      }
      
      toast.success(
        locale === "en" 
          ? "Searching for availability..." 
          : locale === "es" 
          ? "Buscando disponibilidad..."
          : "Buscando disponibilidade..."
      );
      
      setTimeout(() => {
        window.location.href = `/reservas?${params.toString()}`;
      }, 500);
    } catch (error) {
      setIsLoading(false);
      toast.error(
        locale === "en" 
          ? "An error occurred. Please try again." 
          : locale === "es" 
          ? "Ocurrió un error. Por favor intente nuevamente."
          : "Ocorreu um erro. Por favor, tente novamente."
      );
    }
  };

  // Se na home e não visível, não renderizar
  if (isHomePage && !isVisible) {
    return null;
  }

  return (
    <div 
      className={cn(
        "transition-all duration-300 w-full left-0 right-0",
        isHomePage 
          ? "z-50 sticky top-20 lg:top-20 bg-black/40 dark:bg-black/60 backdrop-blur-md border-b border-slate-800/50 dark:border-slate-700/60" // Na home, sticky FULL WIDTH com fundo
          : "fixed bottom-0 lg:sticky lg:top-24 z-40 bg-black/40 dark:bg-black/60 backdrop-blur-md border-b border-slate-800/50 dark:border-slate-700/60" // Outras páginas: mobile fixo bottom, desktop sticky abaixo do header (top-24 = 96px altura do header)
      )}
    >
      {/* Container interno para o conteúdo */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-1 lg:py-1">
        <div className="max-w-7xl mx-auto">
          {/* Barra com mesmo estilo do ReservationForm */}
          <div className="p-1.5 lg:p-2">
            {/* Versão compacta no mobile (sempre visível) */}
            <div className="lg:hidden">
              <div className="flex items-center gap-2 mb-2">
                {/* Check-in compacto */}
                <div className="flex-1 min-w-0">
                  {isMounted ? (
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="ghost"
                          className={cn(
                            "w-full justify-between text-left font-normal h-9 bg-black/20 hover:bg-black/30 text-white border border-white/20 rounded-md p-2",
                            "text-xs"
                          )}
                        >
                          <div className="flex items-center gap-1.5 flex-1 min-w-0">
                            <CalendarIcon className="h-3.5 w-3.5 flex-shrink-0 text-white" />
                            <div className="flex flex-col items-start min-w-0 flex-1">
                              <span className="text-[10px] text-white/60 uppercase font-medium leading-tight">
                                {t.checkIn}
                              </span>
                              <span className="truncate text-xs font-medium">
                                {checkIn ? format(checkIn, "dd/MM", { locale: dateLocale }) : t.selectDate.split(' ')[0]}
                              </span>
                            </div>
                          </div>
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={checkIn}
                          onSelect={setCheckIn}
                          disabled={(date) => date < new Date()}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  ) : (
                    <Button
                      variant="ghost"
                      className="w-full justify-between text-left font-normal h-9 bg-black/20 text-white border border-white/20 rounded-md p-2 text-xs"
                      disabled
                    >
                      <div className="flex items-center gap-1.5 flex-1 min-w-0">
                        <CalendarIcon className="h-3.5 w-3.5 flex-shrink-0 text-white" />
                        <span className="text-xs">{t.checkIn}</span>
                      </div>
                    </Button>
                  )}
                </div>

                {/* Check-out compacto */}
                <div className="flex-1 min-w-0">
                  {isMounted ? (
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="ghost"
                          className={cn(
                            "w-full justify-between text-left font-normal h-9 bg-black/20 hover:bg-black/30 text-white border border-white/20 rounded-md p-2",
                            "text-xs"
                          )}
                        >
                          <div className="flex items-center gap-1.5 flex-1 min-w-0">
                            <CalendarIcon className="h-3.5 w-3.5 flex-shrink-0 text-white" />
                            <div className="flex flex-col items-start min-w-0 flex-1">
                              <span className="text-[10px] text-white/60 uppercase font-medium leading-tight">
                                {t.checkOut}
                              </span>
                              <span className="truncate text-xs font-medium">
                                {checkOut ? format(checkOut, "dd/MM", { locale: dateLocale }) : t.selectDate.split(' ')[0]}
                              </span>
                            </div>
                          </div>
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={checkOut}
                          onSelect={setCheckOut}
                          disabled={(date) => {
                            if (!checkIn) return date < new Date();
                            return date <= checkIn;
                          }}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  ) : (
                    <Button
                      variant="ghost"
                      className="w-full justify-between text-left font-normal h-9 bg-black/20 text-white border border-white/20 rounded-md p-2 text-xs"
                      disabled
                    >
                      <div className="flex items-center gap-1.5 flex-1 min-w-0">
                        <CalendarIcon className="h-3.5 w-3.5 flex-shrink-0 text-white" />
                        <span className="text-xs">{t.checkOut}</span>
                      </div>
                    </Button>
                  )}
                </div>

                {/* Botão de busca compacto */}
                <Button
                  onClick={handleReserve}
                  className="h-9 px-3 flex-shrink-0 font-semibold bg-orange-500 hover:bg-orange-600 text-white rounded-md"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin text-white" />
                  ) : (
                    <Search className="h-4 w-4 text-white" />
                  )}
                </Button>

                {/* Botão expandir/colapsar */}
                <Button
                  variant="ghost"
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="h-9 w-9 flex-shrink-0 bg-black/20 hover:bg-black/30 text-white border border-white/20 rounded-md p-0"
                  aria-label={isExpanded ? "Recolher" : "Expandir"}
                >
                  {isExpanded ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                </Button>
              </div>

              {/* Campos expandidos (ocultos por padrão) */}
              {isExpanded && (
                <div className="space-y-2 pt-2 border-t border-white/10">
                  {/* Campo de Hóspedes */}
                  <div className="flex-1">
                    {isMounted ? (
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="ghost"
                            className={cn(
                              "w-full justify-between text-left font-normal h-8 bg-black/20 hover:bg-black/30 text-white border border-white/20 rounded-md p-2",
                              "text-xs"
                            )}
                          >
                            <div className="flex items-center gap-2 flex-1 min-w-0">
                              <Users className="h-3.5 w-3.5 flex-shrink-0 text-white" />
                              <span className="truncate text-xs">
                                {formattedGuests}
                              </span>
                            </div>
                            <ChevronDown className="h-3.5 w-3.5 flex-shrink-0 text-white/70 ml-2" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-4" align="start">
                          <div className="space-y-4 min-w-[200px]">
                            <div>
                              <label className="text-sm font-medium mb-2 block">{t.adults}</label>
                              <Select value={adults} onValueChange={setAdults}>
                                <SelectTrigger className="w-full">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                                    <SelectItem key={num} value={num.toString()}>
                                      {num} {num === 1 ? (locale === "en" ? "adult" : locale === "es" ? "adulto" : "adulto") : (locale === "en" ? "adults" : locale === "es" ? "adultos" : "adultos")}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                            <div>
                              <label className="text-sm font-medium mb-2 block">{t.children}</label>
                              <Select value={children} onValueChange={setChildren}>
                                <SelectTrigger className="w-full">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  {[0, 1, 2, 3, 4, 5, 6].map((num) => (
                                    <SelectItem key={num} value={num.toString()}>
                                      {num === 0 
                                        ? (locale === "en" ? "No children" : locale === "es" ? "Sin niños" : "Sem crianças")
                                        : `${num} ${num === 1 
                                          ? (locale === "en" ? "child" : locale === "es" ? "niño" : "criança")
                                          : (locale === "en" ? "children" : locale === "es" ? "niños" : "crianças")
                                        }`
                                      }
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                        </PopoverContent>
                      </Popover>
                    ) : (
                      <Button
                        variant="ghost"
                        className="w-full justify-between text-left font-normal h-8 bg-black/20 text-white border border-white/20 rounded-md p-2 text-xs"
                        disabled
                      >
                        <div className="flex items-center gap-2 flex-1 min-w-0">
                          <Users className="h-3.5 w-3.5 flex-shrink-0 text-white" />
                          <span className="truncate text-xs">
                            {formattedGuests}
                          </span>
                        </div>
                      </Button>
                    )}
                  </div>

                  {/* Campo de Cupom */}
                  <div className="flex-1">
                    <div className="flex items-center h-8 px-2 bg-black/20 border border-white/20 rounded-md">
                      <Tag className="h-3.5 w-3.5 flex-shrink-0 text-white mr-2" />
                      <Input
                        id="promoCode"
                        type="text"
                        placeholder={t.promoCode}
                        value={promoCode}
                        onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                        className="h-auto bg-transparent border-0 text-white placeholder:text-white/60 focus-visible:ring-0 focus-visible:ring-offset-0 p-0 text-xs"
                        maxLength={20}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Versão desktop (sempre expandida) */}
            <div className="hidden lg:flex flex-row items-stretch gap-0">
              {/* Campo de Check-in */}
              <div className="flex-1 border-r border-white/10 dark:border-white/10 pr-6 pl-2">
                {isMounted ? (
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="ghost"
                        className={cn(
                          "w-full justify-between text-left font-normal h-8 lg:h-9 bg-transparent hover:bg-black/20 dark:hover:bg-black/30 text-white border-0 p-1",
                          "text-sm lg:text-base"
                        )}
                      >
                        <div className="flex flex-col items-start gap-1 flex-1 min-w-0">
                          <span className="text-xs text-white/70 uppercase font-medium">
                            {t.checkIn}
                          </span>
                          <div className="flex items-center gap-2 w-full">
                            <CalendarIcon className="h-4 w-4 lg:h-5 lg:w-5 flex-shrink-0 text-white" />
                            <span className="truncate text-xs lg:text-sm">
                              {checkIn ? format(checkIn, "dd/MM/yyyy", { locale: dateLocale }) : t.selectDate}
                            </span>
                          </div>
                        </div>
                        <ChevronDown className="h-4 w-4 flex-shrink-0 text-white/70 ml-2" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={checkIn}
                        onSelect={setCheckIn}
                        disabled={(date) => date < new Date()}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                ) : (
                  <Button
                    variant="ghost"
                    className={cn(
                      "w-full justify-between text-left font-normal h-8 lg:h-9 bg-transparent hover:bg-black/20 dark:hover:bg-black/30 text-white border-0 p-1",
                      "text-sm lg:text-base"
                    )}
                    disabled
                  >
                    <div className="flex flex-col items-start gap-1 flex-1 min-w-0">
                      <span className="text-xs text-white/70 uppercase font-medium">
                        {t.checkIn}
                      </span>
                      <div className="flex items-center gap-2 w-full">
                        <CalendarIcon className="h-4 w-4 lg:h-5 lg:w-5 flex-shrink-0 text-white" />
                        <span className="truncate text-xs lg:text-sm">
                          {checkIn ? format(checkIn, "dd/MM/yyyy", { locale: dateLocale }) : t.selectDate}
                        </span>
                      </div>
                    </div>
                    <ChevronDown className="h-4 w-4 flex-shrink-0 text-white/70 ml-2" />
                  </Button>
                )}
              </div>

              {/* Campo de Check-out */}
              <div className="flex-1 border-r border-white/10 dark:border-white/10 pr-6 pl-6">
                {isMounted ? (
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="ghost"
                        className={cn(
                          "w-full justify-between text-left font-normal h-8 lg:h-9 bg-transparent hover:bg-black/20 dark:hover:bg-black/30 text-white border-0 p-1",
                          "text-sm lg:text-base"
                        )}
                      >
                        <div className="flex flex-col items-start gap-1 flex-1 min-w-0">
                          <span className="text-xs text-white/70 uppercase font-medium">
                            {t.checkOut}
                          </span>
                          <div className="flex items-center gap-2 w-full">
                            <CalendarIcon className="h-4 w-4 lg:h-5 lg:w-5 flex-shrink-0 text-white" />
                            <span className="truncate text-xs lg:text-sm">
                              {checkOut ? format(checkOut, "dd/MM/yyyy", { locale: dateLocale }) : t.selectDate}
                            </span>
                          </div>
                        </div>
                        <ChevronDown className="h-4 w-4 flex-shrink-0 text-white/70 ml-2" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={checkOut}
                        onSelect={setCheckOut}
                        disabled={(date) => {
                          if (!checkIn) return date < new Date();
                          return date <= checkIn;
                        }}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                ) : (
                  <Button
                    variant="ghost"
                    className={cn(
                      "w-full justify-between text-left font-normal h-8 lg:h-9 bg-transparent hover:bg-black/20 dark:hover:bg-black/30 text-white border-0 p-1",
                      "text-sm lg:text-base"
                    )}
                    disabled
                  >
                    <div className="flex flex-col items-start gap-1 flex-1 min-w-0">
                      <span className="text-xs text-white/70 uppercase font-medium">
                        {t.checkOut}
                      </span>
                      <div className="flex items-center gap-2 w-full">
                        <CalendarIcon className="h-4 w-4 lg:h-5 lg:w-5 flex-shrink-0 text-white" />
                        <span className="truncate text-xs lg:text-sm">
                          {checkOut ? format(checkOut, "dd/MM/yyyy", { locale: dateLocale }) : t.selectDate}
                        </span>
                      </div>
                    </div>
                    <ChevronDown className="h-4 w-4 flex-shrink-0 text-white/70 ml-2" />
                  </Button>
                )}
              </div>

              {/* Campo de Hóspedes */}
              <div className="flex-1 border-r border-white/10 dark:border-white/10 pr-6 pl-6">
                {isMounted ? (
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="ghost"
                        className={cn(
                          "w-full justify-between text-left font-normal h-8 lg:h-9 bg-transparent hover:bg-black/20 dark:hover:bg-black/30 text-white border-0 p-1",
                          "text-sm lg:text-base"
                        )}
                      >
                        <div className="flex items-center gap-2 flex-1 min-w-0">
                          <Users className="h-4 w-4 lg:h-5 lg:w-5 flex-shrink-0 text-white" />
                          <span className="truncate text-xs lg:text-sm">
                            {formattedGuests}
                          </span>
                        </div>
                        <ChevronDown className="h-4 w-4 flex-shrink-0 text-white/70 ml-2" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-4" align="start">
                      <div className="space-y-4 min-w-[200px]">
                        <div>
                          <label className="text-sm font-medium mb-2 block">{t.adults}</label>
                          <Select value={adults} onValueChange={setAdults}>
                            <SelectTrigger className="w-full">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                                <SelectItem key={num} value={num.toString()}>
                                  {num} {num === 1 ? (locale === "en" ? "adult" : locale === "es" ? "adulto" : "adulto") : (locale === "en" ? "adults" : locale === "es" ? "adultos" : "adultos")}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <label className="text-sm font-medium mb-2 block">{t.children}</label>
                          <Select value={children} onValueChange={setChildren}>
                            <SelectTrigger className="w-full">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {[0, 1, 2, 3, 4, 5, 6].map((num) => (
                                <SelectItem key={num} value={num.toString()}>
                                  {num === 0 
                                    ? (locale === "en" ? "No children" : locale === "es" ? "Sin niños" : "Sem crianças")
                                    : `${num} ${num === 1 
                                      ? (locale === "en" ? "child" : locale === "es" ? "niño" : "criança")
                                      : (locale === "en" ? "children" : locale === "es" ? "niños" : "crianças")
                                    }`
                                  }
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </PopoverContent>
                  </Popover>
                ) : (
                  <Button
                    variant="ghost"
                    className={cn(
                      "w-full justify-between text-left font-normal h-8 lg:h-9 bg-transparent hover:bg-black/20 dark:hover:bg-black/30 text-white border-0 p-1",
                      "text-sm lg:text-base"
                    )}
                    disabled
                  >
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <Users className="h-4 w-4 lg:h-5 lg:w-5 flex-shrink-0 text-white" />
                      <span className="truncate text-xs lg:text-sm">
                        {formattedGuests}
                      </span>
                    </div>
                    <ChevronDown className="h-4 w-4 flex-shrink-0 text-white/70 ml-2" />
                  </Button>
                )}
              </div>

               {/* Campo de Cupom */}
              <div className="flex-1 border-r border-white/10 dark:border-white/10 pr-6 pl-6">
                <div className="flex items-center h-8 lg:h-9 px-1">
                  <Tag className="h-4 w-4 lg:h-5 lg:w-5 flex-shrink-0 text-white mr-2" />
                  <Input
                    id="promoCode"
                    type="text"
                    placeholder={t.promoCode}
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                    className="h-auto bg-transparent border-0 text-white placeholder:text-white/60 focus-visible:ring-0 focus-visible:ring-offset-0 p-0 text-xs lg:text-sm"
                    maxLength={20}
                  />
                </div>
              </div>

              {/* Botão de Pesquisa */}
              <div className="flex-shrink-0 pl-6">
                 <Button
                  onClick={handleReserve}
                  className="w-full lg:w-auto h-8 lg:h-9 px-3 lg:px-4 font-semibold bg-orange-500 hover:bg-orange-600 text-white rounded-md text-xs"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                       <Loader2 className="mr-1.5 h-4 w-4 animate-spin text-white" />
                      <span className="text-xs">{locale === "en" ? "Searching..." : locale === "es" ? "Buscando..." : "Buscando..."}</span>
                    </>
                  ) : (
                    <>
                       <Search className="mr-1.5 h-4 w-4 text-white" />
                      <span className="text-xs">{t.reserve}</span>
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
