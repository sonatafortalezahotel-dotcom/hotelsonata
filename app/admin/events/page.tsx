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
import { Plus, Pencil, Trash2, CalendarDays, Info } from "lucide-react";
import { toast } from "sonner";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ImagePreview } from "@/components/admin/ImagePreview";

interface Event {
  id: number;
  type: string;
  title?: string;
  description?: string;
  imageUrl: string;
  capacity?: number;
  active: boolean;
  order: number;
}

export default function EventsPage() {
  const [items, setItems] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Event | null>(null);

  useEffect(() => {
    loadItems();
  }, []);

  const loadItems = async () => {
    try {
      const response = await fetch("/api/events?locale=pt");
      const data = await response.json();
      setItems(Array.isArray(data) ? data : []);
    } catch (error) {
      toast.error("Erro ao carregar eventos");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Tem certeza que deseja excluir este evento?")) return;

    try {
      const response = await fetch(`/api/events/${id}`, { method: "DELETE" });
      if (response.ok) {
        toast.success("Evento excluído com sucesso");
        loadItems();
      } else {
        toast.error("Erro ao excluir evento");
      }
    } catch (error) {
      toast.error("Erro ao excluir evento");
    }
  };

  const openDialog = (item?: Event) => {
    setEditingItem(item || null);
    setDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Eventos</h1>
          <p className="text-muted-foreground">
            Gerenciar tipos de eventos do hotel
          </p>
          <Alert className="mt-4 max-w-2xl">
            <Info className="h-4 w-4" />
            <AlertTitle>Onde aparece?</AlertTitle>
            <AlertDescription>
              Os eventos aparecem na <strong>página /eventos</strong>.
              O <strong>tipo</strong> define onde aparece: "Corporativo" no Hero, "Casamento" no PhotoStory, etc.
              A <strong>ordem</strong> define a posição nos cards (menor número = primeiro). Apenas eventos <strong>ativos</strong> são exibidos.
            </AlertDescription>
          </Alert>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => openDialog()}>
              <Plus className="h-4 w-4 mr-2" />
              Novo Evento
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingItem ? "Editar Evento" : "Novo Evento"}
              </DialogTitle>
            </DialogHeader>
            <EventForm
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
              Nenhum evento cadastrado
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">Imagem</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Título</TableHead>
                  <TableHead>Capacidade</TableHead>
                  <TableHead>Status</TableHead>
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
                            alt={item.title || "Evento"}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <CalendarDays className="h-6 w-6 text-muted-foreground" />
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{item.type}</TableCell>
                    <TableCell>{item.title || "-"}</TableCell>
                    <TableCell>{item.capacity || "-"}</TableCell>
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

function EventForm({
  item,
  onSuccess,
}: {
  item: Event | null;
  onSuccess: () => void;
}) {
  const [formData, setFormData] = useState({
    type: item?.type || "corporativo",
    title: item?.title || "",
    description: item?.description || "",
    imageUrl: item?.imageUrl || "",
    capacity: item?.capacity || 0,
    active: item?.active ?? true,
    order: item?.order || 0,
  });
  const [loading, setLoading] = useState(false);

  // Atualizar formData quando o item mudar
  useEffect(() => {
    if (item) {
      setFormData({
        type: item.type || "corporativo",
        title: item.title || "",
        description: item.description || "",
        imageUrl: item.imageUrl || "",
        capacity: item.capacity || 0,
        active: item.active ?? true,
        order: item.order || 0,
      });
    } else {
      setFormData({
        type: "corporativo",
        title: "",
        description: "",
        imageUrl: "",
        capacity: 0,
        active: true,
        order: 0,
      });
    }
  }, [item]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const url = item ? `/api/events/${item.id}` : "/api/events";
      const method = item ? "PUT" : "POST";

      const payload = {
        ...formData,
        locale: "pt", // Sempre salvar em português primeiro
      };

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        toast.success(
          item ? "Evento atualizado com sucesso" : "Evento criado com sucesso"
        );
        onSuccess();
      } else {
        toast.error("Erro ao salvar evento");
      }
    } catch (error) {
      toast.error("Erro ao salvar evento");
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
              <SelectItem value="corporativo">Corporativo</SelectItem>
              <SelectItem value="casamento">Casamento</SelectItem>
              <SelectItem value="nupcias">Núpcias</SelectItem>
              <SelectItem value="social">Social</SelectItem>
            </SelectContent>
          </Select>
          <Alert className="mt-2">
            <Info className="h-4 w-4" />
            <AlertTitle>Onde aparece na página de Eventos?</AlertTitle>
            <AlertDescription className="text-xs space-y-2 mt-2">
              <div>
                <strong className="text-foreground">📸 Hero (Topo da Página):</strong>
                <ul className="list-disc list-inside ml-2 mt-1 space-y-0.5">
                  <li><strong>Ordem 0:</strong> Primeira imagem exibida no Hero</li>
                </ul>
              </div>
              <div>
                <strong className="text-foreground">🎯 Tipos de Evento:</strong>
                <ul className="list-disc list-inside ml-2 mt-1 space-y-0.5">
                  <li><strong>Corporativo:</strong> Aparece na seção de tipos de eventos e nos blocos "Auditório" e "Escolar"</li>
                  <li><strong>Casamento:</strong> Aparece na seção de tipos de eventos e no bloco "Banquete"</li>
                  <li><strong>Núpcias:</strong> Aparece na seção de tipos de eventos</li>
                  <li><strong>Social:</strong> Aparece na seção de tipos de eventos e nos blocos "Banquete" e "Coquetel"</li>
                </ul>
              </div>
              <div>
                <strong className="text-foreground">🖼️ Blocos de Configuração:</strong>
                <ul className="list-disc list-inside ml-2 mt-1 space-y-0.5">
                  <li><strong>Auditório:</strong> Usa tipo "Corporativo" (primeiro encontrado)</li>
                  <li><strong>Escolar:</strong> Usa tipo "Corporativo" ou "Social" (primeiro encontrado)</li>
                  <li><strong>Banquete:</strong> Usa tipo "Social" ou "Casamento" (primeiro encontrado)</li>
                  <li><strong>Coquetel:</strong> Usa tipo "Social" ou "Corporativo" (primeiro encontrado)</li>
                </ul>
              </div>
              <div className="text-muted-foreground text-xs mt-2">
                💡 <strong>Dica:</strong> A ordem define a posição (menor número = primeiro). Apenas itens ativos são exibidos. Se não houver eventos cadastrados, usa imagens da galeria com categoria "eventos".
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

        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="capacity">Capacidade</Label>
            <Input
              id="capacity"
              type="number"
              value={formData.capacity}
              onChange={(e) =>
                setFormData({ ...formData, capacity: parseInt(e.target.value) })
              }
            />
          </div>

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
              Menor número = aparece primeiro. Ordem 0 = Hero (imagem principal no topo).
            </p>
          </div>
        </div>

        <ImageUpload
          value={formData.imageUrl}
          onChange={(url) => setFormData({ ...formData, imageUrl: url })}
          folder="events"
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
              category="geral"
            />
          </div>
        )}

        <div className="flex items-center space-x-2">
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

      <DialogFooter>
        <Button type="submit" disabled={loading}>
          {loading ? "Salvando..." : item ? "Atualizar" : "Criar"}
        </Button>
      </DialogFooter>
    </form>
  );
}

