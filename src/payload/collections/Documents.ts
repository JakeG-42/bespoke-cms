import type { CollectionConfig } from "payload";

import { authenticatedOnly } from "../access.ts";

export const Documents: CollectionConfig = {
  slug: "documents",
  access: {
    create: authenticatedOnly,
    delete: authenticatedOnly,
    read: () => true,
    update: authenticatedOnly,
  },
  admin: {
    defaultColumns: ["title", "filename", "updatedAt"],
    group: "Assets",
    useAsTitle: "title",
  },
  fields: [
    {
      name: "title",
      type: "text",
      required: true,
    },
    {
      name: "description",
      type: "textarea",
    },
  ],
  upload: {
    mimeTypes: ["application/pdf", "application/zip", "text/plain"],
    staticDir: "public/payload-documents",
  },
};
