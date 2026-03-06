"use client";

import { useState, useCallback } from "react";
import { Badge } from "@/components/ui/badge";
import { useEditor } from "@/lib/context/EditorContext";
import { getPageContentTags } from "@/lib/utils/pageContent";
import type { PageKey } from "@/lib/utils/pageContent";
import type { Locale } from "@/lib/context/LanguageContext";
import { toast } from "sonner";
import { X, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

interface EditableTagListProps {
  page: PageKey;
  section: string;
  fieldKey: string;
  locale: Locale;
  className?: string;
  /** Tags exibidas quando ainda não há nada salvo no editor (para o usuário poder editar as atuais). */
  defaultTags?: string[];
}

export function EditableTagList({
  page,
  section,
  fieldKey,
  locale,
  className,
  defaultTags = [],
}: EditableTagListProps) {
  const editor = useEditor();
  const overrides = editor?.overrides ?? {};
  const savedTags = getPageContentTags(page, section, fieldKey, locale, overrides);
  const tags = savedTags.length > 0 ? savedTags : defaultTags;
  const [newTag, setNewTag] = useState("");
  const [saving, setSaving] = useState(false);

  const saveTags = useCallback(
    async (newTags: string[]) => {
      if (!editor?.editMode) return;
      setSaving(true);
      try {
        await editor.onEditText(section, fieldKey, JSON.stringify(newTags));
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Erro ao salvar tags");
      } finally {
        setSaving(false);
      }
    },
    [editor, section, fieldKey]
  );

  const handleRemove = (index: number) => {
    const next = tags.filter((_, i) => i !== index);
    saveTags(next);
  };

  const handleAdd = () => {
    const value = newTag.trim();
    if (!value) return;
    if (tags.includes(value)) {
      setNewTag("");
      return;
    }
    saveTags([...tags, value]);
    setNewTag("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAdd();
    }
  };

  if (!editor?.editMode) return null;

  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      {tags.map((tag, index) => (
        <Badge
          key={`${tag}-${index}`}
          variant="outline"
          className="text-xs pr-1 pl-2 py-1 gap-1 group"
        >
          {tag}
          <button
            type="button"
            onClick={() => handleRemove(index)}
            className="rounded-full p-0.5 hover:bg-muted transition-colors"
            aria-label={`Remover ${tag}`}
          >
            <X className="h-3 w-3" />
          </button>
        </Badge>
      ))}
      <div className="flex items-center gap-1 flex-wrap">
        <input
          type="text"
          value={newTag}
          onChange={(e) => setNewTag(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Nova tag..."
          className="h-7 px-2 text-xs rounded-md border border-input bg-background w-24 min-w-0"
          disabled={saving}
        />
        <button
          type="button"
          onClick={handleAdd}
          disabled={saving || !newTag.trim()}
          className="inline-flex items-center justify-center rounded-full p-1.5 bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:pointer-events-none"
          aria-label="Adicionar tag"
        >
          <Plus className="h-3 w-3" />
        </button>
      </div>
    </div>
  );
}
