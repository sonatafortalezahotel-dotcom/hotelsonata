"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  ChevronDown,
  ChevronUp,
  Eye,
  Image as ImageIcon,
  Grid3x3,
  FileText,
  TrendingUp,
} from "lucide-react";
import { toast } from "sonner";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { SectionBlockEditor } from "@/components/admin/SectionBlockEditor";
import { SectionBlockPreview } from "@/components/admin/SectionBlockPreview";
import { cn } from "@/lib/utils";

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

interface SeoLandingPage {
  id: number;
  slug: string;
  locale: string;
  title: string;
  description: string;
  h1?: string;
  content?: string;
  ogImage?: string;
  active: boolean;
}

interface PageSection {
  id: string;
  name: string;
  description: string;
  whereAppears: string;
  recommendedImages: number;
  imageTypes?: string[];
}

// Seções padrão para landing pages de SEO
const SEO_LANDING_PAGE_SECTIONS: PageSection[] = [
  {
    id: "hero",
    name: "Hero - Imagem Principal",
    description: "Imagem de destaque no topo da landing page",
    whereAppears: "Topo da landing page - Imagem principal com título sobreposto",
    recommendedImages: 1,
    imageTypes: ["Hero", "Destaque", "Alta resolução"],
  },
  {
    id: "galeria-principal",
    name: "Galeria Principal",
    description: "Galeria de imagens principais da landing page",
    whereAppears: "Seção principal - Grid de imagens (6-9 imagens)",
    recommendedImages: 6,
    imageTypes: ["Diversos", "Conteúdo relacionado"],
  },
  {
    id: "photo-story",
    name: "Photo Story - Timeline Visual",
    description: "Timeline visual com momentos ou experiências",
    whereAppears: "Seção Photo Story - Timeline com 4-8 momentos",
    recommendedImages: 4,
    imageTypes: ["Momentos", "Experiências", "Timeline"],
  },
  {
    id: "galeria-secundaria",
    name: "Galeria Secundária",
    description: "Galeria adicional de imagens complementares",
    whereAppears: "Seção complementar - Grid de imagens (4-6 imagens)",
    recommendedImages: 4,
    imageTypes: ["Complementares", "Detalhes"],
  },
];

