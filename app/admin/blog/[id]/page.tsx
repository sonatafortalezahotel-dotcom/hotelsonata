"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { ImageUpload, BlogRichTextEditor } from "@/components/admin";

export default function EditBlogPostPage() {
  const router = useRouter();
  const params = useParams();
  const id = Number(params?.id);
  const [categories, setCategories] = useState<{ id: number; slug: string; name: string }[]>([]);
  const [tags, setTags] = useState<{ id: number; slug: string; name: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newTagName, setNewTagName] = useState("");
  const [creatingCategory, setCreatingCategory] = useState(false);
  const [creatingTag, setCreatingTag] = useState(false);
  const [form, setForm] = useState({
    slug: "",
    locale: "pt",
    title: "",
    excerpt: "",
    content: "",
    featuredImageUrl: "",
    authorName: "",
    authorUrl: "",
    publishedAt: "",
    status: "draft",
    metaTitle: "",
    metaDescription: "",
    metaKeywords: "",
    ogImage: "",
    canonicalUrl: "",
    categoryIds: [] as number[],
    tagIds: [] as number[],
  });

  useEffect(() => {
    if (isNaN(id)) return;
    fetch(`/api/blog/${id}?locale=pt`)
      .then((r) => r.json())
      .then(async (post) => {
        if (post.error) {
          toast.error("Post não encontrado");
          return;
        }
        const locale = post.locale ?? "pt";
        setForm({
          slug: post.slug ?? "",
          locale,
          title: post.title ?? "",
          excerpt: post.excerpt ?? "",
          content: post.content ?? "",
          featuredImageUrl: post.featuredImageUrl ?? "",
          authorName: post.authorName ?? "",
          authorUrl: post.authorUrl ?? "",
          publishedAt: post.publishedAt
            ? new Date(post.publishedAt).toISOString().slice(0, 16)
            : "",
          status: post.status ?? "draft",
          metaTitle: post.metaTitle ?? "",
          metaDescription: post.metaDescription ?? "",
          metaKeywords: post.metaKeywords ?? "",
          ogImage: post.ogImage ?? "",
          canonicalUrl: post.canonicalUrl ?? "",
          categoryIds: (post.categories ?? []).map((c: { id: number }) => c.id),
          tagIds: (post.tags ?? []).map((t: { id: number }) => t.id),
        });
        const [cats, tagsData] = await Promise.all([
          fetch(`/api/blog/categories?locale=${locale}`).then((r) => r.json()),
          fetch(`/api/blog/tags?locale=${locale}`).then((r) => r.json()),
        ]);
        setCategories(cats);
        setTags(tagsData);
      })
      .catch(() => toast.error("Erro ao carregar post"))
      .finally(() => setFetching(false));
  }, [id]);

  const locale = form.locale;

  const createCategoryAndSelect = async () => {
    const name = newCategoryName.trim();
    if (!name) {
      toast.error("Digite o nome da categoria");
      return;
    }
    setCreatingCategory(true);
    try {
      const slug = name.toLowerCase().trim().replace(/\s+/g, "-").replace(/[^a-z0-9\-àáâãäåèéêëìíîòóôõöùúûüç]/gi, "") || "nova-categoria";
      const res = await fetch("/api/blog/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slug,
          translations: { [locale]: { name } },
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        toast.error(data.error || "Erro ao criar categoria");
        return;
      }
      const created = await res.json();
      const list = await fetch(`/api/blog/categories?locale=${locale}`).then((r) => r.json());
      setCategories(list);
      setForm((f) => ({ ...f, categoryIds: [created.id] }));
      setNewCategoryName("");
      toast.success("Categoria criada e selecionada");
    } catch {
      toast.error("Erro ao criar categoria");
    } finally {
      setCreatingCategory(false);
    }
  };

  const createTagAndSelect = async () => {
    const name = newTagName.trim();
    if (!name) {
      toast.error("Digite o nome da tag");
      return;
    }
    setCreatingTag(true);
    try {
      const slug = name.toLowerCase().trim().replace(/\s+/g, "-").replace(/[^a-z0-9\-àáâãäåèéêëìíîòóôõöùúûüç]/gi, "") || "nova-tag";
      const res = await fetch("/api/blog/tags", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slug,
          translations: { [locale]: { name } },
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        toast.error(data.error || "Erro ao criar tag");
        return;
      }
      const created = await res.json();
      const list = await fetch(`/api/blog/tags?locale=${locale}`).then((r) => r.json());
      setTags(list);
      setForm((f) => ({ ...f, tagIds: [created.id] }));
      setNewTagName("");
      toast.success("Tag criada e selecionada");
    } catch {
      toast.error("Erro ao criar tag");
    } finally {
      setCreatingTag(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title) {
      toast.error("Título é obrigatório");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`/api/blog/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          categoryIds: form.categoryIds,
          tagIds: form.tagIds,
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        toast.error(data.error || "Erro ao atualizar post");
        return;
      }
      toast.success("Post atualizado com sucesso");
      router.refresh();
    } catch (error) {
      toast.error("Erro ao atualizar post");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-muted-foreground">Carregando...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/blog">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">Editar post</h1>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Conteúdo</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="title">Título *</Label>
                    <Input
                      id="title"
                      value={form.title}
                      onChange={(e) => setForm({ ...form, title: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="slug">Slug (URL)</Label>
                    <Input
                      id="slug"
                      value={form.slug}
                      onChange={(e) => setForm({ ...form, slug: e.target.value })}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="excerpt">Resumo</Label>
                  <Textarea
                    id="excerpt"
                    value={form.excerpt}
                    onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
                    rows={2}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="content">Conteúdo</Label>
                  <BlogRichTextEditor
                    value={form.content}
                    onChange={(content) => setForm({ ...form, content })}
                    placeholder="Escreva o conteúdo do post…"
                    minHeight="320px"
                  />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Imagem de destaque</Label>
                    <ImageUpload
                      value={form.featuredImageUrl}
                      onChange={(url) => setForm({ ...form, featuredImageUrl: url })}
                      folder="blog"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Autor</Label>
                    <Input
                      value={form.authorName}
                      onChange={(e) => setForm({ ...form, authorName: e.target.value })}
                      placeholder="Nome do autor"
                    />
                    <Input
                      value={form.authorUrl}
                      onChange={(e) => setForm({ ...form, authorUrl: e.target.value })}
                      placeholder="URL (opcional)"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Publicação</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Idioma</Label>
                  <Select
                    value={form.locale}
                    onValueChange={(v) => setForm({ ...form, locale: v })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pt">Português</SelectItem>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="es">Español</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Status</Label>
                  <Select
                    value={form.status}
                    onValueChange={(v) => setForm({ ...form, status: v })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Rascunho</SelectItem>
                      <SelectItem value="published">Publicado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Data de publicação</Label>
                  <Input
                    type="datetime-local"
                    value={form.publishedAt}
                    onChange={(e) => setForm({ ...form, publishedAt: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Categorias</Label>
                  <Select
                    value={form.categoryIds[0]?.toString() ?? ""}
                    onValueChange={(v) =>
                      setForm({
                        ...form,
                        categoryIds: v ? [Number(v)] : [],
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((c) => (
                        <SelectItem key={c.id} value={String(c.id)}>
                          {c.name || c.slug}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Nova categoria…"
                      value={newCategoryName}
                      onChange={(e) => setNewCategoryName(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), createCategoryAndSelect())}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={createCategoryAndSelect}
                      disabled={creatingCategory || !newCategoryName.trim()}
                    >
                      {creatingCategory ? "…" : "Criar e selecionar"}
                    </Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Tags</Label>
                  <Select
                    value={form.tagIds[0]?.toString() ?? ""}
                    onValueChange={(v) =>
                      setForm({
                        ...form,
                        tagIds: v ? [Number(v)] : [],
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      {tags.map((t) => (
                        <SelectItem key={t.id} value={String(t.id)}>
                          {t.name || t.slug}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Nova tag…"
                      value={newTagName}
                      onChange={(e) => setNewTagName(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), createTagAndSelect())}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={createTagAndSelect}
                      disabled={creatingTag || !newTagName.trim()}
                    >
                      {creatingTag ? "…" : "Criar e selecionar"}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>SEO</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Meta título</Label>
                  <Input
                    value={form.metaTitle}
                    onChange={(e) => setForm({ ...form, metaTitle: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Meta descrição</Label>
                  <Textarea
                    value={form.metaDescription}
                    onChange={(e) => setForm({ ...form, metaDescription: e.target.value })}
                    rows={2}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Meta keywords</Label>
                  <Input
                    value={form.metaKeywords}
                    onChange={(e) => setForm({ ...form, metaKeywords: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Imagem OG</Label>
                  <ImageUpload
                    value={form.ogImage}
                    onChange={(url) => setForm({ ...form, ogImage: url })}
                    folder="blog"
                  />
                </div>
                <div className="space-y-2">
                  <Label>URL canônica</Label>
                  <Input
                    value={form.canonicalUrl}
                    onChange={(e) => setForm({ ...form, canonicalUrl: e.target.value })}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="mt-6 flex gap-4">
          <Button type="submit" disabled={loading}>
            {loading ? "Salvando..." : "Salvar"}
          </Button>
          <Link href="/admin/blog">
            <Button type="button" variant="outline">
              Cancelar
            </Button>
          </Link>
        </div>
      </form>
    </div>
  );
}
