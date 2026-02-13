"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2, Link as LinkIcon, Upload, Image as ImageIcon, Check } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { optimizeImageForUpload } from "@/lib/imageOptimizer";

interface ImageEditDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentImage: string;
  onSave: (url: string) => Promise<void>;
  path: string; // gallery:page:section:order
}

interface GalleryImage {
  id: number;
  imageUrl: string;
  title?: string;
  page?: string;
  section?: string;
  order?: number;
}

export function ImageEditDialog({
  open,
  onOpenChange,
  currentImage,
  onSave,
  path,
}: ImageEditDialogProps) {
  const [activeTab, setActiveTab] = useState("url");
  const [urlInput, setUrlInput] = useState(currentImage);
  const [selectedImage, setSelectedImage] = useState(currentImage);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([]);
  const [loadingGallery, setLoadingGallery] = useState(false);
  const [uploadedUrl, setUploadedUrl] = useState("");

  // Reset state when dialog opens
  useEffect(() => {
    if (open) {
      setUrlInput(currentImage);
      setSelectedImage(currentImage);
      setUploadedUrl("");
      setActiveTab("url");
    }
  }, [open, currentImage]);

  // Load gallery images when gallery tab is opened (sempre recarrega ao abrir a aba para mostrar as que já existem)
  useEffect(() => {
    if (open && activeTab === "gallery") {
      loadGalleryImages();
    }
  }, [open, activeTab]);

  const loadGalleryImages = async () => {
    setLoadingGallery(true);
    try {
      const response = await fetch("/api/gallery?active=true");
      if (response.ok) {
        const raw = await response.json();
        const list = Array.isArray(raw)
          ? raw
          : Array.isArray((raw as { photos?: unknown[] })?.photos)
            ? (raw as { photos: GalleryImage[] }).photos
            : Array.isArray((raw as { data?: unknown[] })?.data)
              ? (raw as { data: GalleryImage[] }).data
              : [];
        const normalized: GalleryImage[] = list.map((item: Record<string, unknown>) => ({
          id: Number(item.id),
          imageUrl: String(item.imageUrl ?? (item as Record<string, unknown>).image_url ?? ""),
          title: item.title != null ? String(item.title) : undefined,
          page: item.page != null ? String(item.page) : undefined,
          section: item.section != null ? String(item.section) : undefined,
          order: item.order != null ? Number(item.order) : undefined,
        }));
        setGalleryImages(normalized);
      } else {
        toast.error("Erro ao carregar galeria");
      }
    } catch (error) {
      console.error("Erro ao carregar galeria:", error);
      toast.error("Erro ao carregar galeria");
    } finally {
      setLoadingGallery(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validação de tipo
    if (!file.type.startsWith("image/")) {
      toast.error("Por favor, selecione uma imagem válida");
      return;
    }

    // Validação de tamanho (50MB) — será otimizada antes do upload
    const maxSizeBytes = 50 * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      toast.error("A imagem deve ter no máximo 50MB");
      return;
    }

    setUploading(true);
    try {
      const optimized = await optimizeImageForUpload(file);
      const formData = new FormData();
      formData.append("file", optimized);
      formData.append("folder", "hotel-sonata");
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
      setUploadedUrl(data.url);
      setSelectedImage(data.url);
      toast.success("Imagem enviada com sucesso!");
    } catch (error) {
      console.error("Erro no upload:", error);
      toast.error(
        error instanceof Error ? error.message : "Erro ao fazer upload da imagem"
      );
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    const imageToSave = activeTab === "url" ? urlInput : selectedImage;
    
    if (!imageToSave || !imageToSave.trim()) {
      toast.error("Por favor, selecione ou insira uma imagem");
      return;
    }

    // Validação básica de URL
    if (activeTab === "url") {
      try {
        new URL(imageToSave);
      } catch {
        toast.error("URL inválida");
        return;
      }
    }

    setSaving(true);
    try {
      await onSave(imageToSave);
      toast.success("Imagem atualizada com sucesso!");
      onOpenChange(false);
    } catch (error) {
      toast.error("Erro ao salvar imagem");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Editar Imagem</DialogTitle>
          <DialogDescription>
            Escolha a nova imagem. O resultado aparece na página ao salvar.
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col min-h-0">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="url" className="gap-2">
              <LinkIcon className="h-4 w-4" />
              URL
            </TabsTrigger>
            <TabsTrigger value="upload" className="gap-2">
              <Upload className="h-4 w-4" />
              Upload
            </TabsTrigger>
            <TabsTrigger value="gallery" className="gap-2">
              <ImageIcon className="h-4 w-4" />
              Galeria
            </TabsTrigger>
          </TabsList>

          {/* Tab Contents */}
          <div className="flex-1 min-h-0">
            <TabsContent value="url" className="space-y-4 mt-0">
              <div className="space-y-2">
                <Label htmlFor="image-url">URL da Imagem</Label>
                <Input
                  id="image-url"
                  type="url"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  placeholder="https://exemplo.com/imagem.jpg"
                  className="w-full"
                />
                <p className="text-xs text-muted-foreground">
                  Cole a URL completa de uma imagem hospedada na internet
                </p>
              </div>
            </TabsContent>

            <TabsContent value="upload" className="space-y-4 mt-0">
              <div className="space-y-4">
                {uploadedUrl ? (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400">
                      <Check className="h-4 w-4" />
                      <span>Upload concluído com sucesso!</span>
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setUploadedUrl("");
                        setSelectedImage(currentImage);
                      }}
                      className="w-full"
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Fazer Novo Upload
                    </Button>
                  </div>
                ) : (
                  <>
                    <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                      <ImageIcon className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                      <Label
                        htmlFor="file-upload"
                        className="cursor-pointer inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
                      >
                        {uploading ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Enviando...
                          </>
                        ) : (
                          <>
                            <Upload className="h-4 w-4 mr-2" />
                            Selecionar Arquivo
                          </>
                        )}
                      </Label>
                      <Input
                        id="file-upload"
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload}
                        disabled={uploading}
                        className="hidden"
                      />
                      <p className="text-xs text-muted-foreground mt-2">
                        JPG, PNG, WEBP até 50MB
                      </p>
                    </div>
                  </>
                )}
              </div>
            </TabsContent>

            <TabsContent value="gallery" className="mt-0 h-full">
              <div className="pt-4">
                <Label className="text-sm font-medium mb-2 block">Selecione na galeria</Label>
                {loadingGallery ? (
                  <div className="flex items-center justify-center h-40">
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                  </div>
                ) : galleryImages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-40 text-muted-foreground border border-dashed rounded-lg">
                    <ImageIcon className="h-10 w-10 mb-2 opacity-50" />
                    <p className="text-sm">Nenhuma imagem na galeria</p>
                  </div>
                ) : (
                  <ScrollArea className="h-[280px] pr-2">
                    <div className="grid grid-cols-4 gap-2">
                      {galleryImages.map((image) => (
                        <button
                          key={image.id}
                          type="button"
                          onClick={() => setSelectedImage(image.imageUrl)}
                          className={cn(
                            "relative aspect-square rounded-lg overflow-hidden border-2 transition-all hover:scale-[1.02] focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                            selectedImage === image.imageUrl
                              ? "border-primary ring-2 ring-primary ring-offset-2"
                              : "border-transparent hover:border-primary/50"
                          )}
                        >
                          <img
                            src={image.imageUrl}
                            alt={image.title || "Imagem da galeria"}
                            className="w-full h-full object-cover"
                          />
                          {selectedImage === image.imageUrl && (
                            <div className="absolute inset-0 bg-primary/25 flex items-center justify-center">
                              <Check className="h-5 w-5 text-primary-foreground drop-shadow" />
                            </div>
                          )}
                        </button>
                      ))}
                    </div>
                  </ScrollArea>
                )}
              </div>
            </TabsContent>
          </div>
        </Tabs>

        <DialogFooter className="flex-shrink-0">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={saving || uploading}
          >
            Cancelar
          </Button>
          <Button
            type="button"
            onClick={handleSave}
            disabled={saving || uploading || (activeTab === "url" && !urlInput.trim())}
          >
            {saving ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Salvando...
              </>
            ) : (
              "Salvar"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
