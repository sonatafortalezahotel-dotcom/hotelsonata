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
import { Plus, Pencil, Trash2, UtensilsCrossed, Info } from "lucide-react";
import { toast } from "sonner";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ImagePreview } from "@/components/admin/ImagePreview";

interface GastronomyItem {
  id: number;
  type: string;
  title?: string | null;
  description?: string | null;
  imageUrl: string;
  schedule?: string | null;
  tags?: string[] | null;
  active: boolean;
  order: number;
}

export default function GastronomyPage() {
  const [items, setItems] = useState<GastronomyItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<GastronomyItem | null>(null);

  useEffect(() => {
    loadItems();
  }, []);

  const loadItems = async () => {
    try {
      const response = await fetch("/api/gastronomy?locale=pt");
      const data = await response.json();
      setItems(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Erro ao carregar gastronomia:", error);
      toast.error("Erro ao carregar gastronomia");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Tem certeza que deseja excluir este item?")) return;

    try {
      const response = await fetch(`/api/gastronomy/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        toast.success("Item excluído com sucesso");
        loadItems();
      } else {
        toast.error("Erro ao excluir item");
      }
    } catch (error) {
      console.error("Erro ao excluir:", error);
      toast.error("Erro ao excluir item");
    }
  };

  const openDialog = (item?: GastronomyItem) => {
    setEditingItem(item || null);
    setDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Gastronomia</h1>
          <p className="text-muted-foreground">
            Gerenciar opções gastronômicas do hotel
          </p>
          <Alert className="mt-4 max-w-2xl">
            <Info className="h-4 w-4" />
            <AlertTitle>Onde aparece?</AlertTitle>
            <AlertDescription>
              Os itens aparecem na <strong>página /gastronomia</strong> e na <strong>homepage (card Gastronomia)</strong>.
              O <strong>tipo</strong> define onde aparece: "Restaurante" no Hero, "Café da Manhã" no card esquerdo, etc.
              A <strong>ordem</strong> define a posição nos cards (menor número = primeiro). Apenas itens <strong>ativos</strong> são exibidos.
            </AlertDescription>
          </Alert>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => openDialog()}>
              <Plus className="h-4 w-4 mr-2" />
              Novo Item
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingItem ? "Editar Item" : "Novo Item"}
              </DialogTitle>
              <DialogDescription>
                Preencha as informações do item gastronômico
              </DialogDescription>
            </DialogHeader>
            <GastronomyForm
              item={editingItem}
              onSuccess={() => {
                setDialogOpen(false);
                loadItems();
              }}
            />
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="p-8 text-center text-muted-foreground">
              Carregando...
            </div>
          ) : items.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">
              Nenhum item cadastrado
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">Imagem</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Título</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Ordem</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <div className="h-16 w-24 rounded overflow-hidden bg-muted">
                        {item.imageUrl ? (
                          <img
                            src={item.imageUrl}
                            alt={item.title || "Gastronomia"}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="h-full w-full flex items-center justify-center">
                            <UtensilsCrossed className="h-6 w-6 text-muted-foreground" />
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{item.type}</TableCell>
                    <TableCell>{item.title || "-"}</TableCell>
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

function GastronomyForm({
  item,
  onSuccess,
}: {
  item: GastronomyItem | null;
  onSuccess: () => void;
}) {
  const [formData, setFormData] = useState({
    type: item?.type || "restaurante",
    title: item?.title || "",
    description: item?.description || "",
    schedule: item?.schedule ?? "",
    tags: Array.isArray(item?.tags) ? item.tags.join("\n") : (item?.tags ? String(item.tags) : ""),
    imageUrl: item?.imageUrl || "",
    active: item?.active ?? true,
    order: item?.order || 0,
  });
  const [loading, setLoading] = useState(false);

  // Atualizar formData quando o item mudar
  useEffect(() => {
    if (item) {
      setFormData({
        type: item.type || "restaurante",
        title: item.title || "",
        description: item.description || "",
        schedule: item.schedule ?? "",
        tags: Array.isArray(item.tags) ? item.tags.join("\n") : (item.tags ? String(item.tags) : ""),
        imageUrl: item.imageUrl || "",
        active: item.active ?? true,
        order: item.order || 0,
      });
    } else {
      setFormData({
        type: "restaurante",
        title: "",
        description: "",
        schedule: "",
        tags: "",
        imageUrl: "",
        active: true,
        order: 0,
      });
    }
  }, [item]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validação dos campos obrigatórios
      if (!formData.title?.trim()) {
        toast.error("O título é obrigatório");
        setLoading(false);
        return;
      }

      if (!formData.imageUrl?.trim()) {
        toast.error("A imagem é obrigatória");
        setLoading(false);
        return;
      }

      // Validação do ID ao editar
      if (item && (!item.id || isNaN(Number(item.id)))) {
        toast.error("ID inválido para edição");
        setLoading(false);
        return;
      }

      const url = item ? `/api/gastronomy/${item.id}` : "/api/gastronomy";
      const method = item ? "PUT" : "POST";

      const payload = {
        type: formData.type,
        title: formData.title.trim(),
        description: formData.description || "",
        schedule: formData.schedule?.trim() || null,
        tags: formData.tags
          ? formData.tags
              .split("\n")
              .map((s) => s.trim())
              .filter(Boolean)
          : [],
        imageUrl: formData.imageUrl,
        active: formData.active,
        order: formData.order,
        locale: "pt", // Sempre salvar em português primeiro
      };

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        toast.success(
          item ? "Item atualizado com sucesso" : "Item criado com sucesso"
        );
        onSuccess();
      } else {
        const errorData = await response.json().catch(() => ({}));
        toast.error(errorData.error || "Erro ao salvar item");
        console.error("Erro na resposta:", errorData);
      }
    } catch (error) {
      console.error("Erro ao salvar:", error);
      toast.error("Erro ao salvar item");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-4">
        <div className="space-y-2">
          <Label htmlFor="type">Tipo *</Label>
          <Select
            value={formData.type}
            onValueChange={(value) => setFormData({ ...formData, type: value })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="cafe-manha">Café da Manhã</SelectItem>
              <SelectItem value="restaurante">Restaurante</SelectItem>
              <SelectItem value="bar">Bar</SelectItem>
              <SelectItem value="room-service">Room Service</SelectItem>
            </SelectContent>
          </Select>
          <Alert className="mt-2">
            <Info className="h-4 w-4" />
            <AlertTitle>Onde aparece na página de Gastronomia?</AlertTitle>
            <AlertDescription className="text-xs space-y-2 mt-2">
              <div>
                <strong className="text-foreground">📸 Hero (Topo da Página):</strong>
                <ul className="list-disc list-inside ml-2 mt-1 space-y-0.5">
                  <li><strong>Tipo "Restaurante":</strong> Imagem principal no Hero</li>
                </ul>
              </div>
              <div>
                <strong className="text-foreground">🖼️ PhotoStory - Experiência Gastronômica:</strong>
                <ul className="list-disc list-inside ml-2 mt-1 space-y-0.5">
                  <li><strong>Tipo "Restaurante":</strong> 1º bloco - "Restaurante"</li>
                  <li><strong>Galeria[1]:</strong> 2º bloco - "Frutos do Mar"</li>
                  <li><strong>Galeria[2]:</strong> 3º bloco - "Chef"</li>
                  <li><strong>Tipo "Café da Manhã":</strong> 4º bloco - "Café da Manhã"</li>
                </ul>
              </div>
              <div>
                <strong className="text-foreground">🍽️ Cards de Gastronomia:</strong>
                <ul className="list-disc list-inside ml-2 mt-1 space-y-0.5">
                  <li><strong>Tipo "Café da Manhã":</strong> Card esquerdo com galeria</li>
                  <li><strong>Tipo "Restaurante":</strong> Card direito com galeria</li>
                </ul>
              </div>
              <div className="text-muted-foreground text-xs mt-2">
                💡 <strong>Dica:</strong> A ordem define a posição nos cards. Apenas itens ativos são exibidos.
              </div>
            </AlertDescription>
          </Alert>
        </div>

        <div className="space-y-2">
          <Label htmlFor="title">Título *</Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
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

        <div className="space-y-2">
          <Label htmlFor="schedule">Horário</Label>
          <Input
            id="schedule"
            value={formData.schedule}
            onChange={(e) =>
              setFormData({ ...formData, schedule: e.target.value })
            }
            placeholder="Ex: Segunda a Sexta: 6h30 às 10h / Sábados e Domingos: 7h às 10h30"
          />
          <p className="text-xs text-muted-foreground">
            Exibido no card na página de Gastronomia. Deixe em branco para usar o texto padrão.
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="tags">Tags</Label>
          <Textarea
            id="tags"
            value={formData.tags}
            onChange={(e) =>
              setFormData({ ...formData, tags: e.target.value })
            }
            placeholder={"Uma tag por linha\nEx: Tapiocas na Hora\nFrutas Frescas\nCafé Cearense"}
            rows={4}
          />
          <p className="text-xs text-muted-foreground">
            Uma tag por linha. Exibidas no card. Deixe em branco para usar as tags padrão.
          </p>
        </div>

        <ImageUpload
          value={formData.imageUrl}
          onChange={(url) => setFormData({ ...formData, imageUrl: url })}
          folder="gastronomy"
          label="Imagem"
          required
        />

        {/* Prévia Visual */}
        {formData.imageUrl && (
          <div className="mt-4">
            <ImagePreview
              imageUrl={formData.imageUrl}
              type="gallery"
              title={formData.title || undefined}
              category={formData.type === "cafe-manha" ? "cafe" : "restaurante"}
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
              onChange={(e) =>
                setFormData({ ...formData, order: parseInt(e.target.value) })
              }
            />
            <p className="text-xs text-muted-foreground">
              Menor número = aparece primeiro. Define a ordem nos cards de gastronomia.
            </p>
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

      <DialogFooter>
        <Button type="submit" disabled={loading}>
          {loading ? "Salvando..." : item ? "Atualizar" : "Criar"}
        </Button>
      </DialogFooter>
    </form>
  );
}

