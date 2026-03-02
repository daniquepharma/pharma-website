import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb',
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.googleusercontent.com', // For Google Auth profile pictures
      }
    ],
  },
  env: {
    NEXTAUTH_URL: process.env.NEXTAUTH_URL || "https://daniquepharma.in",
  },
};

export default nextConfig;
