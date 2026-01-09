"use client";

import { usePathname } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SkipToContent from "@/components/SkipToContent";
import { AwardsSection } from "@/components/AwardsSection";
import BookingBar from "@/components/BookingBar";
import { cn } from "@/lib/utils";

export function PublicLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith("/admin");
  const isHomePage = pathname === "/" || pathname === "/pt" || pathname === "/en" || pathname === "/es";

  if (isAdminRoute) {
    return <>{children}</>;
  }

  return (
    <>
      <SkipToContent />
      <Header />
      {/* BookingBar: sticky na home, fixo/relativo nas outras páginas */}
      <BookingBar isHomePage={isHomePage} />
      {/* 
        Espaçamento superior: 
        - Home: sem pt extra (BookingBar é sticky)
        - Outras: lg:pt-0 porque BookingBar está acima do main
        - Mobile: pb-32 (128px) = espaço para BookingBar fixo em mobile
        - Desktop: lg:pb-16 (64px) = espaço antes do footer
      */}
      <main 
        id="main-content" 
        className={cn(
          "pb-32 lg:pb-16 min-h-screen relative z-10",
          isHomePage ? "pt-20 lg:pt-28" : "pt-20 lg:pt-0"
        )}
        tabIndex={-1}
      >
        {children}
      </main>
      <AwardsSection />
      {/* Barreira visual para evitar vazamento de gradiente */}
      <div 
        className="h-0 w-full"
        style={{
          background: 'hsl(var(--background))',
          backgroundImage: 'none',
          overflow: 'hidden',
          position: 'relative',
          zIndex: 15,
        }}
      />
      <Footer />
    </>
  );
}

