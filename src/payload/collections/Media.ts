import type { CollectionConfig } from "payload";

import { authenticatedOnly } from "../access.ts";

export const Media: CollectionConfig = {
  slug: "media",
  access: {
    create: authenticatedOnly,
    delete: authenticatedOnly,
    read: () => true,
    update: authenticatedOnly,
  },
  admin: {
    defaultColumns: ["filename", "alt", "updatedAt"],
    group: "Assets",
    useAsTitle: "alt",
  },
  fields: [
    {
      name: "alt",
      type: "text",
      label: "Alt text",
      required: true,
    },
    {
      name: "caption",
      type: "text",
    },
  ],
  upload: {
    mimeTypes: ["image/*"],
    staticDir: "public/payload-media",
  },
};
