import type { NextConfig } from "next";
import path from "path";

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
    ],
  },
  outputFileTracingRoot: path.join(process.cwd(), "/proto"),
};

export default nextConfig;
