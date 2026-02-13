import { NextResponse } from "next/server";
import { uploadFile, generateUniqueFilename, isImageFile, isVideoFile, validateFileSize } from "@/lib/upload";

// Tamanhos máximos permitidos (em bytes).
// Imagens: 4MB — o cliente otimiza (resize + compressão) antes do upload; limite alinhado ao body do Vercel (~4.5MB).
const MAX_IMAGE_SIZE = 4 * 1024 * 1024; // 4MB
const MAX_VIDEO_SIZE = 1024 * 1024 * 1024; // 1GB

// A partir deste tamanho (2MB), imagens são otimizadas no servidor com Sharp
const SERVER_OPTIMIZE_THRESHOLD_BYTES = 2 * 1024 * 1024;

const OPTIMIZABLE_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];

async function optimizeImageWithSharp(file: File): Promise<{ buffer: Buffer; ext: string; mime: string } | null> {
  try {
    const sharp = (await import("sharp")).default;
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const image = sharp(buffer);
    const meta = await image.metadata();
    const width = meta.width ?? 1920;
    const height = meta.height ?? 1920;
    const maxDim = 1920;
    const needResize = width > maxDim || height > maxDim;

    const pipeline = needResize
      ? image.resize(maxDim, maxDim, { fit: "inside", withoutEnlargement: true })
      : image;

    const { data } = await pipeline
      .webp({ quality: 90 })
      .toBuffer({ resolveWithObject: true });

    return {
      buffer: data,
      ext: "webp",
      mime: "image/webp",
    };
  } catch (err) {
    console.warn("Sharp optimization failed, uploading original:", err);
    return null;
  }
}

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

    let payload: File | Buffer = file;
    let uniqueFilename = generateUniqueFilename(file.name);

    // Otimização no servidor para imagens grandes (ex.: quando o cliente não otimizou)
    if (
      isImage &&
      file.size >= SERVER_OPTIMIZE_THRESHOLD_BYTES &&
      OPTIMIZABLE_IMAGE_TYPES.includes(file.type.toLowerCase())
    ) {
      const optimized = await optimizeImageWithSharp(file);
      if (optimized) {
        payload = optimized.buffer;
        const base = uniqueFilename.replace(/\.[^.]+$/, "");
        uniqueFilename = `${base}.${optimized.ext}`;
      }
    }

    const url = await uploadFile(payload, uniqueFilename, {
      folder: folder || undefined,
      access,
    });

    const size = Buffer.isBuffer(payload) ? payload.length : (payload as File).size;

    return NextResponse.json({
      url,
      filename: uniqueFilename,
      size,
      type: Buffer.isBuffer(payload) ? "image/webp" : file.type,
    });
  } catch (error) {
    console.error("Erro ao fazer upload:", error);
    return NextResponse.json(
      { error: "Erro ao fazer upload do arquivo" },
      { status: 500 }
    );
  }
}

