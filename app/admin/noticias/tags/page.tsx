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

interface Tag {
  id: number;
  slug: string;
  name: string;
  postCount?: number;
}

export default function AdminBlogTagsPage() {
  const [items, setItems] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [slug, setSlug] = useState("");
  const [namePt, setNamePt] = useState("");
  const [editSlug, setEditSlug] = useState("");
  const [editNamePt, setEditNamePt] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    try {
      const res = await fetch("/api/noticias/tags?locale=pt&count=true");
      const data = await res.json();
      setItems(Array.isArray(data) ? data : []);
    } catch (error) {
      toast.error("Erro ao carregar tags");
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
      const res = await fetch("/api/noticias/tags", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slug: slug.trim().toLowerCase().replace(/\s+/g, "-"),
          translations: { pt: { name: namePt.trim() } },
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        toast.error(data.error || "Erro ao criar tag");
        return;
      }
      toast.success("Tag criada com sucesso");
      setDialogOpen(false);
      setSlug("");
      setNamePt("");
      load();
    } catch (error) {
      toast.error("Erro ao criar tag");
    } finally {
      setSubmitting(false);
    }
  };

  const openEdit = (tag: Tag) => {
    setEditingId(tag.id);
    setEditSlug(tag.slug ?? "");
    setEditNamePt(tag.name ?? "");
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
      const res = await fetch(`/api/noticias/tags/${editingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slug: editSlug.trim().toLowerCase().replace(/\s+/g, "-"),
          translations: { pt: { name: editNamePt.trim() } },
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        toast.error(data.error || "Erro ao atualizar tag");
        return;
      }
      toast.success("Tag atualizada com sucesso");
      setEditOpen(false);
      setEditingId(null);
      load();
    } catch (error) {
      toast.error("Erro ao atualizar tag");
    } finally {
      setUpdating(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Tem certeza que deseja excluir esta tag?")) return;
    try {
      const res = await fetch(`/api/noticias/tags/${id}`, { method: "DELETE" });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        toast.error(data.error || "Erro ao excluir tag");
        return;
      }
      toast.success("Tag excluída com sucesso");
      load();
    } catch (error) {
      toast.error("Erro ao excluir tag");
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
        <h1 className="text-2xl font-bold">Tags de notícias</h1>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="p-4 flex justify-end">
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Nova tag
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Nova tag</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label>Slug *</Label>
                    <Input
                      value={slug}
                      onChange={(e) => setSlug(e.target.value)}
                      placeholder="ex: fortaleza"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Nome (PT) *</Label>
                    <Input
                      value={namePt}
                      onChange={(e) => setNamePt(e.target.value)}
                      placeholder="ex: Fortaleza"
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
                  <DialogTitle>Editar tag</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleUpdate} className="space-y-4">
                  <div className="space-y-2">
                    <Label>Slug *</Label>
                    <Input
                      value={editSlug}
                      onChange={(e) => setEditSlug(e.target.value)}
                      placeholder="ex: fortaleza"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Nome (PT) *</Label>
                    <Input
                      value={editNamePt}
                      onChange={(e) => setEditNamePt(e.target.value)}
                      placeholder="ex: Fortaleza"
                      required
                    />
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
              Nenhuma tag cadastrada.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Slug</TableHead>
                  <TableHead>Nome</TableHead>
                  <TableHead>Posts</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((tag) => (
                  <TableRow key={tag.id}>
                    <TableCell className="font-mono">{tag.slug}</TableCell>
                    <TableCell>{tag.name}</TableCell>
                    <TableCell>{tag.postCount ?? 0}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" onClick={() => openEdit(tag)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(tag.id)}
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
