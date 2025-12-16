"use client";

import { useEffect } from "react";

/**
 * Componente para suprimir erros inofensivos de extensões do navegador
 * que aparecem no console durante o desenvolvimento
 */
export function ErrorSuppressor() {
  useEffect(() => {
    // Suprimir erros de extensões do navegador (React DevTools, Redux DevTools, etc.)
    const originalError = console.error;
    const originalWarn = console.warn;

    console.error = (...args: any[]) => {
      const message = args[0]?.toString() || "";
      
      // Ignorar erros específicos de extensões do navegador
      if (
        message.includes("A listener indicated an asynchronous response") ||
        message.includes("message channel closed") ||
        message.includes("runtime.lastError") ||
        message.includes("Extension context invalidated")
      ) {
        return; // Suprimir o erro
      }
      
      // Manter outros erros
      originalError.apply(console, args);
    };

    console.warn = (...args: any[]) => {
      const message = args[0]?.toString() || "";
      
      // Ignorar avisos específicos de extensões do navegador
      if (
        message.includes("A listener indicated an asynchronous response") ||
        message.includes("message channel closed") ||
        message.includes("runtime.lastError")
      ) {
        return; // Suprimir o aviso
      }
      
      // Manter outros avisos
      originalWarn.apply(console, args);
    };

    // Limpar listeners de erro não capturados relacionados a extensões
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      const reason = event.reason?.toString() || "";
      
      if (
        reason.includes("A listener indicated an asynchronous response") ||
        reason.includes("message channel closed") ||
        reason.includes("runtime.lastError")
      ) {
        event.preventDefault(); // Prevenir que apareça no console
      }
    };

    window.addEventListener("unhandledrejection", handleUnhandledRejection);

    // Restaurar console original ao desmontar
    return () => {
      console.error = originalError;
      console.warn = originalWarn;
      window.removeEventListener("unhandledrejection", handleUnhandledRejection);
    };
  }, []);

  return null; // Componente não renderiza nada
}

