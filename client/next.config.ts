import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "5000",
        pathname: "/uploads/**",
      },
      {
        protocol: "https",
        hostname: "aesthetic-webworks-production.up.railway.app",
        pathname: "/uploads/**",
      },
    ],
  },
}

export default nextConfig
