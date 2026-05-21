/** Máximo de pessoas por quarto (política do hotel / Omnibees) */
export const MAX_PEOPLE_PER_ROOM = 3;

export interface RoomGuests {
  adults: number;
  children: number;
}

export type GuestDistributionResult =
  | { ok: true; rooms: RoomGuests[] }
  | { ok: false; errorCode: "NO_ADULT_WITH_CHILDREN" | "INVALID_COMBINATION" | "NOT_ENOUGH_ROOMS" };

/** Máximo de crianças permitidas em um quarto com N adultos */
export function maxChildrenForAdults(adults: number): number {
  if (adults >= 3) return 0;
  if (adults === 2) return 1;
  if (adults === 1) return 2;
  return 0;
}

export function isValidRoomOccupancy(adults: number, children: number): boolean {
  if (adults < 0 || children < 0) return false;
  if (adults + children > MAX_PEOPLE_PER_ROOM) return false;
  if (children > 0 && adults < 1) return false;
  return children <= maxChildrenForAdults(adults);
}

/**
 * Empacota o próximo quarto a partir dos hóspedes restantes.
 * Regras: máx. 3 pessoas; criança nunca sozinha; 2 adultos → máx. 1 criança; 3 adultos → sem crianças.
 */
function packNextRoom(
  remainingAdults: number,
  remainingChildren: number
): { room: RoomGuests; remainingAdults: number; remainingChildren: number } | null {
  const a = remainingAdults;
  const c = remainingChildren;

  if (a <= 0 && c <= 0) return null;
  if (c > 0 && a < 1) return null;

  if (c === 0) {
    const adults = Math.min(3, a);
    return {
      room: { adults, children: 0 },
      remainingAdults: a - adults,
      remainingChildren: 0,
    };
  }

  // 2+ crianças com 2+ adultos: 1 adulto + 1 criança por quarto (ex.: 2 adultos + 2 crianças)
  if (c >= 2 && a >= 2) {
    return {
      room: { adults: 1, children: 1 },
      remainingAdults: a - 1,
      remainingChildren: c - 1,
    };
  }

  // 2 adultos + 1 criança cabem no mesmo quarto
  if (a >= 2 && c === 1) {
    return {
      room: { adults: 2, children: 1 },
      remainingAdults: a - 2,
      remainingChildren: 0,
    };
  }

  // 3+ adultos com crianças: quarto de 3 adultos não aceita criança → 2 adultos + 1 criança
  if (a >= 3 && c > 0) {
    return {
      room: { adults: 2, children: 1 },
      remainingAdults: a - 2,
      remainingChildren: c - 1,
    };
  }

  // 1 adulto: até 2 crianças (máx. 3 pessoas)
  if (a === 1) {
    const children = Math.min(c, 2);
    return {
      room: { adults: 1, children },
      remainingAdults: 0,
      remainingChildren: c - children,
    };
  }

  return null;
}

/**
 * Distribui adultos e crianças em quartos válidos para o motor Omnibees.
 */
export function distributeGuests(
  totalAdults: number,
  totalChildren: number,
  requestedRooms?: number
): GuestDistributionResult {
  if (!Number.isFinite(totalAdults) || !Number.isFinite(totalChildren)) {
    return { ok: false, errorCode: "INVALID_COMBINATION" };
  }

  const adults = Math.max(0, Math.floor(totalAdults));
  const children = Math.max(0, Math.floor(totalChildren));

  if (children > 0 && adults < 1) {
    return { ok: false, errorCode: "NO_ADULT_WITH_CHILDREN" };
  }

  const rooms: RoomGuests[] = [];
  let remainingAdults = adults;
  let remainingChildren = children;

  while (remainingAdults > 0 || remainingChildren > 0) {
    const packed = packNextRoom(remainingAdults, remainingChildren);
    if (!packed) {
      return { ok: false, errorCode: "INVALID_COMBINATION" };
    }
    if (!isValidRoomOccupancy(packed.room.adults, packed.room.children)) {
      return { ok: false, errorCode: "INVALID_COMBINATION" };
    }
    rooms.push(packed.room);
    remainingAdults = packed.remainingAdults;
    remainingChildren = packed.remainingChildren;
  }

  if (requestedRooms != null && requestedRooms > 0 && rooms.length > requestedRooms) {
    return { ok: false, errorCode: "NOT_ENOUGH_ROOMS" };
  }

  return { ok: true, rooms };
}

export function getGuestDistributionErrorMessage(
  code: Exclude<GuestDistributionResult, { ok: true }>["errorCode"],
  locale: "pt" | "es" | "en" = "pt"
): string {
  const messages: Record<
    Exclude<GuestDistributionResult, { ok: true }>["errorCode"],
    Record<"pt" | "es" | "en", string>
  > = {
    NO_ADULT_WITH_CHILDREN: {
      pt: "É necessário pelo menos um adulto quando há crianças.",
      es: "Se requiere al menos un adulto cuando hay niños.",
      en: "At least one adult is required when traveling with children.",
    },
    INVALID_COMBINATION: {
      pt: "Esta combinação de adultos e crianças não é permitida. Cada quarto aceita no máximo 3 pessoas; crianças não podem ficar sozinhas; com 2 adultos cabe no máximo 1 criança.",
      es: "Esta combinación de adultos y niños no está permitida. Cada habitación admite como máximo 3 personas; los niños no pueden quedarse solos; con 2 adultos cabe como máximo 1 niño.",
      en: "This combination of adults and children is not allowed. Each room fits up to 3 guests; children cannot stay alone; with 2 adults at most 1 child is allowed.",
    },
    NOT_ENOUGH_ROOMS: {
      pt: "Selecione mais quartos para esta quantidade de hóspedes.",
      es: "Seleccione más habitaciones para esta cantidad de huéspedes.",
      en: "Select more rooms for this number of guests.",
    },
  };
  return messages[code][locale];
}
