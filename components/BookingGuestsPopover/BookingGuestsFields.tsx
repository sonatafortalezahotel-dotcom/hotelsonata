"use client";

import type { ReactNode } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  bookingAdultsOptions,
  bookingChildrenOptions,
  bookingRoomOptions,
} from "@/lib/constants/booking";

export interface BookingGuestsFieldsProps {
  locale: "pt" | "es" | "en";
  rooms: string;
  onRoomsChange: (value: string) => void;
  adults: string;
  onAdultsChange: (value: string) => void;
  children: string;
  onChildrenChange: (value: string) => void;
  roomsLabel: ReactNode;
  adultsLabel: ReactNode;
  childrenLabel: ReactNode;
  idPrefix?: string;
}

export function BookingGuestsFields({
  locale,
  rooms,
  onRoomsChange,
  adults,
  onAdultsChange,
  children,
  onChildrenChange,
  roomsLabel,
  adultsLabel,
  childrenLabel,
  idPrefix = "booking-guests",
}: BookingGuestsFieldsProps) {
  const roomsLabelId = `${idPrefix}-rooms-label`;
  const adultsLabelId = `${idPrefix}-adults-label`;
  const childrenLabelId = `${idPrefix}-children-label`;

  return (
    <div className="space-y-4 min-w-[200px]">
      <div>
        <label id={roomsLabelId} className="text-sm font-medium mb-2 block">
          {roomsLabel}
        </label>
        <Select value={rooms} onValueChange={onRoomsChange}>
          <SelectTrigger className="w-full" aria-labelledby={roomsLabelId}>
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="z-[60]">
            {bookingRoomOptions().map((num) => (
              <SelectItem key={num} value={num.toString()}>
                {num}{" "}
                {locale === "en"
                  ? num === 1
                    ? "room"
                    : "rooms"
                  : locale === "es"
                    ? num === 1
                      ? "habitación"
                      : "habitaciones"
                    : num === 1
                      ? "quarto"
                      : "quartos"}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div>
        <label id={adultsLabelId} className="text-sm font-medium mb-2 block">
          {adultsLabel}
        </label>
        <Select value={adults} onValueChange={onAdultsChange}>
          <SelectTrigger className="w-full" aria-labelledby={adultsLabelId}>
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="z-[60]">
            {bookingAdultsOptions().map((num) => (
              <SelectItem key={num} value={num.toString()}>
                {num}{" "}
                {num === 1
                  ? locale === "en"
                    ? "adult"
                    : locale === "es"
                      ? "adulto"
                      : "adulto"
                  : locale === "en"
                    ? "adults"
                    : locale === "es"
                      ? "adultos"
                      : "adultos"}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div>
        <label id={childrenLabelId} className="text-sm font-medium mb-2 block">
          {childrenLabel}
        </label>
        <Select value={children} onValueChange={onChildrenChange}>
          <SelectTrigger className="w-full" aria-labelledby={childrenLabelId}>
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="z-[60]">
            {bookingChildrenOptions().map((num) => (
              <SelectItem key={num} value={num.toString()}>
                {num === 0
                  ? locale === "en"
                    ? "No children"
                    : locale === "es"
                      ? "Sin niños"
                      : "Sem crianças"
                  : `${num} ${
                      num === 1
                        ? locale === "en"
                          ? "child"
                          : locale === "es"
                            ? "niño"
                            : "criança"
                        : locale === "en"
                          ? "children"
                          : locale === "es"
                            ? "niños"
                            : "crianças"
                    }`}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
