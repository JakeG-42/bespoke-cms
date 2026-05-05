import type { Block } from "payload";

export const GalleryBlock: Block = {
  slug: "gallery",
  fields: [
    {
      name: "heading",
      type: "text",
    },
    {
      name: "images",
      type: "upload",
      hasMany: true,
      relationTo: "media",
      required: true,
    },
  ],
  labels: {
    plural: "Galleries",
    singular: "Gallery",
  },
};
