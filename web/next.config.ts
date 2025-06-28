import type {NextConfig} from "next";

const nextConfig: NextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "storage.foreclosedhub.com",
                port: "",
                pathname: "**",
                search: "",
            },
            {
                protocol: "https",
                hostname: "www.securitybank.com",
                port: "",
                pathname: "/wp-content/uploads/**",
                search: "",
            },
            {
                protocol: "https",
                hostname: "www.unionbankph.com",
                port: "",
                pathname: "/sites/default/files/**",
                search: "",
            },
        ],
    },
};

export default nextConfig;
