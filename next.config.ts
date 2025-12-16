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
    qualities: [75, 90],
  },
  // Otimizações de performance
  compress: true,
  poweredByHeader: false,
};

export default nextConfig;
