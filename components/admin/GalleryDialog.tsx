"use client";

import { useState, useRef, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { X, Upload, Loader2, ImagePlus } from "lucide-react";
import { optimizeImageForUpload } from "@/lib/imageOptimizer";

const UPLOAD_FOLDER = "blog";

interface GalleryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onInsert: (images: string[]) => void;
  initialImages?: string[];
  mode?: "create" | "edit";
}

export function GalleryDialog({
  open,
  onOpenChange,
  onInsert,
  initialImages = [],
  mode = "create",
}: GalleryDialogProps) {
  const [images, setImages] = useState<string[]>(initialImages);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sincronizar com initialImages quando o dialog abrir
  useEffect(() => {
    if (open) {
      setImages(initialImages);
    }
  }, [open, initialImages]);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    e.target.value = "";

    if (files.length === 0) return;

    const imageFiles = files.filter((f) => f.type.startsWith("image/"));
    if (imageFiles.length === 0) {
      toast.error("Selecione apenas arquivos de imagem");
      return;
    }

    setUploading(true);
    const uploadedUrls: string[] = [];

    for (const file of imageFiles) {
      try {
        const optimized = await optimizeImageForUpload(file);
        const formData = new FormData();
        formData.append("file", optimized);
        formData.append("folder", UPLOAD_FOLDER);
        formData.append("access", "public");

        const res = await fetch("/api/upload", { method: "POST", body: formData });
        
        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          throw new Error(err?.error || "Erro no upload");
        }

        const data = await res.json();
        if (data?.url) {
          uploadedUrls.push(data.url);
        }
      } catch (error) {
        toast.error(
          error instanceof Error
            ? error.message
            : `Erro ao enviar ${file.name}`
        );
      }
    }

    setUploading(false);

    if (uploadedUrls.length > 0) {
      setImages((prev) => [...prev, ...uploadedUrls]);
      toast.success(`${uploadedUrls.length} imagem(ns) adicionada(s)`);
    }
  };

  const handleRemoveImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleInsert = () => {
    if (images.length === 0) {
      toast.error("Adicione pelo menos uma imagem à galeria");
      return;
    }
    onInsert(images);
    handleClose();
  };

  const handleClose = () => {
    setImages(initialImages);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>
            {mode === "edit" ? "Editar Galeria" : "Criar Galeria de Imagens"}
          </DialogTitle>
          <DialogDescription>
            Adicione múltiplas imagens para criar uma galeria
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto py-4">
          {/* Área de upload */}
          <div className="space-y-4">
            <Button
              type="button"
              variant="outline"
              className="w-full h-24 border-dashed"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
            >
              {uploading ? (
                <div className="flex flex-col items-center gap-2">
                  <Loader2 className="h-6 w-6 animate-spin" />
                  <span className="text-sm">Enviando imagens...</span>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2">
                  <Upload className="h-6 w-6" />
                  <span className="text-sm">Clique para adicionar imagens</span>
                  <span className="text-xs text-muted-foreground">
                    Você pode selecionar múltiplos arquivos
                  </span>
                </div>
              )}
            </Button>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={handleFileSelect}
            />

            {/* Grid de imagens */}
            {images.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {images.map((src, index) => (
                  <div
                    key={`${src}-${index}`}
                    className="relative group aspect-square rounded-lg overflow-hidden bg-muted"
                  >
                    <img
                      src={src}
                      alt={`Imagem ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute top-2 right-2 h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => handleRemoveImage(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                    <div className="absolute bottom-2 left-2 bg-black/60 text-white text-xs px-2 py-1 rounded">
                      {index + 1}
                    </div>
                  </div>
                ))}
                
                {/* Botão para adicionar mais */}
                <button
                  type="button"
                  className="aspect-square rounded-lg border-2 border-dashed border-muted-foreground/25 hover:border-primary hover:bg-muted/50 transition-colors flex items-center justify-center group"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                >
                  <div className="flex flex-col items-center gap-2 text-muted-foreground group-hover:text-primary">
                    <ImagePlus className="h-6 w-6" />
                    <span className="text-xs">Adicionar</span>
                  </div>
                </button>
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <ImagePlus className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p className="text-sm">Nenhuma imagem adicionada ainda</p>
              </div>
            )}
          </div>
        </div>

        <DialogFooter className="border-t pt-4">
          <div className="flex items-center justify-between w-full">
            <span className="text-sm text-muted-foreground">
              {images.length} {images.length === 1 ? "imagem" : "imagens"}
            </span>
            <div className="flex gap-2">
              <Button type="button" variant="outline" onClick={handleClose}>
                Cancelar
              </Button>
              <Button
                type="button"
                onClick={handleInsert}
                disabled={images.length === 0}
              >
                {mode === "edit" ? "Atualizar" : "Inserir"} Galeria
              </Button>
            </div>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
