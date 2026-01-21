"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, X, Image as ImageIcon, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  folder?: string;
  label?: string;
  required?: boolean;
  accept?: string;
  maxSizeMB?: number;
}

/**
 * Componente reutilizável para upload de imagens usando Vercel Blob Storage
 */
export function ImageUpload({
  value,
  onChange,
  folder = "hotel-sonata",
  label = "Imagem",
  required = false,
  accept = "image/*",
  maxSizeMB = 50,
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(value || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validação de tipo
    if (!file.type.startsWith("image/")) {
      toast.error("Por favor, selecione uma imagem válida");
      return;
    }

    // Validação de tamanho
    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      toast.error(`A imagem deve ter no máximo ${maxSizeMB}MB`);
      return;
    }

    // Preview local
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    // Upload
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", folder);
      formData.append("access", "public");

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Erro ao fazer upload");
      }

      const data = await response.json();
      onChange(data.url);
      toast.success("Imagem enviada com sucesso!");
    } catch (error) {
      console.error("Erro no upload:", error);
      toast.error(
        error instanceof Error ? error.message : "Erro ao fazer upload da imagem"
      );
      setPreview(null);
    } finally {
      setUploading(false);
      // Limpa o input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleRemove = () => {
    if (value) {
      // Opcional: deletar do storage
      // fetch(`/api/upload/delete?url=${encodeURIComponent(value)}`, {
      //   method: "DELETE",
      // });
    }
    setPreview(null);
    onChange("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    onChange(url);
    setPreview(url || null);
  };

  return (
    <div className="space-y-2 min-w-0 max-w-full">
      <Label htmlFor="image-upload">
        {label} {required && "*"}
      </Label>

      {/* Preview */}
      {preview && (
        <div className="relative w-full h-48 rounded-lg overflow-hidden border border-border bg-muted max-w-full">
          <img
            src={preview}
            alt="Preview"
            className="w-full h-full object-cover"
          />
          <Button
            type="button"
            variant="destructive"
            size="icon"
            className="absolute top-2 right-2"
            onClick={handleRemove}
            disabled={uploading}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}

      {/* Upload Button */}
      {!preview && (
        <div className="flex items-center gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
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
                Fazer Upload
              </>
            )}
          </Button>
          <Input
            ref={fileInputRef}
            type="file"
            accept={accept}
            onChange={handleFileSelect}
            className="hidden"
            id="image-upload"
          />
        </div>
      )}

      {/* URL Input (fallback) */}
      <div className="space-y-2 min-w-0 max-w-full">
        <Label htmlFor="image-url" className="text-sm text-muted-foreground">
          Ou cole uma URL
        </Label>
        <Input
          id="image-url"
          type="url"
          value={value}
          onChange={handleUrlChange}
          placeholder="https://..."
          disabled={uploading}
          className="max-w-full"
        />
      </div>

      {preview && !uploading && (
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => fileInputRef.current?.click()}
          className="w-full"
        >
          <ImageIcon className="h-4 w-4 mr-2" />
          Trocar Imagem
        </Button>
      )}

      <p className="text-xs text-muted-foreground">
        Formatos aceitos: JPG, PNG, WEBP. Tamanho máximo: {maxSizeMB}MB
      </p>
    </div>
  );
}

