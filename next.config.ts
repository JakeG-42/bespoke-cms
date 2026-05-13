import type { NextConfig } from "next";
import { withPayload } from "@payloadcms/next/withPayload";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
      {
        protocol: "http",
        hostname: "**",
      },
    ],
  },
  outputFileTracingIncludes: {
    "/api/console-code/*": [
      "./docs/**/*",
      "./public/**/*",
      "./scripts/**/*",
      "./src/**/*",
      "./eslint.config.mjs",
      "./next.config.ts",
      "./package.json",
      "./payload.config.ts",
      "./README.md",
      "./tsconfig.json",
      "./vercel.json",
    ],
  },
};

export default withPayload(nextConfig);
