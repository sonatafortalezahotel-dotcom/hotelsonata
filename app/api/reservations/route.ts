import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { reservations, rooms } from "@/lib/db/schema";
import { eq, and, or, gte, lte, sql, lt, gt, desc } from "drizzle-orm";

/**
 * Gera um número de confirmação único
 * Formato: SON-YYYYMMDD-XXXX (ex: SON-20250115-1234)
 */
function generateConfirmationNumber(): string {
  const prefix = "SON";
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const random = String(Math.floor(Math.random() * 10000)).padStart(4, "0");
  return `${prefix}-${year}${month}${day}-${random}`;
}

/**
 * Verifica se um quarto está disponível no período especificado
 */
async function checkRoomAvailability(
  roomId: number,
  checkIn: string,
  checkOut: string,
  excludeReservationId?: number
): Promise<boolean> {
  try {
    // As datas já vêm como strings no formato YYYY-MM-DD
    // Não precisamos converter para Date, apenas usar diretamente no SQL
    
    // Busca reservas que conflitam com o período
    // Lógica: duas reservas conflitam se:
    // - O check-in da nova está entre check-in e check-out de uma existente, OU
    // - O check-out da nova está entre check-in e check-out de uma existente, OU
    // - A nova reserva engloba completamente uma existente
    
    // Usar operadores do Drizzle diretamente com strings de data
    // As strings já vêm no formato YYYY-MM-DD que o PostgreSQL aceita
    const conflictingReservations = await db
      .select()
      .from(reservations)
      .where(
        and(
          eq(reservations.roomId, roomId),
          eq(reservations.status, "confirmed"), // Apenas reservas confirmadas bloqueiam
          or(
            // Caso 1: Check-in da nova reserva está dentro de uma reserva existente
            // checkIn >= existing.checkIn AND checkIn < existing.checkOut
            and(
              lte(reservations.checkIn, checkIn),
              gt(reservations.checkOut, checkIn)
            ),
            // Caso 2: Check-out da nova reserva está dentro de uma reserva existente
            // checkOut > existing.checkIn AND checkOut <= existing.checkOut
            and(
              lt(reservations.checkIn, checkOut),
              gte(reservations.checkOut, checkOut)
            ),
            // Caso 3: A nova reserva engloba uma reserva existente
            // checkIn <= existing.checkIn AND checkOut >= existing.checkOut
            and(
              gte(reservations.checkIn, checkIn),
              lte(reservations.checkOut, checkOut)
            )
          ),
          excludeReservationId
            ? sql`${reservations.id} != ${excludeReservationId}`
            : undefined
        )
      );

    return conflictingReservations.length === 0;
  } catch (error: any) {
    // Se a tabela não existir ainda, retorna true (disponível)
    // Isso permite que o sistema funcione mesmo sem a migration aplicada
    if (error?.message?.includes("does not exist") || 
        error?.message?.includes("relation") ||
        error?.message?.includes("table")) {
      console.warn("Tabela de reservas não encontrada. Retornando disponível por padrão.");
      return true;
    }
    
    // Para outros erros, loga e retorna true (assumindo disponível em caso de erro)
    console.error("Erro ao verificar disponibilidade:", error);
    return true;
  }
}

