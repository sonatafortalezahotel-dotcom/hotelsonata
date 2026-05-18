/** Máximo de quartos por reserva na barra de busca / Omnibees */
export const MAX_BOOKING_ROOMS = 3;

/** Maior capacidade de um quarto (suíte) */
export const MAX_GUESTS_PER_ROOM = 4;

/** Máximo de adultos na busca global (3 quartos × capacidade da suíte) */
export const MAX_BOOKING_ADULTS = MAX_BOOKING_ROOMS * MAX_GUESTS_PER_ROOM;

export function bookingRoomOptions(max = MAX_BOOKING_ROOMS): number[] {
  return Array.from({ length: max }, (_, i) => i + 1);
}

export function bookingAdultsOptions(max = MAX_BOOKING_ADULTS): number[] {
  return Array.from({ length: max }, (_, i) => i + 1);
}

export function bookingChildrenOptions(max = MAX_BOOKING_ADULTS): number[] {
  return Array.from({ length: max + 1 }, (_, i) => i);
}
