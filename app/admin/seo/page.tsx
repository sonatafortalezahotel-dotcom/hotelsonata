"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Search,
  TrendingUp,
  Globe,
  FileText,
  Link as LinkIcon,
  Hash,
  Eye,
  CheckCircle2,
  AlertCircle,
  BarChart3,
  Zap,
  Target,
  Activity,
  ExternalLink,
  Filter,
  Download,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Pagination } from "@/components/ui/pagination";

interface SEOMetadata {
  total: number;
  byLocale: Record<string, number>;
}

interface LandingPage {
  id: number;
  slug: string;
  locale: string;
  title: string;
  description: string;
  keywords: string;
  active: boolean;
  viewCount: number;
  priority: string;
  changeFrequency: string;
  updatedAt: string;
}

interface KeywordStats {
  keyword: string;
  count: number;
  locale: string;
}

export default function SEOPage() {
  const [loading, setLoading] = useState(true);
  const [seoMetadata, setSeoMetadata] = useState<SEOMetadata>({
    total: 0,
    byLocale: {},
  });
  const [landingPages, setLandingPages] = useState<LandingPage[]>([]);
  const [filteredPages, setFilteredPages] = useState<LandingPage[]>([]);
  const [keywordStats, setKeywordStats] = useState<KeywordStats[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [localeFilter, setLocaleFilter] = useState<string>("all");
  const [activeFilter, setActiveFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(50);
  const [totalItems, setTotalItems] = useState(0);
  const [stats, setStats] = useState({
    totalPages: 0,
    activePages: 0,
    totalViews: 0,
    avgPriority: 0,
  });

  useEffect(() => {
    loadStats();
    loadLandingPages();
  }, []);

  useEffect(() => {
    setCurrentPage(1); // Reset para primeira página quando filtros mudarem
    loadLandingPages(); // Recarregar quando filtros mudarem
  }, [searchTerm, localeFilter, activeFilter]);

  useEffect(() => {
    loadLandingPages(); // Recarregar quando página ou itens por página mudarem
  }, [currentPage, itemsPerPage]);

  // Carregar estatísticas totais (uma vez, sem paginação)
  const loadStats = async () => {
    try {
      const statsRes = await fetch("/api/seo-landing-pages");
      const statsResponse = await statsRes.json();
      const allPages = statsResponse.data || statsResponse;

      // Calcular estatísticas
      const activePages = allPages.filter((p: LandingPage) => p.active);
      const totalViews = allPages.reduce(
        (sum: number, p: LandingPage) => sum + (p.viewCount || 0),
        0
      );
      const avgPriority =
        allPages.length > 0
          ? allPages.reduce(
              (sum: number, p: LandingPage) =>
                sum + parseFloat(p.priority || "0.7"),
              0
            ) / allPages.length
          : 0;

      setStats({
        totalPages: allPages.length,
        activePages: activePages.length,
        totalViews,
        avgPriority: Math.round(avgPriority * 100) / 100,
      });

      // Calcular estatísticas por locale
      const byLocale: Record<string, number> = {};
      allPages.forEach((p: LandingPage) => {
        byLocale[p.locale] = (byLocale[p.locale] || 0) + 1;
      });

      setSeoMetadata({
        total: allPages.length,
        byLocale,
      });

      // Extrair palavras-chave
      const keywordMap = new Map<string, { count: number; locale: string }>();
      allPages.forEach((p: LandingPage) => {
        if (p.keywords) {
          const keywords = p.keywords.split(",").map((k) => k.trim());
          keywords.forEach((keyword) => {
            const key = keyword.toLowerCase();
            const existing = keywordMap.get(key);
            if (existing) {
              keywordMap.set(key, {
                count: existing.count + 1,
                locale: p.locale,
              });
            } else {
              keywordMap.set(key, { count: 1, locale: p.locale });
            }
          });
        }
      });

      const keywords = Array.from(keywordMap.entries())
        .map(([keyword, data]) => ({
          keyword,
          count: data.count,
          locale: data.locale,
        }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 50);

      setKeywordStats(keywords);
    } catch (error) {
      console.error("Erro ao carregar estatísticas SEO:", error);
    }
  };

  // Carregar landing pages com paginação
  const loadLandingPages = async () => {
    try {
      setLoading(true);
      
      // Se há busca por texto, precisa carregar todas para filtrar
      // Caso contrário, usa paginação do servidor
      const needsFullLoad = searchTerm.length > 0;
      
      let allPages: LandingPage[] = [];
      let total = 0;
      
      if (needsFullLoad) {
        // Carregar todas as páginas para poder filtrar por texto
        const params = new URLSearchParams();
        if (localeFilter !== "all") {
          params.append("locale", localeFilter);
        }
        if (activeFilter !== "all") {
          params.append("active", activeFilter === "active" ? "true" : "false");
        }
        
        const pagesRes = await fetch(`/api/seo-landing-pages?${params.toString()}`);
        const response = await pagesRes.json();
        allPages = response.data || response;
        total = response.total || allPages.length;
        
        // Aplicar filtro de busca
        allPages = allPages.filter(
          (p: LandingPage) =>
            p.slug.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.keywords.toLowerCase().includes(searchTerm.toLowerCase())
        );
        
        total = allPages.length;
        
        // Aplicar paginação no cliente
        const offset = (currentPage - 1) * itemsPerPage;
        const paginated = allPages.slice(offset, offset + itemsPerPage);
        
        setLandingPages(paginated);
        setFilteredPages(paginated);
        setTotalItems(total);
      } else {
        // Paginação no servidor (mais eficiente)
        const offset = (currentPage - 1) * itemsPerPage;
        const params = new URLSearchParams({
          limit: itemsPerPage.toString(),
          offset: offset.toString(),
        });
        
        if (localeFilter !== "all") {
          params.append("locale", localeFilter);
        }
        
        if (activeFilter !== "all") {
          params.append("active", activeFilter === "active" ? "true" : "false");
        }
        
        const pagesRes = await fetch(`/api/seo-landing-pages?${params.toString()}`);
        const response = await pagesRes.json();
        
        const pages = response.data || response;
        total = response.total || 0;

        setLandingPages(pages);
        setFilteredPages(pages);
        setTotalItems(total);
      }
    } catch (error) {
      console.error("Erro ao carregar landing pages:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadData = async () => {
    await Promise.all([loadStats(), loadLandingPages()]);
  };


  const generatePages = async () => {
    try {
      const response = await fetch("/api/seo-landing-pages/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          keywords: [
            "hotel",
            "fortaleza",
            "vista mar",
            "praia de iracema",
            "beira mar",
            "piscina",
            "spa",
            "quartos",
            "reservas",
            "promoções",
          ],
          locale: "pt",
          template: "general",
        }),
      });

      const result = await response.json();
      alert(`Geradas ${result.generated} landing pages!`);
      // Recarregar estatísticas e páginas
      loadStats();
      setCurrentPage(1); // Voltar para primeira página
      loadLandingPages();
    } catch (error) {
      console.error("Erro ao gerar páginas:", error);
      alert("Erro ao gerar landing pages");
    }
  };

  const SITE_URL = process.env.NEXT_PUBLIC_APP_URL || "https://hotelsonata.com.br";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">SEO & Landing Pages</h1>
          <p className="text-muted-foreground">
            Gerencie o SEO do site e visualize milhares de URLs otimizadas
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            onClick={() => {
              loadStats();
              loadLandingPages();
            }} 
            variant="outline" 
            size="sm"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Atualizar
          </Button>
          <Button onClick={generatePages} size="sm">
            <Zap className="h-4 w-4 mr-2" />
            Gerar Landing Pages
          </Button>
        </div>
      </div>

      {/* Cards de Estatísticas */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 border-blue-500/20">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total de URLs</CardTitle>
            <LinkIcon className="h-5 w-5 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.totalPages}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Landing pages criadas
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-500/10 to-green-600/5 border-green-500/20">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Páginas Ativas</CardTitle>
            <CheckCircle2 className="h-5 w-5 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.activePages}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {stats.totalPages > 0
                ? Math.round((stats.activePages / stats.totalPages) * 100)
                : 0}
              % do total
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-500/10 to-purple-600/5 border-purple-500/20">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Visualizações</CardTitle>
            <Eye className="h-5 w-5 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {stats.totalViews.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Total de acessos
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-500/10 to-orange-600/5 border-orange-500/20">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Prioridade Média</CardTitle>
            <Target className="h-5 w-5 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.avgPriority}</div>
            <p className="text-xs text-muted-foreground mt-1">
              No sitemap
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="landing-pages">Landing Pages</TabsTrigger>
          <TabsTrigger value="keywords">Palavras-chave</TabsTrigger>
          <TabsTrigger value="basics">SEO Básico</TabsTrigger>
        </TabsList>

        {/* Tab: Visão Geral */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  Distribuição por Idioma
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {Object.entries(seoMetadata.byLocale).map(([locale, count]) => (
                    <div key={locale}>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium">
                          {locale === "pt"
                            ? "Português"
                            : locale === "en"
                            ? "Inglês"
                            : "Espanhol"}
                        </span>
                        <span className="text-sm text-muted-foreground">
                          {count} páginas
                        </span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div
                          className="bg-primary h-2 rounded-full transition-all"
                          style={{
                            width: `${
                              seoMetadata.total > 0
                                ? (count / seoMetadata.total) * 100
                                : 0
                            }%`,
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Status do Sistema
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-green-500/10 rounded-lg border border-green-500/20">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                    <span className="font-medium">Sitemap XML</span>
                  </div>
                  <Badge variant="outline" className="bg-green-500/10">
                    Ativo
                  </Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-green-500/10 rounded-lg border border-green-500/20">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                    <span className="font-medium">Robots.txt</span>
                  </div>
                  <Badge variant="outline" className="bg-green-500/10">
                    Configurado
                  </Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-green-500/10 rounded-lg border border-green-500/20">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                    <span className="font-medium">Structured Data</span>
                  </div>
                  <Badge variant="outline" className="bg-green-500/10">
                    Implementado
                  </Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-green-500/10 rounded-lg border border-green-500/20">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                    <span className="font-medium">Open Graph</span>
                  </div>
                  <Badge variant="outline" className="bg-green-500/10">
                    Completo
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Tab: Landing Pages */}
        <TabsContent value="landing-pages" className="space-y-4">
          {/* Filtros */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Filter className="h-5 w-5" />
                Filtros
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar por slug, título ou keywords..."
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
                    <SelectItem value="pt">Português</SelectItem>
                    <SelectItem value="en">Inglês</SelectItem>
                    <SelectItem value="es">Espanhol</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={activeFilter} onValueChange={setActiveFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="active">Apenas ativas</SelectItem>
                    <SelectItem value="inactive">Apenas inativas</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Lista de Landing Pages */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>
                    Landing Pages ({filteredPages.length} de {totalItems.toLocaleString()})
                  </CardTitle>
                  <CardDescription>
                    {totalItems > 0 
                      ? `Total de ${totalItems.toLocaleString()} URLs geradas para SEO`
                      : "Lista de todas as URLs geradas para SEO"}
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Select
                    value={itemsPerPage.toString()}
                    onValueChange={(value) => {
                      setItemsPerPage(parseInt(value));
                      setCurrentPage(1);
                    }}
                  >
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="25">25 por página</SelectItem>
                      <SelectItem value="50">50 por página</SelectItem>
                      <SelectItem value="100">100 por página</SelectItem>
                      <SelectItem value="200">200 por página</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Exportar
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {loading ? (
                  <div className="text-center py-8 text-muted-foreground">
                    Carregando...
                  </div>
                ) : filteredPages.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    Nenhuma landing page encontrada
                  </div>
                ) : (
                  <>
                    <div className="space-y-2">
                      {filteredPages.map((page) => (
                      <div
                        key={page.id}
                        className="p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <LinkIcon className="h-4 w-4 text-muted-foreground" />
                              <a
                                href={`${SITE_URL}/${page.locale !== "pt" ? `${page.locale}/` : ""}${page.slug}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="font-mono text-sm text-primary hover:underline flex items-center gap-1"
                              >
                                /{page.slug}
                                <ExternalLink className="h-3 w-3" />
                              </a>
                              <Badge
                                variant={
                                  page.active ? "default" : "secondary"
                                }
                              >
                                {page.active ? "Ativa" : "Inativa"}
                              </Badge>
                              <Badge variant="outline">{page.locale}</Badge>
                            </div>
                            <h3 className="font-semibold mb-1">{page.title}</h3>
                            <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                              {page.description}
                            </p>
                            <div className="flex flex-wrap gap-2 mb-2">
                              {page.keywords
                                .split(",")
                                .slice(0, 5)
                                .map((keyword, idx) => (
                                  <Badge
                                    key={idx}
                                    variant="outline"
                                    className="text-xs"
                                  >
                                    {keyword.trim()}
                                  </Badge>
                                ))}
                            </div>
                            <div className="flex items-center gap-4 text-xs text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <Eye className="h-3 w-3" />
                                {page.viewCount || 0} views
                              </span>
                              <span className="flex items-center gap-1">
                                <Target className="h-3 w-3" />
                                Prioridade: {page.priority}
                              </span>
                              <span>
                                Frequência: {page.changeFrequency}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                      ))}
                    </div>
                    
                    {/* Paginação */}
                    {totalItems > itemsPerPage && (
                      <div className="mt-4">
                        <Pagination
                          currentPage={currentPage}
                          totalPages={Math.ceil(totalItems / itemsPerPage)}
                          onPageChange={(page) => {
                            setCurrentPage(page);
                            window.scrollTo({ top: 0, behavior: "smooth" });
                          }}
                          itemsPerPage={itemsPerPage}
                          totalItems={totalItems}
                        />
                      </div>
                    )}
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab: Palavras-chave */}
        <TabsContent value="keywords" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Hash className="h-5 w-5" />
                Palavras-chave Mais Usadas
              </CardTitle>
              <CardDescription>
                Top 50 palavras-chave mais frequentes nas landing pages
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[500px]">
                <div className="space-y-2">
                  {keywordStats.map((stat, index) => (
                    <div
                      key={stat.keyword}
                      className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center gap-3 flex-1">
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-bold text-sm">
                          {index + 1}
                        </div>
                        <div className="flex-1">
                          <div className="font-medium">{stat.keyword}</div>
                          <div className="text-xs text-muted-foreground">
                            {stat.locale === "pt"
                              ? "Português"
                              : stat.locale === "en"
                              ? "Inglês"
                              : "Espanhol"}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <div className="font-bold text-lg">{stat.count}</div>
                          <div className="text-xs text-muted-foreground">
                            páginas
                          </div>
                        </div>
                        <div className="w-24 bg-muted rounded-full h-2">
                          <div
                            className="bg-primary h-2 rounded-full"
                            style={{
                              width: `${
                                keywordStats.length > 0
                                  ? (stat.count / keywordStats[0].count) * 100
                                  : 0
                              }%`,
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab: SEO Básico */}
        <TabsContent value="basics" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 border-blue-500/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-blue-600" />
                  Metadata
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Title Tags</span>
                  <Badge variant="outline" className="bg-green-500/10 flex items-center gap-1">
                    <CheckCircle2 className="h-3 w-3" />
                    Implementado
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Meta Descriptions</span>
                  <Badge variant="outline" className="bg-green-500/10 flex items-center gap-1">
                    <CheckCircle2 className="h-3 w-3" />
                    Implementado
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Keywords</span>
                  <Badge variant="outline" className="bg-green-500/10 flex items-center gap-1">
                    <CheckCircle2 className="h-3 w-3" />
                    Implementado
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Canonical URLs</span>
                  <Badge variant="outline" className="bg-green-500/10 flex items-center gap-1">
                    <CheckCircle2 className="h-3 w-3" />
                    Implementado
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-500/10 to-purple-600/5 border-purple-500/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-purple-600" />
                  Social Media
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Open Graph</span>
                  <Badge variant="outline" className="bg-green-500/10 flex items-center gap-1">
                    <CheckCircle2 className="h-3 w-3" />
                    Completo
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Twitter Cards</span>
                  <Badge variant="outline" className="bg-green-500/10 flex items-center gap-1">
                    <CheckCircle2 className="h-3 w-3" />
                    Completo
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">OG Images</span>
                  <Badge variant="outline" className="bg-green-500/10 flex items-center gap-1">
                    <CheckCircle2 className="h-3 w-3" />
                    Configurado
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-500/10 to-green-600/5 border-green-500/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-green-600" />
                  Structured Data
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Hotel Schema</span>
                  <Badge variant="outline" className="bg-green-500/10 flex items-center gap-1">
                    <CheckCircle2 className="h-3 w-3" />
                    Implementado
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">LocalBusiness</span>
                  <Badge variant="outline" className="bg-green-500/10 flex items-center gap-1">
                    <CheckCircle2 className="h-3 w-3" />
                    Implementado
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">BreadcrumbList</span>
                  <Badge variant="outline" className="bg-green-500/10 flex items-center gap-1">
                    <CheckCircle2 className="h-3 w-3" />
                    Implementado
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-orange-500/10 to-orange-600/5 border-orange-500/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5 text-orange-600" />
                  Internacionalização
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Hreflang Tags</span>
                  <Badge variant="outline" className="bg-green-500/10 flex items-center gap-1">
                    <CheckCircle2 className="h-3 w-3" />
                    PT, EN, ES
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">URLs Alternativas</span>
                  <Badge variant="outline" className="bg-green-500/10 flex items-center gap-1">
                    <CheckCircle2 className="h-3 w-3" />
                    Implementado
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Metadata Traduzida</span>
                  <Badge variant="outline" className="bg-green-500/10 flex items-center gap-1">
                    <CheckCircle2 className="h-3 w-3" />
                    Completo
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Links Úteis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-2 md:grid-cols-2">
                <a
                  href={`${SITE_URL}/sitemap.xml`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 p-3 border rounded-lg hover:bg-muted transition-colors"
                >
                  <FileText className="h-4 w-4" />
                  <span>Sitemap.xml</span>
                  <ExternalLink className="h-3 w-3 ml-auto" />
                </a>
                <a
                  href={`${SITE_URL}/robots.txt`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 p-3 border rounded-lg hover:bg-muted transition-colors"
                >
                  <FileText className="h-4 w-4" />
                  <span>Robots.txt</span>
                  <ExternalLink className="h-3 w-3 ml-auto" />
                </a>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

