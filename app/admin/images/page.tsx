"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Home,
  Waves,
  UtensilsCrossed,
  Leaf,
  Mail,
  TrendingUp,
  Bed,
  Calendar,
  ChevronDown,
  ChevronUp,
  Image as ImageIcon,
  Search,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { SectionBlockEditor } from "@/components/admin/SectionBlockEditor";
import { SectionBlockPreview } from "@/components/admin/SectionBlockPreview";
import { Eye } from "lucide-react";
import { toast } from "sonner";
import type { PageSection } from "@/lib/constants/page-sections";
import { getPageSections, isValidPage, type PageType } from "@/lib/constants/page-sections";

interface GalleryItem {
  id: number;
  title?: string;
  imageUrl: string;
  page?: string;
  section?: string;
  description?: string;
  category?: string;
  active: boolean;
  order: number;
}

interface CategoryGroup {
  id: string;
  name: string;
  description: string;
  icon: any;
  color: string;
  page?: PageType;
  sections: PageSection[];
  imageCount: number;
}

export default function ImagesAdminPage() {
  const [categories, setCategories] = useState<CategoryGroup[]>([]);
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [allItems, setAllItems] = useState<GalleryItem[]>([]);

  useEffect(() => {
    loadAllImages();
  }, []);

  useEffect(() => {
    updateCategoriesWithCounts();
  }, [allItems]);

  const loadAllImages = async () => {
    try {
      setLoading(true);
      // Buscar todas as imagens (ativas e inativas) para o admin
      const response = await fetch("/api/gallery?active=all");
      if (!response.ok) {
        throw new Error(`Erro ao buscar imagens: ${response.status}`);
      }
      const data = await response.json();
      setAllItems(Array.isArray(data) ? data : []);
      console.log(`Carregadas ${Array.isArray(data) ? data.length : 0} imagens no admin`);
    } catch (error) {
      console.error("Erro ao carregar imagens:", error);
      toast.error("Erro ao carregar imagens");
      setAllItems([]);
    } finally {
      setLoading(false);
    }
  };

  const updateCategoriesWithCounts = () => {
    const categoryGroups: CategoryGroup[] = [
  {
    id: "home",
        name: "Hotel / Home",
        description: "Página inicial e imagens gerais do hotel",
    icon: Home,
    color: "bg-blue-600",
        page: "home",
        sections: getPageSections("home"),
        imageCount: 0,
      },
      {
        id: "acomodacoes",
        name: "Acomodações",
        description: "Quartos e suítes (gerenciados em /admin/rooms)",
        icon: Bed,
        color: "bg-indigo-600",
        sections: [
          {
            id: "quarto-standard",
            name: "Quartos Standard",
            description: "⚠️ Gerenciado em /admin/rooms",
            whereAppears: "Página de Quartos - Quartos Standard (gerenciado em /admin/rooms)",
            recommendedImages: 0,
          },
          {
            id: "quarto-luxo",
            name: "Suítes Luxo",
            description: "⚠️ Gerenciado em /admin/rooms",
            whereAppears: "Página de Quartos - Suítes Luxo (gerenciado em /admin/rooms)",
            recommendedImages: 0,
          },
        ],
        imageCount: 0,
      },
      {
        id: "gastronomia",
        name: "Gastronomia",
        description: "Café da manhã, restaurante, bar e room service",
        icon: UtensilsCrossed,
        color: "bg-amber-600",
        page: "gastronomia",
        sections: getPageSections("gastronomia"),
        imageCount: 0,
  },
  {
    id: "lazer",
    name: "Lazer",
        description: "Piscina, academia, beach tennis, bike e spa",
    icon: Waves,
    color: "bg-cyan-600",
        page: "lazer",
        sections: getPageSections("lazer"),
        imageCount: 0,
      },
      {
        id: "eventos",
        name: "Eventos",
        description: "Eventos corporativos, casamentos e núpcias (gerenciados em /admin/events)",
        icon: Calendar,
        color: "bg-pink-600",
        sections: [
          {
            id: "evento-corporativo",
            name: "Eventos Corporativos",
            description: "⚠️ Gerenciado em /admin/events",
            whereAppears: "Página de Eventos - Eventos Corporativos (gerenciado em /admin/events)",
            recommendedImages: 0,
          },
          {
            id: "evento-casamento",
            name: "Casamentos",
            description: "⚠️ Gerenciado em /admin/events",
            whereAppears: "Página de Eventos - Casamentos (gerenciado em /admin/events)",
            recommendedImages: 0,
          },
          {
            id: "evento-nupcias",
            name: "Núpcias",
            description: "⚠️ Gerenciado em /admin/events",
            whereAppears: "Página de Eventos - Núpcias (gerenciado em /admin/events)",
            recommendedImages: 0,
          },
        ],
        imageCount: 0,
  },
  {
    id: "esg",
        name: "ESG / Sustentabilidade",
        description: "Ações de sustentabilidade e responsabilidade social",
    icon: Leaf,
    color: "bg-green-600",
        page: "esg",
        sections: getPageSections("esg"),
        imageCount: 0,
  },
  {
    id: "contato",
    name: "Contato",
        description: "Informações de contato e localização",
    icon: Mail,
    color: "bg-purple-600",
        page: "contato",
        sections: getPageSections("contato"),
        imageCount: 0,
  },
  {
    id: "reservas",
    name: "Reservas",
        description: "Imagens da página de busca e reserva de quartos",
    icon: Bed,
    color: "bg-teal-600",
        page: "reservas",
        sections: getPageSections("reservas"),
        imageCount: 0,
  },
  {
        id: "seo-landing-pages",
    name: "SEO Landing Pages",
        description: "Imagens e conteúdo padrão para todas as landing pages de SEO (organizado por idioma)",
    icon: TrendingUp,
    color: "bg-emerald-600",
        sections: [
          {
            id: "seo-hero-padrao-pt",
            name: "Hero Padrão - Português (PT)",
            description: "Imagens hero padrão para landing pages em português",
            whereAppears: "Todas as landing pages de SEO em PT - Seção hero principal",
            recommendedImages: 5,
            imageTypes: ["Hotel exterior", "Vista mar", "Piscina", "Recepção", "Panorâmica"],
          },
          {
            id: "seo-hero-padrao-es",
            name: "Hero Padrão - Español (ES)",
            description: "Imagens hero padrão para landing pages em espanhol",
            whereAppears: "Todas as landing pages de SEO em ES - Seção hero principal",
            recommendedImages: 5,
            imageTypes: ["Hotel exterior", "Vista mar", "Piscina", "Recepção", "Panorâmica"],
          },
          {
            id: "seo-hero-padrao-en",
            name: "Hero Padrão - English (EN)",
            description: "Imagens hero padrão para landing pages em inglês",
            whereAppears: "Todas as landing pages de SEO em EN - Seção hero principal",
            recommendedImages: 5,
            imageTypes: ["Hotel exterior", "Vista mar", "Piscina", "Recepção", "Panorâmica"],
          },
          {
            id: "seo-galeria-quartos-pt",
            name: "Galeria Quartos - Português (PT)",
            description: "Imagens de quartos para landing pages de acomodações em português",
            whereAppears: "Landing pages sobre quartos e acomodações em PT",
            recommendedImages: 8,
            imageTypes: ["Quartos standard", "Suítes luxo", "Interiores", "Varandas"],
          },
          {
            id: "seo-galeria-quartos-es",
            name: "Galeria Quartos - Español (ES)",
            description: "Imagens de quartos para landing pages de acomodações em espanhol",
            whereAppears: "Landing pages sobre quartos e acomodações em ES",
            recommendedImages: 8,
            imageTypes: ["Quartos standard", "Suítes luxo", "Interiores", "Varandas"],
          },
          {
            id: "seo-galeria-quartos-en",
            name: "Galeria Quartos - English (EN)",
            description: "Imagens de quartos para landing pages de acomodações em inglês",
            whereAppears: "Landing pages sobre quartos e acomodações em EN",
            recommendedImages: 8,
            imageTypes: ["Quartos standard", "Suítes luxo", "Interiores", "Varandas"],
          },
          {
            id: "seo-galeria-gastronomia-pt",
            name: "Galeria Gastronomia - Português (PT)",
            description: "Imagens de gastronomia para landing pages em português",
            whereAppears: "Landing pages sobre gastronomia e restaurante em PT",
            recommendedImages: 8,
            imageTypes: ["Pratos", "Café da manhã", "Restaurante", "Bar"],
          },
          {
            id: "seo-galeria-gastronomia-es",
            name: "Galeria Gastronomia - Español (ES)",
            description: "Imagens de gastronomia para landing pages em espanhol",
            whereAppears: "Landing pages sobre gastronomia e restaurante em ES",
            recommendedImages: 8,
            imageTypes: ["Pratos", "Café da manhã", "Restaurante", "Bar"],
          },
          {
            id: "seo-galeria-gastronomia-en",
            name: "Galeria Gastronomia - English (EN)",
            description: "Imagens de gastronomia para landing pages em inglês",
            whereAppears: "Landing pages sobre gastronomia e restaurante em EN",
            recommendedImages: 8,
            imageTypes: ["Pratos", "Café da manhã", "Restaurante", "Bar"],
          },
          {
            id: "seo-galeria-lazer-pt",
            name: "Galeria Lazer - Português (PT)",
            description: "Imagens de lazer para landing pages em português",
            whereAppears: "Landing pages sobre lazer, piscina e atividades em PT",
            recommendedImages: 8,
            imageTypes: ["Piscina", "Academia", "Beach tennis", "Spa", "Bicicletas"],
          },
          {
            id: "seo-galeria-lazer-es",
            name: "Galeria Lazer - Español (ES)",
            description: "Imagens de lazer para landing pages em espanhol",
            whereAppears: "Landing pages sobre lazer, piscina e atividades em ES",
            recommendedImages: 8,
            imageTypes: ["Piscina", "Academia", "Beach tennis", "Spa", "Bicicletas"],
          },
          {
            id: "seo-galeria-lazer-en",
            name: "Galeria Lazer - English (EN)",
            description: "Imagens de lazer para landing pages em inglês",
            whereAppears: "Landing pages sobre lazer, piscina e atividades em EN",
            recommendedImages: 8,
            imageTypes: ["Piscina", "Academia", "Beach tennis", "Spa", "Bicicletas"],
          },
          {
            id: "seo-galeria-geral-pt",
            name: "Galeria Geral - Português (PT)",
            description: "Imagens gerais do hotel para landing pages em português",
            whereAppears: "Landing pages gerais sobre o hotel em PT",
            recommendedImages: 10,
            imageTypes: ["Exterior", "Recepção", "Áreas comuns", "Vista", "Ambiente"],
          },
          {
            id: "seo-galeria-geral-es",
            name: "Galeria Geral - Español (ES)",
            description: "Imagens gerais do hotel para landing pages em espanhol",
            whereAppears: "Landing pages gerais sobre o hotel em ES",
            recommendedImages: 10,
            imageTypes: ["Exterior", "Recepção", "Áreas comuns", "Vista", "Ambiente"],
          },
          {
            id: "seo-galeria-geral-en",
            name: "Galeria Geral - English (EN)",
            description: "Imagens gerais do hotel para landing pages em inglês",
            whereAppears: "Landing pages gerais sobre o hotel em EN",
            recommendedImages: 10,
            imageTypes: ["Exterior", "Recepção", "Áreas comuns", "Vista", "Ambiente"],
          },
          {
            id: "seo-galeria-localizacao-pt",
            name: "Galeria Localização - Português (PT)",
            description: "Imagens da localização para landing pages em português",
            whereAppears: "Landing pages sobre localização e arredores em PT",
            recommendedImages: 6,
            imageTypes: ["Praia de Iracema", "Pontos turísticos", "Arredores", "Vista"],
          },
          {
            id: "seo-galeria-localizacao-es",
            name: "Galeria Localização - Español (ES)",
            description: "Imagens da localização para landing pages em espanhol",
            whereAppears: "Landing pages sobre localização e arredores em ES",
            recommendedImages: 6,
            imageTypes: ["Praia de Iracema", "Pontos turísticos", "Arredores", "Vista"],
          },
          {
            id: "seo-galeria-localizacao-en",
            name: "Galeria Localização - English (EN)",
            description: "Imagens da localização para landing pages em inglês",
            whereAppears: "Landing pages sobre localização e arredores em EN",
            recommendedImages: 6,
            imageTypes: ["Praia de Iracema", "Pontos turísticos", "Arredores", "Vista"],
          },
        ],
        imageCount: 0,
      },
    ];

    // Calcular contagem de imagens por categoria
    categoryGroups.forEach((category) => {
      let count = 0;
      if (category.page && isValidPage(category.page)) {
        // Contar imagens por seção da página
        category.sections.forEach((section) => {
          const sectionItems = allItems.filter(
            (item) => item.page === category.page && item.section === section.id
          );
          count += sectionItems.length;
        });
      } else if (category.id === "seo-landing-pages") {
        // Para SEO Landing Pages, buscar imagens com page="seo-landing-page" e section específica
        category.sections.forEach((section) => {
          const sectionItems = allItems.filter(
            (item) => item.page === "seo-landing-page" && item.section === section.id
          );
          count += sectionItems.length;
        });
      } else {
        // Para categorias sem página específica (acomodações, eventos)
        category.sections.forEach((section) => {
          const sectionItems = allItems.filter((item) => item.section === section.id);
          count += sectionItems.length;
        });
      }
      category.imageCount = count;
    });

    setCategories(categoryGroups);
  };

  const handleSave = async () => {
    setSaving(true);
    await loadAllImages();
    setSaving(false);
    toast.success("Alterações salvas com sucesso!");
  };

  const getSectionType = (sectionId: string): "video" | "gallery" | "card" | "single" => {
    if (sectionId.includes("hero") || sectionId.includes("carousel")) return "single";
    if (sectionId.includes("galeria") || sectionId.includes("photo-story")) return "gallery";
    if (sectionId.includes("card") || sectionId.includes("experiencias")) return "card";
    return "single";
  };

  const getSectionIcon = (type: "video" | "gallery" | "card" | "single") => {
    return ImageIcon;
  };

  const filteredCategories = categories.filter((category) => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      category.name.toLowerCase().includes(term) ||
      category.description.toLowerCase().includes(term) ||
      category.sections.some((s) => s.name.toLowerCase().includes(term))
    );
  });

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="text-center text-muted-foreground py-12">Carregando imagens...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Gerenciar Imagens</h1>
        <p className="text-muted-foreground">
          Visão geral de todas as imagens do site organizadas por categoria. Expanda uma categoria
          para gerenciar suas imagens.
        </p>
      </div>

      {/* Busca */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por categoria ou seção..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Categorias */}
      <div className="space-y-4">
        {filteredCategories.map((category) => {
          const Icon = category.icon;
          const isExpanded = expandedCategory === category.id;

          return (
            <Card key={category.id} className="overflow-hidden">
              {/* Cabeçalho da Categoria */}
              <div
                className={cn(
                  "p-6 cursor-pointer hover:bg-muted/50 transition-colors",
                  isExpanded && "bg-muted/50 border-b"
                )}
                onClick={() => setExpandedCategory(isExpanded ? null : category.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 flex-1">
                    <div className={`p-3 ${category.color} rounded-lg text-white`}>
                    <Icon className="h-6 w-6" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <h2 className="text-xl font-bold">{category.name}</h2>
                        <Badge variant="secondary">{category.imageCount} imagens</Badge>
                        <Badge variant="outline">{category.sections.length} seções</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">{category.description}</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon">
                    {isExpanded ? (
                      <ChevronUp className="h-5 w-5" />
                    ) : (
                      <ChevronDown className="h-5 w-5" />
                    )}
                  </Button>
                </div>
              </div>

              {/* Seções da Categoria */}
              {isExpanded && (
                <div className="border-t bg-background">
                  {category.id === "seo-landing-pages" && (
                    <div className="p-6 bg-emerald-50 dark:bg-emerald-950/20 border-b border-emerald-200 dark:border-emerald-900">
                      <div className="flex items-start gap-3">
                        <TrendingUp className="h-5 w-5 text-emerald-600 mt-0.5" />
                        <div className="flex-1">
                          <h3 className="font-semibold text-emerald-900 dark:text-emerald-100 mb-2">
                            📋 Conteúdo Padrão para Landing Pages de SEO (Organizado por Idioma)
                          </h3>
                          <p className="text-sm text-emerald-800 dark:text-emerald-200 mb-2">
                            As imagens gerenciadas aqui são usadas como <strong>conteúdo padrão</strong> em todas as landing pages de SEO.
                            Cada seção está organizada por <strong>idioma (PT, ES, EN)</strong> para garantir que as landing pages exibam
                            o conteúdo correto conforme o idioma do visitante.
                          </p>
                          <p className="text-sm text-emerald-800 dark:text-emerald-200 mb-2">
                            <strong>Como funciona:</strong> Quando uma landing page é renderizada, ela automaticamente busca e exibe as imagens
                            padrão correspondentes ao seu idioma e tipo de conteúdo (Hero, Quartos, Gastronomia, Lazer, Localização, Geral).
                            Os blocos aparecem automaticamente nas landing pages baseado nas keywords e tipo de conteúdo.
                          </p>
                          <p className="text-sm text-emerald-800 dark:text-emerald-200">
                            <strong>Organização:</strong> Cada categoria (Hero, Quartos, Gastronomia, etc) possui 3 seções - uma para cada idioma.
                            Gerencie as imagens de cada idioma separadamente para ter controle total sobre o conteúdo exibido.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                  <div className="p-6 space-y-4">
                    {category.sections.map((section) => {
                      const sectionItems = allItems.filter((item) => {
                        if (category.page && isValidPage(category.page)) {
                          return item.page === category.page && item.section === section.id;
                        }
                        if (category.id === "seo-landing-pages") {
                          // Para SEO Landing Pages, buscar por seção específica exata
                          return item.page === "seo-landing-page" && item.section === section.id;
                        }
                        return item.section === section.id;
                      });
                      const sectionType = getSectionType(section.id);
                      const SectionIcon = getSectionIcon(sectionType);
                      const isSectionExpanded = expandedSection === `${category.id}-${section.id}`;

                      return (
                        <div
                          key={section.id}
                          className="border rounded-lg overflow-hidden bg-card"
                        >
                          {/* Cabeçalho da Seção */}
                          <div
                            className={cn(
                              "p-4 cursor-pointer hover:bg-muted/30 transition-colors",
                              isSectionExpanded && "bg-muted/30 border-b"
                            )}
                            onClick={(e) => {
                              e.stopPropagation();
                              setExpandedSection(
                                isSectionExpanded ? null : `${category.id}-${section.id}`
                              );
                            }}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3 flex-1">
                                <div className="p-2 rounded-lg bg-primary/10">
                                  <SectionIcon className="h-4 w-4 text-primary" />
                                </div>
                                <div className="flex-1">
                                  <div className="flex items-center gap-2">
                                    <h3 className="font-semibold">{section.name}</h3>
                                    <Badge variant="secondary">
                                      {sectionItems.length} / {section.recommendedImages}
                                    </Badge>
                                  </div>
                                  <p className="text-xs text-muted-foreground mt-1">
                                    {section.whereAppears}
                                  </p>
                                </div>
                              </div>
                              <Button variant="ghost" size="icon">
                                {isSectionExpanded ? (
                                  <ChevronUp className="h-4 w-4" />
                                ) : (
                                  <ChevronDown className="h-4 w-4" />
                                )}
                              </Button>
                            </div>
                          </div>

                          {/* Editor e Preview da Seção */}
                          {isSectionExpanded && (
                            <div className="border-t bg-background">
                              {section.recommendedImages === 0 ? (
                                <div className="p-6 text-center text-muted-foreground">
                                  <p className="text-sm">
                                    Esta seção é gerenciada em outra área do admin.
                                  </p>
                                  <p className="text-xs mt-2">{section.description}</p>
                                </div>
                              ) : (
                                <div className="grid lg:grid-cols-2 gap-0">
                                  {/* Painel de Edição */}
                                  <div className="p-6 border-r bg-muted/30">
                                    <SectionBlockEditor
                                      page={
                                        category.id === "seo-landing-pages"
                                          ? "seo-landing-page"
                                          : (category.page || "home")
                                      }
                                      section={section}
                                      items={sectionItems}
                                      sectionType={sectionType}
                                      onSave={handleSave}
                                      onSavingChange={setSaving}
                                    />
                                  </div>

                                  {/* Painel de Preview */}
                                  <div className="p-6 bg-background">
                                    <div className="sticky top-6">
                                      <div className="flex items-center gap-2 mb-4">
                                        <Eye className="h-4 w-4 text-muted-foreground" />
                                        <h4 className="font-semibold">Preview</h4>
                                      </div>
                                      <SectionBlockPreview
                                        section={section}
                                        items={sectionItems}
                                        sectionType={sectionType}
                                      />
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </Card>
          );
        })}
      </div>

      {filteredCategories.length === 0 && (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center text-muted-foreground py-12">
              Nenhuma categoria encontrada com o termo de busca.
            </div>
          </CardContent>
        </Card>
      )}

      <Card className="bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-900">
        <CardHeader>
          <CardTitle className="text-lg">ℹ️ Como funciona?</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <p>
            <strong className="text-foreground">Visão Geral:</strong> Todas as imagens estão
            organizadas por categoria. Expanda uma categoria para ver suas seções.
          </p>
          <p>
            <strong className="text-foreground">Gerenciamento:</strong> Clique em uma seção para
            expandir e gerenciar suas imagens. Você pode adicionar, editar e remover imagens.
          </p>
          <p>
            <strong className="text-foreground">Preview:</strong> Veja como as imagens aparecem no
            site em tempo real enquanto edita.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
