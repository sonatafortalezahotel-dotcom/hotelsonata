import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { rooms, roomTranslations } from "@/lib/db/schema";
import { eq, and, sql } from "drizzle-orm";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ code: string }> | { code: string } }
) {
  try {
    const { searchParams } = new URL(request.url);
    const locale = searchParams.get("locale") || "pt";
    
    // Suporta Next.js 15 (params pode ser Promise) e versões anteriores
    const resolvedParams = params instanceof Promise ? await params : params;
    const code = decodeURIComponent(resolvedParams.code).trim();

    console.log("Buscando quarto com código:", code);

    if (!code) {
      return NextResponse.json(
        { error: "Código do quarto é obrigatório" },
        { status: 400 }
      );
    }

    // Primeiro, vamos buscar todos os quartos para debug
    const allRooms = await db.select({ code: rooms.code }).from(rooms);
    console.log("Códigos de quartos disponíveis:", allRooms.map(r => r.code));

    // Buscar quarto - usando ilike para case-insensitive
    const result = await db
      .select({
        id: rooms.id,
        code: rooms.code,
        size: rooms.size,
        maxGuests: rooms.maxGuests,
        hasSeaView: rooms.hasSeaView,
        hasBalcony: rooms.hasBalcony,
        amenities: rooms.amenities,
        basePrice: rooms.basePrice,
        imageUrl: rooms.imageUrl,
        gallery: rooms.gallery,
        active: rooms.active,
        order: rooms.order,
        name: roomTranslations.name,
        description: roomTranslations.description,
        shortDescription: roomTranslations.shortDescription,
        translatedAmenities: roomTranslations.amenities,
      })
      .from(rooms)
      .leftJoin(
        roomTranslations,
        and(
          eq(roomTranslations.roomId, rooms.id),
          eq(roomTranslations.locale, locale)
        )
      )
      .where(eq(rooms.code, code))
      .limit(1);

    console.log("Resultado da busca:", result.length > 0 ? "Encontrado" : "Não encontrado");

    if (result.length === 0) {
      // Tentar buscar sem case-sensitive como fallback
      const caseInsensitiveResult = await db
        .select({
          id: rooms.id,
          code: rooms.code,
          size: rooms.size,
          maxGuests: rooms.maxGuests,
          hasSeaView: rooms.hasSeaView,
          hasBalcony: rooms.hasBalcony,
          amenities: rooms.amenities,
          basePrice: rooms.basePrice,
          imageUrl: rooms.imageUrl,
          gallery: rooms.gallery,
          active: rooms.active,
          order: rooms.order,
          name: roomTranslations.name,
          description: roomTranslations.description,
          shortDescription: roomTranslations.shortDescription,
          translatedAmenities: roomTranslations.amenities,
        })
        .from(rooms)
        .leftJoin(
          roomTranslations,
          and(
            eq(roomTranslations.roomId, rooms.id),
            eq(roomTranslations.locale, locale)
          )
        )
        .where(sql`LOWER(${rooms.code}) = LOWER(${sql.raw(`'${code.replace(/'/g, "''")}'`)}::text)`)
        .limit(1);

      if (caseInsensitiveResult.length === 0) {
        return NextResponse.json(
          { 
            error: "Quarto não encontrado",
            searchedCode: code,
            availableCodes: allRooms.map(r => r.code)
          },
          { status: 404 }
        );
      }

      return NextResponse.json(caseInsensitiveResult[0]);
    }

    return NextResponse.json(result[0]);
  } catch (error) {
    console.error("Erro ao buscar quarto:", error);
    return NextResponse.json(
      { error: "Erro ao buscar quarto", details: error instanceof Error ? error.message : "Erro desconhecido" },
      { status: 500 }
    );
  }
}

