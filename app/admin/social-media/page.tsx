"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus, Trash2, Instagram, Facebook, Twitter, Info } from "lucide-react";
import { toast } from "sonner";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ImagePreview } from "@/components/admin/ImagePreview";

interface SocialPost {
  id: number;
  platform: string;
  imageUrl: string;
  link?: string;
  active: boolean;
  order: number;
}

export default function SocialMediaPage() {
  const [posts, setPosts] = useState<SocialPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    try {
      const response = await fetch("/api/social-media");
      const data = await response.json();
      setPosts(Array.isArray(data) ? data : []);
    } catch (error) {
      toast.error("Erro ao carregar posts");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Tem certeza que deseja excluir este post?")) return;

    try {
      const response = await fetch(`/api/social-media/${id}`, { method: "DELETE" });
      if (response.ok) {
        toast.success("Post excluído com sucesso");
        loadPosts();
      } else {
        toast.error("Erro ao excluir post");
      }
    } catch (error) {
      toast.error("Erro ao excluir post");
    }
  };

  const getPlatformIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case "instagram":
        return <Instagram className="h-5 w-5" />;
      case "facebook":
        return <Facebook className="h-5 w-5" />;
      case "twitter":
        return <Twitter className="h-5 w-5" />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Redes Sociais</h1>
          <p className="text-muted-foreground">
            Gerenciar posts exibidos no feed do site
          </p>
          <Alert className="mt-4 max-w-2xl">
            <Info className="h-4 w-4" />
            <AlertTitle>Onde aparece?</AlertTitle>
            <AlertDescription>
              Os posts aparecem na <strong>seção "Nos Acompanhe nas Redes Sociais" da homepage</strong>.
              A <strong>ordem</strong> define a posição no grid (menor número = primeiro).
              Apenas posts <strong>ativos</strong> são exibidos.
              Use imagens quadradas (1:1) para melhor visualização.
            </AlertDescription>
          </Alert>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Novo Post
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Adicionar Post</DialogTitle>
              <DialogDescription>
                Adicionar post das redes sociais ao feed do site
              </DialogDescription>
            </DialogHeader>
            <SocialPostForm
              onSuccess={() => {
                setDialogOpen(false);
                loadPosts();
              }}
            />
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardContent className="p-6">
          {loading ? (
            <div className="text-center text-muted-foreground">
              Carregando...
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center text-muted-foreground">
              Nenhum post cadastrado
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {posts.map((post) => (
                <div key={post.id} className="relative group">
                  <div className="aspect-square rounded-lg overflow-hidden bg-muted">
                    <img
                      src={post.imageUrl}
                      alt="Post das redes sociais"
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="absolute top-2 left-2 bg-white rounded-full p-1.5 shadow-md">
                    {getPlatformIcon(post.platform)}
                  </div>
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={() => handleDelete(post.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function SocialPostForm({ onSuccess }: { onSuccess: () => void }) {
  const [formData, setFormData] = useState({
    platform: "Instagram",
    imageUrl: "",
    link: "",
    active: true,
    order: 0,
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/social-media", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast.success("Post adicionado com sucesso");
        onSuccess();
      } else {
        toast.error("Erro ao adicionar post");
      }
    } catch (error) {
      toast.error("Erro ao adicionar post");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-4">
        <div className="space-y-2">
          <Label htmlFor="platform">Plataforma *</Label>
          <Select
            value={formData.platform}
            onValueChange={(value) =>
              setFormData({ ...formData, platform: value })
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Instagram">Instagram</SelectItem>
              <SelectItem value="Facebook">Facebook</SelectItem>
              <SelectItem value="Twitter">Twitter</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <ImageUpload
          value={formData.imageUrl}
          onChange={(url) => setFormData({ ...formData, imageUrl: url })}
          folder="social-media"
          label="Imagem do Post"
          required
        />

        <div className="space-y-2">
          <Label htmlFor="link">Link do Post</Label>
          <Input
            id="link"
            type="url"
            value={formData.link}
            onChange={(e) => setFormData({ ...formData, link: e.target.value })}
            placeholder="https://instagram.com/p/..."
          />
        </div>

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
              type="social"
            />
          </div>
        )}
      </div>

      <DialogFooter>
        <Button type="submit" disabled={loading}>
          {loading ? "Salvando..." : "Adicionar"}
        </Button>
      </DialogFooter>
    </form>
  );
}

