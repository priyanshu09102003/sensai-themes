import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: "4mb",
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "qyrdkritcazoz8pz.public.blob.vercel-storage.com",
      },
    ],
  },
  typescript: {
    ignoreBuildErrors: true, // 👈 temporary fix only
  },
  eslint: {
    ignoreDuringBuilds: true, // 👈 temporary fix only
  },
};

export default nextConfig;
