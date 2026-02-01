import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { pageContent } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = searchParams.get("page");
    const locale = searchParams.get("locale");

    if (!page) {
      return NextResponse.json(
        { error: "Query 'page' é obrigatória" },
        { status: 400 }
      );
    }

    const rows = locale
      ? await db
          .select()
          .from(pageContent)
          .where(and(eq(pageContent.page, page), eq(pageContent.locale, locale)))
      : await db
          .select()
          .from(pageContent)
          .where(eq(pageContent.page, page));
    const map: Record<string, string> = {};
    for (const row of rows) {
      const key = `${row.section}.${row.fieldKey}`;
      map[key] = row.value;
    }
    return NextResponse.json(map);
  } catch (error) {
    console.error("Erro ao buscar page content:", error);
    return NextResponse.json(
      { error: "Erro ao buscar conteúdo da página" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { page, section, field_key, fieldKey, locale, value } = body;
    const key = field_key ?? fieldKey;

    if (!page || !section || !key || !locale || value === undefined) {
      return NextResponse.json(
        { error: "page, section, field_key, locale e value são obrigatórios" },
        { status: 400 }
      );
    }

    const existing = await db
      .select()
      .from(pageContent)
      .where(
        and(
          eq(pageContent.page, page),
          eq(pageContent.section, section),
          eq(pageContent.fieldKey, key),
          eq(pageContent.locale, locale)
        )
      )
      .limit(1);

    const valueStr = typeof value === "string" ? value : String(value ?? "");

    if (existing.length > 0) {
      const [updated] = await db
        .update(pageContent)
        .set({
          value: valueStr,
          updatedAt: new Date(),
        })
        .where(eq(pageContent.id, existing[0].id))
        .returning();
      return NextResponse.json(updated);
    }

    const [created] = await db
      .insert(pageContent)
      .values({
        page,
        section,
        fieldKey: key,
        locale,
        value: valueStr,
      })
      .returning();
    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    console.error("Erro ao salvar page content:", error);
    return NextResponse.json(
      { error: "Erro ao salvar conteúdo da página" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    if (!Array.isArray(body) && typeof body === "object" && body !== null && "page" in body) {
      const { page, section, field_key, fieldKey, locale, value } = body;
      const key = field_key ?? fieldKey;
      if (!page || !section || !key || !locale) {
        return NextResponse.json(
          { error: "page, section, field_key, locale são obrigatórios" },
          { status: 400 }
        );
      }
      const valueStr = typeof value === "string" ? value : String(value ?? "");
      const existing = await db
        .select()
        .from(pageContent)
        .where(
          and(
            eq(pageContent.page, page),
            eq(pageContent.section, section),
            eq(pageContent.fieldKey, key),
            eq(pageContent.locale, locale)
          )
        )
        .limit(1);
      if (existing.length > 0) {
        const [updated] = await db
          .update(pageContent)
          .set({ value: valueStr, updatedAt: new Date() })
          .where(eq(pageContent.id, existing[0].id))
          .returning();
        return NextResponse.json(updated);
      }
      const [created] = await db
        .insert(pageContent)
        .values({ page, section, fieldKey: key, locale, value: valueStr })
        .returning();
      return NextResponse.json(created, { status: 201 });
    }
    if (Array.isArray(body)) {
      const results = [];
      for (const item of body) {
        const { page, section, field_key, fieldKey, locale, value } = item;
        const key = field_key ?? fieldKey;
        if (!page || !section || !key || !locale) continue;
        const valueStr = typeof value === "string" ? value : String(value ?? "");
        const existing = await db
          .select()
          .from(pageContent)
          .where(
            and(
              eq(pageContent.page, page),
              eq(pageContent.section, section),
              eq(pageContent.fieldKey, key),
              eq(pageContent.locale, locale)
            )
          )
          .limit(1);
        if (existing.length > 0) {
          const [updated] = await db
            .update(pageContent)
            .set({ value: valueStr, updatedAt: new Date() })
            .where(eq(pageContent.id, existing[0].id))
            .returning();
          results.push(updated);
        } else {
          const [created] = await db
            .insert(pageContent)
            .values({ page, section, fieldKey: key, locale, value: valueStr })
            .returning();
          results.push(created);
        }
      }
      return NextResponse.json(results);
    }
    return NextResponse.json(
      { error: "Body deve ser um objeto com page, section, field_key, locale, value ou um array deles" },
      { status: 400 }
    );
  } catch (error) {
    console.error("Erro ao atualizar page content:", error);
    return NextResponse.json(
      { error: "Erro ao atualizar conteúdo da página" },
      { status: 500 }
    );
  }
}
