"use client";

import { useEffect, useState, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus, Trash2, Upload, Info, Eye, Pencil, Video, Search, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ImagePreview } from "@/components/admin/ImagePreview";
import { Progress } from "@/components/ui/progress";
import { optimizeImageForUpload } from "@/lib/imageOptimizer";
import type { AdminMediaItem } from "@/app/api/admin/media/route";

const SOURCE_OPTIONS = [
  "Blob Storage",
  "Galeria",
  "Destaques",
  "Quartos",
  "Gastronomia",
  "Lazer",
  "Eventos",
  "Pacotes",
  "Sustentabilidade",
  "Certificações",
  "Redes sociais",
  "Landing pages SEO",
  "Pontos turísticos",
];

interface GalleryItem {
  id: number;
  title?: string;
  imageUrl?: string | null;
  videoUrl?: string | null;
  mediaType?: "image" | "video";
  category?: string;
  active: boolean;
  order: number;
}

export default function GalleryPage() {
  const [mediaItems, setMediaItems] = useState<AdminMediaItem[]>([]);
  const [mediaLoading, setMediaLoading] = useState(true);
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [sourceFilter, setSourceFilter] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");

  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<GalleryItem | null>(null);
  const [uploading, setUploading] = useState(false);

  const loadMedia = useCallback(async () => {
    try {
      setMediaLoading(true);
      const params = new URLSearchParams();
      if (typeFilter && typeFilter !== "all") params.set("type", typeFilter);
      if (sourceFilter && sourceFilter !== "all") params.set("source", sourceFilter);
      if (searchTerm.trim()) params.set("search", searchTerm.trim());
      const response = await fetch(`/api/admin/media?${params.toString()}`);
      const data = await response.json();
      setMediaItems(Array.isArray(data) ? data : []);
    } catch {
      toast.error("Erro ao carregar mídia");
      setMediaItems([]);
    } finally {
      setMediaLoading(false);
    }
  }, [typeFilter, sourceFilter, searchTerm]);

  useEffect(() => {
    loadMedia();
  }, [loadMedia]);

  const loadGallery = useCallback(async () => {
    try {
      const response = await fetch("/api/gallery");
      const data = await response.json();
      setItems(Array.isArray(data) ? data : []);
    } catch (error) {
      toast.error("Erro ao carregar galeria");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadGallery();
  }, [loadGallery]);

  const handleDelete = async (id: number) => {
    if (!confirm("Tem certeza que deseja excluir esta foto?")) return;
    try {
      const response = await fetch(`/api/gallery/${id}`, { method: "DELETE" });
      if (response.ok) {
        toast.success("Foto excluída com sucesso");
        loadGallery();
        loadMedia();
      } else {
        toast.error("Erro ao excluir foto");
      }
    } catch {
      toast.error("Erro ao excluir foto");
    }
  };

  const handleFileUpload = async (
    file: File,
    onProgress?: (percent: number) => void
  ): Promise<string | null> => {
    setUploading(true);
    onProgress?.(0);
    try {
      const isImage = file.type.startsWith("image/");
      const fileToUpload = isImage ? await optimizeImageForUpload(file) : file;
      const formData = new FormData();
      formData.append("file", fileToUpload);
      formData.append("folder", "gallery");

      const url = await new Promise<string | null>((resolve) => {
        const xhr = new XMLHttpRequest();
        xhr.open("POST", "/api/upload");

        xhr.upload.addEventListener("progress", (e) => {
          if (e.lengthComputable) {
            const percent = Math.round((100 * e.loaded) / e.total);
            onProgress?.(percent);
          }
        });

        xhr.addEventListener("load", () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            try {
              const data = JSON.parse(xhr.responseText);
              onProgress?.(100);
              resolve(data?.url ?? null);
            } catch {
              resolve(null);
            }
          } else {
            try {
              const err = JSON.parse(xhr.responseText);
              toast.error(err?.error || "Erro ao fazer upload");
            } catch {
              toast.error("Erro ao fazer upload");
            }
            resolve(null);
          }
        });

        xhr.addEventListener("error", () => {
          toast.error("Erro de conexão ao enviar arquivo");
          resolve(null);
        });

        xhr.addEventListener("abort", () => resolve(null));
        xhr.send(formData);
      });

      if (url) {
        toast.success(isImage ? "Imagem enviada com sucesso!" : "Vídeo enviado com sucesso!");
      }
      return url;
    } catch {
      toast.error("Erro ao fazer upload");
      return null;
    } finally {
      setUploading(false);
      onProgress?.(100);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">Galeria de mídia</h1>
          <p className="text-muted-foreground">
            Todas as imagens e vídeos do site. Filtre por tipo, origem ou busque por URL/nome.
          </p>
          <Alert className="mt-4 max-w-2xl">
            <Info className="h-4 w-4" />
            <AlertTitle>Onde cada mídia aparece?</AlertTitle>
            <AlertDescription>
              Use o filtro &quot;Origem&quot; ou o link &quot;Editar&quot; para ir ao admin correspondente (Destaques, Quartos, etc.).
            </AlertDescription>
          </Alert>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Adicionar à galeria
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
            <DialogHeader>
              <DialogTitle>Adicionar à galeria</DialogTitle>
              <DialogDescription>
                Faça upload de uma nova foto ou vídeo para a galeria
              </DialogDescription>
            </DialogHeader>
            <div className="flex-1 min-h-0 -mx-6 px-6">
              <GalleryForm
                onSuccess={() => {
                  setDialogOpen(false);
                  loadGallery();
                  loadMedia();
                }}
                onUpload={handleFileUpload}
              />
            </div>
          </DialogContent>
        </Dialog>

        <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
            <DialogHeader>
              <DialogTitle>Editar item da galeria</DialogTitle>
              <DialogDescription>
                Edite as informações do item da galeria
              </DialogDescription>
            </DialogHeader>
            <div className="flex-1 min-h-0 -mx-6 px-6">
              {editingItem && (
                <GalleryForm
                  item={editingItem}
                  onSuccess={() => {
                    setEditDialogOpen(false);
                    setEditingItem(null);
                    loadGallery();
                    loadMedia();
                  }}
                  onUpload={handleFileUpload}
                />
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filtros */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-4 items-end">
            <div className="flex-1 min-w-[200px] space-y-2">
              <Label className="text-xs text-muted-foreground">Buscar</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="URL, título ou origem..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Tipo</Label>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="image">Imagem</SelectItem>
                  <SelectItem value="video">Vídeo</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Origem</Label>
              <Select value={sourceFilter} onValueChange={setSourceFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas</SelectItem>
                  {SOURCE_OPTIONS.map((s) => (
                    <SelectItem key={s} value={s}>{s}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Grid de mídia */}
      <Card>
        <CardContent className="p-6">
          {mediaLoading ? (
            <div className="text-center text-muted-foreground py-12">Carregando mídia...</div>
          ) : mediaItems.length === 0 ? (
            <div className="text-center text-muted-foreground py-12">
              Nenhuma mídia encontrada. Ajuste os filtros ou adicione itens à galeria.
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {mediaItems.map((item, index) => (
                <div
                  key={`${item.source}-${item.sourceId ?? index}-${item.url}`}
                  className="relative group rounded-lg overflow-hidden border bg-muted/50"
                >
                  <div className="aspect-square relative">
                    {item.type === "video" ? (
                      <div className="absolute inset-0 flex items-center justify-center bg-muted">
                        <Video className="h-12 w-12 text-muted-foreground" />
                      </div>
                    ) : (
                      <img
                        src={item.url}
                        alt={item.title || ""}
                        className="h-full w-full object-cover"
                      />
                    )}
                  </div>
                  <div className="p-2 space-y-1">
                    <Badge variant="secondary" className="text-xs truncate max-w-full">
                      {item.source}
                    </Badge>
                    {item.title && (
                      <p className="text-xs text-muted-foreground truncate" title={item.title}>
                        {item.title}
                      </p>
                    )}
                    {item.editPath && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 text-xs w-full justify-center gap-1"
                        asChild
                      >
                        <a href={item.editPath} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="h-3 w-3" />
                          Editar
                        </a>
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Seção: Itens da galeria (tabela gallery) - edição rápida */}
      <Card>
        <CardContent className="p-6">
          <h2 className="text-lg font-semibold mb-4">Itens da galeria (editar / excluir)</h2>
          {loading ? (
            <div className="text-center text-muted-foreground">Carregando...</div>
          ) : items.length === 0 ? (
            <div className="text-center text-muted-foreground">
              Nenhum item na galeria. Use &quot;Adicionar à galeria&quot; para criar.
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {items.map((item) => {
                const mediaUrl = item.imageUrl || item.videoUrl || "";
                const isVideo = item.mediaType === "video" || (!item.imageUrl && item.videoUrl);
                return (
                <div key={item.id} className="relative group">
                  <div className="aspect-square rounded-lg overflow-hidden bg-muted">
                    {isVideo && mediaUrl ? (
                      <video src={mediaUrl} className="h-full w-full object-cover" muted />
                    ) : mediaUrl ? (
                      <img
                        src={mediaUrl}
                        alt={item.title || "Foto da galeria"}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center">
                        <Video className="h-10 w-10 text-muted-foreground" />
                      </div>
                    )}
                  </div>
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 rounded-lg">
                    <Button
                      variant="default"
                      size="icon"
                      onClick={() => {
                        setEditingItem(item);
                        setEditDialogOpen(true);
                      }}
                      title="Editar foto"
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={() => handleDelete(item.id)}
                      title="Excluir foto"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="mt-2 space-y-1">
                    {item.title && (
                      <p className="text-sm text-center truncate font-medium">{item.title}</p>
                    )}
                    {item.category && (
                      <div className="flex items-center justify-center gap-1">
                        <Badge variant="secondary" className="text-xs">{item.category}</Badge>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Eye className="h-3 w-3 text-muted-foreground cursor-help" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className="text-xs">{getCategoryDescription(item.category)}</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    )}
                    <p className="text-xs text-muted-foreground text-center">Ordem: {item.order}</p>
                  </div>
                </div>
              );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function getCategoryDescription(category: string): string {
  const descriptions: Record<string, string> = {
    piscina: "Homepage (card Piscina), PhotoStory, Página Quartos",
    recepcao: "Homepage (card Quartos), Página Quartos",
    restaurante: "Homepage (card Gastronomia), Página Gastronomia",
    gastronomia: "Homepage (card Gastronomia), Página Gastronomia",
    cafe: "Página Gastronomia (card Café), PhotoStory",
    quarto: "Homepage (card Quartos), Página Quartos, PhotoStory",
    spa: "Homepage (card Spa), Página Lazer",
    academia: "Homepage (card Spa), Página Lazer",
    lazer: "Homepage (card Beach Tennis), PhotoStory, Página Lazer",
    esporte: "Homepage (card Beach Tennis), PhotoStory",
    sustentabilidade: "Homepage (card Sustentabilidade), Página ESG",
    geral: "Galeria geral, Localização, Vários lugares",
    localizacao: "Homepage (seção Localização - pontos turísticos)",
  };
  return descriptions[category] || "Vários lugares do site";
}

function GalleryForm({
  item,
  onSuccess,
  onUpload,
}: {
  item?: GalleryItem;
  onSuccess: () => void;
  onUpload: (file: File, onProgress?: (percent: number) => void) => Promise<string | null>;
}) {
  const isEditing = !!item;
  const [formData, setFormData] = useState({
    title: item?.title || "",
    imageUrl: item?.imageUrl ?? "",
    videoUrl: item?.videoUrl ?? "",
    mediaType: (item?.mediaType as "image" | "video") || "image",
    category: item?.category || "",
    active: item?.active ?? true,
    order: item?.order || 0,
  });
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);

  useEffect(() => {
    setUploadProgress(null);
    if (item) {
      setFormData({
        title: item.title || "",
        imageUrl: item.imageUrl ?? "",
        videoUrl: item.videoUrl ?? "",
        mediaType: (item.mediaType as "image" | "video") || "image",
        category: item.category || "",
        active: item.active ?? true,
        order: item.order || 0,
      });
      setFile(null);
    } else {
      setFormData({
        title: "",
        imageUrl: "",
        videoUrl: "",
        mediaType: "image",
        category: "",
        active: true,
        order: 0,
      });
      setFile(null);
    }
  }, [item]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      let imageUrl = formData.imageUrl;
      let videoUrl = formData.videoUrl;
      let mediaType = formData.mediaType;

      if (file) {
        setUploadProgress(0);
        const uploadedUrl = await onUpload(file, (percent) => setUploadProgress(percent));
        setUploadProgress(null);
        if (!uploadedUrl) {
          setLoading(false);
          return;
        }
        const isVideo = file.type.startsWith("video/");
        if (isVideo) {
          videoUrl = uploadedUrl;
          imageUrl = "";
          mediaType = "video";
        } else {
          imageUrl = uploadedUrl;
          videoUrl = "";
          mediaType = "image";
        }
      }

      const url = isEditing ? `/api/gallery/${item.id}` : "/api/gallery";
      const response = await fetch(url, {
        method: isEditing ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          imageUrl: imageUrl || undefined,
          videoUrl: videoUrl || undefined,
          mediaType,
        }),
      });
      if (response.ok) {
        toast.success(isEditing ? "Foto atualizada com sucesso" : "Item adicionado com sucesso");
        onSuccess();
      } else {
        const errorData = await response.json().catch(() => ({}));
        toast.error(errorData.error || (isEditing ? "Erro ao atualizar" : "Erro ao adicionar"));
      }
    } catch {
      toast.error("Erro ao salvar");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto space-y-4 pb-4">
        <div className="grid gap-4">
          <div className="space-y-2">
            <Label htmlFor="title">Título</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />
          </div>

          {!isEditing && (
            <>
              <div className="space-y-2">
                <Label>Upload de imagem ou vídeo</Label>
                <div className="border-2 border-dashed rounded-lg p-8 text-center hover:border-primary transition-colors cursor-pointer">
                  <input
                    type="file"
                    accept="image/*,image/heic,image/heif,.heic,.heif,video/mp4,video/webm,video/quicktime,video/x-msvideo"
                    onChange={(e) => {
                      const selectedFile = e.target.files?.[0];
                      if (selectedFile) {
                        setFile(selectedFile);
                        setFormData({ ...formData, imageUrl: "" });
                      }
                    }}
                    className="hidden"
                    id="file-upload"
                  />
                  <label htmlFor="file-upload" className="cursor-pointer">
                    <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">
                      {file ? file.name : "Clique para selecionar imagem ou vídeo"}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Imagens: até 4MB (serão otimizadas). Vídeos: até 1GB.
                    </p>
                  </label>
                </div>
                {uploadProgress !== null && (
                  <div className="space-y-2">
                    <Label>Enviando... {uploadProgress}%</Label>
                    <Progress value={uploadProgress} className="h-2" />
                  </div>
                )}
              </div>
              <div className="text-center text-sm text-muted-foreground">ou</div>
            </>
          )}

          {isEditing && (
            <div className="space-y-2">
              <Label>Mídia atual</Label>
              <div className="relative aspect-video rounded-lg overflow-hidden bg-muted border">
                {(formData.videoUrl || formData.imageUrl) && (
                  formData.mediaType === "video" || formData.videoUrl ? (
                    <video src={formData.videoUrl || formData.imageUrl} className="h-full w-full object-cover" controls />
                  ) : (
                    <img
                      src={formData.imageUrl}
                      alt={formData.title || "Galeria"}
                      className="h-full w-full object-cover"
                    />
                  )
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                Para alterar, exclua e crie um novo item.
              </p>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="imageUrl">URL da imagem (opcional se for vídeo)</Label>
            <Input
              id="imageUrl"
              type="url"
              value={formData.imageUrl}
              onChange={(e) => {
                setFormData({ ...formData, imageUrl: e.target.value });
                setFile(null);
              }}
              disabled={!!file || isEditing}
              readOnly={isEditing}
              placeholder="https://..."
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="videoUrl">URL do vídeo (opcional)</Label>
            <Input
              id="videoUrl"
              type="url"
              value={formData.videoUrl}
              onChange={(e) => {
                setFormData({ ...formData, videoUrl: e.target.value });
                setFile(null);
              }}
              disabled={!!file || isEditing}
              readOnly={isEditing}
              placeholder="https://..."
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Label htmlFor="category">Categoria *</Label>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent className="max-w-sm">
                    <p className="font-semibold mb-2">A categoria define onde a foto aparece no site.</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <Select
              value={formData.category}
              onValueChange={(value) => setFormData({ ...formData, category: value })}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione uma categoria" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="piscina">Piscina</SelectItem>
                <SelectItem value="recepcao">Recepção</SelectItem>
                <SelectItem value="restaurante">Restaurante</SelectItem>
                <SelectItem value="gastronomia">Gastronomia</SelectItem>
                <SelectItem value="cafe">Café da Manhã</SelectItem>
                <SelectItem value="quarto">Quarto</SelectItem>
                <SelectItem value="spa">Spa</SelectItem>
                <SelectItem value="academia">Academia</SelectItem>
                <SelectItem value="lazer">Lazer</SelectItem>
                <SelectItem value="esporte">Esporte</SelectItem>
                <SelectItem value="sustentabilidade">Sustentabilidade</SelectItem>
                <SelectItem value="geral">Geral</SelectItem>
                <SelectItem value="localizacao">Localização</SelectItem>
              </SelectContent>
            </Select>
            {formData.category && (
              <div className="text-xs text-muted-foreground mt-1 p-2 bg-muted rounded">
                <strong>Aparece em:</strong> {getCategoryDescription(formData.category)}
              </div>
            )}
          </div>

          {(formData.imageUrl || formData.videoUrl) && formData.mediaType !== "video" && formData.imageUrl && (
            <div className="mt-4">
              <ImagePreview
                imageUrl={formData.imageUrl}
                category={formData.category ?? ""}
                type="gallery"
                title={formData.title}
              />
            </div>
          )}

          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="order">Ordem</Label>
              <Input
                id="order"
                type="number"
                value={formData.order}
                onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
              />
            </div>
            <div className="flex items-center space-x-2 pt-8">
              <Switch
                id="active"
                checked={formData.active}
                onCheckedChange={(checked) => setFormData({ ...formData, active: checked })}
              />
              <Label htmlFor="active">Ativo</Label>
            </div>
          </div>
        </div>
      </div>
      <DialogFooter className="flex-shrink-0 pt-4 border-t mt-4">
        <Button
          type="submit"
          disabled={loading || (!isEditing && !file && !formData.imageUrl && !formData.videoUrl)}
        >
          {loading ? "Salvando..." : isEditing ? "Salvar" : "Adicionar"}
        </Button>
      </DialogFooter>
    </form>
  );
}
