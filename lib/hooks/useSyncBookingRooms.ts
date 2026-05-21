import { useEffect } from "react";
import { MAX_BOOKING_ROOMS } from "@/lib/constants/booking";
import { distributeGuests } from "@/lib/utils/guestDistribution";

/**
 * Ajusta o número de quartos na UI quando a combinação de hóspedes exige mais quartos.
 */
export function useSyncBookingRooms(
  adults: string,
  children: string,
  rooms: string,
  setRooms: (value: string) => void
) {
  useEffect(() => {
    const a = parseInt(adults, 10);
    const c = parseInt(children, 10);
    if (Number.isNaN(a) || Number.isNaN(c)) return;

    const result = distributeGuests(a, c);
    if (!result.ok) return;

    const needed = result.rooms.length;
    const current = parseInt(rooms, 10) || 1;
    if (needed > current) {
      setRooms(String(Math.min(needed, MAX_BOOKING_ROOMS)));
    }
  }, [adults, children, rooms, setRooms]);
}
