"use client";

import { useState } from "react";
import { Calendar as CalendarIcon } from "lucide-react";
import { format } from "date-fns";
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

export default function BookingBar() {
  const { locale } = useLanguage();
  const [checkIn, setCheckIn] = useState<Date>();
  const [checkOut, setCheckOut] = useState<Date>();
  const [guests, setGuests] = useState("2");

  const labels = {
    pt: {
      checkIn: "Check-in",
      checkOut: "Check-out",
      guests: "Hóspedes",
      reserve: "RESERVAR AGORA",
    },
    es: {
      checkIn: "Entrada",
      checkOut: "Salida",
      guests: "Huéspedes",
      reserve: "RESERVAR AHORA",
    },
    en: {
      checkIn: "Check-in",
      checkOut: "Check-out",
      guests: "Guests",
      reserve: "BOOK NOW",
    },
  };

  const t = labels[locale as keyof typeof labels] || labels.pt;

  const handleReserve = () => {
    if (!checkIn || !checkOut) return;
    const checkInStr = format(checkIn, "yyyy-MM-dd");
    const checkOutStr = format(checkOut, "yyyy-MM-dd");
    window.location.href = `/reservas?checkin=${checkInStr}&checkout=${checkOutStr}&guests=${guests}`;
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 lg:top-20 lg:bottom-auto z-50 bg-background/95 backdrop-blur-md border-t lg:border-b border-border shadow-lg">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 lg:py-3">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-end gap-4 lg:gap-6">
          {/* Check-in */}
          <div className="flex-1 w-full lg:w-auto space-y-2">
            <Label htmlFor="checkin" className="block text-sm font-semibold text-foreground">
              {t.checkIn}
            </Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  id="checkin"
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal h-11 border-2 hover:border-primary/50 focus:border-primary bg-background transition-all duration-200",
                    !checkIn && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4 flex-shrink-0" />
                  <span className="truncate">
                    {checkIn ? (
                      format(checkIn, "dd/MM/yyyy")
                    ) : (
                      <span>Selecione a data</span>
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
          <div className="flex-1 w-full lg:w-auto space-y-2">
            <Label htmlFor="checkout" className="block text-sm font-semibold text-foreground">
              {t.checkOut}
            </Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  id="checkout"
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal h-11 border-2 hover:border-primary/50 focus:border-primary bg-background transition-all duration-200",
                    !checkOut && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4 flex-shrink-0" />
                  <span className="truncate">
                    {checkOut ? (
                      format(checkOut, "dd/MM/yyyy")
                    ) : (
                      <span>Selecione a data</span>
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

          {/* Guests */}
          <div className="flex-1 w-full lg:w-auto space-y-2">
            <Label htmlFor="guests" className="block text-sm font-semibold text-foreground">
              {t.guests}
            </Label>
            <Select value={guests} onValueChange={setGuests}>
              <SelectTrigger 
                id="guests" 
                className="w-full h-11 border-2 hover:border-primary/50 focus:border-primary bg-background transition-all duration-200"
              >
                <SelectValue placeholder="Selecione" />
              </SelectTrigger>
              <SelectContent>
                {[1, 2, 3, 4, 5, 6].map((num) => (
                  <SelectItem key={num} value={num.toString()}>
                    {num} {num === 1 ? "hóspede" : "hóspedes"}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Reserve Button */}
          <div className="w-full lg:w-auto lg:self-end">
            <Button
              onClick={handleReserve}
              size="lg"
              className="w-full lg:w-auto lg:min-w-[200px] h-11 bg-secondary hover:bg-secondary/90 text-secondary-foreground shadow-md hover:shadow-lg transition-all duration-200 focus-visible:ring-2 focus-visible:ring-secondary focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 hover:scale-[1.02] active:scale-[0.98]"
              disabled={!checkIn || !checkOut}
            >
              {t.reserve}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
