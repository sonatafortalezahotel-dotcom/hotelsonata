import { startOfDay, isBefore, isAfter } from "date-fns";

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
