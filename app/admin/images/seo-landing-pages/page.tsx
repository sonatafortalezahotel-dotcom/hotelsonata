"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Search, Image as ImageIcon, Globe, TrendingUp } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface SeoLandingPage {
  id: number;
  slug: string;
  locale: string;
  title: string;
  description: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function SeoLandingPagesImagesPage() {
  const router = useRouter();
  const [landingPages, setLandingPages] = useState<SeoLandingPage[]>([]);
  const [filteredPages, setFilteredPages] = useState<SeoLandingPage[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [localeFilter, setLocaleFilter] = useState<string>("all");
  const [activeFilter, setActiveFilter] = useState<string>("all");

  useEffect(() => {
    loadLandingPages();
  }, []);

  useEffect(() => {
    filterPages();
  }, [searchTerm, localeFilter, activeFilter, landingPages]);

  const loadLandingPages = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/seo-landing-pages");
      const data = await response.json();
      const pages = Array.isArray(data.data) ? data.data : Array.isArray(data) ? data : [];
      setLandingPages(pages);
    } catch (error) {
      console.error("Erro ao carregar landing pages:", error);
      toast.error("Erro ao carregar landing pages");
    } finally {
      setLoading(false);
    }
  };

  const filterPages = () => {
    let filtered = [...landingPages];

    // Filtro por busca
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (page) =>
          page.title.toLowerCase().includes(term) ||
          page.slug.toLowerCase().includes(term) ||
          page.description.toLowerCase().includes(term)
      );
    }

    // Filtro por locale
    if (localeFilter !== "all") {
      filtered = filtered.filter((page) => page.locale === localeFilter);
    }

    // Filtro por status ativo
    if (activeFilter === "active") {
      filtered = filtered.filter((page) => page.active);
    } else if (activeFilter === "inactive") {
      filtered = filtered.filter((page) => !page.active);
    }

    setFilteredPages(filtered);
  };

  const getLocaleLabel = (locale: string) => {
    const labels: Record<string, string> = {
      pt: "🇧🇷 Português",
      es: "🇪🇸 Español",
      en: "🇬🇧 English",
    };
    return labels[locale] || locale;
  };


  if (loading) {
    return (
      <div className="space-y-6">
        <div className="text-center text-muted-foreground py-12">
          Carregando landing pages...
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Button
            variant="ghost"
            onClick={() => router.push("/admin/images")}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
          <h1 className="text-3xl font-bold mb-2">Imagens - SEO Landing Pages</h1>
          <p className="text-muted-foreground">
            Selecione uma landing page de SEO para gerenciar suas imagens.
          </p>
        </div>
      </div>

      {/* Filtros */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por título, slug ou descrição..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={localeFilter} onValueChange={setLocaleFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Todos os idiomas" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os idiomas</SelectItem>
                <SelectItem value="pt">🇧🇷 Português</SelectItem>
                <SelectItem value="es">🇪🇸 Español</SelectItem>
                <SelectItem value="en">🇬🇧 English</SelectItem>
              </SelectContent>
            </Select>
            <Select value={activeFilter} onValueChange={setActiveFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Todos os status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os status</SelectItem>
                <SelectItem value="active">Apenas ativas</SelectItem>
                <SelectItem value="inactive">Apenas inativas</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Landing Pages */}
      {filteredPages.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center text-muted-foreground py-12">
              {searchTerm || localeFilter !== "all" || activeFilter !== "all"
                ? "Nenhuma landing page encontrada com os filtros aplicados."
                : "Nenhuma landing page cadastrada. Crie uma em /admin/seo"}
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPages.map((page) => (
            <Card key={page.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between mb-4">
                  <div className="p-3 bg-emerald-600 rounded-lg text-white">
                    <TrendingUp className="h-6 w-6" />
                  </div>
                  <div className="flex flex-col gap-2 items-end">
                    <Badge variant={page.active ? "default" : "secondary"}>
                      {page.active ? "Ativa" : "Inativa"}
                    </Badge>
                    <Badge variant="outline">{getLocaleLabel(page.locale)}</Badge>
                  </div>
                </div>
                <CardTitle className="text-xl line-clamp-2">{page.title}</CardTitle>
                <CardDescription className="line-clamp-2">{page.description}</CardDescription>
                <div className="mt-2">
                  <code className="text-xs bg-muted px-2 py-1 rounded">
                    /{page.slug}
                  </code>
                </div>
              </CardHeader>
              <CardContent>
                <Button
                  className="w-full"
                  variant="outline"
                  onClick={() =>
                    router.push(`/admin/images/seo-landing-pages/${page.slug}`)
                  }
                >
                  <ImageIcon className="h-4 w-4 mr-2" />
                  Gerenciar Imagens
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Card className="bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-900">
        <CardHeader>
          <CardTitle className="text-lg">ℹ️ Como funciona?</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <p>
            <strong className="text-foreground">Landing Pages de SEO:</strong> Estas são páginas
            dinâmicas criadas para otimização de busca. Cada landing page pode ter imagens
            específicas.
          </p>
          <p>
            <strong className="text-foreground">Gerenciamento de Imagens:</strong> Selecione uma
            landing page para gerenciar suas imagens. Você pode adicionar imagens para hero,
            galerias e outras seções.
          </p>
          <p>
            <strong className="text-foreground">Criar Landing Pages:</strong> Para criar novas
            landing pages, acesse <strong>/admin/seo</strong> no menu administrativo.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

