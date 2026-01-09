"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
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
import { Plus, Pencil, Trash2, Bed, Info, X } from "lucide-react";
import { toast } from "sonner";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { GalleryUpload } from "@/components/admin/GalleryUpload";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ImagePreview } from "@/components/admin/ImagePreview";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";

interface Room {
  id: number;
  code: string;
  name: string;
  description?: string;
  shortDescription?: string;
  imageUrl: string;
  gallery?: string[] | null;
  size: number;
  maxGuests: number;
  hasSeaView: boolean;
  hasBalcony: boolean;
  amenities?: string[] | null;
  basePrice?: number;
  active: boolean;
  order?: number;
}

export default function RoomsPage() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Room | null>(null);

  useEffect(() => {
    loadRooms();
  }, []);

  const loadRooms = async () => {
    try {
      const response = await fetch("/api/rooms?locale=pt");
      const data = await response.json();
      setRooms(Array.isArray(data) ? data : []);
    } catch (error) {
      toast.error("Erro ao carregar quartos");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Tem certeza que deseja excluir este quarto?")) return;

    try {
      const response = await fetch(`/api/rooms/${id}`, { method: "DELETE" });
      if (response.ok) {
        toast.success("Quarto excluído com sucesso");
        loadRooms();
      } else {
        toast.error("Erro ao excluir quarto");
      }
    } catch (error) {
      toast.error("Erro ao excluir quarto");
    }
  };

  const openDialog = (item?: Room) => {
    setEditingItem(item || null);
    setDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Quartos</h1>
          <p className="text-muted-foreground">
            Gerenciar acomodações do hotel
          </p>
          <Alert className="mt-4 max-w-2xl">
            <Info className="h-4 w-4" />
            <AlertTitle>Onde aparece?</AlertTitle>
            <AlertDescription>
              Os quartos aparecem na <strong>página /quartos</strong> e na <strong>homepage (card Quartos)</strong>.
              A <strong>imagem principal</strong> é usada no card e na listagem. A <strong>galeria</strong> aparece na página de detalhes do quarto.
              Apenas quartos <strong>ativos</strong> são exibidos. O <strong>código</strong> é usado na URL (ex: /quartos/standard).
            </AlertDescription>
          </Alert>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => openDialog()}>
              <Plus className="h-4 w-4 mr-2" />
              Novo Quarto
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingItem ? "Editar Quarto" : "Novo Quarto"}
              </DialogTitle>
              <DialogDescription>
                Preencha as informações do quarto
              </DialogDescription>
            </DialogHeader>
            <RoomForm
              item={editingItem}
              onSuccess={() => {
                setDialogOpen(false);
                loadRooms();
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
          ) : rooms.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">
              Nenhum quarto cadastrado
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Código</TableHead>
                  <TableHead>Nome</TableHead>
                  <TableHead>Tamanho</TableHead>
                  <TableHead>Hóspedes</TableHead>
                  <TableHead>Vista Mar</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rooms.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-mono">{item.code}</TableCell>
                    <TableCell className="font-medium">{item.name}</TableCell>
                    <TableCell>{item.size}m²</TableCell>
                    <TableCell>{item.maxGuests}</TableCell>
                    <TableCell>
                      {item.hasSeaView ? (
                        <span className="text-green-600">✓</span>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
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
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function RoomForm({
  item,
  onSuccess,
}: {
  item: Room | null;
  onSuccess: () => void;
}) {
  const [formData, setFormData] = useState({
    code: item?.code || "",
    name: item?.name || "",
    description: item?.description || "",
    shortDescription: item?.shortDescription || "",
    imageUrl: item?.imageUrl || "",
    gallery: (Array.isArray(item?.gallery) ? item.gallery : []) as string[],
    size: item?.size || 20,
    maxGuests: item?.maxGuests || 2,
    hasSeaView: item?.hasSeaView ?? true,
    hasBalcony: item?.hasBalcony ?? false,
    amenities: (Array.isArray(item?.amenities) ? item.amenities : []) as string[],
    basePrice: item?.basePrice || 0,
    active: item?.active ?? true,
    order: item?.order || 0,
  });
  const [newAmenity, setNewAmenity] = useState("");
  const [loading, setLoading] = useState(false);

  // Atualizar formData quando o item mudar
  useEffect(() => {
    if (item) {
      setFormData({
        code: item.code || "",
        name: item.name || "",
        description: item.description || "",
        shortDescription: item.shortDescription || "",
        imageUrl: item.imageUrl || "",
        gallery: Array.isArray(item.gallery) ? item.gallery : [],
        size: item.size || 20,
        maxGuests: item.maxGuests || 2,
        hasSeaView: item.hasSeaView ?? true,
        hasBalcony: item.hasBalcony ?? false,
        amenities: Array.isArray(item.amenities) ? item.amenities : [],
        basePrice: item.basePrice || 0, // Já vem em centavos do banco
        active: item.active ?? true,
        order: item.order || 0,
      });
    } else {
      setFormData({
        code: "",
        name: "",
        description: "",
        shortDescription: "",
        imageUrl: "",
        gallery: [],
        size: 20,
        maxGuests: 2,
        hasSeaView: true,
        hasBalcony: false,
        amenities: [],
        basePrice: 0,
        active: true,
        order: 0,
      });
    }
  }, [item]);

  const addAmenity = () => {
    if (newAmenity.trim() && !formData.amenities.includes(newAmenity.trim())) {
      setFormData({
        ...formData,
        amenities: [...formData.amenities, newAmenity.trim()],
      });
      setNewAmenity("");
    }
  };

  const removeAmenity = (index: number) => {
    setFormData({
      ...formData,
      amenities: formData.amenities.filter((_, i) => i !== index),
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const url = item ? `/api/rooms/${item.id}` : "/api/rooms";
      const method = item ? "PUT" : "POST";

      const payload = {
        ...formData,
        gallery: formData.gallery.length > 0 ? formData.gallery : null,
        amenities: formData.amenities.length > 0 ? formData.amenities : null,
        basePrice: formData.basePrice || null, // Já está em centavos (convertido no onChange)
        locale: "pt", // Sempre salvar em português primeiro
      };

      // Debug: log do payload
      console.log("Payload sendo enviado:", payload);

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        toast.success(
          item ? "Quarto atualizado com sucesso" : "Quarto criado com sucesso"
        );
        onSuccess();
      } else {
        const errorData = await response.json().catch(() => ({}));
        console.error("Erro na resposta:", response.status, errorData);
        const errorMessage = errorData.error || `Erro ${response.status}: ${response.statusText}`;
        toast.error(errorMessage);
      }
    } catch (error) {
      console.error("Erro ao salvar quarto:", error);
      toast.error("Erro ao salvar quarto");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-4">
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Label htmlFor="code">Código *</Label>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="h-3 w-3 text-muted-foreground cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="text-xs">O código é usado na URL (ex: /quartos/standard). Use apenas letras minúsculas e hífens.</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <Input
              id="code"
              value={formData.code}
              onChange={(e) => setFormData({ ...formData, code: e.target.value })}
              required
              placeholder="standard, luxo, suite-luxo"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="name">Nome *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="shortDescription">Descrição Curta</Label>
          <Textarea
            id="shortDescription"
            value={formData.shortDescription}
            onChange={(e) =>
              setFormData({ ...formData, shortDescription: e.target.value })
            }
            rows={2}
            placeholder="Breve descrição que aparece nos cards (opcional)"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Descrição Completa</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            rows={5}
            placeholder="Descrição detalhada do quarto"
          />
        </div>

        <ImageUpload
          value={formData.imageUrl}
          onChange={(url) => setFormData({ ...formData, imageUrl: url })}
          folder="rooms"
          label="Imagem Principal do Quarto"
          required
        />

        {/* Prévia Visual da Imagem Principal */}
        {formData.imageUrl && (
          <div className="mt-4">
            <ImagePreview
              imageUrl={formData.imageUrl}
              type="gallery"
              title={formData.name}
              category="quarto"
            />
          </div>
        )}

        <GalleryUpload
          value={formData.gallery}
          onChange={(urls) => setFormData({ ...formData, gallery: urls })}
          folder="rooms"
          label="Galeria de Imagens do Quarto"
          maxImages={20}
        />

        <div className="grid md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="size">Tamanho (m²) *</Label>
            <Input
              id="size"
              type="number"
              value={formData.size}
              onChange={(e) => {
                const value = parseInt(e.target.value) || 0;
                setFormData({ ...formData, size: value });
              }}
              required
              min="0"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="maxGuests">Hóspedes *</Label>
            <Input
              id="maxGuests"
              type="number"
              value={formData.maxGuests}
              onChange={(e) => {
                const value = parseInt(e.target.value) || 1;
                setFormData({ ...formData, maxGuests: value });
              }}
              required
              min="1"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="basePrice">Preço Base (R$)</Label>
            <Input
              id="basePrice"
              type="number"
              value={formData.basePrice ? (formData.basePrice / 100) : ""}
              onChange={(e) => {
                const value = parseFloat(e.target.value) || 0;
                setFormData({ ...formData, basePrice: Math.round(value * 100) }); // Armazenar em centavos
              }}
              min="0"
              step="0.01"
              placeholder="250.00"
            />
            <p className="text-xs text-muted-foreground">
              Digite o valor em reais (ex: 250.00). Será convertido para centavos automaticamente.
            </p>
          </div>
        </div>

        {/* Amenidades */}
        <div className="space-y-2">
          <Label htmlFor="amenities">Amenidades</Label>
          <div className="flex gap-2">
            <Input
              id="amenities"
              value={newAmenity}
              onChange={(e) => setNewAmenity(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addAmenity();
                }
              }}
              placeholder="Ex: WiFi, Ar Condicionado, TV Smart..."
            />
            <Button
              type="button"
              onClick={addAmenity}
              variant="outline"
              disabled={!newAmenity.trim()}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          {formData.amenities.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2 p-3 border rounded-lg bg-muted/50">
              {formData.amenities.map((amenity, index) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="flex items-center gap-1 pr-1"
                >
                  {amenity}
                  <button
                    type="button"
                    onClick={() => removeAmenity(index)}
                    className="ml-1 hover:bg-destructive/20 rounded-full p-0.5"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          )}
          <p className="text-xs text-muted-foreground">
            Adicione as amenidades do quarto. Pressione Enter ou clique no botão + para adicionar.
          </p>
        </div>

        {/* Ordem */}
        <div className="space-y-2">
          <Label htmlFor="order">Ordem de Exibição</Label>
          <Input
            id="order"
            type="number"
            value={formData.order}
            onChange={(e) => {
              const value = parseInt(e.target.value) || 0;
              setFormData({ ...formData, order: value });
            }}
            min="0"
          />
          <p className="text-xs text-muted-foreground">
            Quartos com menor número aparecem primeiro na listagem.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          <div className="flex items-center space-x-2">
            <Switch
              id="hasSeaView"
              checked={formData.hasSeaView}
              onCheckedChange={(checked) =>
                setFormData({ ...formData, hasSeaView: checked })
              }
            />
            <Label htmlFor="hasSeaView">Vista Mar</Label>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="hasBalcony"
              checked={formData.hasBalcony}
              onCheckedChange={(checked) =>
                setFormData({ ...formData, hasBalcony: checked })
              }
            />
            <Label htmlFor="hasBalcony">Varanda</Label>
          </div>

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
      </div>

      <DialogFooter>
        <Button type="submit" disabled={loading}>
          {loading ? "Salvando..." : item ? "Atualizar" : "Criar"}
        </Button>
      </DialogFooter>
    </form>
  );
}

