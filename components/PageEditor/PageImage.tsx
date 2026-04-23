"use client";

import { useState } from "react";
import Image from "@/lib/app-image";
import { useEditor } from "@/lib/context/EditorContext";
import { EditableImage } from "@/components/admin/EditableImage";
import { ImageEditDialog } from "./ImageEditDialog";
import { cn } from "@/lib/utils";

interface PageImageProps {
  src: string;
  alt?: string;
  className?: string;
  aspectRatio?: "video" | "square" | "auto";
  /** Path para persistência (ex: gallery:hotel:hero:0). Se não informado, edição não salva no backend. */
  path?: string;
}

export function PageImage({
  src,
  alt = "",
  className,
  aspectRatio = "auto",
  path,
}: PageImageProps) {
  const editor = useEditor();
  const [dialogOpen, setDialogOpen] = useState(false);

  const displaySrc = path && editor?.imageOverrides?.[path] != null ? editor.imageOverrides[path] : src;

  const handleSave = async (url: string) => {
    if (!path || !editor?.onEditImage) {
      throw new Error("Edição de imagem não disponível para este bloco.");
    }
    await editor.onEditImage(path, url);
  };

  if (editor?.editMode) {
    return (
      <>
        <EditableImage
          src={displaySrc}
          alt={alt}
          onClick={() => setDialogOpen(true)}
          editMode
          className={className}
          aspectRatio={aspectRatio}
        />
        <ImageEditDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          currentImage={displaySrc}
          onSave={handleSave}
          path={path ?? "image"}
        />
      </>
    );
  }

  return (
    <div className={cn("relative w-full h-full min-h-[120px]", className)}>
      {displaySrc ? (
        <Image
          src={displaySrc}
          alt={alt}
          fill
          quality={80}
          sizes="100vw"
          className="object-cover"
        />
      ) : (
        <div className="h-full w-full flex items-center justify-center bg-muted text-muted-foreground">
          Sem imagem
        </div>
      )}
    </div>
  );
}
