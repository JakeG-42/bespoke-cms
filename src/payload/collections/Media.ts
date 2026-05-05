import type { CollectionConfig } from "payload";

import { adminsOnly } from "../access.ts";

export const Media: CollectionConfig = {
  slug: "media",
  access: {
    create: adminsOnly,
    delete: adminsOnly,
    read: () => true,
    update: adminsOnly,
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
