"use client";

import { useEffect, useState } from "react";
import { useLanguage } from "@/lib/context/LanguageContext";
import { getPageTranslation } from "@/lib/translations/pages";
import RoomCard from "@/components/RoomCard";
import { RoomCardSkeleton } from "@/components/LoadingStates";

interface Room {
  id: number;
  code: string;
  name: string;
  description?: string;
  shortDescription?: string;
  imageUrl: string;
  gallery?: string[] | null;
  size: number;
  maxGuests: number;
  hasSeaView: boolean;
  hasBalcony: boolean;
  amenities?: string[];
  basePrice?: number;
}

export default function RoomsPageContent() {
  const { locale } = useLanguage();
  const t = getPageTranslation(locale, "rooms");
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRooms() {
      try {
        setLoading(true);
        const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
        const res = await fetch(`${baseUrl}/api/rooms?locale=${locale}&active=true`, {
          cache: 'no-store'
        });
        
        if (!res.ok) {
          console.error('Erro ao buscar quartos:', res.status);
          setRooms([]);
          return;
        }
        
        const data = await res.json();
        setRooms(data);
      } catch (error) {
        console.error('Erro ao buscar quartos:', error);
        setRooms([]);
      } finally {
        setLoading(false);
      }
    }

    fetchRooms();
  }, [locale]);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
        {[...Array(6)].map((_, i) => (
          <RoomCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (rooms.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-muted-foreground text-lg">
          {t.empty}
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
      {rooms.map((room) => (
        <RoomCard key={room.id} room={room} />
      ))}
    </div>
  );
}

