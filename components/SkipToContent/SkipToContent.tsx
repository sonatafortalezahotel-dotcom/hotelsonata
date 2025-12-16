"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";

/**
 * Componente Skip to Content para acessibilidade
 * Permite usuários de leitores de tela e navegação por teclado
 * pular diretamente para o conteúdo principal
 */
export default function SkipToContent() {
  return (
    <Link
      href="#main-content"
      className={cn(
        "sr-only focus:not-sr-only",
        "fixed top-4 left-4 z-[100]",
        "px-6 py-3",
        "bg-primary text-primary-foreground",
        "font-semibold rounded-md",
        "shadow-lg",
        "transition-all duration-200",
        "focus:outline-none focus:ring-2 focus:ring-primary-foreground focus:ring-offset-2",
        "hover:bg-primary/90",
        "active:scale-95"
      )}
      aria-label="Pular para o conteúdo principal"
    >
      Pular para o conteúdo
    </Link>
  );
}

