"use client";

import { useEffect, useRef, useState, useId } from "react";
import { cn } from "@/lib/utils";

interface HeroProps {
  videoId?: string;
  videoUrl?: string;
  className?: string;
  height?: "full" | "screen" | "auto" | string; // Permite valores customizados como "70vh", "80vh", etc.
  showOverlay?: boolean;
  overlayOpacity?: number;
}

// Tipos para YouTube IFrame API
declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
  }
}

export default function Hero({
  videoId = "xptckGz4eH8",
  videoUrl,
  className,
  height = "screen",
  showOverlay = false,
  overlayOpacity = 0.3,
}: HeroProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<any>(null);
  const [useAPI, setUseAPI] = useState(true); // Tentar usar API primeiro
  // Use useId() to generate a stable ID that's consistent between server and client
  const uniqueId = useId();
  const containerId = `youtube-player-${uniqueId.replace(/:/g, '-')}`;

  // Set mounted state to prevent hydration mismatch
  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!videoId || !isMounted) return;

    const initializePlayer = () => {
      const element = document.getElementById(containerId);
      if (!element || !window.YT || !window.YT.Player) {
        // Fallback: usar iframe simples se API não estiver disponível
        setUseAPI(false);
        setIsLoaded(true);
        return;
      }

      try {
        playerRef.current = new window.YT.Player(containerId, {
          videoId: videoId,
          playerVars: {
            autoplay: 1,
            mute: 1,
            loop: 1,
            playlist: videoId,
            controls: 0,
            showinfo: 0,
            rel: 0,
            iv_load_policy: 3,
            modestbranding: 1,
            playsinline: 1,
            quality: "hd1080",
            vq: "hd1080",
          },
          events: {
            onReady: (event: any) => {
              try {
                const availableQualities = ["highres", "hd1080", "hd720", "large"];
                for (const quality of availableQualities) {
                  try {
                    event.target.setPlaybackQuality(quality);
                    break;
                  } catch (e) {
                    continue;
                  }
                }
              } catch (e) {
                // Ignorar erros
              }
              setIsLoaded(true);
            },
            onError: () => {
              // Se houver erro, usar fallback
              setUseAPI(false);
              setIsLoaded(true);
            },
            onStateChange: (event: any) => {
              if (event.data === window.YT.PlayerState.PLAYING || event.data === window.YT.PlayerState.BUFFERING) {
                try {
                  const availableQualities = ["highres", "hd1080", "hd720", "large"];
                  for (const quality of availableQualities) {
                    try {
                      event.target.setPlaybackQuality(quality);
                      break;
                    } catch (e) {
                      continue;
                    }
                  }
                } catch (e) {
                  // Ignorar erros
                }
              }
            },
          },
        });
        setUseAPI(true);
      } catch (error) {
        console.error("Erro ao inicializar player do YouTube:", error);
        setUseAPI(false);
        setIsLoaded(true);
      }
    };

    // Carregar YouTube IFrame API
    if (!window.YT) {
      const existingScript = document.querySelector('script[src="https://www.youtube.com/iframe_api"]');
      if (!existingScript) {
        const tag = document.createElement("script");
        tag.src = "https://www.youtube.com/iframe_api";
        const firstScriptTag = document.getElementsByTagName("script")[0];
        firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);
      }

      // Salvar callback anterior se existir
      const previousCallback = window.onYouTubeIframeAPIReady;
      window.onYouTubeIframeAPIReady = () => {
        if (previousCallback) previousCallback();
        setTimeout(initializePlayer, 100);
      };
    } else if (window.YT && window.YT.Player) {
      setTimeout(initializePlayer, 100);
    }

    // Timeout de segurança: se API não carregar em 2 segundos, usar iframe simples
    const timeout = setTimeout(() => {
      setUseAPI(false);
      setIsLoaded(true);
    }, 2000);

    return () => {
      clearTimeout(timeout);
      if (playerRef.current) {
        try {
          playerRef.current.destroy();
        } catch (e) {
          // Ignorar erros
        }
        playerRef.current = null;
      }
    };
  }, [videoId, containerId, isMounted]);

  const heightClasses = {
    full: "h-full",
    screen: "h-screen",
    auto: "h-auto min-h-[60vh]",
  };

  // Verifica se height é um valor customizado (contém "vh", "px", etc.)
  const isCustomHeight = height && !heightClasses[height as keyof typeof heightClasses];
  const heightStyle = isCustomHeight ? { height: height } : undefined;
  const heightClass = isCustomHeight ? "" : heightClasses[height as keyof typeof heightClasses] || heightClasses.screen;

  return (
    <section
      className={cn(
        "relative w-full overflow-hidden",
        heightClass,
        className
      )}
      style={heightStyle}
      aria-label="Hero section com vídeo"
    >
      {/* Video Container */}
      <div className="absolute inset-0 w-full h-full">
        {videoUrl ? (
          // Vídeo direto via URL
          <video
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover"
            aria-label="Vídeo de fundo"
          >
            <source src={videoUrl} type="video/mp4" />
          </video>
        ) : (
          // Vídeo do YouTube com qualidade máxima
          <div className="absolute inset-0 w-full h-full">
            {/* Container para API - sempre presente */}
            <div
              id={containerId}
              ref={containerRef}
              className={useAPI ? "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none" : "hidden"}
              style={useAPI ? {
                width: "100vw",
                height: "56.25vw",
                minHeight: "100vh",
                minWidth: "177.77vh",
              } : undefined}
            />
            {/* Fallback iframe - mostrado se API não funcionar */}
            {!useAPI && (
              <iframe
                src={`https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&loop=1&playlist=${videoId}&controls=0&showinfo=0&rel=0&iv_load_policy=3&modestbranding=1&playsinline=1&enablejsapi=1&quality=hd1080&vq=hd1080`}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
                style={{
                  width: "100vw",
                  height: "56.25vw",
                  minHeight: "100vh",
                  minWidth: "177.77vh",
                }}
                allow="autoplay; encrypted-media; accelerometer; gyroscope; picture-in-picture"
                allowFullScreen
                title="Vídeo do Hotel Sonata de Iracema"
                loading="lazy"
                aria-label="Vídeo promocional do hotel"
                onLoad={() => setIsLoaded(true)}
              />
            )}
          </div>
        )}
      </div>

      {/* Overlay opcional */}
      {showOverlay && (
        <div
          className="absolute inset-0 bg-black/40"
          style={{ opacity: overlayOpacity }}
          aria-hidden="true"
        />
      )}

      {/* Loading state */}
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-primary/20">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary-foreground/20 border-t-primary-foreground" />
        </div>
      )}
    </section>
  );
}

