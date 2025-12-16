import { NextResponse } from "next/server";
import { uploadFile, generateUniqueFilename, isImageFile, isVideoFile, validateFileSize } from "@/lib/upload";

// Tamanhos máximos permitidos (em bytes)
const MAX_IMAGE_SIZE = 10 * 1024 * 1024; // 10MB
const MAX_VIDEO_SIZE = 100 * 1024 * 1024; // 100MB

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const folder = formData.get("folder") as string | null;
    const access = "public" as const;

    if (!file) {
      return NextResponse.json(
        { error: "Nenhum arquivo foi enviado" },
        { status: 400 }
      );
    }

    // Validação de tipo
    const isImage = isImageFile(file);
    const isVideo = isVideoFile(file);

    if (!isImage && !isVideo) {
      return NextResponse.json(
        { error: "Tipo de arquivo não suportado. Apenas imagens e vídeos são permitidos." },
        { status: 400 }
      );
    }

    // Validação de tamanho
    const maxSize = isImage ? MAX_IMAGE_SIZE : MAX_VIDEO_SIZE;
    if (!validateFileSize(file, maxSize)) {
      const maxSizeMB = maxSize / (1024 * 1024);
      return NextResponse.json(
        { error: `Arquivo muito grande. Tamanho máximo: ${maxSizeMB}MB` },
        { status: 400 }
      );
    }

    // Gera nome único para o arquivo
    const uniqueFilename = generateUniqueFilename(file.name);

    // Faz o upload
    const url = await uploadFile(file, uniqueFilename, {
      folder: folder || undefined,
      access,
    });

    return NextResponse.json({
      url,
      filename: uniqueFilename,
      size: file.size,
      type: file.type,
    });
  } catch (error) {
    console.error("Erro ao fazer upload:", error);
    return NextResponse.json(
      { error: "Erro ao fazer upload do arquivo" },
      { status: 500 }
    );
  }
}

