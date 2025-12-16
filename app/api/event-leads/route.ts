import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { eventLeads } from "@/lib/db/schema";

export async function GET() {
  try {
    const leads = await db.select().from(eventLeads).orderBy(eventLeads.createdAt);
    return NextResponse.json(leads);
  } catch (error) {
    console.error("Erro ao buscar leads de eventos:", error);
    return NextResponse.json(
      { error: "Erro ao buscar leads de eventos" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, phone, company, eventType, eventDate, guests, message } = body;

    if (!name || !email) {
      return NextResponse.json(
        { error: "Nome e email são obrigatórios" },
        { status: 400 }
      );
    }

    const newLead = await db
      .insert(eventLeads)
      .values({
        name,
        email,
        phone,
        company,
        eventType,
        eventDate: eventDate || null,
        guests,
        message,
        status: "new",
      })
      .returning();

    return NextResponse.json(newLead[0], { status: 201 });
  } catch (error) {
    console.error("Erro ao criar lead de evento:", error);
    return NextResponse.json(
      { error: "Erro ao criar lead de evento" },
      { status: 500 }
    );
  }
}

