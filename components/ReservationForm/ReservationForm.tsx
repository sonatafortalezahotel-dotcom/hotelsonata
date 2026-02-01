"use client";

import { useState, useEffect } from "react";
import { Calendar as CalendarIcon, Users, Tag, Search, Loader2, ChevronDown } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale/pt-BR";
import { toast } from "sonner";
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
import { useEditor } from "@/lib/context/EditorContext";
import { PageText } from "@/components/PageEditor";
import { getPageContent } from "@/lib/utils/pageContent";
import { buildOmnibeesUrl } from "@/lib/utils/omnibees";

interface ReservationFormProps {
  className?: string;
}

export default function ReservationForm({ 
  className 
}: ReservationFormProps) {
  const { locale } = useLanguage();
  const [checkIn, setCheckIn] = useState<Date>();
  const [checkOut, setCheckOut] = useState<Date>();
  const [adults, setAdults] = useState("2");
  const [children, setChildren] = useState("0");
  const [promoCode, setPromoCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // Set mounted state to prevent hydration mismatch with Radix UI IDs
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const editor = useEditor();
  const globalOverrides = editor?.globalOverrides ?? {};
  const getLabel = (fieldKey: string) => {
    if (editor?.editMode) {
      return <PageText page="global" section="reservationForm" fieldKey={fieldKey} locale={locale} as="span" />;
    }
    return getPageContent("global", "reservationForm", fieldKey, locale, globalOverrides) || "";
  };
  const getLabelStr = (fieldKey: string, fallback: string) =>
    getPageContent("global", "reservationForm", fieldKey, locale, globalOverrides) || fallback;
  const labels = {
    pt: { checkIn: "Check-in", checkOut: "Check-out", dates: "Datas", guests: "Hóspedes", adults: "Adultos", children: "Crianças", promoCode: "CUPOM", promoCodePlaceholder: "CUPOM", reserve: "PESQUISAR", selectDate: "Selecione a data" },
    es: { checkIn: "Entrada", checkOut: "Salida", dates: "Fechas", guests: "Huéspedes", adults: "Adultos", children: "Niños", promoCode: "CUPÓN", promoCodePlaceholder: "CUPÓN", reserve: "BUSCAR", selectDate: "Seleccione la fecha" },
    en: { checkIn: "Check-in", checkOut: "Check-out", dates: "Dates", guests: "Guests", adults: "Adults", children: "Children", promoCode: "COUPON", promoCodePlaceholder: "COUPON", reserve: "SEARCH", selectDate: "Select date" },
  };
  const t = labels[locale as keyof typeof labels] || labels.pt;

  const handleReserve = () => {
    // Validação com feedback visual
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

    // Validar se check-out é depois de check-in
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
      // Construir URL da Omnibees com os parâmetros
      const omnibeesUrl = buildOmnibeesUrl({
        checkIn,
        checkOut,
        adults,
        children,
        promoCode: promoCode.trim() || undefined,
        locale: locale as "pt" | "es" | "en",
      });
      
      // Toast de sucesso antes do redirect
      toast.success(
        locale === "en" 
          ? "Redirecting to booking system..." 
          : locale === "es" 
          ? "Redirigiendo al sistema de reservas..."
          : "Redirecionando para o sistema de reservas..."
      );
      
      // Pequeno delay para o usuário ver o feedback
      setTimeout(() => {
        window.location.href = omnibeesUrl;
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

  // Locale para formatação de datas
  const dateLocale = locale === "pt" ? ptBR : undefined;

  // Formatar hóspedes
  const adultsCount = parseInt(adults);
  const childrenCount = parseInt(children);
  const formattedGuests = locale === "pt" 
    ? `${adultsCount} ${adultsCount === 1 ? "ADULTO" : "ADULTOS"}, ${childrenCount} ${childrenCount === 1 ? "CRIANÇA" : "CRIANÇAS"}`
    : locale === "es"
    ? `${adultsCount} ${adultsCount === 1 ? "ADULTO" : "ADULTOS"}, ${childrenCount} ${childrenCount === 1 ? "NIÑO" : "NIÑOS"}`
    : `${adultsCount} ${adultsCount === 1 ? "ADULT" : "ADULTS"}, ${childrenCount} ${childrenCount === 1 ? "CHILD" : "CHILDREN"}`;

  return (
    <section
      className={cn(
        "relative w-full",
        className
      )}
      aria-label="Formulário de reserva"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Barra de Pesquisa Horizontal */}
          <div className="bg-black/40 dark:bg-black/60 backdrop-blur-md rounded-lg shadow-2xl p-4 lg:p-5 border border-slate-800/50 dark:border-slate-700/60">
            <div className="flex flex-col lg:flex-row items-stretch gap-0 lg:gap-0">
              {/* Campo de Check-in */}
              <div className="flex-1 border-r-0 lg:border-r border-slate-800/50 dark:border-slate-700/60 pr-0 lg:pr-4 mb-3 lg:mb-0">
                {isMounted ? (
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="ghost"
                        className={cn(
                          "w-full justify-between text-left font-normal h-12 lg:h-14 bg-transparent hover:bg-black/20 dark:hover:bg-black/30 text-white border-0 p-3",
                          "text-sm lg:text-base"
                        )}
                      >
                        <div className="flex flex-col items-start gap-1 flex-1 min-w-0">
                          <span className="text-xs text-white/70 uppercase font-medium">
                            {getLabel("checkIn")}
                          </span>
                          <div className="flex items-center gap-2 w-full">
                            <CalendarIcon className="h-4 w-4 lg:h-5 lg:w-5 flex-shrink-0 text-white" />
                            <span className="truncate text-xs lg:text-sm">
                              {checkIn ? format(checkIn, "dd/MM/yyyy", { locale: dateLocale }) : getLabelStr("selectDate", t.selectDate)}
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
                      "w-full justify-between text-left font-normal h-12 lg:h-14 bg-transparent hover:bg-black/20 dark:hover:bg-black/30 text-white border-0 p-3",
                      "text-sm lg:text-base"
                    )}
                    disabled
                  >
                    <div className="flex flex-col items-start gap-1 flex-1 min-w-0">
                      <span className="text-xs text-white/70 uppercase font-medium">
                        {getLabel("checkIn")}
                      </span>
                      <div className="flex items-center gap-2 w-full">
                        <CalendarIcon className="h-4 w-4 lg:h-5 lg:w-5 flex-shrink-0 text-white" />
                        <span className="truncate text-xs lg:text-sm">
                          {checkIn ? format(checkIn, "dd/MM/yyyy", { locale: dateLocale }) : getLabelStr("selectDate", t.selectDate)}
                        </span>
                      </div>
                    </div>
                    <ChevronDown className="h-4 w-4 flex-shrink-0 text-white/70 ml-2" />
                  </Button>
                )}
              </div>

              {/* Campo de Check-out */}
              <div className="flex-1 border-r-0 lg:border-r border-slate-800/50 dark:border-slate-700/60 pr-0 lg:pr-4 mb-3 lg:mb-0">
                {isMounted ? (
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="ghost"
                        className={cn(
                          "w-full justify-between text-left font-normal h-12 lg:h-14 bg-transparent hover:bg-black/20 dark:hover:bg-black/30 text-white border-0 p-3",
                          "text-sm lg:text-base"
                        )}
                      >
                        <div className="flex flex-col items-start gap-1 flex-1 min-w-0">
                          <span className="text-xs text-white/70 uppercase font-medium">
                            {getLabel("checkOut")}
                          </span>
                          <div className="flex items-center gap-2 w-full">
                            <CalendarIcon className="h-4 w-4 lg:h-5 lg:w-5 flex-shrink-0 text-white" />
                            <span className="truncate text-xs lg:text-sm">
                              {checkOut ? format(checkOut, "dd/MM/yyyy", { locale: dateLocale }) : getLabelStr("selectDate", t.selectDate)}
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
                      "w-full justify-between text-left font-normal h-12 lg:h-14 bg-transparent hover:bg-black/20 dark:hover:bg-black/30 text-white border-0 p-3",
                      "text-sm lg:text-base"
                    )}
                    disabled
                  >
                    <div className="flex flex-col items-start gap-1 flex-1 min-w-0">
                      <span className="text-xs text-white/70 uppercase font-medium">
                        {getLabel("checkOut")}
                      </span>
                      <div className="flex items-center gap-2 w-full">
                        <CalendarIcon className="h-4 w-4 lg:h-5 lg:w-5 flex-shrink-0 text-white" />
                        <span className="truncate text-xs lg:text-sm">
                          {checkOut ? format(checkOut, "dd/MM/yyyy", { locale: dateLocale }) : getLabelStr("selectDate", t.selectDate)}
                        </span>
                      </div>
                    </div>
                    <ChevronDown className="h-4 w-4 flex-shrink-0 text-white/70 ml-2" />
                  </Button>
                )}
              </div>

              {/* Campo de Hóspedes */}
              <div className="flex-1 border-r-0 lg:border-r border-slate-800/50 dark:border-slate-700/60 pr-0 lg:pr-4 mb-3 lg:mb-0">
                {isMounted ? (
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="ghost"
                        className={cn(
                          "w-full justify-between text-left font-normal h-12 lg:h-14 bg-transparent hover:bg-black/20 dark:hover:bg-black/30 text-white border-0 p-3",
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
                          <label className="text-sm font-medium mb-2 block">{getLabel("adults")}</label>
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
                          <label className="text-sm font-medium mb-2 block">{getLabel("children")}</label>
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
                      "w-full justify-between text-left font-normal h-12 lg:h-14 bg-transparent hover:bg-black/20 dark:hover:bg-black/30 text-white border-0 p-3",
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
              <div className="flex-1 border-r-0 lg:border-r border-slate-800/50 dark:border-slate-700/60 pr-0 lg:pr-4 mb-3 lg:mb-0">
                <div className="flex items-center h-12 lg:h-14 px-3">
                  <Tag className="h-4 w-4 lg:h-5 lg:w-5 flex-shrink-0 text-white mr-2" />
                  <Input
                    id="promoCode"
                    type="text"
                    placeholder={getLabelStr("promoCodePlaceholder", t.promoCode)}
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                    className="h-auto bg-transparent border-0 text-white placeholder:text-white/60 focus-visible:ring-0 focus-visible:ring-offset-0 p-0 text-xs lg:text-sm"
                    maxLength={20}
                  />
                </div>
              </div>

              {/* Botão de Pesquisa */}
              <div className="flex-shrink-0">
                <Button
                  onClick={handleReserve}
                  className="w-full lg:w-auto h-12 lg:h-14 px-6 lg:px-8 font-semibold bg-orange-500 hover:bg-orange-600 text-white rounded-lg"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin text-white" />
                      <span className="text-sm lg:text-base">{locale === "en" ? "Searching..." : locale === "es" ? "Buscando..." : "Buscando..."}</span>
                    </>
                  ) : (
                    <>
                      <Search className="mr-2 h-5 w-5 text-white" />
                      <span className="text-sm lg:text-base">{t.reserve}</span>
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

