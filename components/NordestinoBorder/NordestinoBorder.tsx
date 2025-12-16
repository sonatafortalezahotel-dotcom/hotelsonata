"use client";

import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface NordestinoBorderProps {
  children: ReactNode;
  variant?: "tile" | "lace" | "sunset" | "simple";
  className?: string;
  intensity?: "light" | "medium" | "strong";
}

/**
 * Componente que adiciona bordas decorativas inspiradas na cultura nordestina
 * - tile: Borda inspirada em azulejos
 * - lace: Borda inspirada em renda de bilro
 * - sunset: Borda com gradiente de pôr do sol
 * - simple: Borda simples com cores nordestinas
 */
export default function NordestinoBorder({
  children,
  variant = "simple",
  className,
  intensity = "medium",
}: NordestinoBorderProps) {
  const intensityMap = {
    light: 0.2,
    medium: 0.4,
    strong: 0.6,
  };

  const opacity = intensityMap[intensity];

  const variants = {
    tile: (
      <div
        className={cn("relative", className)}
        style={{
          border: `2px solid transparent`,
          background: `
            linear-gradient(white, white) padding-box,
            repeating-linear-gradient(
              45deg,
              hsl(var(--nordeste-sol) / ${opacity}),
              hsl(var(--nordeste-sol) / ${opacity}) 10px,
              hsl(var(--nordeste-terra) / ${opacity}) 10px,
              hsl(var(--nordeste-terra) / ${opacity}) 20px
            ) border-box
          `,
        }}
      >
        {children}
      </div>
    ),
    lace: (
      <div
        className={cn(
          "relative border-2",
          "border-amber-300/30 dark:border-amber-700/30",
          className
        )}
      >
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: `
              repeating-linear-gradient(0deg, transparent, transparent 8px, 
                hsl(var(--nordeste-areia) / ${opacity}) 8px, 
                hsl(var(--nordeste-areia) / ${opacity}) 9px),
              repeating-linear-gradient(90deg, transparent, transparent 8px, 
                hsl(var(--nordeste-areia) / ${opacity}) 8px, 
                hsl(var(--nordeste-areia) / ${opacity}) 9px)
            `,
            backgroundSize: "16px 16px",
          }}
        />
        <div className="relative z-10">{children}</div>
      </div>
    ),
    sunset: (
      <div
        className={cn("relative overflow-hidden", className)}
        style={{
          border: `3px solid transparent`,
          background: `
            linear-gradient(white, white) padding-box,
            linear-gradient(135deg, 
              hsl(var(--nordeste-ocaso) / ${opacity}), 
              hsl(var(--nordeste-sol) / ${opacity}), 
              hsl(var(--nordeste-terra) / ${opacity}),
              hsl(var(--primary) / ${opacity})
            ) border-box
          `,
        }}
      >
        {children}
      </div>
    ),
    simple: (
      <div
        className={cn(
          "relative border-2",
          "border-amber-400/40 dark:border-amber-600/40",
          "shadow-[0_0_0_1px_hsl(var(--nordeste-sol)/0.1)]",
          className
        )}
      >
        {children}
      </div>
    ),
  };

  return variants[variant];
}

