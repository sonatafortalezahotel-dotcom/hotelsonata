import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { packages, packageTranslations } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    // Next.js 13+ pode retornar params como Promise
    const resolvedParams = params instanceof Promise ? await params : params;
    const id = parseInt(resolvedParams.id);
    if (isNaN(id)) {
      return NextResponse.json(
        { error: "ID inválido" },
        { status: 400 }
      );
    }

    const { searchParams } = new URL(request.url);
    const locale = searchParams.get("locale") || "pt";

    const result = await db
      .select({
        id: packages.id,
        name: packageTranslations.name,
        description: packageTranslations.description,
        imageUrl: packages.imageUrl,
        price: packages.price,
        startDate: packages.startDate,
        endDate: packages.endDate,
        category: packages.category,
        active: packages.active,
        order: packages.order,
        // Fallback para campos originais caso não haja tradução
        originalName: packages.name,
        originalDescription: packages.description,
      })
      .from(packages)
      .leftJoin(
        packageTranslations,
        and(
          eq(packageTranslations.packageId, packages.id),
          eq(packageTranslations.locale, locale)
        )
      )
      .where(eq(packages.id, id))
      .limit(1);

    if (result.length === 0 || !result[0]) {
      return NextResponse.json(
        { error: "Pacote não encontrado" },
        { status: 404 }
      );
    }

    const pkg = result[0];
    
    // Verifica se o pacote tem ID válido
    if (!pkg.id) {
      console.error("Pacote retornado sem ID:", pkg);
      return NextResponse.json(
        { error: "Dados do pacote inválidos" },
        { status: 500 }
      );
    }
    
    // Usa tradução se disponível, senão usa os campos originais
    const packageData = {
      id: pkg.id,
      name: pkg.name || pkg.originalName || "",
      description: pkg.description || pkg.originalDescription || null,
      imageUrl: pkg.imageUrl,
      price: pkg.price,
      startDate: pkg.startDate,
      endDate: pkg.endDate,
      category: pkg.category,
      active: pkg.active,
      order: pkg.order,
    };

    // Valida se o pacote tem pelo menos um nome
    if (!packageData.name) {
      console.error("Pacote sem nome configurado:", packageData);
      return NextResponse.json(
        { error: "Pacote sem nome configurado" },
        { status: 500 }
      );
    }

    return NextResponse.json(packageData);
  } catch (error) {
    console.error("Erro ao buscar pacote:", error);
    const errorMessage = error instanceof Error ? error.message : "Erro desconhecido";
    return NextResponse.json(
      { error: "Erro ao buscar pacote", details: errorMessage },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    // Next.js 13+ pode retornar params como Promise
    const resolvedParams = params instanceof Promise ? await params : params;
    const id = parseInt(resolvedParams.id);
    if (isNaN(id)) {
      return NextResponse.json(
        { error: "ID inválido" },
        { status: 400 }
      );
    }

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

    const [updated] = await db
      .update(packages)
      .set({
        name,
        description: description || null,
        imageUrl,
        price: price || null,
        startDate,
        endDate,
        active: active ?? true,
        order: order || 0,
        category: category || null,
        updatedAt: new Date(),
      })
      .where(eq(packages.id, id))
      .returning();

    if (!updated) {
      return NextResponse.json(
        { error: "Pacote não encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Erro ao atualizar pacote:", error);
    return NextResponse.json(
      { error: "Erro ao atualizar pacote" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    // Next.js 13+ pode retornar params como Promise
    const resolvedParams = params instanceof Promise ? await params : params;
    const id = parseInt(resolvedParams.id);
    if (isNaN(id)) {
      return NextResponse.json(
        { error: "ID inválido" },
        { status: 400 }
      );
    }

    const [deleted] = await db
      .delete(packages)
      .where(eq(packages.id, id))
      .returning();

    if (!deleted) {
      return NextResponse.json(
        { error: "Pacote não encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "Pacote excluído com sucesso" });
  } catch (error) {
    console.error("Erro ao excluir pacote:", error);
    return NextResponse.json(
      { error: "Erro ao excluir pacote" },
      { status: 500 }
    );
  }
}

