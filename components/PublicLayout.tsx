"use client";

import { usePathname } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SkipToContent from "@/components/SkipToContent";
import { AwardsSection } from "@/components/AwardsSection";

export function PublicLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith("/admin");

  if (isAdminRoute) {
    return <>{children}</>;
  }

  return (
    <>
      <SkipToContent />
      <Header />
      {/* 
        Espaçamento superior: 
        - Mobile: pt-20 (80px) = altura do header
        - Desktop: lg:pt-28 (112px) = Header (80px) + pequeno gap
        Espaçamento inferior:
        - Mobile: pb-32 (128px) = espaço para BookingBar fixo
        - Desktop: lg:pb-16 (64px) = espaço antes do footer
      */}
      <main 
        id="main-content" 
        className="pt-20 pb-32 lg:pb-16 lg:pt-28 min-h-screen relative z-10" 
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

