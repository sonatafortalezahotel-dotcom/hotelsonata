"use client";

import { useState, useRef, useEffect, useId } from "react";
import { cn } from "@/lib/utils";
import { Edit2 } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

interface EditableTextProps {
  value: string;
  onChange?: (value: string) => void;
  /** Quando fornecido, exibe checkbox "Aplicar em todos os idiomas" e usa esta callback ao salvar com a opção marcada. */
  onChangeAllLocales?: (value: string) => void | Promise<void>;
  onClick?: () => void;
  className?: string;
  placeholder?: string;
  as?: "h1" | "h2" | "h3" | "h4" | "p" | "span";
  editMode?: boolean;
  showEditIndicator?: boolean;
}

export function EditableText({
  value,
  onChange,
  onChangeAllLocales,
  onClick,
  className,
  placeholder = "Clique para editar...",
  as = "p",
  editMode = false,
  showEditIndicator = true,
}: EditableTextProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [localValue, setLocalValue] = useState(value);
  const [applyToAllLocales, setApplyToAllLocales] = useState(false);
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);
  const checkboxId = useId();

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      if (inputRef.current instanceof HTMLInputElement) {
        inputRef.current.select();
      }
    }
  }, [isEditing]);

  const handleClick = () => {
    if (editMode && !isEditing) {
      setIsEditing(true);
      onClick?.();
    }
  };

  const handleBlur = () => {
    setIsEditing(false);
    if (localValue === value) return;
    const saveCallback = applyToAllLocales && onChangeAllLocales ? onChangeAllLocales : onChange;
    if (saveCallback) {
      void Promise.resolve(saveCallback(localValue));
    }
    setApplyToAllLocales(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleBlur();
    }
    if (e.key === "Escape") {
      setLocalValue(value);
      setIsEditing(false);
    }
  };

  const Component = as;

  if (!editMode) {
    return (
      <Component className={className}>
        {value || placeholder}
      </Component>
    );
  }

  if (isEditing) {
    const isMultiline = localValue.length > 50 || localValue.includes("\n");
    const showAllLocalesCheckbox = !!onChangeAllLocales;

    const inputElement = isMultiline ? (
      <textarea
        ref={inputRef as React.RefObject<HTMLTextAreaElement>}
        value={localValue}
        onChange={(e) => setLocalValue(e.target.value)}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        className={cn(
          "w-full bg-primary/10 border-2 border-primary rounded px-2 py-1 outline-none resize-none",
          className
        )}
        rows={Math.min(Math.max(localValue.split("\n").length, 2), 6)}
      />
    ) : (
      <input
        ref={inputRef as React.RefObject<HTMLInputElement>}
        type="text"
        value={localValue}
        onChange={(e) => setLocalValue(e.target.value)}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        className={cn(
          "w-full bg-primary/10 border-2 border-primary rounded px-2 py-1 outline-none",
          className
        )}
      />
    );

    return (
      <span className="block space-y-2 w-full">
        {inputElement}
        {showAllLocalesCheckbox && (
          <span className="flex items-center gap-2">
            <Checkbox
              id={checkboxId}
              checked={applyToAllLocales}
              onCheckedChange={(checked) => setApplyToAllLocales(checked === true)}
            />
            <Label htmlFor={checkboxId} className="text-xs cursor-pointer">
              Aplicar em PT, ES e EN
            </Label>
          </span>
        )}
      </span>
    );
  }

  return (
    <Component
      className={cn(
        "relative group cursor-pointer transition-all",
        editMode && "hover:bg-primary/5 hover:ring-2 hover:ring-primary/30 rounded px-1 -mx-1",
        className
      )}
      onClick={handleClick}
    >
      {value || (
        <span className="text-muted-foreground italic">{placeholder}</span>
      )}
      {editMode && showEditIndicator && (
        <span className="absolute -top-1 -right-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <Edit2 className="h-3 w-3 text-primary bg-background rounded-full p-0.5" />
        </span>
      )}
    </Component>
  );
}
