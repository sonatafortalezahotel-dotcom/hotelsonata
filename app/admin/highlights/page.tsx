"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus, Pencil, Trash2, Image as ImageIcon, Info } from "lucide-react";
import { toast } from "sonner";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ImagePreview } from "@/components/admin/ImagePreview";
import { getVideoUrlType, extractYouTubeVideoId, extractVimeoVideoId } from "@/lib/utils";

interface Highlight {
  id: number;
  title: string;
  description?: string;
  imageUrl: string;
  videoUrl?: string;
  link?: string;
  startDate: string;
  endDate: string;
  active: boolean;
  order: number;
}

export default function HighlightsPage() {
  const [highlights, setHighlights] = useState<Highlight[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Highlight | null>(null);

  useEffect(() => {
    loadHighlights();
  }, []);

  const loadHighlights = async () => {
    try {
      const response = await fetch("/api/highlights");
      const data = await response.json();
      setHighlights(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Erro ao carregar destaques:", error);
      toast.error("Erro ao carregar destaques");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Tem certeza que deseja excluir este destaque?")) return;

    try {
      const response = await fetch(`/api/highlights/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        toast.success("Destaque excluído com sucesso");
        loadHighlights();
      } else {
        toast.error("Erro ao excluir destaque");
      }
    } catch (error) {
      console.error("Erro ao excluir:", error);
      toast.error("Erro ao excluir destaque");
    }
  };

  const openDialog = (item?: Highlight) => {
    setEditingItem(item || null);
    setDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Destaques</h1>
          <p className="text-muted-foreground">
            Gerenciar carrossel principal da homepage
          </p>
          <Alert className="mt-4 max-w-2xl">
            <Info className="h-4 w-4" />
            <AlertTitle>Onde aparece?</AlertTitle>
            <AlertDescription>
              Os destaques aparecem no <strong>carrossel principal no topo da homepage</strong>.
              A <strong>ordem</strong> define qual aparece primeiro (menor número = primeiro).
              Apenas destaques <strong>ativos</strong> e dentro do <strong>período</strong> são exibidos.
            </AlertDescription>
          </Alert>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => openDialog()}>
              <Plus className="h-4 w-4 mr-2" />
              Novo Destaque
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingItem ? "Editar Destaque" : "Novo Destaque"}
              </DialogTitle>
              <DialogDescription>
                Preencha as informações do destaque do carrossel
              </DialogDescription>
            </DialogHeader>
            <HighlightForm
              item={editingItem}
              onSuccess={() => {
                setDialogOpen(false);
                loadHighlights();
              }}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="p-8 text-center text-muted-foreground">
              Carregando...
            </div>
          ) : highlights.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">
              Nenhum destaque cadastrado
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">Imagem</TableHead>
                  <TableHead>Título</TableHead>
                  <TableHead>Período</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Ordem</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {highlights.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <div className="h-16 w-24 rounded overflow-hidden bg-muted">
                        {item.imageUrl ? (
                          <img
                            src={item.imageUrl}
                            alt={item.title}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="h-full w-full flex items-center justify-center">
                            <ImageIcon className="h-6 w-6 text-muted-foreground" />
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{item.title || "(Sem título)"}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {new Date(item.startDate).toLocaleDateString("pt-BR")} até{" "}
                      {new Date(item.endDate).toLocaleDateString("pt-BR")}
                    </TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          item.active
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {item.active ? "Ativo" : "Inativo"}
                      </span>
                    </TableCell>
                    <TableCell>{item.order}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openDialog(item)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(item.id)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// Função auxiliar para formatar data para YYYY-MM-DD (fora do componente para evitar recriação)
const formatDateForInput = (date: string | undefined): string => {
  if (!date) return "";
  try {
    const d = new Date(date);
    if (isNaN(d.getTime())) return "";
    return d.toISOString().split("T")[0];
  } catch {
    return "";
  }
};

// Componente para preview do vídeo
function VideoPreview({ url }: { url: string }) {
  try {
    const videoType = getVideoUrlType(url);
    
    if (!videoType) {
      return (
        <div className="mt-2 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-md">
          <p className="text-xs text-yellow-800 dark:text-yellow-200">
            ⚠️ URL de vídeo não reconhecida. Verifique se é uma URL válida do YouTube ou Vimeo.
          </p>
        </div>
      );
    }

    if (videoType === 'youtube') {
      const videoId = extractYouTubeVideoId(url);
      if (videoId) {
        const embedUrl = `https://www.youtube.com/embed/${videoId}`;
        return (
          <div className="mt-2">
            <p className="text-xs text-green-600 dark:text-green-400 mb-2">
              ✓ URL do YouTube detectada
            </p>
            <div className="relative aspect-video bg-muted rounded-md overflow-hidden border">
              <iframe
                src={embedUrl}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title="Preview do vídeo do YouTube"
              />
            </div>
          </div>
        );
      }
    }

    if (videoType === 'vimeo') {
      const videoId = extractVimeoVideoId(url);
      if (videoId) {
        const embedUrl = `https://player.vimeo.com/video/${videoId}`;
        return (
          <div className="mt-2">
            <p className="text-xs text-green-600 dark:text-green-400 mb-2">
              ✓ URL do Vimeo detectada
            </p>
            <div className="relative aspect-video bg-muted rounded-md overflow-hidden border">
              <iframe
                src={embedUrl}
                className="w-full h-full"
                allow="autoplay; fullscreen; picture-in-picture"
                allowFullScreen
                title="Preview do vídeo do Vimeo"
              />
            </div>
          </div>
        );
      }
    }

    if (videoType === 'direct') {
      return (
        <div className="mt-2">
          <p className="text-xs text-blue-600 dark:text-blue-400 mb-2">
            ✓ URL direta de vídeo detectada
          </p>
          <div className="relative aspect-video bg-muted rounded-md overflow-hidden border">
            <video
              src={url}
              controls
              className="w-full h-full"
            >
              Seu navegador não suporta vídeos HTML5.
            </video>
          </div>
        </div>
      );
    }

    return null;
  } catch (error) {
    console.error("Erro ao renderizar preview do vídeo:", error);
    return null;
  }
}

function HighlightForm({
  item,
  onSuccess,
}: {
  item: Highlight | null;
  onSuccess: () => void;
}) {
  const [formData, setFormData] = useState({
    title: item?.title || "",
    description: item?.description || "",
    imageUrl: item?.imageUrl || "",
    videoUrl: item?.videoUrl || "",
    link: item?.link || "",
    startDate: formatDateForInput(item?.startDate),
    endDate: formatDateForInput(item?.endDate),
    active: item?.active ?? true,
    order: item?.order || 0,
  });
  const [loading, setLoading] = useState(false);

  // Atualizar formData quando o item mudar
  useEffect(() => {
    setFormData({
      title: item?.title || "",
      description: item?.description || "",
      imageUrl: item?.imageUrl || "",
      videoUrl: item?.videoUrl || "",
      link: item?.link || "",
      startDate: formatDateForInput(item?.startDate),
      endDate: formatDateForInput(item?.endDate),
      active: item?.active ?? true,
      order: item?.order || 0,
    });
  }, [item]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    console.log("Form submitted", formData);
    setLoading(true);

    try {
      // Validação básica no frontend
      // Imagem ou vídeo é obrigatório (pelo menos um)
      if (!formData.imageUrl.trim() && !formData.videoUrl?.trim()) {
        toast.error("É necessário adicionar uma imagem ou um vídeo");
        setLoading(false);
        return;
      }
      if (!formData.startDate) {
        toast.error("A data de início é obrigatória");
        setLoading(false);
        return;
      }
      if (!formData.endDate) {
        toast.error("A data de fim é obrigatória");
        setLoading(false);
        return;
      }

      // Preparar dados para envio (tratar strings vazias como null para campos opcionais)
      const hasImage = formData.imageUrl?.trim();
      const hasVideo = formData.videoUrl?.trim();
      
      const dataToSend = {
        title: formData.title?.trim() || null, // Opcional
        description: formData.description?.trim() || null,
        imageUrl: hasImage || null, // Pode ser null se tiver vídeo
        videoUrl: hasVideo || null,
        link: formData.link?.trim() || null,
        startDate: formData.startDate,
        endDate: formData.endDate,
        active: formData.active,
        order: Number(formData.order) || 0,
      };

      console.log("Dados a serem enviados:", dataToSend);

      const url = item ? `/api/highlights/${item.id}` : "/api/highlights";
      const method = item ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dataToSend),
      });

      console.log("Resposta da API:", response.status, response.statusText);

      let data;
      try {
        data = await response.json();
      } catch (parseError) {
        console.error("Erro ao fazer parse da resposta:", parseError);
        const text = await response.text();
        console.error("Resposta em texto:", text);
        toast.error("Erro ao processar resposta do servidor");
        setLoading(false);
        return;
      }

      if (response.ok) {
        toast.success(
          item ? "Destaque atualizado com sucesso" : "Destaque criado com sucesso"
        );
        onSuccess();
      } else {
        const errorMessage = data.error || "Erro ao salvar destaque";
        const missingFields = data.missingFields;
        if (missingFields && missingFields.length > 0) {
          toast.error(`${errorMessage}: ${missingFields.join(", ")}`);
        } else {
          toast.error(errorMessage);
        }
        console.error("Erro na resposta:", data);
      }
    } catch (error) {
      console.error("Erro ao salvar:", error);
      toast.error(`Erro ao salvar destaque: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-4">
        <div className="space-y-2">
          <Label htmlFor="title">Título</Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="Título do destaque (opcional)"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Descrição</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            rows={3}
          />
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <ImageUpload
            value={formData.imageUrl}
            onChange={(url) => setFormData({ ...formData, imageUrl: url })}
            folder="highlights"
            label="Imagem do Destaque"
            required={!formData.videoUrl?.trim()}
          />
          {!formData.imageUrl && !formData.videoUrl?.trim() && (
            <p className="text-xs text-muted-foreground col-span-2">
              ⚠️ É necessário adicionar uma imagem ou um vídeo
            </p>
          )}

          <div className="space-y-2">
            <Label htmlFor="videoUrl">
              URL do Vídeo (YouTube/Vimeo)
              {!formData.imageUrl?.trim() && (
                <span className="text-destructive ml-1">*</span>
              )}
            </Label>
            <Input
              id="videoUrl"
              type="text"
              value={formData.videoUrl || ""}
              onChange={(e) => {
                const value = e.target.value.trim();
                setFormData({ ...formData, videoUrl: value || "" });
              }}
              placeholder="https://youtube.com/watch?v=... ou https://youtu.be/..."
            />
            {formData.videoUrl && formData.videoUrl.trim() !== "" && (
              <>
                <VideoPreview url={formData.videoUrl} />
                <p className="text-xs text-muted-foreground">
                  Formatos aceitos: youtube.com/watch?v=..., youtu.be/..., vimeo.com/...
                </p>
              </>
            )}
            {!formData.imageUrl?.trim() && !formData.videoUrl?.trim() && (
              <p className="text-xs text-destructive">
                ⚠️ Adicione uma imagem ou um vídeo
              </p>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="link">Link</Label>
          <Input
            id="link"
            type="text"
            value={formData.link || ""}
            onChange={(e) => {
              const value = e.target.value.trim();
              setFormData({ ...formData, link: value || "" });
            }}
            placeholder="https://..."
          />
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="startDate">Data Início *</Label>
            <Input
              id="startDate"
              type="date"
              value={formData.startDate}
              onChange={(e) =>
                setFormData({ ...formData, startDate: e.target.value })
              }
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="endDate">Data Fim *</Label>
            <Input
              id="endDate"
              type="date"
              value={formData.endDate}
              onChange={(e) =>
                setFormData({ ...formData, endDate: e.target.value })
              }
              required
            />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="order">Ordem</Label>
            <Input
              id="order"
              type="number"
              value={formData.order}
              onChange={(e) =>
                setFormData({ ...formData, order: parseInt(e.target.value) })
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

        {/* Prévia Visual */}
        {formData.imageUrl && (
          <div className="mt-4">
            <ImagePreview
              imageUrl={formData.imageUrl}
              type="highlight"
              title={formData.title}
              description={formData.description || undefined}
            />
          </div>
        )}
      </div>

      <DialogFooter>
        <Button type="submit" disabled={loading}>
          {loading ? "Salvando..." : item ? "Atualizar" : "Criar"}
        </Button>
      </DialogFooter>
    </form>
  );
}

