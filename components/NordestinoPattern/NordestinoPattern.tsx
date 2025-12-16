"use client";

import { cn } from "@/lib/utils";

interface NordestinoPatternProps {
  variant?: "lace" | "tile" | "waves" | "sunset";
  className?: string;
  opacity?: number;
}

/**
 * Componente decorativo que adiciona padrões visuais inspirados na cultura nordestina
 * - lace: Padrão inspirado em renda de bilro
 * - tile: Padrão inspirado em azulejos nordestinos
 * - waves: Padrão de ondas do mar
 * - sunset: Gradiente de pôr do sol
 */
export default function NordestinoPattern({
  variant = "lace",
  className,
  opacity = 0.1,
}: NordestinoPatternProps) {
  const patterns = {
    lace: (
      <div
        className={cn("absolute inset-0 pointer-events-none", className)}
        style={{
          backgroundImage: `
            repeating-linear-gradient(45deg, transparent, transparent 8px, 
              hsl(var(--nordeste-areia) / ${opacity}) 8px, 
              hsl(var(--nordeste-areia) / ${opacity}) 16px),
            repeating-linear-gradient(-45deg, transparent, transparent 8px, 
              hsl(var(--nordeste-areia) / ${opacity}) 8px, 
              hsl(var(--nordeste-areia) / ${opacity}) 16px)
          `,
        }}
        aria-hidden="true"
      />
    ),
    tile: (
      <div
        className={cn("absolute inset-0 pointer-events-none", className)}
        style={{
          backgroundImage: `
            linear-gradient(90deg, transparent 0%, transparent 48%, 
              hsl(var(--nordeste-sol) / ${opacity}) 49%, 
              hsl(var(--nordeste-sol) / ${opacity}) 51%, 
              transparent 52%, transparent 100%),
            linear-gradient(0deg, transparent 0%, transparent 48%, 
              hsl(var(--nordeste-sol) / ${opacity}) 49%, 
              hsl(var(--nordeste-sol) / ${opacity}) 51%, 
              transparent 52%, transparent 100%)
          `,
          backgroundSize: "40px 40px",
        }}
        aria-hidden="true"
      />
    ),
    waves: (
      <div
        className={cn("absolute inset-0 pointer-events-none overflow-hidden", className)}
        aria-hidden="true"
      >
        <svg
          className="absolute inset-0 w-full h-full"
          viewBox="0 0 1200 200"
          preserveAspectRatio="none"
          style={{ opacity }}
        >
          <path
            d="M0,100 Q300,50 600,100 T1200,100 L1200,200 L0,200 Z"
            fill={`hsl(var(--nordeste-ceu) / 0.3)`}
          />
          <path
            d="M0,120 Q300,80 600,120 T1200,120 L1200,200 L0,200 Z"
            fill={`hsl(var(--nordeste-areia) / 0.2)`}
          />
        </svg>
      </div>
    ),
    sunset: (
      <div
        className={cn("absolute inset-0 pointer-events-none", className)}
        style={{
          background: `linear-gradient(135deg, 
            hsl(var(--nordeste-ocaso) / ${opacity}) 0%, 
            hsl(var(--nordeste-sol) / ${opacity * 0.7}) 50%, 
            hsl(var(--nordeste-terra) / ${opacity * 0.5}) 100%)`,
        }}
        aria-hidden="true"
      />
    ),
  };

  return patterns[variant];
}

