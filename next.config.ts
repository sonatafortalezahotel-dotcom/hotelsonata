import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
    unoptimized: false,
    qualities: [75, 80, 90, 100],
  },
  // Otimizações de performance
  compress: true,
  poweredByHeader: false,
  
  // Otimizar imports de pacotes grandes
  experimental: {
    optimizePackageImports: [
      'lucide-react',
      '@radix-ui/react-dialog',
      '@radix-ui/react-popover',
      '@radix-ui/react-select',
      '@radix-ui/react-command',
      'date-fns',
    ],
    // Permite payloads grandes para upload de vídeo (até 1GB) em Server Actions
    serverActions: {
      bodySizeLimit: "1gb",
    },
  },
};

export default nextConfig;
