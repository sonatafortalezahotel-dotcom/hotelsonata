"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, X, Image as ImageIcon, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { optimizeImageForUpload } from "@/lib/imageOptimizer";

interface GalleryUploadProps {
  value: string[]; // Array de URLs
  onChange: (urls: string[]) => void;
  folder?: string;
  label?: string;
  maxImages?: number;
  maxSizeMB?: number;
}

/**
 * Componente reutilizável para upload de múltiplas imagens usando Vercel Blob Storage
 */
export function GalleryUpload({
  value = [],
  onChange,
  folder = "hotel-sonata",
  label = "Galeria de Imagens",
  maxImages = 20,
  maxSizeMB = 50,
}: GalleryUploadProps) {
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const urls = Array.isArray(value) ? value : [];

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    // Verificar limite de imagens
    if (urls.length + files.length > maxImages) {
      toast.error(`Você pode adicionar no máximo ${maxImages} imagens. Já possui ${urls.length}.`);
      return;
    }

    // Validação de tipo e tamanho
    for (const file of files) {
      if (!file.type.startsWith("image/")) {
        toast.error(`Arquivo ${file.name} não é uma imagem válida`);
        return;
      }

      const maxSizeBytes = maxSizeMB * 1024 * 1024;
      if (file.size > maxSizeBytes) {
        toast.error(`A imagem ${file.name} deve ter no máximo ${maxSizeMB}MB`);
        return;
      }
    }

    // Upload múltiplo (otimiza cada imagem antes)
    setUploading(true);
    try {
      const optimizedFiles = await Promise.all(files.map((f) => optimizeImageForUpload(f)));
      const formData = new FormData();
      optimizedFiles.forEach((file) => {
        formData.append("files", file);
      });
      formData.append("folder", folder);
      formData.append("baseFilename", "gallery");

      const response = await fetch("/api/upload/multiple", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: "Erro desconhecido" }));
        const errorMessage = errorData.error || `Erro ${response.status}: ${response.statusText}`;
        console.error("Erro na resposta:", errorData);
        throw new Error(errorMessage);
      }

      const data = await response.json();
      
      if (!data.urls || !Array.isArray(data.urls)) {
        throw new Error("Resposta inválida do servidor");
      }

      const newUrls = [...urls, ...data.urls];
      onChange(newUrls);
      toast.success(`${files.length} imagem(ns) enviada(s) com sucesso!`);
    } catch (error) {
      console.error("Erro no upload:", error);
      const errorMessage = error instanceof Error 
        ? error.message 
        : "Erro ao fazer upload das imagens";
      toast.error(errorMessage);
    } finally {
      setUploading(false);
      // Limpa o input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleRemove = (index: number) => {
    const newUrls = urls.filter((_, i) => i !== index);
    onChange(newUrls);
    toast.success("Imagem removida");
  };

  const handleUrlAdd = (url: string) => {
    if (!url.trim()) return;
    
    // Validar URL
    try {
      new URL(url);
      const newUrls = [...urls, url.trim()];
      onChange(newUrls);
    } catch {
      toast.error("URL inválida");
    }
  };

  return (
    <div className="space-y-4">
      <Label>{label}</Label>

      {/* Grid de imagens */}
      {urls.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {urls.map((url, index) => (
            <div key={index} className="relative group">
              <div className="aspect-square rounded-lg overflow-hidden border border-border bg-muted">
                <img
                  src={url}
                  alt={`Imagem ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
              <Button
                type="button"
                variant="destructive"
                size="icon"
                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => handleRemove(index)}
                disabled={uploading}
              >
                <X className="h-4 w-4" />
              </Button>
              <div className="absolute bottom-2 left-2 bg-black/60 text-white text-xs px-2 py-1 rounded">
                {index + 1}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Botão de upload */}
      <div className="flex items-center gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading || urls.length >= maxImages}
          className="w-full"
        >
          {uploading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Enviando...
            </>
          ) : (
            <>
              <Upload className="h-4 w-4 mr-2" />
              Adicionar Imagens ({urls.length}/{maxImages})
            </>
          )}
        </Button>
        <Input
          ref={fileInputRef}
          type="file"
          accept="image/*,image/heic,image/heif,.heic,.heif"
          multiple
          onChange={handleFileSelect}
          className="hidden"
          id="gallery-upload"
          disabled={uploading || urls.length >= maxImages}
        />
      </div>

      {/* Adicionar por URL */}
      <div className="space-y-2">
        <Label htmlFor="gallery-url" className="text-sm text-muted-foreground">
          Ou adicione uma URL
        </Label>
        <div className="flex gap-2">
          <Input
            id="gallery-url"
            type="url"
            placeholder="https://..."
            disabled={uploading || urls.length >= maxImages}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleUrlAdd(e.currentTarget.value);
                e.currentTarget.value = "";
              }
            }}
          />
          <Button
            type="button"
            variant="outline"
            onClick={(e) => {
              const input = e.currentTarget.previousElementSibling as HTMLInputElement;
              if (input?.value) {
                handleUrlAdd(input.value);
                input.value = "";
              }
            }}
            disabled={uploading || urls.length >= maxImages}
          >
            Adicionar
          </Button>
        </div>
      </div>

      <p className="text-xs text-muted-foreground">
        Formatos aceitos: JPG, PNG, WEBP. Tamanho máximo: {maxSizeMB}MB por imagem.
        Máximo de {maxImages} imagens.
      </p>
    </div>
  );
}

