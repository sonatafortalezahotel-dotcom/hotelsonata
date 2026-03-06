"use client";

import * as React from "react";

import { cn } from "@/lib/utils";
import NordestinoPattern from "@/components/NordestinoPattern";

type ContentSectionVariant = "default" | "muted" | "dark" | "nordeste";
type ContentSectionWidth = "default" | "full" | "narrow";

interface ContentSectionProps
  extends React.HTMLAttributes<HTMLElement> {
  /**
   * Elemento semântico usado como wrapper.
   * Mantemos `section` como padrão para acessibilidade.
   */
  as?: "section" | "div";
  /**
   * Estilo visual de fundo do bloco de conteúdo.
   */
  variant?: ContentSectionVariant;
  /**
   * Controle de largura máxima do conteúdo.
   * - default: não impõe container, deixa o filho decidir (mantém compatibilidade com páginas existentes).
   * - full: ocupa toda a largura disponível.
   * - narrow: útil para blocos mais editoriais.
   */
  width?: ContentSectionWidth;
}

export function ContentSection({
  as: Component = "section",
  variant = "default",
  width = "default",
  className,
  children,
  ...props
}: ContentSectionProps) {
  const variantClasses: Record<ContentSectionVariant, string> = {
    default: "bg-background",
    muted: "bg-muted/30",
    dark: "bg-slate-950 text-slate-50",
    nordeste:
      "bg-gradient-to-b from-[hsl(var(--nordeste-ceu)/0.95)] via-[hsl(var(--nordeste-ocaso)/0.9)] to-[hsl(var(--nordeste-terra)/0.95)] text-white",
  };

  const widthClasses: Record<ContentSectionWidth, string> = {
    default: "",
    full: "w-full",
    narrow: "max-w-5xl mx-auto",
  };

  return (
    <Component
      className={cn(
        "relative overflow-x-clip py-16 lg:py-24",
        variantClasses[variant],
        widthClasses[width],
        className,
      )}
      {...props}
    >
      {variant === "nordeste" && (
        <NordestinoPattern
          variant="waves"
          opacity={0.08}
          className="z-0"
        />
      )}

      <div className="relative z-10 min-w-0">
        {children}
      </div>
    </Component>
  );
}


