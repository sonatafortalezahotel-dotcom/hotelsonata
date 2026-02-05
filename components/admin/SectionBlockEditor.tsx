"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Upload, Plus, Trash2, Save, X, Image as ImageIcon } from "lucide-react";
import { toast } from "sonner";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { optimizeImageForUpload } from "@/lib/imageOptimizer";
import type { PageSection, PageType } from "@/lib/constants/page-sections";
import { isLegacyImage, suggestPageSectionForImage } from "@/lib/utils/gallery-mapper";

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

interface SectionBlockEditorProps {
  page: PageType | "seo-landing-page";
  section: PageSection;
  items: GalleryItem[];
  sectionType: "video" | "gallery" | "card" | "single";
  onSave: () => void;
  onSavingChange?: (saving: boolean) => void;
  customPageId?: string; // Para landing pages de SEO, usa o slug como identificador
}

export function SectionBlockEditor({
  page,
  section,
  items,
  sectionType,
  onSave,
  onSavingChange,
  customPageId,
}: SectionBlockEditorProps) {
  const [localItems, setLocalItems] = useState<GalleryItem[]>(items);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  useEffect(() => {
    setLocalItems(items);
  }, [items]);

  const handleFileUpload = async (file: File): Promise<string | null> => {
    setUploading(true);
    
    try {
      const optimized = await optimizeImageForUpload(file);
      const formData = new FormData();
      formData.append("file", optimized);
      const folderName = page === "seo-landing-page" && customPageId 
        ? `images/seo-landing-pages/${customPageId}`
        : `images/${page}`;
      formData.append("folder", folderName);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        toast.success("Imagem enviada com sucesso!");
        return data.url;
      } else {
        toast.error("Erro ao fazer upload");
        return null;
      }
    } catch (error) {
      toast.error("Erro ao fazer upload");
      return null;
    } finally {
      setUploading(false);
    }
  };

  const handleAddNew = () => {
    // Usa ID negativo para identificar novos itens (não salvos no banco)
    const newItem: GalleryItem = {
      id: -(Date.now() % 1000000), // ID negativo temporário (módulo para evitar números muito grandes)
      title: "",
      imageUrl: "",
      section: section.id,
      description: "",
      active: true,
      order: localItems.length,
    };
    setLocalItems([...localItems, newItem]);
    setEditingIndex(localItems.length);
  };

  const handleUpdateItem = (index: number, updates: Partial<GalleryItem>) => {
    const updated = [...localItems];
    updated[index] = { ...updated[index], ...updates };
    setLocalItems(updated);
  };

  const handleDeleteItem = (index: number) => {
    const item = localItems[index];
    // Se for um item existente (ID positivo válido), pedir confirmação
    if (item.id && item.id > 0 && item.id <= 2147483647) {
      if (!confirm("Tem certeza que deseja excluir esta imagem?")) return;
    }
    const updated = localItems.filter((_, i) => i !== index);
    setLocalItems(updated);
    if (editingIndex === index) {
      setEditingIndex(null);
    } else if (editingIndex !== null && editingIndex > index) {
      setEditingIndex(editingIndex - 1);
    }
  };

  const handleSaveAll = async () => {
    setSaving(true);
    onSavingChange?.(true);

    try {
      // Validar que todos os itens têm imageUrl antes de salvar
      const itemsWithoutUrl = localItems.filter(item => !item.imageUrl || !item.imageUrl.trim());
      if (itemsWithoutUrl.length > 0) {
        toast.error("Alguns itens não têm imagem. Adicione uma imagem antes de salvar.");
        setSaving(false);
        onSavingChange?.(false);
        return;
      }

      // Separar novos itens (ID negativo) dos existentes (ID positivo)
      const newItems = localItems.filter(item => item.id <= 0);
      const existingItems = localItems.filter(item => item.id > 0);

      // Criar novos itens (POST)
      for (const item of newItems) {
        const response = await fetch("/api/gallery", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: item.title || null,
            imageUrl: item.imageUrl,
            page: page === "seo-landing-page" ? "seo-landing-page" : page,
            section: page === "seo-landing-page" && customPageId 
              ? `${customPageId}-${section.id}` 
              : page === "seo-landing-page"
              ? section.id // Para seções padrão de SEO, usar apenas o ID da seção
              : section.id,
            description: item.description || null,
            active: item.active,
            order: item.order,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.error || "Erro ao criar imagem");
        }
      }

      // Atualizar itens existentes (PUT)
      const itemsToCreate: GalleryItem[] = []; // Itens que não existem mais e precisam ser criados
      
      for (const item of existingItems) {
        // Validar que o ID é um número válido e positivo
        if (!item.id || item.id <= 0 || item.id > 2147483647) {
          console.warn(`ID inválido ignorado: ${item.id}`);
          continue;
        }

        const response = await fetch(`/api/gallery/${item.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: item.title || null,
            imageUrl: item.imageUrl,
            page: page === "seo-landing-page" ? "seo-landing-page" : page,
            section: page === "seo-landing-page" && customPageId 
              ? `${customPageId}-${section.id}` 
              : page === "seo-landing-page"
              ? section.id // Para seções padrão de SEO, usar apenas o ID da seção
              : section.id,
            description: item.description || null,
            active: item.active,
            order: item.order,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          
          // Se a foto não foi encontrada (404), converter para criação
          if (response.status === 404) {
            console.warn(`Foto com ID ${item.id} não encontrada. Convertendo para criação.`);
            itemsToCreate.push({
              ...item,
              id: -(Date.now() % 1000000), // ID negativo temporário
            });
            continue;
          }
          
          // Para outros erros, lançar exceção
          throw new Error(errorData.error || "Erro ao atualizar imagem");
        }
      }

      // Criar itens que não existiam mais no banco
      if (itemsToCreate.length > 0) {
        toast.info(`${itemsToCreate.length} item(ns) não encontrado(s) no banco. Recriando...`);
      }
      
      for (const item of itemsToCreate) {
        const response = await fetch("/api/gallery", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: item.title || null,
            imageUrl: item.imageUrl,
            page: page === "seo-landing-page" ? "seo-landing-page" : page,
            section: page === "seo-landing-page" && customPageId 
              ? `${customPageId}-${section.id}` 
              : page === "seo-landing-page"
              ? section.id // Para seções padrão de SEO, usar apenas o ID da seção
              : section.id,
            description: item.description || null,
            active: item.active,
            order: item.order,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.error || "Erro ao criar imagem");
        }
      }

      // Remover itens deletados (que têm ID válido mas não estão mais na lista)
      const currentIds = new Set(
        localItems
          .filter(i => i.id > 0 && i.id <= 2147483647)
          .map(i => i.id)
      );
      const originalIds = new Set(
        items
          .filter(i => i.id > 0 && i.id <= 2147483647)
          .map(i => i.id)
      );
      const deletedIds = Array.from(originalIds).filter(id => !currentIds.has(id));

      for (const id of deletedIds) {
        const response = await fetch(`/api/gallery/${id}`, { method: "DELETE" });
        if (!response.ok) {
          console.warn(`Erro ao deletar imagem ${id}, mas continuando...`);
        }
      }

      toast.success("Alterações salvas com sucesso!");
      onSave();
    } catch (error: any) {
      console.error("Erro ao salvar:", error);
      toast.error(error.message || "Erro ao salvar alterações");
    } finally {
      setSaving(false);
      onSavingChange?.(false);
      setEditingIndex(null);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h4 className="font-semibold text-lg mb-2">Editar Bloco: {section.name}</h4>
        <p className="text-sm text-muted-foreground mb-4">{section.description}</p>
        
        {section.id === "hero-carousel" && (
          <Alert className="bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-900 mb-4">
            <Info className="h-4 w-4 text-blue-600" />
            <AlertTitle className="text-blue-900 dark:text-blue-100">⚠️ Atenção</AlertTitle>
            <AlertDescription className="text-blue-800 dark:text-blue-200 text-xs">
              O carrossel hero com vídeos é gerenciado em <strong>/admin/highlights</strong>
            </AlertDescription>
          </Alert>
        )}

        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-sm text-muted-foreground">
              {localItems.length} de {section.recommendedImages} imagens recomendadas
            </p>
          </div>
          <Button onClick={handleAddNew} size="sm" variant="outline">
            <Plus className="h-4 w-4 mr-2" />
            Adicionar Imagem
          </Button>
        </div>
      </div>

      <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
        {localItems.map((item, index) => {
          const isEditing = editingIndex === index;
          const isNewItem = item.id <= 0;
          const isLegacy = item.id > 0 && item.id <= 2147483647 && isLegacyImage(item);
          const suggestion = isLegacy ? suggestPageSectionForImage(item) : null;

          return (
            <div
              key={item.id || `new-${index}`}
              className={cn(
                "border rounded-lg p-4 space-y-4",
                isEditing && "ring-2 ring-primary"
              )}
            >
              {isNewItem && (
                <Alert className="bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-900">
                  <Info className="h-4 w-4 text-blue-600" />
                  <AlertDescription className="text-xs">
                    <strong>Novo item</strong> - Será criado ao salvar
                  </AlertDescription>
                </Alert>
              )}
              {isLegacy && suggestion && (
                <Alert className="bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-900">
                  <Info className="h-4 w-4 text-amber-600" />
                  <AlertDescription className="text-xs">
                    Imagem do sistema antigo. Categoria: <strong>{item.category}</strong>
                  </AlertDescription>
                </Alert>
              )}

              {isEditing ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-medium">Imagem #{index + 1}</Label>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setEditingIndex(null)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDeleteItem(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`title-${index}`}>Título</Label>
                    <Input
                      id={`title-${index}`}
                      value={item.title || ""}
                      onChange={(e) => handleUpdateItem(index, { title: e.target.value })}
                      placeholder="Ex: Piscina vista mar"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`description-${index}`}>Descrição</Label>
                    <Textarea
                      id={`description-${index}`}
                      value={item.description || ""}
                      onChange={(e) => handleUpdateItem(index, { description: e.target.value })}
                      placeholder="Descrição opcional"
                      rows={2}
                    />
                  </div>

                  {!item.imageUrl && (
                    <div className="space-y-2">
                      <Label>Upload de Imagem</Label>
                      <div className="border-2 border-dashed rounded-lg p-6 text-center">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={async (e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const url = await handleFileUpload(file);
                              if (url) {
                                handleUpdateItem(index, { imageUrl: url });
                              }
                            }
                          }}
                          className="hidden"
                          id={`file-upload-${index}`}
                        />
                        <label htmlFor={`file-upload-${index}`} className="cursor-pointer">
                          <Upload className="h-6 w-6 mx-auto mb-2 text-muted-foreground" />
                          <p className="text-sm text-muted-foreground">
                            Clique para selecionar uma imagem
                          </p>
                        </label>
                      </div>
                    </div>
                  )}

                  {item.imageUrl && (
                    <div className="space-y-2">
                      <Label>URL da Imagem</Label>
                      <Input
                        value={item.imageUrl}
                        onChange={(e) => handleUpdateItem(index, { imageUrl: e.target.value })}
                        placeholder="https://..."
                      />
                      <div className="relative aspect-video rounded-lg overflow-hidden bg-muted border">
                        <img
                          src={item.imageUrl}
                          alt={item.title || "Preview"}
                          className="h-full w-full object-cover"
                        />
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor={`order-${index}`}>Ordem</Label>
                      <Input
                        id={`order-${index}`}
                        type="number"
                        value={item.order}
                        onChange={(e) =>
                          handleUpdateItem(index, { order: parseInt(e.target.value) || 0 })
                        }
                      />
                    </div>
                    <div className="flex items-center space-x-2 pt-8">
                      <Switch
                        id={`active-${index}`}
                        checked={item.active}
                        onCheckedChange={(checked) =>
                          handleUpdateItem(index, { active: checked })
                        }
                      />
                      <Label htmlFor={`active-${index}`}>Ativo</Label>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-4">
                  <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                    {item.imageUrl ? (
                      <img
                        src={item.imageUrl}
                        alt={item.title || "Imagem"}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center">
                        <ImageIcon className="h-6 w-6 text-muted-foreground" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{item.title || "Sem título"}</p>
                    <p className="text-sm text-muted-foreground truncate">
                      {item.description || "Sem descrição"}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant={item.active ? "default" : "secondary"} className="text-xs">
                        {item.active ? "Ativo" : "Inativo"}
                      </Badge>
                      <span className="text-xs text-muted-foreground">Ordem: {item.order}</span>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setEditingIndex(index)}
                  >
                    Editar
                  </Button>
                </div>
              )}
            </div>
          );
        })}

        {localItems.length === 0 && (
          <div className="text-center text-muted-foreground py-8 border rounded-lg">
            Nenhuma imagem cadastrada. Clique em "Adicionar Imagem" para começar.
          </div>
        )}
      </div>

      <div className="flex gap-2 pt-4 border-t">
        <Button
          onClick={handleSaveAll}
          disabled={uploading || saving}
          className="flex-1"
        >
          <Save className="h-4 w-4 mr-2" />
          {saving ? "Salvando..." : "Salvar Alterações"}
        </Button>
      </div>
    </div>
  );
}

