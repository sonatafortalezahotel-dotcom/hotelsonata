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
  },
  // Otimizações de performance
  compress: true,
  poweredByHeader: false,
};

export default nextConfig;
