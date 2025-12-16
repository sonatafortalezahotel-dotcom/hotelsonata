"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
import { Plus, Trash2, Upload, Info, Eye, Pencil } from "lucide-react";
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

interface GalleryItem {
  id: number;
  title?: string;
  imageUrl: string;
  category?: string;
  active: boolean;
  order: number;
}

export default function GalleryPage() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<GalleryItem | null>(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    loadGallery();
  }, []);

  const loadGallery = async () => {
    try {
      const response = await fetch("/api/gallery");
      const data = await response.json();
      setItems(Array.isArray(data) ? data : []);
    } catch (error) {
      toast.error("Erro ao carregar galeria");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Tem certeza que deseja excluir esta foto?")) return;

    try {
      const response = await fetch(`/api/gallery/${id}`, { method: "DELETE" });
      if (response.ok) {
        toast.success("Foto excluída com sucesso");
        loadGallery();
      } else {
        toast.error("Erro ao excluir foto");
      }
    } catch (error) {
      toast.error("Erro ao excluir foto");
    }
  };

  const handleFileUpload = async (file: File) => {
    setUploading(true);
    
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", "gallery");

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        toast.success("Imagem enviada com sucesso!");
        return data.url;
      } else {
        toast.error("Erro ao fazer upload");
        return null;
      }
    } catch (error) {
      toast.error("Erro ao fazer upload");
      return null;
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Galeria</h1>
          <p className="text-muted-foreground">
            Gerenciar fotos da galeria do hotel
          </p>
          <Alert className="mt-4 max-w-2xl">
            <Info className="h-4 w-4" />
            <AlertTitle>Onde cada foto aparece?</AlertTitle>
            <AlertDescription>
              A <strong>categoria</strong> define onde a foto aparece no site. 
              Use o ícone <Eye className="h-3 w-3 inline" /> ao lado de cada categoria para ver os detalhes.
              <br />
              <a href="/MAPEAMENTO_FOTOS_ADMIN_FRONTEND.md" target="_blank" className="text-primary underline mt-2 inline-block">
                Ver documentação completa
              </a>
            </AlertDescription>
          </Alert>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Nova Foto
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
            <DialogHeader>
              <DialogTitle>Adicionar Foto</DialogTitle>
              <DialogDescription>
                Faça upload de uma nova foto para a galeria
              </DialogDescription>
            </DialogHeader>
            <div className="flex-1 min-h-0 -mx-6 px-6">
              <GalleryForm
                onSuccess={() => {
                  setDialogOpen(false);
                  loadGallery();
                }}
                onUpload={handleFileUpload}
              />
            </div>
          </DialogContent>
        </Dialog>
        
        {/* Dialog de Edição */}
        <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
            <DialogHeader>
              <DialogTitle>Editar Foto</DialogTitle>
              <DialogDescription>
                Edite as informações da foto da galeria
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
                  }}
                  onUpload={handleFileUpload}
                />
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardContent className="p-6">
          {loading ? (
            <div className="text-center text-muted-foreground">
              Carregando...
            </div>
          ) : items.length === 0 ? (
            <div className="text-center text-muted-foreground">
              Nenhuma foto na galeria
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {items.map((item) => (
                <div key={item.id} className="relative group">
                  <div className="aspect-square rounded-lg overflow-hidden bg-muted">
                    <img
                      src={item.imageUrl}
                      alt={item.title || "Foto da galeria"}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
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
                      <p className="text-sm text-center truncate font-medium">
                        {item.title}
                      </p>
                    )}
                    {item.category && (
                      <div className="flex items-center justify-center gap-1">
                        <Badge variant="secondary" className="text-xs">
                          {item.category}
                        </Badge>
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
                    <p className="text-xs text-muted-foreground text-center">
                      Ordem: {item.order}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// Função auxiliar para obter descrição da categoria
function getCategoryDescription(category: string): string {
  const descriptions: Record<string, string> = {
    piscina: "Homepage (card Piscina), PhotoStory, Página Quartos",
    recepcao: "Homepage (card Quartos), Página Quartos",
    restaurante: "Homepage (card Gastronomia), Página Gastronomia, PhotoStory",
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
  onUpload: (file: File) => Promise<string | null>;
}) {
  const isEditing = !!item;
  const [formData, setFormData] = useState({
    title: item?.title || "",
    imageUrl: item?.imageUrl || "",
    category: item?.category || "",
    active: item?.active ?? true,
    order: item?.order || 0,
  });
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null);

  // Resetar formulário quando item mudar
  useEffect(() => {
    if (item) {
      setFormData({
        title: item.title || "",
        imageUrl: item.imageUrl || "",
        category: item.category || "",
        active: item.active ?? true,
        order: item.order || 0,
      });
      setFile(null);
    } else {
      setFormData({
        title: "",
        imageUrl: "",
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

      // Se tiver arquivo, faz upload primeiro
      if (file) {
        const uploadedUrl = await onUpload(file);
        if (!uploadedUrl) {
          setLoading(false);
          return;
        }
        imageUrl = uploadedUrl;
      }

      const url = isEditing ? `/api/gallery/${item.id}` : "/api/gallery";
      const method = isEditing ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, imageUrl }),
      });

      if (response.ok) {
        toast.success(isEditing ? "Foto atualizada com sucesso" : "Foto adicionada com sucesso");
        onSuccess();
      } else {
        const errorData = await response.json().catch(() => ({}));
        toast.error(errorData.error || (isEditing ? "Erro ao atualizar foto" : "Erro ao adicionar foto"));
      }
    } catch (error) {
      toast.error("Erro ao adicionar foto");
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
              <Label>Upload de Imagem</Label>
              <div className="border-2 border-dashed rounded-lg p-8 text-center hover:border-primary transition-colors cursor-pointer">
                <input
                  type="file"
                  accept="image/*"
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
                    {file ? file.name : "Clique para selecionar uma imagem"}
                  </p>
                </label>
              </div>
            </div>

            <div className="text-center text-sm text-muted-foreground">ou</div>
          </>
        )}

        {isEditing && (
          <div className="space-y-2">
            <Label>Imagem Atual</Label>
            <div className="relative aspect-video rounded-lg overflow-hidden bg-muted border">
              <img
                src={formData.imageUrl}
                alt={formData.title || "Foto da galeria"}
                className="h-full w-full object-cover"
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Para alterar a imagem, você precisará deletar e criar uma nova foto.
            </p>
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="imageUrl">{isEditing ? "URL da Imagem (atual)" : "URL da Imagem"}</Label>
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
          />
          {isEditing && (
            <p className="text-xs text-muted-foreground">
              A URL da imagem não pode ser alterada. Para trocar a imagem, exclua e crie uma nova foto.
            </p>
          )}
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
                  <p className="font-semibold mb-2">A categoria define onde a foto aparece:</p>
                  <ul className="text-xs space-y-1 list-disc list-inside">
                    <li><strong>piscina</strong> → Homepage (card Piscina), PhotoStory</li>
                    <li><strong>restaurante</strong> → Homepage (card Gastronomia), Página Gastronomia</li>
                    <li><strong>quarto</strong> → Homepage (card Quartos), Página Quartos</li>
                    <li><strong>recepcao</strong> → Homepage (card Quartos), Página Quartos</li>
                    <li><strong>geral</strong> → Vários lugares (galeria, localização)</li>
                  </ul>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <Select
            value={formData.category}
            onValueChange={(value) =>
              setFormData({ ...formData, category: value })
            }
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
              <strong>Esta foto aparecerá em:</strong> {getCategoryDescription(formData.category)}
            </div>
          )}
        </div>

        {/* Prévia Visual */}
        {formData.imageUrl && (
          <div className="mt-4">
            <ImagePreview
              imageUrl={formData.imageUrl}
              category={formData.category}
              type="gallery"
              title={formData.title}
            />
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Label htmlFor="order">Ordem</Label>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="h-3 w-3 text-muted-foreground cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Número menor aparece primeiro. Use 0, 1, 2, 3... para ordenar.</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <Input
              id="order"
              type="number"
              value={formData.order}
              onChange={(e) =>
                setFormData({ ...formData, order: parseInt(e.target.value) || 0 })
              }
            />
          </div>

          <div className="flex items-center space-x-2 pt-8">
            <Switch
              id="active"
              checked={formData.active}
              onCheckedChange={(checked) =>
                setFormData({ ...formData, active: checked })
              }
            />
            <Label htmlFor="active">Ativo</Label>
          </div>
        </div>
        </div>
      </div>

      <DialogFooter className="flex-shrink-0 pt-4 border-t mt-4">
        <Button type="submit" disabled={loading || (!isEditing && !file && !formData.imageUrl)}>
          {loading ? "Salvando..." : isEditing ? "Salvar Alterações" : "Adicionar"}
        </Button>
      </DialogFooter>
    </form>
  );
}

