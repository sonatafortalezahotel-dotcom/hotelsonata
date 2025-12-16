"use client";

import { useState } from "react";
import { Calendar as CalendarIcon, Users, Baby, Tag, Search, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale/pt-BR";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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

  const labels = {
    pt: {
      checkIn: "Check-in",
      checkOut: "Check-out",
      adults: "Adultos",
      children: "Crianças",
      promoCode: "Código Promocional",
      promoCodePlaceholder: "Digite o código",
      reserve: "RESERVAR AGORA",
      selectDate: "Selecione a data",
    },
    es: {
      checkIn: "Entrada",
      checkOut: "Salida",
      adults: "Adultos",
      children: "Niños",
      promoCode: "Código Promocional",
      promoCodePlaceholder: "Ingrese el código",
      reserve: "RESERVAR AHORA",
      selectDate: "Seleccione la fecha",
    },
    en: {
      checkIn: "Check-in",
      checkOut: "Check-out",
      adults: "Adults",
      children: "Children",
      promoCode: "Promotional Code",
      promoCodePlaceholder: "Enter code",
      reserve: "BOOK NOW",
      selectDate: "Select date",
    },
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
      
      // Toast de sucesso antes do redirect
      toast.success(
        locale === "en" 
          ? "Searching for availability..." 
          : locale === "es" 
          ? "Buscando disponibilidad..."
          : "Buscando disponibilidade..."
      );
      
      // Pequeno delay para o usuário ver o feedback
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

  // Locale para formatação de datas
  const dateLocale = locale === "pt" ? ptBR : undefined;

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
          {/* Card Simples e Elegante */}
          <div className="bg-primary rounded-lg shadow-xl p-6 lg:p-8">
            {/* Grid do Formulário */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5">
              {/* Check-in */}
              <div className="space-y-1.5">
                <Label 
                  htmlFor="checkin" 
                  className="text-sm font-medium text-primary-foreground"
                >
                  {t.checkIn}
                </Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      id="checkin"
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal h-10 bg-background border-background/20 hover:bg-background/90",
                        !checkIn && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4 flex-shrink-0 text-orange-500" />
                      <span className="truncate">
                        {checkIn ? (
                          format(checkIn, "dd/MM/yyyy", { locale: dateLocale })
                        ) : (
                          t.selectDate
                        )}
                      </span>
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
              </div>

              {/* Check-out */}
              <div className="space-y-1.5">
                <Label 
                  htmlFor="checkout" 
                  className="text-sm font-medium text-primary-foreground"
                >
                  {t.checkOut}
                </Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      id="checkout"
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal h-10 bg-background border-background/20 hover:bg-background/90",
                        !checkOut && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4 flex-shrink-0 text-orange-500" />
                      <span className="truncate">
                        {checkOut ? (
                          format(checkOut, "dd/MM/yyyy", { locale: dateLocale })
                        ) : (
                          t.selectDate
                        )}
                      </span>
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
              </div>

              {/* Adultos */}
              <div className="space-y-1.5">
                <Label 
                  htmlFor="adults" 
                  className="text-sm font-medium text-primary-foreground"
                >
                  {t.adults}
                </Label>
                <Select value={adults} onValueChange={setAdults}>
                  <SelectTrigger 
                    id="adults" 
                    className="w-full h-10 bg-background border-background/20"
                  >
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

              {/* Crianças */}
              <div className="space-y-1.5">
                <Label 
                  htmlFor="children" 
                  className="text-sm font-medium text-primary-foreground"
                >
                  {t.children}
                </Label>
                <Select value={children} onValueChange={setChildren}>
                  <SelectTrigger 
                    id="children" 
                    className="w-full h-10 bg-background border-background/20"
                  >
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

              {/* Código Promocional */}
              <div className="md:col-span-2 space-y-1.5">
                <Label 
                  htmlFor="promoCode" 
                  className="text-sm font-medium text-primary-foreground"
                >
                  {t.promoCode} <span className="text-primary-foreground/70 text-xs">(opcional)</span>
                </Label>
                <Input
                  id="promoCode"
                  type="text"
                  placeholder={t.promoCodePlaceholder}
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                  className="h-10 bg-background border-background/20"
                  maxLength={20}
                />
              </div>

              {/* Botão de Reserva */}
              <div className="md:col-span-2 flex items-end">
                <Button
                  onClick={handleReserve}
                  size="lg"
                  className="w-full h-10 font-semibold bg-orange-500 hover:bg-orange-600 text-white"
                  disabled={isLoading}
                >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin text-white" />
                    {locale === "en" ? "Searching..." : locale === "es" ? "Buscando..." : "Buscando..."}
                  </>
                ) : (
                  <>
                    <Search className="mr-2 h-5 w-5 text-white" />
                    {t.reserve}
                  </>
                )}
                </Button>
              </div>
            </div>

            {/* Informações adicionais */}
            <div className="mt-5 pt-5 border-t border-primary-foreground/20">
              <p className="text-xs text-primary-foreground/80 text-center">
                {locale === "en" 
                  ? "Best rate guaranteed. Free cancellation up to 24 hours before check-in." 
                  : locale === "es" 
                  ? "Mejor tarifa garantizada. Cancelación gratuita hasta 24 horas antes del check-in."
                  : "Melhor tarifa garantida. Cancelamento gratuito até 24 horas antes do check-in."}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

