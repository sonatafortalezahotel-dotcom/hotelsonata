"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Save, Edit2, X, Upload, Image as ImageIcon, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { optimizeImageForUpload } from "@/lib/imageOptimizer";
import { ImageUpload } from "./ImageUpload";

interface EditableField {
  id: string;
  type: "text" | "textarea" | "image" | "title" | "description";
  value: string;
  label: string;
  placeholder?: string;
}

interface VisualEditorProps {
  items: any[];
  onSave: (items: any[]) => Promise<void>;
  renderPreview: (items: any[], onFieldClick: (fieldId: string, itemIndex: number) => void, editMode?: boolean) => React.ReactNode;
  getEditableFields: (item: any, index: number) => EditableField[];
  page?: string;
  folder?: string;
}

export function VisualEditor({
  items,
  onSave,
  renderPreview,
  getEditableFields,
  page = "hotel-sonata",
  folder,
}: VisualEditorProps) {
  const [localItems, setLocalItems] = useState(items);
  const [editingField, setEditingField] = useState<{ fieldId: string; itemIndex: number } | null>(null);
  const [saving, setSaving] = useState(false);
  const [editMode, setEditMode] = useState(true);
  const [hasChanges, setHasChanges] = useState(false);
  const [editModeState, setEditModeState] = useState(true);

  useEffect(() => {
    setLocalItems(items);
    setHasChanges(false);
  }, [items]);

  const handleFieldClick = (fieldId: string, itemIndex: number) => {
    if (!editModeState) return;
    setEditingField({ fieldId, itemIndex });
  };

  const handleFieldChange = (fieldId: string, itemIndex: number, value: string) => {
    const updated = [...localItems];
    const field = getEditableFields(updated[itemIndex], itemIndex).find(f => f.id === fieldId);
    
    if (field) {
      updated[itemIndex] = {
        ...updated[itemIndex],
        [field.type === "title" ? "title" : field.type === "description" ? "description" : field.type]: value,
      };
      setLocalItems(updated);
      setHasChanges(true);
    }
  };

  const handleImageUpload = async (file: File, itemIndex: number) => {
    try {
      const optimized = await optimizeImageForUpload(file);
      const formData = new FormData();
      formData.append("file", optimized);
      const folderName = folder || `images/${page}`;
      formData.append("folder", folderName);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        const updated = [...localItems];
        updated[itemIndex] = {
          ...updated[itemIndex],
          imageUrl: data.url,
        };
        setLocalItems(updated);
        setHasChanges(true);
        setEditingField(null);
        toast.success("Imagem atualizada com sucesso!");
      } else {
        toast.error("Erro ao fazer upload da imagem");
      }
    } catch (error) {
      toast.error("Erro ao fazer upload da imagem");
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await onSave(localItems);
      setHasChanges(false);
      toast.success("Alterações salvas com sucesso!");
    } catch (error) {
      toast.error("Erro ao salvar alterações");
    } finally {
      setSaving(false);
      setEditingField(null);
    }
  };

  const currentField = editingField
    ? getEditableFields(localItems[editingField.itemIndex], editingField.itemIndex).find(
        f => f.id === editingField.fieldId
      )
    : null;

  const currentItem = editingField ? localItems[editingField.itemIndex] : null;

  return (
    <div className="space-y-4">
      {/* Barra de Controles */}
      <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg border">
        <div className="flex items-center gap-2">
          <Button
            variant={editModeState ? "default" : "outline"}
            size="sm"
            onClick={() => setEditModeState(!editModeState)}
          >
            {editModeState ? <Edit2 className="h-4 w-4 mr-2" /> : <Eye className="h-4 w-4 mr-2" />}
            {editModeState ? "Modo Edição" : "Modo Visualização"}
          </Button>
          {hasChanges && (
            <span className="text-xs text-amber-600 dark:text-amber-400">
              • Alterações não salvas
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {hasChanges && (
            <Button variant="outline" size="sm" onClick={() => {
              setLocalItems(items);
              setHasChanges(false);
              setEditingField(null);
            }}>
              <X className="h-4 w-4 mr-2" />
              Descartar
            </Button>
          )}
          <Button
            size="sm"
            onClick={handleSave}
            disabled={saving || !hasChanges}
          >
            <Save className="h-4 w-4 mr-2" />
            {saving ? "Salvando..." : "Salvar"}
          </Button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        {/* Preview Principal */}
        <div className={cn(
          "lg:col-span-2 space-y-4",
          editModeState && "ring-2 ring-primary/20 rounded-lg p-4 bg-muted/10"
        )}>
          <div className="sticky top-4">
            <div className="mb-4 flex items-center gap-2">
              <Eye className="h-4 w-4 text-muted-foreground" />
              <h3 className="font-semibold">Preview Visual</h3>
              {editModeState && (
                <span className="text-xs text-muted-foreground">
                  • Clique nos elementos para editar
                </span>
              )}
            </div>
            <div className={cn(
              "relative",
              editModeState && "min-h-[400px]"
            )}>
              {renderPreview(localItems, handleFieldClick, editModeState)}
            </div>
          </div>
        </div>

        {/* Painel de Edição Lateral */}
        <div className="lg:col-span-1">
          <div className="sticky top-4 space-y-4">
            {editModeState && editingField && currentField && currentItem ? (
              <div className="border rounded-lg p-4 bg-card space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold">Editar {currentField.label}</h4>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setEditingField(null)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>

                {currentField.type === "image" ? (
                  <div className="space-y-4">
                    <div className="relative aspect-video rounded-lg overflow-hidden bg-muted border">
                      {currentItem.imageUrl ? (
                        <img
                          src={currentItem.imageUrl}
                          alt={currentItem.title || "Preview"}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center">
                          <ImageIcon className="h-12 w-12 text-muted-foreground" />
                        </div>
                      )}
                    </div>
                    <ImageUpload
                      value={currentItem.imageUrl || ""}
                      onChange={(url) => {
                        handleFieldChange(editingField.fieldId, editingField.itemIndex, url);
                        setEditingField(null);
                      }}
                      folder={folder || `images/${page}`}
                      label="Trocar Imagem"
                    />
                  </div>
                ) : currentField.type === "textarea" ? (
                  <div className="space-y-2">
                    <Label>{currentField.label}</Label>
                    <Textarea
                      value={currentField.value}
                      onChange={(e) =>
                        handleFieldChange(editingField.fieldId, editingField.itemIndex, e.target.value)
                      }
                      placeholder={currentField.placeholder}
                      rows={6}
                    />
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Label>{currentField.label}</Label>
                    <Input
                      value={currentField.value}
                      onChange={(e) =>
                        handleFieldChange(editingField.fieldId, editingField.itemIndex, e.target.value)
                      }
                      placeholder={currentField.placeholder}
                    />
                  </div>
                )}

                {currentField.type !== "image" && (
                  <div className="pt-2 border-t">
                    <p className="text-xs text-muted-foreground">
                      As alterações são aplicadas em tempo real no preview
                    </p>
                  </div>
                )}
              </div>
            ) : editModeState ? (
              <div className="border-2 border-dashed rounded-lg p-8 text-center bg-muted/30">
                <Edit2 className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">
                  Clique em um elemento no preview para começar a editar
                </p>
              </div>
            ) : (
              <div className="border rounded-lg p-4 bg-muted/30">
                <div className="flex items-center gap-2 mb-2">
                  <EyeOff className="h-4 w-4 text-muted-foreground" />
                  <h4 className="font-semibold text-sm">Modo Visualização</h4>
                </div>
                <p className="text-xs text-muted-foreground">
                  Ative o modo edição para fazer alterações
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
