import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { siteSettings } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const key = searchParams.get("key");

    if (key) {
      const setting = await db
        .select()
        .from(siteSettings)
        .where(eq(siteSettings.key, key))
        .limit(1);

      if (setting.length === 0) {
        return NextResponse.json(null);
      }

      return NextResponse.json(setting[0]);
    }

    const allSettings = await db.select().from(siteSettings);
    return NextResponse.json(allSettings);
  } catch (error) {
    console.error("Erro ao buscar configurações:", error);
    return NextResponse.json(
      { error: "Erro ao buscar configurações" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { key, value, type, description } = body;

    if (!key || value === undefined) {
      return NextResponse.json(
        { error: "Chave e valor são obrigatórios" },
        { status: 400 }
      );
    }

    // Verifica se a configuração já existe
    const existing = await db
      .select()
      .from(siteSettings)
      .where(eq(siteSettings.key, key))
      .limit(1);

    if (existing.length > 0) {
      // Atualiza configuração existente
      const updated = await db
        .update(siteSettings)
        .set({
          value: String(value),
          type: type || "text",
          description: description || null,
          updatedAt: new Date(),
        })
        .where(eq(siteSettings.key, key))
        .returning();

      return NextResponse.json(updated[0]);
    } else {
      // Cria nova configuração
      const created = await db
        .insert(siteSettings)
        .values({
          key,
          value: String(value),
          type: type || "text",
          description: description || null,
        })
        .returning();

      return NextResponse.json(created[0], { status: 201 });
    }
  } catch (error) {
    console.error("Erro ao salvar configuração:", error);
    return NextResponse.json(
      { error: "Erro ao salvar configuração" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    
    // Aceita um objeto com múltiplas configurações
    if (!body || typeof body !== "object") {
      return NextResponse.json(
        { error: "Corpo da requisição deve ser um objeto" },
        { status: 400 }
      );
    }

    const results = [];
    
    // Atualiza ou cria cada configuração
    for (const [key, valueObj] of Object.entries(body)) {
      if (valueObj === null || valueObj === undefined) {
        continue; // Pula valores nulos ou indefinidos
      }
      const isObjectValue = typeof valueObj === "object" && valueObj !== null && "value" in valueObj;
      const value = isObjectValue ? (valueObj as { value: unknown }).value : valueObj;
      const type = isObjectValue ? (valueObj as { type?: string }).type : "text";
      const description = isObjectValue ? (valueObj as { description?: string | null }).description : null;

      const existing = await db
        .select()
        .from(siteSettings)
        .where(eq(siteSettings.key, key))
        .limit(1);

      if (existing.length > 0) {
        const updated = await db
          .update(siteSettings)
          .set({
            value: String(value),
            type: type || "text",
            description: description || null,
            updatedAt: new Date(),
          })
          .where(eq(siteSettings.key, key))
          .returning();

        results.push(updated[0]);
      } else {
        const created = await db
          .insert(siteSettings)
          .values({
            key,
            value: String(value),
            type: type || "text",
            description: description || null,
          })
          .returning();

        results.push(created[0]);
      }
    }

    return NextResponse.json(results);
  } catch (error) {
    console.error("Erro ao atualizar configurações:", error);
    return NextResponse.json(
      { error: "Erro ao atualizar configurações" },
      { status: 500 }
    );
  }
}

