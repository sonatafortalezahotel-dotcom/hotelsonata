"use client";

import { useState } from "react";
import { useEditor } from "@/lib/context/EditorContext";
import { getPageContentIcon } from "@/lib/utils/pageContent";
import { getIcon, getIconNames, type IconName } from "@/lib/icon-registry";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Edit2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import type { LucideIcon } from "lucide-react";
import type { PageKey } from "@/lib/utils/pageContent";

interface EditableIconProps {
  page: PageKey | "global";
  section: string;
  fieldKey: string;
  locale: string;
  /** Nome do ícone padrão (ex: "Waves"). Usado quando não há override. */
  defaultIconName: string;
  /** Componente Lucide fallback quando o nome não está no registro. */
  defaultIcon?: LucideIcon;
  className?: string;
  iconClassName?: string;
}

/**
 * Exibe o ícone da página (override ou padrão). No modo edição, ao clicar abre um
 * seletor para escolher outro ícone; persiste via API page-content.
 */
export function EditableIcon({
  page,
  section,
  fieldKey,
  locale,
  defaultIconName,
  defaultIcon,
  className,
  iconClassName,
}: EditableIconProps) {
  const editor = useEditor();
  const overrides = page === "global" ? editor?.globalOverrides ?? {} : editor?.overrides ?? {};
  const iconName = getPageContentIcon(section, fieldKey, overrides, defaultIconName);
  const IconComponent = getIcon(iconName) ?? defaultIcon;

  const [open, setOpen] = useState(false);

  const handleSelect = (name: IconName) => {
    if (!editor) return;
    const promise =
      page === "global"
        ? editor.onEditGlobal(section, fieldKey, name)
        : editor.onEditText(section, fieldKey, name);
    promise
      .then(() => setOpen(false))
      .catch((err) => {
        toast.error(err instanceof Error ? err.message : "Erro ao salvar ícone");
      });
  };

  if (!editor?.editMode) {
    if (!IconComponent) return null;
    return <IconComponent className={cn("h-16 w-16 text-muted-foreground/50", iconClassName)} />;
  }

  const iconNames = getIconNames();

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          className={cn(
            "relative group cursor-pointer rounded-lg p-2 transition-all",
            "hover:bg-primary/10 hover:ring-2 hover:ring-primary/30",
            className
          )}
          aria-label="Alterar ícone"
        >
          {IconComponent ? (
            <IconComponent className={cn("h-16 w-16 text-muted-foreground/50", iconClassName)} />
          ) : (
            <span className="text-sm text-muted-foreground">Ícone</span>
          )}
          <span className="absolute -top-1 -right-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <Edit2 className="h-3 w-3 text-primary bg-background rounded-full p-0.5" />
          </span>
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-2" align="start">
        <p className="text-xs font-medium text-muted-foreground mb-2 px-2">Escolha um ícone</p>
        <div className="grid grid-cols-6 gap-1 max-h-64 overflow-y-auto">
          {iconNames.map((name) => {
            const Icon = getIcon(name);
            if (!Icon) return null;
            const isSelected = name === iconName;
            return (
              <Button
                key={name}
                type="button"
                variant={isSelected ? "secondary" : "ghost"}
                size="icon"
                className="h-9 w-9 shrink-0"
                onClick={() => handleSelect(name)}
                title={name}
              >
                <Icon className="h-4 w-4" />
              </Button>
            );
          })}
        </div>
      </PopoverContent>
    </Popover>
  );
}
