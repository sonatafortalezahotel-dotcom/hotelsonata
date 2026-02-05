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
import { Plus, Pencil, Trash2, Info, Loader2 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { GalleryUpload } from "@/components/admin/GalleryUpload";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ImagePreview } from "@/components/admin/ImagePreview";
import { AmenitiesCombobox } from "@/components/admin/AmenitiesCombobox";
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

type RoomTranslation = {
  name: string;
  description: string;
  shortDescription: string | null;
  amenities: string[] | null;
};

type RoomFull = {
  id: number;
  code: string;
  imageUrl: string;
  gallery: string[] | null;
  size: number | null;
  maxGuests: number;
  hasSeaView: boolean;
  hasBalcony: boolean;
  basePrice: number | null;
  active: boolean;
  order: number;
  translations: {
    pt: RoomTranslation;
    es: RoomTranslation;
    en: RoomTranslation;
  };
};

function RoomForm({
  item,
  onSuccess,
}: {
  item: Room | null;
  onSuccess: () => void;
}) {
  const [roomFull, setRoomFull] = useState<RoomFull | null>(null);
  const [loadingFetch, setLoadingFetch] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("pt");

  // PT: dados completos do quarto (para novo ou edição PT)
  const [ptForm, setPtForm] = useState({
    code: "",
    name: "",
    description: "",
    shortDescription: "",
    imageUrl: "",
    gallery: [] as string[],
    size: 20,
    maxGuests: 2,
    hasSeaView: true,
    hasBalcony: false,
    amenities: [] as string[],
    basePrice: 0,
    active: true,
    order: 0,
  });
  // ES/EN: só textos (herdam estrutura do PT)
  const [esForm, setEsForm] = useState<RoomTranslation>({ name: "", description: "", shortDescription: null, amenities: null });
  const [enForm, setEnForm] = useState<RoomTranslation>({ name: "", description: "", shortDescription: null, amenities: null });

  useEffect(() => {
    if (!item) {
      setRoomFull(null);
      setPtForm({
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
      setEsForm({ name: "", description: "", shortDescription: null, amenities: null });
      setEnForm({ name: "", description: "", shortDescription: null, amenities: null });
      setActiveTab("pt");
      return;
    }
    setLoadingFetch(true);
    fetch(`/api/rooms/${item.id}`)
      .then((res) => res.ok ? res.json() : null)
      .then((data: RoomFull | null) => {
        if (data) {
          setRoomFull(data);
          const pt = data.translations.pt;
          setPtForm({
            code: data.code,
            name: pt.name,
            description: pt.description,
            shortDescription: pt.shortDescription || "",
            imageUrl: data.imageUrl,
            gallery: Array.isArray(data.gallery) ? data.gallery : [],
            size: data.size ?? 20,
            maxGuests: data.maxGuests,
            hasSeaView: data.hasSeaView,
            hasBalcony: data.hasBalcony,
            amenities: Array.isArray(pt.amenities) ? pt.amenities : [],
            basePrice: data.basePrice ?? 0,
            active: data.active,
            order: data.order,
          });
          setEsForm({
            name: data.translations.es.name,
            description: data.translations.es.description,
            shortDescription: data.translations.es.shortDescription,
            amenities: data.translations.es.amenities,
          });
          setEnForm({
            name: data.translations.en.name,
            description: data.translations.en.description,
            shortDescription: data.translations.en.shortDescription,
            amenities: data.translations.en.amenities,
          });
        } else {
          setRoomFull(null);
          setPtForm({
            code: item.code,
            name: item.name,
            description: item.description || "",
            shortDescription: item.shortDescription || "",
            imageUrl: item.imageUrl,
            gallery: Array.isArray(item.gallery) ? item.gallery : [],
            size: item.size || 20,
            maxGuests: item.maxGuests,
            hasSeaView: item.hasSeaView ?? true,
            hasBalcony: item.hasBalcony ?? false,
            amenities: Array.isArray(item.amenities) ? item.amenities : [],
            basePrice: item.basePrice ?? 0,
            active: item.active ?? true,
            order: item.order ?? 0,
          });
        }
      })
      .catch(() => toast.error("Erro ao carregar quarto"))
      .finally(() => setLoadingFetch(false));
  }, [item?.id]);

  const ptAmenities = ptForm.amenities || [];
  const esAmenitiesResolved = esForm.amenities && esForm.amenities.length === ptAmenities.length
    ? esForm.amenities
    : ptAmenities.map(() => "");
  const enAmenitiesResolved = enForm.amenities && enForm.amenities.length === ptAmenities.length
    ? enForm.amenities
    : ptAmenities.map(() => "");

  const handleSubmitPt = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const url = item ? `/api/rooms/${item.id}` : "/api/rooms";
      const method = item ? "PUT" : "POST";
      const payload = {
        ...ptForm,
        gallery: ptForm.gallery.length > 0 ? ptForm.gallery : null,
        amenities: ptForm.amenities.length > 0 ? ptForm.amenities : null,
        basePrice: ptForm.basePrice || null,
        locale: "pt",
      };
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (response.ok) {
        toast.success(item ? "Quarto (PT) atualizado" : "Quarto criado");
        onSuccess();
      } else {
        const err = await response.json().catch(() => ({}));
        toast.error(err.error || "Erro ao salvar");
      }
    } catch {
      toast.error("Erro ao salvar quarto");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitEs = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!item) return;
    setLoading(true);
    try {
      const response = await fetch(`/api/rooms/${item.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          locale: "es",
          name: esForm.name,
          description: esForm.description,
          shortDescription: esForm.shortDescription || null,
          amenities: esAmenitiesResolved.every((s) => s.trim() === "") ? null : esAmenitiesResolved,
        }),
      });
      if (response.ok) {
        toast.success("Tradução (ES) salva");
        onSuccess();
      } else {
        const err = await response.json().catch(() => ({}));
        toast.error(err.error || "Erro ao salvar");
      }
    } catch {
      toast.error("Erro ao salvar tradução");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitEn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!item) return;
    setLoading(true);
    try {
      const response = await fetch(`/api/rooms/${item.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          locale: "en",
          name: enForm.name,
          description: enForm.description,
          shortDescription: enForm.shortDescription || null,
          amenities: enAmenitiesResolved.every((s) => s.trim() === "") ? null : enAmenitiesResolved,
        }),
      });
      if (response.ok) {
        toast.success("Tradução (EN) salva");
        onSuccess();
      } else {
        const err = await response.json().catch(() => ({}));
        toast.error(err.error || "Erro ao salvar");
      }
    } catch {
      toast.error("Erro ao salvar tradução");
    } finally {
      setLoading(false);
    }
  };

  if (loadingFetch && item) {
    return (
      <div className="flex items-center justify-center py-12 gap-2 text-muted-foreground">
        <Loader2 className="h-5 w-5 animate-spin" />
        Carregando quarto...
      </div>
    );
  }

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="pt" className="gap-2">
          <span className="font-medium">PT</span>
          <span className="text-xs opacity-80 hidden sm:inline">Português</span>
        </TabsTrigger>
        <TabsTrigger value="es" className="gap-2" disabled={!item}>
          <span className="font-medium">ES</span>
          <span className="text-xs opacity-80 hidden sm:inline">Español</span>
        </TabsTrigger>
        <TabsTrigger value="en" className="gap-2" disabled={!item}>
          <span className="font-medium">EN</span>
          <span className="text-xs opacity-80 hidden sm:inline">English</span>
        </TabsTrigger>
      </TabsList>

      <TabsContent value="pt" className="mt-4">
        <form onSubmit={handleSubmitPt} className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Configure o quarto em português. Imagem, galeria, adicionais e opções são definidos aqui; ES e EN herdam a estrutura e só traduzem os textos.
          </p>
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
                        <p className="text-xs">Usado na URL (ex: /quartos/standard). Minúsculas e hífens.</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <Input
                  id="code"
                  value={ptForm.code}
                  onChange={(e) => setPtForm({ ...ptForm, code: e.target.value })}
                  required
                  placeholder="standard, luxo, suite-luxo"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="name">Nome *</Label>
                <Input
                  id="name"
                  value={ptForm.name}
                  onChange={(e) => setPtForm({ ...ptForm, name: e.target.value })}
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="shortDescription">Descrição curta</Label>
              <Textarea
                id="shortDescription"
                value={ptForm.shortDescription}
                onChange={(e) => setPtForm({ ...ptForm, shortDescription: e.target.value })}
                rows={2}
                placeholder="Breve descrição nos cards"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Descrição completa</Label>
              <Textarea
                id="description"
                value={ptForm.description}
                onChange={(e) => setPtForm({ ...ptForm, description: e.target.value })}
                rows={5}
              />
            </div>
            <ImageUpload
              value={ptForm.imageUrl}
              onChange={(url) => setPtForm({ ...ptForm, imageUrl: url })}
              folder="rooms"
              label="Imagem principal"
              required
            />
            {ptForm.imageUrl && (
              <div className="mt-2">
                <ImagePreview imageUrl={ptForm.imageUrl} type="gallery" title={ptForm.name} category="quarto" />
              </div>
            )}
            <GalleryUpload
              value={ptForm.gallery}
              onChange={(urls) => setPtForm({ ...ptForm, gallery: urls })}
              folder="rooms"
              label="Galeria"
              maxImages={20}
            />
            <div className="grid md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="size">Tamanho (m²)</Label>
                <Input
                  id="size"
                  type="number"
                  value={ptForm.size}
                  onChange={(e) => setPtForm({ ...ptForm, size: parseInt(e.target.value) || 0 })}
                  min={0}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="maxGuests">Hóspedes *</Label>
                <Input
                  id="maxGuests"
                  type="number"
                  value={ptForm.maxGuests}
                  onChange={(e) => setPtForm({ ...ptForm, maxGuests: parseInt(e.target.value) || 1 })}
                  min={1}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="basePrice">Preço base (R$)</Label>
                <Input
                  id="basePrice"
                  type="number"
                  value={ptForm.basePrice ? ptForm.basePrice / 100 : ""}
                  onChange={(e) => setPtForm({ ...ptForm, basePrice: Math.round((parseFloat(e.target.value) || 0) * 100) })}
                  min={0}
                  step={0.01}
                />
              </div>
            </div>
            <AmenitiesCombobox
              value={ptForm.amenities}
              onChange={(amenities) => setPtForm({ ...ptForm, amenities })}
              label="Adicionais (PT)"
              placeholder="Buscar ou adicionar..."
            />
            <div className="space-y-2">
              <Label htmlFor="order">Ordem</Label>
              <Input
                id="order"
                type="number"
                value={ptForm.order}
                onChange={(e) => setPtForm({ ...ptForm, order: parseInt(e.target.value) || 0 })}
                min={0}
              />
            </div>
            <div className="flex flex-wrap gap-6">
              <div className="flex items-center gap-2">
                <Switch
                  id="hasSeaView"
                  checked={ptForm.hasSeaView}
                  onCheckedChange={(c) => setPtForm({ ...ptForm, hasSeaView: c })}
                />
                <Label htmlFor="hasSeaView">Vista mar</Label>
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  id="hasBalcony"
                  checked={ptForm.hasBalcony}
                  onCheckedChange={(c) => setPtForm({ ...ptForm, hasBalcony: c })}
                />
                <Label htmlFor="hasBalcony">Varanda</Label>
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  id="active"
                  checked={ptForm.active}
                  onCheckedChange={(c) => setPtForm({ ...ptForm, active: c })}
                />
                <Label htmlFor="active">Ativo</Label>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={loading}>
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              {item ? "Atualizar PT" : "Criar quarto"}
            </Button>
          </DialogFooter>
        </form>
      </TabsContent>

      <TabsContent value="es" className="mt-4">
        {!item ? (
          <p className="text-sm text-muted-foreground py-4">
            Salve o quarto em PT primeiro para adicionar a tradução em espanhol.
          </p>
        ) : (
          <form onSubmit={handleSubmitEs} className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Só textos em espanhol. A lista de adicionais segue a mesma ordem do PT; preencha a tradução de cada um.
            </p>
            <div className="space-y-2">
              <Label htmlFor="es-name">Nome *</Label>
              <Input
                id="es-name"
                value={esForm.name}
                onChange={(e) => setEsForm({ ...esForm, name: e.target.value })}
                required
                placeholder="Ej: Habitación de Lujo"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="es-short">Descripción corta</Label>
              <Textarea
                id="es-short"
                value={esForm.shortDescription || ""}
                onChange={(e) => setEsForm({ ...esForm, shortDescription: e.target.value || null })}
                rows={2}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="es-desc">Descripción completa</Label>
              <Textarea
                id="es-desc"
                value={esForm.description}
                onChange={(e) => setEsForm({ ...esForm, description: e.target.value })}
                rows={5}
              />
            </div>
            {ptAmenities.length > 0 && (
              <div className="space-y-2">
                <Label>Adicionales (traducir en el mismo orden que PT)</Label>
                <div className="space-y-2">
                  {ptAmenities.map((ptLabel, i) => (
                    <div key={i} className="flex flex-col gap-1">
                      <span className="text-xs text-muted-foreground">PT: {ptLabel}</span>
                      <Input
                        value={esAmenitiesResolved[i] ?? ""}
                        onChange={(e) => {
                          const next = [...esAmenitiesResolved];
                          next[i] = e.target.value;
                          setEsForm({ ...esForm, amenities: next });
                        }}
                        placeholder="Traducción al español"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
            <DialogFooter>
              <Button type="submit" disabled={loading}>
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                Guardar ES
              </Button>
            </DialogFooter>
          </form>
        )}
      </TabsContent>

      <TabsContent value="en" className="mt-4">
        {!item ? (
          <p className="text-sm text-muted-foreground py-4">
            Salve o quarto em PT primeiro para adicionar a tradução em inglês.
          </p>
        ) : (
          <form onSubmit={handleSubmitEn} className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Só textos em inglês. A lista de adicionais segue a mesma ordem do PT; preencha a tradução de cada um.
            </p>
            <div className="space-y-2">
              <Label htmlFor="en-name">Name *</Label>
              <Input
                id="en-name"
                value={enForm.name}
                onChange={(e) => setEnForm({ ...enForm, name: e.target.value })}
                required
                placeholder="e.g. Luxury Room"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="en-short">Short description</Label>
              <Textarea
                id="en-short"
                value={enForm.shortDescription || ""}
                onChange={(e) => setEnForm({ ...enForm, shortDescription: e.target.value || null })}
                rows={2}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="en-desc">Full description</Label>
              <Textarea
                id="en-desc"
                value={enForm.description}
                onChange={(e) => setEnForm({ ...enForm, description: e.target.value })}
                rows={5}
              />
            </div>
            {ptAmenities.length > 0 && (
              <div className="space-y-2">
                <Label>Amenities (translate in same order as PT)</Label>
                <div className="space-y-2">
                  {ptAmenities.map((ptLabel, i) => (
                    <div key={i} className="flex flex-col gap-1">
                      <span className="text-xs text-muted-foreground">PT: {ptLabel}</span>
                      <Input
                        value={enAmenitiesResolved[i] ?? ""}
                        onChange={(e) => {
                          const next = [...enAmenitiesResolved];
                          next[i] = e.target.value;
                          setEnForm({ ...enForm, amenities: next });
                        }}
                        placeholder="English translation"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
            <DialogFooter>
              <Button type="submit" disabled={loading}>
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                Save EN
              </Button>
            </DialogFooter>
          </form>
        )}
      </TabsContent>
    </Tabs>
  );
}

