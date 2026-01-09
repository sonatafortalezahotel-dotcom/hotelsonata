import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { rooms } from "@/lib/db/schema";
import { sql } from "drizzle-orm";

/**
 * GET /api/amenities
 * Retorna lista única de todas as amenidades cadastradas em quartos
 */
export async function GET() {
  try {
    // Buscar todos os quartos ativos com amenidades
    const allRooms = await db
      .select({
        amenities: rooms.amenities,
      })
      .from(rooms)
      .where(sql`${rooms.amenities} IS NOT NULL`);

    // Extrair e normalizar amenidades únicas
    const amenitiesSet = new Set<string>();
    
    allRooms.forEach((room) => {
      if (Array.isArray(room.amenities)) {
        room.amenities.forEach((amenity) => {
          if (amenity && typeof amenity === "string") {
            // Normalizar: trim e capitalize primeira letra
            const normalized = amenity.trim();
            if (normalized) {
              amenitiesSet.add(normalized);
            }
          }
        });
      }
    });

    // Converter para array e ordenar alfabeticamente
    const amenitiesList = Array.from(amenitiesSet).sort((a, b) =>
      a.localeCompare(b, "pt-BR")
    );

    return NextResponse.json(amenitiesList);
  } catch (error) {
    console.error("Erro ao buscar amenidades:", error);
    return NextResponse.json(
      { error: "Erro ao buscar amenidades" },
      { status: 500 }
    );
  }
}
