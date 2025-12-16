import { put } from "@vercel/blob";

export interface UploadOptions {
  folder?: string; // Pasta onde o arquivo será salvo
  access?: "public";
}

/**
 * Faz upload de um arquivo para o Vercel Blob Storage
 * @param file - Arquivo a ser enviado (File ou Buffer)
 * @param filename - Nome do arquivo
 * @param options - Opções de upload
 * @returns URL do arquivo enviado
 */
export async function uploadFile(
  file: File | Buffer,
  filename: string,
  options: UploadOptions = {}
): Promise<string> {
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    throw new Error("BLOB_READ_WRITE_TOKEN não está configurado");
  }

  const { folder = "hotel-sonata", access = "public" } = options;

  // Gera o caminho completo do arquivo
  const path = folder ? `${folder}/${filename}` : filename;

  // Faz o upload
  const blob = await put(path, file, {
    access,
    token: process.env.BLOB_READ_WRITE_TOKEN,
  });

  return blob.url;
}

/**
 * Faz upload de múltiplos arquivos
 * @param files - Array de arquivos
 * @param baseFilename - Nome base para os arquivos (será incrementado)
 * @param options - Opções de upload
 * @returns Array de URLs dos arquivos enviados
 */
export async function uploadMultipleFiles(
  files: (File | Buffer)[],
  baseFilename: string,
  options: UploadOptions = {}
): Promise<string[]> {
  const uploads = files.map(async (file, index) => {
    try {
      if (file instanceof File) {
        // Gera nome único para cada arquivo usando timestamp e random
        const uniqueFilename = generateUniqueFilename(file.name);
        return await uploadFile(file, uniqueFilename, options);
      } else {
        // Para Buffer, usa nome base com timestamp
        const timestamp = Date.now();
        const random = Math.random().toString(36).substring(2, 9);
        const filename = `${baseFilename}-${timestamp}-${random}.jpg`;
        return await uploadFile(file, filename, options);
      }
    } catch (error) {
      const fileName = file instanceof File ? file.name : `arquivo-${index}`;
      console.error(`Erro ao fazer upload do arquivo ${fileName}:`, error);
      throw new Error(`Erro ao fazer upload de ${fileName}: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
    }
  });

  return Promise.all(uploads);
}

/**
 * Deleta um arquivo do Vercel Blob Storage
 * @param url - URL do arquivo a ser deletado
 */
export async function deleteFile(url: string): Promise<void> {
  const { del } = await import("@vercel/blob");
  
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    throw new Error("BLOB_READ_WRITE_TOKEN não está configurado");
  }
  
  await del(url, {
    token: process.env.BLOB_READ_WRITE_TOKEN,
  });
}

/**
 * Valida se um arquivo é uma imagem
 */
export function isImageFile(file: File): boolean {
  return file.type.startsWith("image/");
}

/**
 * Valida se um arquivo é um vídeo
 */
export function isVideoFile(file: File): boolean {
  return file.type.startsWith("video/");
}

/**
 * Valida o tamanho do arquivo (máximo em bytes)
 */
export function validateFileSize(file: File, maxSizeBytes: number): boolean {
  return file.size <= maxSizeBytes;
}

/**
 * Gera um nome de arquivo único baseado em timestamp
 */
export function generateUniqueFilename(originalName: string): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 9);
  const extension = originalName.split(".").pop();
  return `${timestamp}-${random}.${extension}`;
}

