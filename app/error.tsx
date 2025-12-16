"use client";

import { useEffect } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Erro capturado:", error);
    toast.error("Ops! Algo deu errado.", {
      description: "Tente novamente ou entre em contato conosco.",
      action: {
        label: "Tentar novamente",
        onClick: () => reset(),
      },
    });
  }, [error, reset]);

  return (
    <div className="flex min-h-[400px] flex-col items-center justify-center px-4 py-16">
      <div className="text-center space-y-6 max-w-md">
        <div className="mx-auto w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center">
          <AlertCircle className="w-8 h-8 text-destructive" />
        </div>
        
        <div className="space-y-2">
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
            Algo deu errado!
          </h2>
          <p className="text-muted-foreground">
            Ocorreu um erro inesperado. Por favor, tente novamente ou entre em contato conosco.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button onClick={() => reset()} size="lg">
            Tentar novamente
          </Button>
          <Button onClick={() => window.location.href = "/"} variant="outline" size="lg">
            Voltar para a Home
          </Button>
        </div>

        {process.env.NODE_ENV === "development" && error.message && (
          <div className="mt-8 p-4 bg-muted rounded-lg text-left">
            <p className="text-xs font-mono text-muted-foreground break-all">
              {error.message}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

