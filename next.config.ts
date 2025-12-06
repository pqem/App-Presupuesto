import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Configuración para Vercel (soporta SSR y todas las features de Next.js)
  reactStrictMode: true,
  
  // Optimizaciones de imágenes habilitadas (Vercel lo soporta)
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'www.gstatic.com',
      },
    ],
  },
};

export default nextConfig;
