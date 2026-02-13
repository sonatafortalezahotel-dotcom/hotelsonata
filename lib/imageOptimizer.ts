/**
 * Otimização de imagens no cliente (browser): redimensiona e comprime
 * antes do upload. Reduz tamanho de arquivo e evita limite de 4.5MB do Vercel.
 * Use apenas em componentes "use client".
 */

export interface OptimizeImageOptions {
  /** Largura máxima em pixels (mantém proporção). Padrão 1920. */
  maxWidth?: number;
  /** Altura máxima em pixels (mantém proporção). Padrão 1920. */
  maxHeight?: number;
  /** Tamanho máximo do arquivo em bytes após compressão. Padrão ~1.5MB. */
  maxSizeBytes?: number;
  /** Qualidade inicial (0–1). Padrão 0.88. */
  quality?: number;
  /** Se true, usa WebP quando o navegador suportar (menor tamanho). Padrão true. */
  preferWebP?: boolean;
}

const DEFAULTS: Required<OptimizeImageOptions> = {
  maxWidth: 1920,
  maxHeight: 1920,
  maxSizeBytes: 1572864, // 1.5 MB
  quality: 0.9, // Qualidade alta para evitar perda visível (0.88–0.92)
  preferWebP: true,
};

/** Tipos de imagem que podem ser redimensionados via Canvas (bitmap). */
const OPTIMIZABLE_TYPES = ["image/jpeg", "image/png", "image/webp"];

/**
 * Verifica se o navegador suporta WebP para canvas.
 */
function supportsWebP(): boolean {
  if (typeof document === "undefined") return false;
  const canvas = document.createElement("canvas");
  if (!canvas.getContext("2d")) return false;
  const data = canvas.toDataURL("image/webp");
  return data.startsWith("data:image/webp");
}

/**
 * Carrega um File como HTMLImageElement (Promise).
 */
function loadImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Falha ao carregar imagem"));
    };
    img.src = url;
  });
}

/**
 * Redimensiona dimensões mantendo proporção, limitado por maxW e maxH.
 */
function fitDimensions(
  width: number,
  height: number,
  maxW: number,
  maxH: number
): { width: number; height: number } {
  if (width <= maxW && height <= maxH) return { width, height };
  const ratio = Math.min(maxW / width, maxH / height);
  return {
    width: Math.round(width * ratio),
    height: Math.round(height * ratio),
  };
}

/**
 * Gera extensão e tipo MIME para o output.
 */
function outputMime(preferWebP: boolean): { mime: string; ext: string } {
  if (preferWebP && supportsWebP()) return { mime: "image/webp", ext: "webp" };
  return { mime: "image/jpeg", ext: "jpg" };
}

/**
 * Otimiza uma imagem no cliente: redimensiona (max 1920px) e comprime
 * para ficar dentro do tamanho alvo (~1.5MB), ideal para upload sem bater
 * no limite de 4.5MB do Vercel e para exibição leve no site.
 *
 * Imagens não-bitmap (ex.: SVG) ou não suportadas são retornadas sem alteração.
 *
 * @param file - Arquivo de imagem (File do input)
 * @param options - Opções de otimização (opcional)
 * @returns Promise com o novo File otimizado (ou o original se não for possível otimizar)
 */
export async function optimizeImageForUpload(
  file: File,
  options: OptimizeImageOptions = {}
): Promise<File> {
  const opts = { ...DEFAULTS, ...options };
  const type = (file.type || "").toLowerCase();

  if (!OPTIMIZABLE_TYPES.includes(type)) {
    return file;
  }

  try {
    const img = await loadImage(file);
    const { maxWidth, maxHeight, maxSizeBytes, quality, preferWebP } = opts;
    const { width: w, height: h } = fitDimensions(
      img.naturalWidth,
      img.naturalHeight,
      maxWidth,
      maxHeight
    );

    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d");
    if (!ctx) return file;

    ctx.imageSmoothingEnabled = true;
    (ctx as CanvasRenderingContext2D & { imageSmoothingQuality?: string }).imageSmoothingQuality = "high";
    ctx.drawImage(img, 0, 0, w, h);

    const { mime, ext } = outputMime(preferWebP);
    const baseName = file.name.replace(/\.[^.]+$/, "");

    const qualities = [quality, 0.75, 0.6, 0.5];
    for (const q of qualities) {
      const blob = await new Promise<Blob | null>((res) =>
        canvas.toBlob(res, mime, q)
      );
      if (!blob) continue;
      if (blob.size <= maxSizeBytes) {
        const name = `${baseName}.${ext}`;
        return new File([blob], name, { type: mime, lastModified: Date.now() });
      }
    }

    const blob = await new Promise<Blob | null>((res) =>
      canvas.toBlob(res, mime, 0.5)
    );
    if (!blob) return file;
    const name = `${baseName}.${ext}`;
    return new File([blob], name, { type: mime, lastModified: Date.now() });
  } catch {
    return file;
  }
}
