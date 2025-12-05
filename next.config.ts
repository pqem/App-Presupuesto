import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/App-Presupuesto",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
