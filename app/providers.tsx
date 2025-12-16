"use client";

import { ThemeProvider } from "@/components/ThemeProvider/ThemeProvider";
import { LanguageProvider } from "@/lib/context/LanguageContext";
import { Toaster } from "@/components/ui/sonner";
import { ErrorSuppressor } from "@/components/ErrorSuppressor";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      enableSystem
      disableTransitionOnChange={false}
    >
      <LanguageProvider>
        <ErrorSuppressor />
        {children}
        <Toaster />
      </LanguageProvider>
    </ThemeProvider>
  );
}

