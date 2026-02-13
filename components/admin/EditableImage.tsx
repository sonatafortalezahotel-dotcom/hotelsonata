"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Edit2, Image as ImageIcon } from "lucide-react";

interface EditableImageProps {
  src: string;
  alt?: string;
  onClick?: () => void;
  className?: string;
  editMode?: boolean;
  showEditIndicator?: boolean;
  aspectRatio?: "video" | "square" | "auto";
}

export function EditableImage({
  src,
  alt = "",
  onClick,
  className,
  editMode = false,
  showEditIndicator = true,
  aspectRatio = "auto",
}: EditableImageProps) {
  const [imageError, setImageError] = useState(false);

  // Quando a URL da imagem muda (ex.: após salvar no editor), resetar erro para exibir a nova imagem
  useEffect(() => {
    setImageError(false);
  }, [src]);

  const aspectClasses = {
    video: "aspect-video",
    square: "aspect-square",
    auto: "",
  };

  if (!editMode) {
    return (
      <div className={cn("relative overflow-hidden", aspectClasses[aspectRatio], className)}>
        {src && !imageError ? (
          <img
            src={src}
            alt={alt}
            className="h-full w-full object-cover"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="h-full w-full flex items-center justify-center bg-muted">
            <ImageIcon className="h-12 w-12 text-muted-foreground" />
          </div>
        )}
      </div>
    );
  }

  return (
    <div
      className={cn(
        "relative group cursor-pointer transition-all overflow-hidden",
        aspectClasses[aspectRatio],
        editMode && "hover:ring-2 hover:ring-primary/50 rounded-lg",
        className
      )}
      onClick={onClick}
    >
      {src && !imageError ? (
        <>
          <img
            src={src}
            alt={alt}
            className="h-full w-full object-cover transition-transform group-hover:scale-105"
            onError={() => setImageError(true)}
          />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <div className="flex items-center gap-2 text-white">
              <Edit2 className="h-5 w-5" />
              <span className="text-sm font-medium">Clique para trocar imagem</span>
            </div>
          </div>
        </>
      ) : (
        <div className="h-full w-full flex flex-col items-center justify-center bg-muted border-2 border-dashed border-muted-foreground/30">
          <ImageIcon className="h-12 w-12 text-muted-foreground mb-2" />
          <span className="text-sm text-muted-foreground">Clique para adicionar imagem</span>
        </div>
      )}
      {editMode && showEditIndicator && src && !imageError && (
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="bg-primary text-primary-foreground rounded-full p-1.5">
            <Edit2 className="h-3 w-3" />
          </div>
        </div>
      )}
    </div>
  );
}
