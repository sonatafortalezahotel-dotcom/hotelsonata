"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Pencil, Trash2, FolderOpen, Tag } from "lucide-react";
import { toast } from "sonner";

interface BlogPost {
  id: number;
  slug: string;
  locale: string;
  title: string;
  status: string;
  publishedAt?: string | null;
  updatedAt: string;
}

export default function AdminBlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [localeFilter, setLocaleFilter] = useState<string>("all");

  useEffect(() => {
    loadPosts();
  }, [statusFilter, localeFilter]);

  const loadPosts = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      params.set("status", statusFilter);
      params.set("locale", localeFilter === "all" ? "all" : localeFilter);
      const res = await fetch(`/api/noticias?${params.toString()}`);
      const data = await res.json();
      setPosts(data.posts ?? []);
    } catch (error) {
      toast.error("Erro ao carregar posts");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Tem certeza que deseja excluir este post?")) return;
    try {
      const res = await fetch(`/api/noticias/${id}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("Post excluído com sucesso");
        loadPosts();
      } else {
        toast.error("Erro ao excluir post");
      }
    } catch (error) {
      toast.error("Erro ao excluir post");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">Blog</h1>
          <p className="text-muted-foreground">
            Gerenciar posts, categorias e tags de notícias.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/admin/noticias/categories">
            <Button variant="outline" size="sm">
              <FolderOpen className="h-4 w-4 mr-2" />
              Categorias
            </Button>
          </Link>
          <Link href="/admin/noticias/tags">
            <Button variant="outline" size="sm">
              <Tag className="h-4 w-4 mr-2" />
              Tags
            </Button>
          </Link>
          <Link href="/admin/noticias/new">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Novo post
            </Button>
          </Link>
        </div>
      </div>

      <div className="flex gap-4 flex-wrap">
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="published">Publicados</SelectItem>
            <SelectItem value="draft">Rascunho</SelectItem>
          </SelectContent>
        </Select>
        <Select value={localeFilter} onValueChange={setLocaleFilter}>
          <SelectTrigger className="w-[120px]">
            <SelectValue placeholder="Idioma" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="pt">PT</SelectItem>
            <SelectItem value="en">EN</SelectItem>
            <SelectItem value="es">ES</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="p-8 text-center text-muted-foreground">
              Carregando...
            </div>
          ) : posts.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">
              Nenhum post encontrado.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Título</TableHead>
                  <TableHead>Slug</TableHead>
                  <TableHead>Idioma</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Atualizado</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {posts.map((post) => (
                  <TableRow key={post.id}>
                    <TableCell className="font-medium">{post.title}</TableCell>
                    <TableCell className="text-muted-foreground">{post.slug}</TableCell>
                    <TableCell>{post.locale.toUpperCase()}</TableCell>
                    <TableCell>
                      <span
                        className={
                          post.status === "published"
                            ? "text-green-600"
                            : "text-muted-foreground"
                        }
                      >
                        {post.status === "published" ? "Publicado" : "Rascunho"}
                      </span>
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {post.updatedAt
                        ? new Date(post.updatedAt).toLocaleDateString("pt-BR")
                        : "-"}
                    </TableCell>
                    <TableCell className="text-right">
                      <Link href={`/noticias/${post.slug}`} target="_blank" rel="noopener">
                        <Button variant="ghost" size="sm">
                          Ver
                        </Button>
                      </Link>
                      <Link href={`/admin/noticias/${post.id}`}>
                        <Button variant="ghost" size="icon">
                          <Pencil className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(post.id)}
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
