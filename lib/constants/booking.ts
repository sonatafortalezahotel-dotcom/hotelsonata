/** Máximo de quartos por reserva na barra de busca / Omnibees */
export const MAX_BOOKING_ROOMS = 3;

/** Máximo de adultos por reserva na barra de busca / Omnibees */
export const MAX_BOOKING_ADULTS = 3;

/** Máximo de crianças por reserva na barra de busca / Omnibees */
export const MAX_BOOKING_CHILDREN = 2;

export function bookingRoomOptions(max = MAX_BOOKING_ROOMS): number[] {
  return Array.from({ length: max }, (_, i) => i + 1);
}

export function bookingAdultsOptions(max = MAX_BOOKING_ADULTS): number[] {
  return Array.from({ length: max }, (_, i) => i + 1);
}

export function bookingChildrenOptions(max = MAX_BOOKING_CHILDREN): number[] {
  return Array.from({ length: max + 1 }, (_, i) => i);
}
