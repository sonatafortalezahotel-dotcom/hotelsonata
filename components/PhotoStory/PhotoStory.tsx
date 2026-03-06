"use client";

import Image from "next/image";
import { useEffect, useRef, useState, ReactNode } from "react";
import { ElegantCarousel } from "@/components/HorizontalScroll";
import NordestinoPattern from "@/components/NordestinoPattern";

interface PhotoStoryItem {
  image: string | ReactNode | null;
  title: string | ReactNode;
  description: string | ReactNode;
  time?: string | ReactNode;
}

interface PhotoStoryProps {
  title: string | ReactNode;
  subtitle?: string | ReactNode;
  items: PhotoStoryItem[];
  backgroundColor?: "white" | "muted" | "primary";
}

export function PhotoStory({
  title,
  subtitle,
  items,
  backgroundColor = "white"
}: PhotoStoryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const bgClasses = {
    white: "bg-background",
    muted: "bg-muted/30",
    primary: "bg-gradient-to-br from-primary/5 to-primary/10"
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = Number(entry.target.getAttribute("data-index"));
            setActiveIndex(index);
          }
        });
      },
      { threshold: 0.6, rootMargin: "-20% 0px -20% 0px" }
    );

    const items = containerRef.current?.querySelectorAll("[data-index]");
    items?.forEach((item) => observer.observe(item));

    return () => observer.disconnect();
  }, []);

  return (
    <section className={`py-16 lg:py-24 ${bgClasses[backgroundColor]} relative overflow-hidden`}>
      {/* Padrão decorativo nordestino sutil */}
      {backgroundColor === "muted" && (
        <NordestinoPattern variant="sunset" opacity={0.04} />
      )}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Cabeçalho - título e texto sempre visíveis em qualquer resolução */}
        <div className="text-center mb-12 lg:mb-16 min-w-0">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4 min-w-0 break-words">
            {title}
          </h2>
          {subtitle && (
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto min-w-0 break-words">
              {subtitle}
            </p>
          )}
        </div>

        {/* Mobile: Carrossel Elegante */}
        <div className="lg:hidden group">
          <ElegantCarousel
            itemWidth="full"
            showNavigation={true}
            showProgress={true}
            progressType="minimal"
            centerMode={true}
            autoplay={false}
            gap={6}
          >
            {items.map((item, index) => (
              <div
                key={index}
                className="group/item relative px-2"
              >
                {/* Imagem */}
                <div className="relative aspect-[4/3] overflow-hidden rounded-2xl shadow-xl mb-6">
                  {typeof item.image === "string" ? (
                    item.image && item.image.trim() !== "" ? (
                      <Image
                        src={item.image}
                        alt={typeof item.title === "string" ? item.title : "Slide"}
                        fill
                        className="object-cover"
                        sizes="100vw"
                        priority={index === 0}
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center">
                        <span className="text-muted-foreground/50 text-sm">{item.title}</span>
                      </div>
                    )
                  ) : item.image != null ? (
                    <div className="absolute inset-0 [&>div]:absolute [&>div]:inset-0 [&_img]:object-cover [&_img]:w-full [&_img]:h-full">
                      {item.image}
                    </div>
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center">
                      <span className="text-muted-foreground/50 text-sm">{item.title}</span>
                    </div>
                  )}
                  
                  {/* Overlay com horário */}
                  {item.time && (
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1.5 bg-black/70 text-white rounded-full text-xs font-semibold backdrop-blur-sm">
                        {item.time}
                      </span>
                    </div>
                  )}

                  {/* Número do Item */}
                  <div className="absolute top-4 right-4">
                    <span className="w-8 h-8 rounded-full bg-primary/90 text-white flex items-center justify-center text-sm font-bold">
                      {index + 1}
                    </span>
                  </div>
                </div>

                {/* Conteúdo */}
                <div className="space-y-3 px-2">
                  <h3 className="text-xl font-bold text-foreground">
                    {item.title}
                  </h3>
                  <p className="text-base text-muted-foreground leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </ElegantCarousel>
        </div>

        {/* Desktop: Grid com Scroll Progressivo */}
        <div 
          ref={containerRef}
          className="hidden lg:grid lg:grid-cols-2 gap-8 lg:gap-12 max-w-7xl mx-auto"
        >
          {items.map((item, index) => (
            <div
              key={index}
              data-index={index}
              className="group relative"
            >
              {/* Imagem */}
              <div className="relative aspect-[4/3] overflow-hidden rounded-2xl shadow-xl mb-6">
                {typeof item.image === "string" ? (
                  item.image && item.image.trim() !== "" ? (
                    <Image
                      src={item.image}
                      alt={typeof item.title === "string" ? item.title : "Slide"}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                      sizes="50vw"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center">
                      <span className="text-muted-foreground/50 text-sm">{item.title}</span>
                    </div>
                  )
                ) : item.image != null ? (
                  <div className="absolute inset-0 [&>div]:absolute [&>div]:inset-0 [&_img]:object-cover [&_img]:w-full [&_img]:h-full">
                    {item.image}
                  </div>
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center">
                    <span className="text-muted-foreground/50 text-sm">{item.title}</span>
                  </div>
                )}
                
                {/* Overlay com horário */}
                {item.time && (
                  <div className="absolute top-4 left-4">
                    <span className="px-4 py-2 bg-black/70 text-white rounded-full text-sm font-semibold backdrop-blur-sm">
                      {item.time}
                    </span>
                  </div>
                )}

                {/* Indicador de progresso */}
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20">
                  <div 
                    className="h-full bg-primary transition-all duration-500"
                    style={{ 
                      width: activeIndex >= index ? "100%" : "0%" 
                    }}
                  />
                </div>
              </div>

              {/* Conteúdo */}
              <div className="space-y-3">
                <h3 className="text-2xl font-bold text-foreground group-hover:text-primary transition-colors">
                  {item.title}
                </h3>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  {item.description}
                </p>
              </div>

              {/* Número do Item (decorativo) */}
              <div className="absolute -top-4 -right-4 lg:-right-8 text-8xl font-bold text-primary/5 select-none pointer-events-none">
                {String(index + 1).padStart(2, "0")}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

