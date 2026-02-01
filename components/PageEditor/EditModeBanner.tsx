"use client";

import { useState } from "react";
import { useEditor } from "@/lib/context/EditorContext";
import { useLanguage } from "@/lib/context/LanguageContext";
import type { Locale } from "@/lib/context/LanguageContext";
import { notifyGalleryUpdated } from "@/lib/galleryRefetch";
import { Pencil, Save, Loader2, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const LOCALE_LABELS: Record<Locale, string> = {
  pt: "Português",
  es: "Español",
  en: "English",
};

export function EditModeBanner() {
  const editor = useEditor();
  const { locale, setLocale } = useLanguage();
  const [updating, setUpdating] = useState(false);
  if (!editor?.editMode) return null;

  const handleAtualizar = async () => {
    if (updating) return;
    setUpdating(true);
    try {
      await editor.refetch();
      notifyGalleryUpdated();
      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("gallery-updated"));
      }
      editor.clearImageOverrides?.();
      toast.success("Edição confirmada", {
        description: "Página e galeria atualizados. As alterações estão visíveis.",
      });
    } catch (e) {
      toast.error("Erro ao atualizar", {
        description: "Tente novamente ou recarregue a página.",
      });
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="fixed top-0 left-0 right-0 z-[9999] bg-primary text-primary-foreground shadow-lg">
      <div className="container mx-auto px-4 py-2 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-3 flex-wrap">
          <Pencil className="h-4 w-4 shrink-0" />
          <span className="text-sm font-medium">
            Modo edição — clique no <strong>título</strong>, <strong>subtítulo</strong> ou na <strong>imagem de fundo</strong> do topo para editar. Imagens: clique e use o link para trocar.
          </span>
          <div className="flex items-center gap-2 border-l border-primary-foreground/30 pl-3">
            <Globe className="h-4 w-4 shrink-0" />
            <span className="text-sm">Editando em:</span>
            <div className="flex gap-1">
              {(["pt", "es", "en"] as const).map((loc) => (
                <Button
                  key={loc}
                  size="sm"
                  variant={locale === loc ? "secondary" : "ghost"}
                  className={`h-7 px-2 text-xs font-medium ${
                    locale === loc
                      ? "bg-primary-foreground text-primary"
                      : "text-primary-foreground/80 hover:text-primary-foreground hover:bg-primary-foreground/20"
                  }`}
                  onClick={() => setLocale(loc)}
                >
                  {loc.toUpperCase()}
                </Button>
              ))}
            </div>
            <span className="text-sm text-primary-foreground/90">({LOCALE_LABELS[locale]})</span>
          </div>
        </div>
        <Button
          size="sm"
          variant="secondary"
          className="text-primary bg-primary-foreground hover:bg-primary-foreground/90"
          onClick={handleAtualizar}
          disabled={updating}
        >
          {updating ? (
            <Loader2 className="h-3 w-3 mr-1 animate-spin" />
          ) : (
            <Save className="h-3 w-3 mr-1" />
          )}
          Atualizar
        </Button>
      </div>
    </div>
  );
}
