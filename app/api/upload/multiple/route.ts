import { NextResponse } from "next/server";
import { uploadMultipleFiles, generateUniqueFilename, isImageFile, isVideoFile, validateFileSize } from "@/lib/upload";

// Tamanhos máximos permitidos (em bytes). Imagens: 4MB (cliente otimiza antes do upload).
const MAX_IMAGE_SIZE = 4 * 1024 * 1024; // 4MB
const MAX_VIDEO_SIZE = 1024 * 1024 * 1024; // 1GB

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const files = formData.getAll("files") as File[];
    const folder = formData.get("folder") as string | null;
    const access = "public" as const;
    const baseFilename = (formData.get("baseFilename") as string) || "file";

    if (!files || files.length === 0) {
      return NextResponse.json(
        { error: "Nenhum arquivo foi enviado" },
        { status: 400 }
      );
    }

    // Validação de todos os arquivos
    for (const file of files) {
      const isImage = isImageFile(file);
      const isVideo = isVideoFile(file);

      if (!isImage && !isVideo) {
        return NextResponse.json(
          { error: `Arquivo ${file.name}: Tipo não suportado. Apenas imagens e vídeos são permitidos.` },
          { status: 400 }
        );
      }

      const maxSize = isImage ? MAX_IMAGE_SIZE : MAX_VIDEO_SIZE;
      if (!validateFileSize(file, maxSize)) {
        const maxSizeMB = maxSize / (1024 * 1024);
        return NextResponse.json(
          { error: `Arquivo ${file.name} muito grande. Tamanho máximo: ${maxSizeMB}MB` },
          { status: 400 }
        );
      }
    }

    // Valida se o token está configurado antes de tentar fazer upload
    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      return NextResponse.json(
        { error: "BLOB_READ_WRITE_TOKEN não está configurado" },
        { status: 500 }
      );
    }

    // Faz o upload de todos os arquivos
    const urls = await uploadMultipleFiles(files, baseFilename, {
      folder: folder || undefined,
      access,
    });

    return NextResponse.json({
      urls,
      count: urls.length,
    });
  } catch (error) {
    console.error("Erro ao fazer upload múltiplo:", error);
    const errorMessage = error instanceof Error ? error.message : "Erro ao fazer upload dos arquivos";
    return NextResponse.json(
      { 
        error: errorMessage,
        details: error instanceof Error ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}

