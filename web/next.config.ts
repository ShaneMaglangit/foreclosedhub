import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "storage.googleapis.com",
        port: "",
        pathname: "/*-homagochi/**",
        search: "",
      },
      {
        protocol: "https",
        hostname: "www.securitybank.com",
        port: "",
        pathname: "/wp-content/uploads/**",
        search: "",
      },
    ],
  },
};

export default nextConfig;
