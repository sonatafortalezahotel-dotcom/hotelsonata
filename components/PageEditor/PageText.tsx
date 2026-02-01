"use client";

import { useEditor } from "@/lib/context/EditorContext";
import { getPageContent } from "@/lib/utils/pageContent";
import type { PageKey } from "@/lib/utils/pageContent";
import { EditableText } from "@/components/admin/EditableText";
import type { Locale } from "@/lib/context/LanguageContext";
import { toast } from "sonner";

interface PageTextProps {
  page: PageKey;
  section: string;
  fieldKey: string;
  locale: Locale;
  as?: "h1" | "h2" | "h3" | "h4" | "p" | "span";
  className?: string;
  placeholder?: string;
}

export function PageText({
  page,
  section,
  fieldKey,
  locale,
  as = "p",
  className,
  placeholder,
}: PageTextProps) {
  const editor = useEditor();
  const overrides = page === "global" ? editor?.globalOverrides ?? {} : editor?.overrides ?? {};
  const value = editor
    ? getPageContent(page, section, fieldKey, locale, overrides)
    : "";

  if (editor?.editMode) {
    const onChange = (newValue: string) => {
      const promise =
        page === "global"
          ? editor.onEditGlobal(section, fieldKey, newValue)
          : editor.onEditText(section, fieldKey, newValue);
      promise.catch((err) => {
        toast.error(err instanceof Error ? err.message : "Erro ao salvar texto");
      });
    };
    const onChangeAllLocales = (newValue: string) => {
      const promise =
        page === "global"
          ? editor.onEditGlobalAllLocales(section, fieldKey, newValue)
          : editor.onEditTextAllLocales(section, fieldKey, newValue);
      promise.catch((err) => {
        toast.error(err instanceof Error ? err.message : "Erro ao salvar texto");
      });
    };
    return (
      <EditableText
        value={value}
        onChange={onChange}
        onChangeAllLocales={onChangeAllLocales}
        as={as}
        className={className}
        editMode
        placeholder={placeholder}
      />
    );
  }

  const Component = as;
  return (
    <Component className={className}>
      {value || placeholder}
    </Component>
  );
}
