import type { MetadataRoute } from "next";

import { siteConfig } from "@/lib/seo";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Bespoke CMS",
    short_name: "Bespoke CMS",
    description: siteConfig.description,
    start_url: "/",
    display: "standalone",
    background_color: "#020617",
    theme_color: "#c084fc",
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
      },
    ],
  };
}
