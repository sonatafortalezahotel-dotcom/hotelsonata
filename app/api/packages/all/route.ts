import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { packages } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";

export async function GET() {
  try {
    // Buscar todos os pacotes ativos, sem filtrar por data
    const activePackages = await db
      .select()
      .from(packages)
      .where(eq(packages.active, true))
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
