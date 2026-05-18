import { startOfDay, startOfMonth, isBefore, isAfter } from "date-fns";

/** Desabilita dias anteriores a hoje (hoje permitido). */
export function disableCheckInCalendarDate(date: Date): boolean {
  return isBefore(startOfDay(date), startOfDay(new Date()));
}

/** Sem check-in: mesma regra do check-in. Com check-in: só dias depois do check-in. */
export function disableCheckOutCalendarDate(
  date: Date,
  checkIn: Date | undefined | null
): boolean {
  if (!checkIn) return disableCheckInCalendarDate(date);
  return !isAfter(startOfDay(date), startOfDay(checkIn));
}

/** Mês inicial do calendário de check-in. */
export function getCheckInCalendarMonth(checkIn?: Date | null): Date {
  return startOfMonth(checkIn ?? new Date());
}

/**
 * Mês inicial do calendário de check-out: mesmo mês do check-in,
 * ou o mês do check-out se já estiver selecionado após o check-in.
 */
export function getCheckOutCalendarMonth(
  checkIn?: Date | null,
  checkOut?: Date | null
): Date {
  if (!checkIn) {
    return startOfMonth(checkOut ?? new Date());
  }
  const checkInMonth = startOfMonth(checkIn);
  if (
    checkOut &&
    isAfter(startOfDay(checkOut), startOfDay(checkIn))
  ) {
    return startOfMonth(checkOut);
  }
  return checkInMonth;
}
