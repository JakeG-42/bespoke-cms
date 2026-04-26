import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "eltronic.co.uk",
      },
      {
        protocol: "https",
        hostname: "www.autopi.io",
      },
    ],
  },
};

export default nextConfig;
