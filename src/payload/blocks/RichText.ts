import type { Block } from "payload";

export const RichTextBlock: Block = {
  slug: "richText",
  fields: [
    {
      name: "content",
      type: "richText",
      required: true,
    },
  ],
  labels: {
    plural: "Rich text sections",
    singular: "Rich text section",
  },
};
