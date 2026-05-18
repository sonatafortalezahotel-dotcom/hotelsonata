"use client";

import { useEffect, useState } from "react";
import {
  getCheckInCalendarMonth,
  getCheckOutCalendarMonth,
} from "@/lib/utils/bookingCalendar";

/**
 * Controla o mês exibido nos calendários de check-in/check-out.
 * Ao abrir o check-out, alinha o mês ao check-in selecionado.
 */
export function useBookingCalendarMonths(
  checkIn?: Date | null,
  checkOut?: Date | null,
  checkOutOpen = false
) {
  const [checkInMonth, setCheckInMonth] = useState(() =>
    getCheckInCalendarMonth(checkIn)
  );
  const [checkOutMonth, setCheckOutMonth] = useState(() =>
    getCheckOutCalendarMonth(checkIn, checkOut)
  );

  useEffect(() => {
    setCheckInMonth(getCheckInCalendarMonth(checkIn));
  }, [checkIn]);

  useEffect(() => {
    setCheckOutMonth(getCheckOutCalendarMonth(checkIn, checkOut));
  }, [checkIn, checkOut]);

  useEffect(() => {
    if (checkOutOpen && checkIn) {
      setCheckOutMonth(getCheckOutCalendarMonth(checkIn, checkOut));
    }
  }, [checkOutOpen, checkIn, checkOut]);

  return {
    checkInMonth,
    setCheckInMonth,
    checkOutMonth,
    setCheckOutMonth,
  };
}