export default function SeoLandingPageImagesAdmin() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;

  const [landingPage, setLandingPage] = useState<SeoLandingPage | null>(null);
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (slug) {
      loadLandingPage();
      loadGallery();
    }
  }, [slug]);

  const loadLandingPage = async () => {
    try {
      const response = await fetch(`/api/seo-landing-pages?slug=${slug}`);
      const data = await response.json();
      const pages = Array.isArray(data.data) ? data.data : Array.isArray(data) ? data : [];
      if (pages.length > 0) {
        setLandingPage(pages[0]);
      } else {
        toast.error("Landing page não encontrada");
      }
    } catch (error) {
      console.error("Erro ao carregar landing page:", error);
      toast.error("Erro ao carregar landing page");
    }
  };

  const loadGallery = async () => {
    try {
      // Buscar imagens de todas as seções desta landing page
      const allItems: GalleryItem[] = [];
      for (const section of SEO_LANDING_PAGE_SECTIONS) {
        const sectionId = `${slug}-${section.id}`;
        const response = await fetch(
          `/api/gallery?page=seo-landing-page&section=${sectionId}`
        );
        const data = await response.json();
        if (Array.isArray(data)) {
          allItems.push(...data);
        }
      }
      setItems(allItems);
    } catch (error) {
      toast.error("Erro ao carregar imagens");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    await loadGallery();
    setSaving(false);
    toast.success("Alterações salvas com sucesso!");
  };

  const getSectionType = (sectionId: string): "video" | "gallery" | "card" | "single" => {
    if (sectionId.includes("hero")) return "single";
    if (sectionId.includes("galeria") || sectionId.includes("photo-story")) return "gallery";
    if (sectionId.includes("card")) return "card";
    return "single";
  };

  const getSectionIcon = (type: "video" | "gallery" | "card" | "single") => {
    switch (type) {
      case "gallery":
        return Grid3x3;
      case "card":
        return FileText;
      default:
        return ImageIcon;
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="text-center text-muted-foreground py-12">
          Carregando landing page...
        </div>
      </div>
    );
  }

  if (!landingPage) {
    return (
      <div className="space-y-6">
        <Alert variant="destructive">
          <AlertTitle>Landing page não encontrada</AlertTitle>
          <AlertDescription>
            A landing page especificada não existe ou foi removida.
          </AlertDescription>
        </Alert>
        <Button onClick={() => router.push("/admin/images/seo-landing-pages")}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar
        </Button>
      </div>
    );
  }

  const sections = SEO_LANDING_PAGE_SECTIONS;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Button
            variant="ghost"
            onClick={() => router.push("/admin/images/seo-landing-pages")}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-bold">Imagens - {landingPage.title}</h1>
            <Badge variant="outline">
              {landingPage.locale === "pt"
                ? "🇧🇷 PT"
                : landingPage.locale === "es"
                ? "🇪🇸 ES"
                : "🇬🇧 EN"}
            </Badge>
            {landingPage.active ? (
              <Badge>Ativa</Badge>
            ) : (
              <Badge variant="secondary">Inativa</Badge>
            )}
          </div>
          <p className="text-muted-foreground">
            <code className="text-sm bg-muted px-2 py-1 rounded">/{landingPage.slug}</code> -{" "}
            {landingPage.description}
          </p>
        </div>
      </div>

      {loading ? (
        <div className="text-center text-muted-foreground py-12">
          Carregando blocos...
        </div>
      ) : (
        <div className="space-y-4">
          {sections.map((section) => {
            const sectionId = `${slug}-${section.id}`;
            const sectionItems = items.filter((item) => item.section === sectionId);
            const sectionType = getSectionType(section.id);
            const Icon = getSectionIcon(sectionType);
            const isExpanded = expandedSection === section.id;

            return (
              <div key={section.id} className="border rounded-lg overflow-hidden bg-card">
                {/* Cabeçalho do Bloco */}
                <div
                  className={cn(
                    "p-4 cursor-pointer hover:bg-muted/50 transition-colors",
                    isExpanded && "bg-muted/50 border-b"
                  )}
                  onClick={() => setExpandedSection(isExpanded ? null : section.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 flex-1">
                      <div className="p-2 rounded-lg bg-primary/10">
                        <Icon className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-lg">{section.name}</h3>
                          <Badge variant="secondary">
                            {sectionItems.length} / {section.recommendedImages}
                          </Badge>
                          {sectionType === "gallery" && (
                            <Badge variant="outline" className="text-xs">
                              Múltiplas Imagens
                            </Badge>
                          )}
                          {sectionType === "card" && (
                            <Badge variant="outline" className="text-xs">
                              Cards de Texto
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          {section.whereAppears}
                        </p>
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

                {/* Área Expandida: Edição + Preview */}
                {isExpanded && (
                  <div className="border-t bg-background">
                    <div className="grid lg:grid-cols-2 gap-0">
                      {/* Painel de Edição */}
                      <div className="p-6 border-r bg-muted/30">
                        <SectionBlockEditor
                          page="seo-landing-page"
                          section={section}
                          items={sectionItems}
                          sectionType={sectionType}
                          onSave={handleSave}
                          onSavingChange={setSaving}
                          customPageId={slug}
                        />
                      </div>

                      {/* Painel de Preview */}
                      <div className="p-6 bg-background">
                        <div className="sticky top-6">
                          <div className="flex items-center gap-2 mb-4">
                            <Eye className="h-4 w-4 text-muted-foreground" />
                            <h4 className="font-semibold">Preview - Como aparece no site</h4>
                          </div>
                          <SectionBlockPreview
                            section={section}
                            items={sectionItems}
                            sectionType={sectionType}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

