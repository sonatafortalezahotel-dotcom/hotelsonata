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
import { Plus, Pencil, Trash2, Leaf, Info } from "lucide-react";
import { toast } from "sonner";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ImagePreview } from "@/components/admin/ImagePreview";

interface SustainabilityItem {
  id: number;
  title: string;
  description: string;
  imageUrl?: string;
  category?: string;
  active: boolean;
  order: number;
}

export default function SustainabilityPage() {
  const [items, setItems] = useState<SustainabilityItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<SustainabilityItem | null>(null);

  useEffect(() => {
    loadItems();
  }, []);

  const loadItems = async () => {
    try {
      const response = await fetch("/api/sustainability");
      const data = await response.json();
      setItems(Array.isArray(data) ? data : []);
    } catch (error) {
      toast.error("Erro ao carregar sustentabilidade");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Tem certeza que deseja excluir este item?")) return;

    try {
      const response = await fetch(`/api/sustainability/${id}`, { method: "DELETE" });
      if (response.ok) {
        toast.success("Item excluído com sucesso");
        loadItems();
      } else {
        toast.error("Erro ao excluir item");
      }
    } catch (error) {
      toast.error("Erro ao excluir item");
    }
  };

  const openDialog = (item?: SustainabilityItem) => {
    setEditingItem(item || null);
    setDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Sustentabilidade</h1>
          <p className="text-muted-foreground">
            Gerenciar ações de sustentabilidade e inclusão
          </p>
          <Alert className="mt-4 max-w-2xl">
            <Info className="h-4 w-4" />
            <AlertTitle>Onde aparece?</AlertTitle>
            <AlertDescription>
              Os itens aparecem na <strong>seção "Sustentabilidade e Inclusão" da homepage</strong> e na <strong>página ESG</strong>.
              A <strong>ordem</strong> define a posição (menor número = primeiro).
              Apenas itens <strong>ativos</strong> são exibidos.
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
            </DialogHeader>
            <SustainabilityForm
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
                  <TableHead>Título</TableHead>
                  <TableHead>Categoria</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.title}</TableCell>
                    <TableCell>{item.category || "-"}</TableCell>
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

function SustainabilityForm({
  item,
  onSuccess,
}: {
  item: SustainabilityItem | null;
  onSuccess: () => void;
}) {
  const [formData, setFormData] = useState({
    title: item?.title || "",
    description: item?.description || "",
    imageUrl: item?.imageUrl || "",
    category: item?.category || "sustentabilidade",
    active: item?.active ?? true,
    order: item?.order || 0,
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const url = item ? `/api/sustainability/${item.id}` : "/api/sustainability";
      const method = item ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast.success(
          item ? "Item atualizado com sucesso" : "Item criado com sucesso"
        );
        onSuccess();
      } else {
        toast.error("Erro ao salvar item");
      }
    } catch (error) {
      toast.error("Erro ao salvar item");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-4">
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
          <Label htmlFor="description">Descrição *</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            rows={4}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="category">Categoria</Label>
          <Select
            value={formData.category}
            onValueChange={(value) => setFormData({ ...formData, category: value })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="sustentabilidade">Sustentabilidade</SelectItem>
              <SelectItem value="inclusao">Inclusão</SelectItem>
              <SelectItem value="acoes-sociais">Ações Sociais</SelectItem>
              <SelectItem value="obras-locais">Obras Locais</SelectItem>
            </SelectContent>
          </Select>
          <Alert className="mt-2">
            <Info className="h-4 w-4" />
            <AlertTitle>Onde aparece na página ESG?</AlertTitle>
            <AlertDescription className="text-xs space-y-2 mt-2">
              <div>
                <strong className="text-foreground">📸 Sustentabilidade:</strong>
                <ul className="list-disc list-inside ml-2 mt-1 space-y-0.5">
                  <li><strong>Ordem 0:</strong> Hero (imagem principal no topo da página)</li>
                  <li><strong>Ordem 0:</strong> Bloco "Mobilidade Sustentável" (PhotoStory - 2º bloco)</li>
                  <li><strong>Ordem 1:</strong> Bloco "Gestão Inteligente de Recursos" (PhotoStory - 3º bloco)</li>
                </ul>
              </div>
              <div>
                <strong className="text-foreground">🏗️ Obras Locais:</strong>
                <ul className="list-disc list-inside ml-2 mt-1 space-y-0.5">
                  <li>Bloco "Valorização da Produção Local" (PhotoStory - 1º bloco)</li>
                </ul>
              </div>
              <div>
                <strong className="text-foreground">❤️ Ações Sociais:</strong>
                <ul className="list-disc list-inside ml-2 mt-1 space-y-0.5">
                  <li>Bloco "Equipe" (PhotoStory - 4º bloco)</li>
                  <li>Seção "Ações Sociais" (imagem grande lateral direita)</li>
                </ul>
              </div>
            </AlertDescription>
          </Alert>
        </div>

        <ImageUpload
          value={formData.imageUrl}
          onChange={(url) => setFormData({ ...formData, imageUrl: url })}
          folder="sustainability"
          label="Imagem"
        />

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
              Menor número = aparece primeiro. Para "Sustentabilidade": 0 = Hero e 1º bloco PhotoStory, 1 = 2º bloco PhotoStory.
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

        {/* Prévia Visual */}
        {formData.imageUrl && (
          <div className="mt-4">
            <ImagePreview
              imageUrl={formData.imageUrl}
              type="sustainability"
              title={formData.title}
              description={formData.description}
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