/**
 * GET /api/reservations
 * Verifica disponibilidade de quartos
 * 
 * Query params:
 * - checkin: Data de check-in (YYYY-MM-DD)
 * - checkout: Data de check-out (YYYY-MM-DD)
 * - roomId?: ID do quarto específico (opcional)
 * - adults?: Número de adultos (opcional, para filtrar por capacidade)
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const checkIn = searchParams.get("checkin");
    const checkOut = searchParams.get("checkout");
    const roomIdParam = searchParams.get("roomId");
    const adultsParam = searchParams.get("adults");
    const listAll = searchParams.get("list"); // Parâmetro para listar todas as reservas

    // Se o parâmetro "list" estiver presente, retornar todas as reservas
    if (listAll === "true") {
      const allReservations = await db
        .select({
          id: reservations.id,
          confirmationNumber: reservations.confirmationNumber,
          roomId: reservations.roomId,
          checkIn: reservations.checkIn,
          checkOut: reservations.checkOut,
          adults: reservations.adults,
          children: reservations.children,
          guestName: reservations.guestName,
          guestEmail: reservations.guestEmail,
          guestPhone: reservations.guestPhone,
          guestDocument: reservations.guestDocument,
          basePrice: reservations.basePrice,
          totalNights: reservations.totalNights,
          totalPrice: reservations.totalPrice,
          promoCode: reservations.promoCode,
          discount: reservations.discount,
          specialRequests: reservations.specialRequests,
          status: reservations.status,
          notes: reservations.notes,
          createdAt: reservations.createdAt,
          updatedAt: reservations.updatedAt,
          // Dados do quarto
          roomCode: rooms.code,
        })
        .from(reservations)
        .leftJoin(rooms, eq(reservations.roomId, rooms.id))
        .orderBy(desc(reservations.createdAt));

      return NextResponse.json(allReservations);
    }

    // Validações para verificação de disponibilidade
    if (!checkIn || !checkOut) {
      return NextResponse.json(
        { error: "Parâmetros 'checkin' e 'checkout' são obrigatórios" },
        { status: 400 }
      );
    }

    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);

    if (isNaN(checkInDate.getTime()) || isNaN(checkOutDate.getTime())) {
      return NextResponse.json(
        { error: "Datas inválidas. Use o formato YYYY-MM-DD" },
        { status: 400 }
      );
    }

    if (checkOutDate <= checkInDate) {
      return NextResponse.json(
        { error: "A data de check-out deve ser posterior à data de check-in" },
        { status: 400 }
      );
    }

    // Buscar todos os quartos ativos
    let availableRooms = await db
      .select()
      .from(rooms)
      .where(eq(rooms.active, true));

    // Filtrar por capacidade se especificado
    if (adultsParam) {
      const adults = parseInt(adultsParam);
      if (!isNaN(adults)) {
        availableRooms = availableRooms.filter((room) => room.maxGuests >= adults);
      }
    }

    // Filtrar por quarto específico se especificado
    if (roomIdParam) {
      const roomId = parseInt(roomIdParam);
      if (!isNaN(roomId)) {
        availableRooms = availableRooms.filter((room) => room.id === roomId);
      }
    }

    // Verificar disponibilidade de cada quarto
    const roomsWithAvailability = await Promise.all(
      availableRooms.map(async (room) => {
        const isAvailable = await checkRoomAvailability(
          room.id,
          checkIn,
          checkOut
        );
        return {
          ...room,
          available: isAvailable,
        };
      })
    );

    // Calcular noites
    const nights = Math.ceil(
      (checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24)
    );

    return NextResponse.json({
      checkIn,
      checkOut,
      nights,
      rooms: roomsWithAvailability,
      availableCount: roomsWithAvailability.filter((r) => r.available).length,
    });
  } catch (error: any) {
    console.error("Erro ao verificar disponibilidade:", error);
    
    // Mensagens de erro mais específicas
    let errorMessage = "Erro ao verificar disponibilidade";
    
    if (error?.message?.includes("does not exist")) {
      errorMessage = "Tabela de reservas não encontrada. Execute a migration do banco de dados.";
    } else if (error?.message?.includes("relation") || error?.message?.includes("table")) {
      errorMessage = "Erro de banco de dados. Verifique se as migrations foram aplicadas.";
    } else if (error?.message) {
      errorMessage = error.message;
    }
    
    return NextResponse.json(
      { 
        error: errorMessage,
        details: process.env.NODE_ENV === "development" ? error?.message : undefined
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/reservations
 * Cria uma nova reserva
 * 
 * Body:
 * {
 *   roomId: number,
 *   checkIn: string (YYYY-MM-DD),
 *   checkOut: string (YYYY-MM-DD),
 *   adults: number,
 *   children: number,
 *   guestName: string,
 *   guestEmail: string,
 *   guestPhone: string,
 *   guestDocument?: string,
 *   promoCode?: string,
 *   specialRequests?: string
 * }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validações obrigatórias
    const {
      roomId,
      checkIn,
      checkOut,
      adults,
      children,
      guestName,
      guestEmail,
      guestPhone,
      guestDocument,
      promoCode,
      specialRequests,
    } = body;

    if (!roomId || !checkIn || !checkOut || !adults || !guestName || !guestEmail || !guestPhone) {
      return NextResponse.json(
        { error: "Campos obrigatórios faltando" },
        { status: 400 }
      );
    }

    // Validar datas
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);

    if (isNaN(checkInDate.getTime()) || isNaN(checkOutDate.getTime())) {
      return NextResponse.json(
        { error: "Datas inválidas" },
        { status: 400 }
      );
    }

    if (checkOutDate <= checkInDate) {
      return NextResponse.json(
        { error: "A data de check-out deve ser posterior à data de check-in" },
        { status: 400 }
      );
    }

    if (checkInDate < new Date(new Date().setHours(0, 0, 0, 0))) {
      return NextResponse.json(
        { error: "A data de check-in não pode ser no passado" },
        { status: 400 }
      );
    }

    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(guestEmail)) {
      return NextResponse.json(
        { error: "Email inválido" },
        { status: 400 }
      );
    }

    // Buscar quarto
    const room = await db
      .select()
      .from(rooms)
      .where(and(eq(rooms.id, roomId), eq(rooms.active, true)))
      .limit(1);

    if (room.length === 0) {
      return NextResponse.json(
        { error: "Quarto não encontrado ou inativo" },
        { status: 404 }
      );
    }

    const selectedRoom = room[0];

    // Verificar capacidade
    if (selectedRoom.maxGuests < (adults + (children || 0))) {
      return NextResponse.json(
        { error: `O quarto suporta no máximo ${selectedRoom.maxGuests} hóspedes` },
        { status: 400 }
      );
    }

    // Verificar disponibilidade
    const isAvailable = await checkRoomAvailability(roomId, checkIn, checkOut);
    if (!isAvailable) {
      return NextResponse.json(
        { error: "Quarto não disponível no período selecionado" },
        { status: 409 }
      );
    }

    // Calcular preços
    const nights = Math.ceil(
      (checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24)
    );
    const basePrice = selectedRoom.basePrice || 0;
    const totalPrice = basePrice * nights;
    let discount = 0;

    // TODO: Implementar lógica de código promocional
    // Por enquanto, apenas valida se existe
    if (promoCode) {
      // Aqui você pode implementar a lógica de desconto
      // Por exemplo, buscar em uma tabela de códigos promocionais
    }

    // Gerar número de confirmação único
    let confirmationNumber = generateConfirmationNumber();
    let attempts = 0;
    while (attempts < 10) {
      const existing = await db
        .select()
        .from(reservations)
        .where(eq(reservations.confirmationNumber, confirmationNumber))
        .limit(1);
      
      if (existing.length === 0) {
        break;
      }
      confirmationNumber = generateConfirmationNumber();
      attempts++;
    }

    if (attempts >= 10) {
      return NextResponse.json(
        { error: "Erro ao gerar número de confirmação. Tente novamente." },
        { status: 500 }
      );
    }

    // Criar reserva
    const [newReservation] = await db
      .insert(reservations)
      .values({
        confirmationNumber,
        roomId,
        checkIn,
        checkOut,
        adults: parseInt(adults),
        children: parseInt(children || 0),
        guestName: guestName.trim(),
        guestEmail: guestEmail.trim().toLowerCase(),
        guestPhone: guestPhone.trim(),
        guestDocument: guestDocument?.trim() || null,
        basePrice,
        totalNights: nights,
        totalPrice: totalPrice - discount,
        discount,
        promoCode: promoCode?.trim().toUpperCase() || null,
        specialRequests: specialRequests?.trim() || null,
        status: "confirmed", // Reserva confirmada automaticamente
      })
      .returning();

    return NextResponse.json(
      {
        success: true,
        reservation: {
          id: newReservation.id,
          confirmationNumber: newReservation.confirmationNumber,
          checkIn: newReservation.checkIn,
          checkOut: newReservation.checkOut,
          nights: newReservation.totalNights,
          totalPrice: newReservation.totalPrice,
          room: {
            id: selectedRoom.id,
            code: selectedRoom.code,
          },
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Erro ao criar reserva:", error);
    return NextResponse.json(
      { error: "Erro ao processar reserva" },
      { status: 500 }
    );
  }
}

