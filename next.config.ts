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
      "./components.json",
      "./eslint.config.mjs",
      "./next.config.ts",
      "./package.json",
      "./payload.config.ts",
      "./postcss.config.mjs",
      "./README.md",
      "./tsconfig.json",
      "./vercel.json",
    ],
  },
};

export default withPayload(nextConfig);
