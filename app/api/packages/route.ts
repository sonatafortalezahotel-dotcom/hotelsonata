import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { packages } from "@/lib/db/schema";
import { eq, and, gte, lte, desc } from "drizzle-orm";

export async function GET() {
  try {
    const today = new Date().toISOString().split("T")[0];

    const activePackages = await db
      .select()
      .from(packages)
      .where(
        and(
          eq(packages.active, true),
          lte(packages.startDate, today),
          gte(packages.endDate, today)
        )
      )
      .orderBy(desc(packages.order));

    return NextResponse.json(activePackages);
  } catch (error) {
    console.error("Erro ao buscar pacotes:", error);
    return NextResponse.json(
      { error: "Erro ao buscar pacotes" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, description, imageUrl, price, startDate, endDate, active, order, category } = body;

    if (!name || !startDate || !endDate) {
      return NextResponse.json(
        { error: "Campos obrigatórios: name, startDate, endDate" },
        { status: 400 }
      );
    }

    if (!imageUrl || typeof imageUrl !== "string" || !imageUrl.trim()) {
      return NextResponse.json(
        { error: "imageUrl é obrigatório e deve ser uma URL válida" },
        { status: 400 }
      );
    }

    const [newPackage] = await db
      .insert(packages)
      .values({
        name,
        description: description || null,
        imageUrl,
        price: price || null,
        startDate,
        endDate,
        active: active ?? true,
        order: order || 0,
        category: category || null,
      })
      .returning();

    return NextResponse.json(newPackage, { status: 201 });
  } catch (error) {
    console.error("Erro ao criar pacote:", error);
    return NextResponse.json(
      { error: "Erro ao criar pacote" },
      { status: 500 }
    );
  }
}
