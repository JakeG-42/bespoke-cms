import type { Block } from "payload";

export const DownloadsBlock: Block = {
  slug: "downloads",
  fields: [
    {
      name: "heading",
      type: "text",
      required: true,
    },
    {
      name: "documents",
      type: "relationship",
      hasMany: true,
      relationTo: "documents",
    },
  ],
  labels: {
    plural: "Download sections",
    singular: "Download section",
  },
};
