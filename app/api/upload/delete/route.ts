import { NextResponse } from "next/server";
import { deleteFile } from "@/lib/upload";

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const url = searchParams.get("url");

    if (!url) {
      return NextResponse.json(
        { error: "URL do arquivo é obrigatória" },
        { status: 400 }
      );
    }

    await deleteFile(url);

    return NextResponse.json({
      success: true,
      message: "Arquivo deletado com sucesso",
    });
  } catch (error) {
    console.error("Erro ao deletar arquivo:", error);
    return NextResponse.json(
      { error: "Erro ao deletar arquivo" },
      { status: 500 }
    );
  }
}

