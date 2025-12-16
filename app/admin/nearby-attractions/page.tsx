"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { Plus, Pencil, Trash2, MapPin, Info } from "lucide-react";
import { toast } from "sonner";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { ImagePreview } from "@/components/admin/ImagePreview";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface NearbyAttractionItem {
  id: number;
  code: string;
  name?: string;
  distance?: string;
  imageUrl: string;
  active: boolean;
  order: number;
}

export default function NearbyAttractionsPage() {
  const [items, setItems] = useState<NearbyAttractionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<NearbyAttractionItem | null>(null);

  useEffect(() => {
    loadItems();
  }, []);

  const loadItems = async () => {
    try {
      const response = await fetch("/api/nearby-attractions?locale=pt");
      const data = await response.json();
      const itemsArray = Array.isArray(data) ? data : [];
      console.log("Itens carregados:", itemsArray);
      setItems(itemsArray);
    } catch (error) {
      toast.error("Erro ao carregar pontos turísticos");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Tem certeza que deseja excluir este ponto turístico?")) return;

    try {
      const response = await fetch(`/api/nearby-attractions/${id}`, { method: "DELETE" });
      if (response.ok) {
        toast.success("Ponto turístico excluído com sucesso");
        loadItems();
      } else {
        toast.error("Erro ao excluir ponto turístico");
      }
    } catch (error) {
      toast.error("Erro ao excluir ponto turístico");
    }
  };

  const openDialog = (item?: NearbyAttractionItem) => {
    console.log("Abrindo diálogo para edição:", item);
    if (item) {
      console.log("ID do item:", item.id, "Tipo:", typeof item.id);
    }
    setEditingItem(item || null);
    setDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Pontos Turísticos Próximos</h1>
          <p className="text-muted-foreground">
            Gerenciar pontos turísticos exibidos na seção de localização
          </p>
          <Alert className="mt-4 max-w-2xl">
            <Info className="h-4 w-4" />
            <AlertTitle>Onde aparece?</AlertTitle>
            <AlertDescription>
              Os pontos turísticos aparecem na <strong>homepage (seção Localização - Praia de Iracema)</strong>.
              A <strong>ordem</strong> define a posição na lista (menor número = primeiro). Apenas pontos <strong>ativos</strong> são exibidos.
              O <strong>código</strong> é usado internamente para identificar o ponto.
            </AlertDescription>
          </Alert>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => openDialog()}>
              <Plus className="h-4 w-4 mr-2" />
              Novo Ponto Turístico
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingItem ? "Editar Ponto Turístico" : "Novo Ponto Turístico"}
              </DialogTitle>
              <DialogDescription>
                Adicione ou edite informações sobre pontos turísticos próximos ao hotel
              </DialogDescription>
            </DialogHeader>
            <NearbyAttractionForm
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
              Nenhum ponto turístico cadastrado
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">Imagem</TableHead>
                  <TableHead>Código</TableHead>
                  <TableHead>Nome</TableHead>
                  <TableHead>Distância</TableHead>
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
                            alt={item.name || "Ponto turístico"}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <MapPin className="h-6 w-6 text-muted-foreground" />
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{item.code}</TableCell>
                    <TableCell>{item.name || "-"}</TableCell>
                    <TableCell>{item.distance || "-"}</TableCell>
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

function NearbyAttractionForm({
  item,
  onSuccess,
}: {
  item: NearbyAttractionItem | null;
  onSuccess: () => void;
}) {
  const [formData, setFormData] = useState({
    code: item?.code || "",
    name: item?.name || "",
    distance: item?.distance || "",
    imageUrl: item?.imageUrl || "",
    active: item?.active ?? true,
    order: item?.order || 0,
  });
  const [loading, setLoading] = useState(false);

  // Atualizar formData quando o item mudar
  useEffect(() => {
    if (item) {
      setFormData({
        code: item.code || "",
        name: item.name || "",
        distance: item.distance || "",
        imageUrl: item.imageUrl || "",
        active: item.active ?? true,
        order: item.order || 0,
      });
    } else {
      setFormData({
        code: "",
        name: "",
        distance: "",
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
      // Validar ID se estiver editando
      if (item && (!item.id || isNaN(Number(item.id)))) {
        toast.error("ID inválido para edição");
        setLoading(false);
        return;
      }

      const url = item ? `/api/nearby-attractions/${item.id}` : "/api/nearby-attractions";
      const method = item ? "PUT" : "POST";
      
      console.log("Editando item:", { id: item?.id, url, method });

      // Garantir que os dados estão no formato correto
      const payload = {
        code: formData.code.trim(),
        name: formData.name.trim(),
        distance: formData.distance.trim(),
        imageUrl: formData.imageUrl.trim(),
        active: formData.active,
        order: typeof formData.order === "number" ? formData.order : parseInt(String(formData.order || 0), 10) || 0,
        locale: "pt", // Sempre salvar em português primeiro
      };

      // Validação no cliente antes de enviar
      if (!payload.code || !payload.name || !payload.distance || !payload.imageUrl) {
        toast.error("Por favor, preencha todos os campos obrigatórios");
        setLoading(false);
        return;
      }

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        toast.success(
          item ? "Ponto turístico atualizado com sucesso" : "Ponto turístico criado com sucesso"
        );
        onSuccess();
      } else {
        const errorData = await response.json().catch(() => ({ error: "Erro desconhecido" }));
        const errorMessage = errorData.error || errorData.details || "Erro ao salvar ponto turístico";
        toast.error(errorMessage, {
          duration: 5000,
        });
        console.error("Erro na resposta:", errorData);
      }
    } catch (error: any) {
      console.error("Erro ao salvar ponto turístico:", error);
      toast.error(error?.message || "Erro ao salvar ponto turístico");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-4">
        <div className="space-y-2">
          <Label htmlFor="code">Código *</Label>
          <Input
            id="code"
            value={formData.code}
            onChange={(e) => setFormData({ ...formData, code: e.target.value })}
            placeholder="Ex: iracema, ponte-ingleses, dragao-mar, orla-fortaleza"
            required
            disabled={!!item} // Não permite editar código após criar
          />
          <p className="text-xs text-muted-foreground">
            Código único para identificar o ponto turístico (não pode ser alterado após criação)
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="name">Nome *</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Ex: Praia de Iracema"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="distance">Distância *</Label>
          <Input
            id="distance"
            value={formData.distance}
            onChange={(e) => setFormData({ ...formData, distance: e.target.value })}
            placeholder="Ex: Em frente ao hotel, 5 minutos a pé, 10 minutos a pé"
            required
          />
        </div>

        <ImageUpload
          value={formData.imageUrl}
          onChange={(url) => setFormData({ ...formData, imageUrl: url })}
          folder="nearby-attractions"
          label="Imagem *"
          required
        />

        {/* Prévia Visual */}
        {formData.imageUrl && (
          <div className="mt-4">
            <ImagePreview
              imageUrl={formData.imageUrl}
              type="gallery"
              title={formData.name || undefined}
              category="localizacao"
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
              onChange={(e) => {
                const value = e.target.value === "" ? 0 : parseInt(e.target.value, 10);
                setFormData({ ...formData, order: isNaN(value) ? 0 : value });
              }}
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

      <DialogFooter>
        <Button type="submit" disabled={loading}>
          {loading ? "Salvando..." : item ? "Atualizar" : "Criar"}
        </Button>
      </DialogFooter>
    </form>
  );
}

