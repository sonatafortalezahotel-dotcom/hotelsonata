"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ChevronDown, ChevronUp, Eye, Image as ImageIcon, Video, Grid3x3, FileText } from "lucide-react";
import { toast } from "sonner";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { getPageSections, isValidPage, type PageType } from "@/lib/constants/page-sections";
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

export default function PageImagesAdmin() {
  const params = useParams();
  const router = useRouter();
  const page = params.page as string;
  const isValid = isValidPage(page);

  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isValid) {
      loadGallery();
    }
  }, [page]);

  const loadGallery = async () => {
    try {
      const response = await fetch(`/api/gallery?page=${page}`);
      const data = await response.json();
      setItems(Array.isArray(data) ? data : []);
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

  if (!isValid) {
    return (
      <div className="space-y-6">
        <Alert variant="destructive">
          <AlertTitle>Página inválida</AlertTitle>
          <AlertDescription>A página especificada não existe.</AlertDescription>
        </Alert>
        <Button onClick={() => router.push("/admin/images")}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar
        </Button>
      </div>
    );
  }

  const pageType = page as PageType;
  const sections = getPageSections(pageType);

  const pageNames: Record<PageType, string> = {
    home: "Home / Hotel",
    lazer: "Lazer",
    gastronomia: "Gastronomia",
    esg: "ESG",
    contato: "Contato"
  };

  const getSectionType = (sectionId: string): "video" | "gallery" | "card" | "single" => {
    if (sectionId.includes("hero") || sectionId.includes("carousel")) return "video";
    if (sectionId.includes("galeria") || sectionId.includes("photo-story")) return "gallery";
    if (sectionId.includes("card") || sectionId.includes("experiencias")) return "card";
    return "single";
  };

  const getSectionIcon = (type: "video" | "gallery" | "card" | "single") => {
    switch (type) {
      case "video":
        return Video;
      case "gallery":
        return Grid3x3;
      case "card":
        return FileText;
      default:
        return ImageIcon;
    }
  };

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
          <h1 className="text-3xl font-bold mb-2">Imagens - {pageNames[pageType]}</h1>
          <p className="text-muted-foreground">
            Gerencie as imagens desta página. Cada bloco representa uma seção do site.
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
            const sectionItems = items.filter(item => item.section === section.id);
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
                          {sectionType === "video" && (
                            <Badge variant="outline" className="text-xs">
                              Vídeo
                            </Badge>
                          )}
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
                          page={pageType}
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
