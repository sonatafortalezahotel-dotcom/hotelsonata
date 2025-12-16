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
import { Plus, Pencil, Trash2, Package as PackageIcon, Info } from "lucide-react";
import { toast } from "sonner";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ImagePreview } from "@/components/admin/ImagePreview";

interface Package {
  id: number;
  name: string;
  description?: string;
  imageUrl: string;
  price?: number;
  startDate: string;
  endDate: string;
  active: boolean;
  order: number;
  category?: string;
}

export default function PackagesPage() {
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Package | null>(null);

  useEffect(() => {
    loadPackages();
  }, []);

  const loadPackages = async () => {
    try {
      const response = await fetch("/api/packages");
      const data = await response.json();
      setPackages(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Erro ao carregar pacotes:", error);
      toast.error("Erro ao carregar pacotes");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Tem certeza que deseja excluir este pacote?")) return;

    try {
      const response = await fetch(`/api/packages/${id}`, { method: "DELETE" });
      if (response.ok) {
        toast.success("Pacote excluído com sucesso");
        loadPackages();
      } else {
        toast.error("Erro ao excluir pacote");
      }
    } catch (error) {
      toast.error("Erro ao excluir pacote");
    }
  };

  const openDialog = (item?: Package) => {
    setEditingItem(item || null);
    setDialogOpen(true);
  };

  return (
    <div className="space-y-6 min-w-0 max-w-full">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div className="min-w-0 flex-1">
          <h1 className="text-3xl font-bold mb-2">Pacotes</h1>
          <p className="text-muted-foreground">
            Gerenciar pacotes e promoções do hotel
          </p>
          <Alert className="mt-4 max-w-2xl">
            <Info className="h-4 w-4" />
            <AlertTitle>Onde aparece?</AlertTitle>
            <AlertDescription>
              Os pacotes aparecem na <strong>seção "Pacotes Promocionais" da homepage</strong>.
              A <strong>ordem</strong> define a posição na grade (menor número = primeiro).
              Apenas pacotes <strong>ativos</strong> e dentro do <strong>período</strong> são exibidos.
            </AlertDescription>
          </Alert>
        </div>
        <div className="flex-shrink-0">
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => openDialog()}>
                <Plus className="h-4 w-4 mr-2" />
                Novo Pacote
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto overflow-x-hidden">
              <div className="min-w-0 max-w-full">
                <DialogHeader>
                  <DialogTitle>
                    {editingItem ? "Editar Pacote" : "Novo Pacote"}
                  </DialogTitle>
                  <DialogDescription>
                    Preencha as informações do pacote
                  </DialogDescription>
                </DialogHeader>
                <PackageForm
                  item={editingItem}
                  onSuccess={() => {
                    setDialogOpen(false);
                    loadPackages();
                  }}
                />
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="p-8 text-center text-muted-foreground">
              Carregando...
            </div>
          ) : packages.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">
              Nenhum pacote cadastrado
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[100px]">Imagem</TableHead>
                    <TableHead>Nome</TableHead>
                    <TableHead>Categoria</TableHead>
                    <TableHead>Preço</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {packages.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <div className="h-16 w-24 rounded overflow-hidden bg-muted">
                          {item.imageUrl ? (
                            <img
                              src={item.imageUrl}
                              alt={item.name}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="h-full w-full flex items-center justify-center">
                              <PackageIcon className="h-6 w-6 text-muted-foreground" />
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="font-medium max-w-[200px] truncate" title={item.name}>
                        {item.name}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {item.category || "-"}
                      </TableCell>
                      <TableCell>
                        {item.price
                          ? new Intl.NumberFormat("pt-BR", {
                              style: "currency",
                              currency: "BRL",
                            }).format(item.price)
                          : "-"}
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
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function PackageForm({
  item,
  onSuccess,
}: {
  item: Package | null;
  onSuccess: () => void;
}) {
  const [formData, setFormData] = useState({
    name: item?.name || "",
    description: item?.description || "",
    imageUrl: item?.imageUrl || "",
    price: item?.price || 0,
    startDate: item?.startDate || "",
    endDate: item?.endDate || "",
    active: item?.active ?? true,
    order: item?.order || 0,
    category: item?.category || "",
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const url = item ? `/api/packages/${item.id}` : "/api/packages";
      const method = item ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast.success(
          item ? "Pacote atualizado com sucesso" : "Pacote criado com sucesso"
        );
        onSuccess();
      } else {
        toast.error("Erro ao salvar pacote");
      }
    } catch (error) {
      toast.error("Erro ao salvar pacote");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 min-w-0">
      <div className="grid gap-4 max-w-full min-w-0">
        <div className="space-y-2 min-w-0">
          <Label htmlFor="name">Nome *</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
        </div>

        <div className="space-y-2 min-w-0">
          <Label htmlFor="description">Descrição</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            rows={3}
            className="resize-none"
          />
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2 min-w-0">
            <ImageUpload
              value={formData.imageUrl}
              onChange={(url) => setFormData({ ...formData, imageUrl: url })}
              folder="packages"
              label="Imagem do Pacote"
              required
            />
          </div>

          <div className="space-y-2 min-w-0">
            <Label htmlFor="price">Preço (R$)</Label>
            <Input
              id="price"
              type="number"
              value={formData.price}
              onChange={(e) =>
                setFormData({ ...formData, price: parseFloat(e.target.value) })
              }
            />
          </div>
        </div>

        <div className="space-y-2 min-w-0">
          <Label htmlFor="category">Categoria</Label>
          <Select
            value={formData.category}
            onValueChange={(value) =>
              setFormData({ ...formData, category: value })
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Selecione uma categoria" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="cabana-kids">Cabana Kids</SelectItem>
              <SelectItem value="pet-friendly">Pet Friendly</SelectItem>
              <SelectItem value="day-use">Day Use</SelectItem>
              <SelectItem value="casamento">Casamento</SelectItem>
              <SelectItem value="eventos">Eventos</SelectItem>
              <SelectItem value="nupcias">Núpcias</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2 min-w-0">
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

          <div className="space-y-2 min-w-0">
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
          <div className="space-y-2 min-w-0">
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

          <div className="flex items-center space-x-2 pt-8 min-w-0">
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
          <div className="mt-4 min-w-0">
            <ImagePreview
              imageUrl={formData.imageUrl}
              type="package"
              title={formData.name}
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

