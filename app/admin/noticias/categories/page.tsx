"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ArrowLeft, Plus, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Switch } from "@/components/ui/switch";

interface Category {
  id: number;
  slug: string;
  name: string;
  postCount?: number;
  order?: number;
  active?: boolean;
}

export default function AdminBlogCategoriesPage() {
  const [items, setItems] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [slug, setSlug] = useState("");
  const [namePt, setNamePt] = useState("");
  const [editSlug, setEditSlug] = useState("");
  const [editNamePt, setEditNamePt] = useState("");
  const [editOrder, setEditOrder] = useState(0);
  const [editActive, setEditActive] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    try {
      const res = await fetch("/api/noticias/categories?locale=pt&count=true&all=true");
      const data = await res.json();
      setItems(Array.isArray(data) ? data : []);
    } catch (error) {
      toast.error("Erro ao carregar categorias");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!slug.trim() || !namePt.trim()) {
      toast.error("Slug e nome (PT) são obrigatórios");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/noticias/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slug: slug.trim().toLowerCase().replace(/\s+/g, "-"),
          order: 0,
          active: true,
          translations: { pt: { name: namePt.trim() } },
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        toast.error(data.error || "Erro ao criar categoria");
        return;
      }
      toast.success("Categoria criada com sucesso");
      setDialogOpen(false);
      setSlug("");
      setNamePt("");
      load();
    } catch (error) {
      toast.error("Erro ao criar categoria");
    } finally {
      setSubmitting(false);
    }
  };

  const openEdit = (cat: Category) => {
    setEditingId(cat.id);
    setEditSlug(cat.slug ?? "");
    setEditNamePt(cat.name ?? "");
    setEditOrder(cat.order ?? 0);
    setEditActive(cat.active ?? true);
    setEditOpen(true);
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingId) return;
    if (!editSlug.trim() || !editNamePt.trim()) {
      toast.error("Slug e nome (PT) são obrigatórios");
      return;
    }
    setUpdating(true);
    try {
      const res = await fetch(`/api/noticias/categories/${editingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slug: editSlug.trim().toLowerCase().replace(/\s+/g, "-"),
          order: Number.isFinite(editOrder) ? editOrder : 0,
          active: editActive,
          translations: { pt: { name: editNamePt.trim() } },
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        toast.error(data.error || "Erro ao atualizar categoria");
        return;
      }
      toast.success("Categoria atualizada com sucesso");
      setEditOpen(false);
      setEditingId(null);
      load();
    } catch (error) {
      toast.error("Erro ao atualizar categoria");
    } finally {
      setUpdating(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Tem certeza que deseja excluir esta categoria?")) return;
    try {
      const res = await fetch(`/api/noticias/categories/${id}`, { method: "DELETE" });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        toast.error(data.error || "Erro ao excluir categoria");
        return;
      }
      toast.success("Categoria excluída com sucesso");
      load();
    } catch (error) {
      toast.error("Erro ao excluir categoria");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/noticias">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">Categorias de notícias</h1>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="p-4 flex justify-end">
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Nova categoria
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Nova categoria</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label>Slug *</Label>
                    <Input
                      value={slug}
                      onChange={(e) => setSlug(e.target.value)}
                      placeholder="ex: novidades"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Nome (PT) *</Label>
                    <Input
                      value={namePt}
                      onChange={(e) => setNamePt(e.target.value)}
                      placeholder="ex: Novidades"
                      required
                    />
                  </div>
                  <Button type="submit" disabled={submitting}>
                    {submitting ? "Salvando..." : "Criar"}
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
            <Dialog open={editOpen} onOpenChange={setEditOpen}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Editar categoria</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleUpdate} className="space-y-4">
                  <div className="space-y-2">
                    <Label>Slug *</Label>
                    <Input
                      value={editSlug}
                      onChange={(e) => setEditSlug(e.target.value)}
                      placeholder="ex: novidades"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Nome (PT) *</Label>
                    <Input
                      value={editNamePt}
                      onChange={(e) => setEditNamePt(e.target.value)}
                      placeholder="ex: Novidades"
                      required
                    />
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label>Ordem</Label>
                      <Input
                        type="number"
                        value={editOrder}
                        onChange={(e) => setEditOrder(Number(e.target.value))}
                        min={0}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Ativa</Label>
                      <div className="flex items-center gap-2">
                        <Switch checked={editActive} onCheckedChange={setEditActive} />
                        <span className="text-sm text-muted-foreground">
                          {editActive ? "Sim" : "Não"}
                        </span>
                      </div>
                    </div>
                  </div>
                  <Button type="submit" disabled={updating}>
                    {updating ? "Salvando..." : "Salvar"}
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>
          {loading ? (
            <div className="p-8 text-center text-muted-foreground">
              Carregando...
            </div>
          ) : items.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">
              Nenhuma categoria cadastrada.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Slug</TableHead>
                  <TableHead>Nome</TableHead>
                  <TableHead>Posts</TableHead>
                  <TableHead>Ordem</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((cat) => (
                  <TableRow key={cat.id}>
                    <TableCell className="font-mono">{cat.slug}</TableCell>
                    <TableCell>{cat.name}</TableCell>
                    <TableCell>{cat.postCount ?? 0}</TableCell>
                    <TableCell>{cat.order ?? 0}</TableCell>
                    <TableCell>{cat.active ? "Ativa" : "Inativa"}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" onClick={() => openEdit(cat)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(cat.id)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
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
