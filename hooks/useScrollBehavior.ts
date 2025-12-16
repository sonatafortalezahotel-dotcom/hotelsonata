import { useState, useEffect } from "react";
import { useDebounce } from "use-debounce";

interface ScrollBehavior {
  isScrolled: boolean;
  scrollY: number;
}

/**
 * Hook para gerenciar comportamento de scroll do header
 * Retorna estado de scroll com debounce para performance
 */
export function useScrollBehavior(threshold: number = 50): ScrollBehavior {
  const [scrollY, setScrollY] = useState(0);
  const [debouncedScrollY] = useDebounce(scrollY, 10);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    // Adiciona listener com passive para melhor performance
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return {
    isScrolled: debouncedScrollY > threshold,
    scrollY: debouncedScrollY,
  };
}

