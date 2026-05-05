import type { Block } from "payload";

export const SpecTableBlock: Block = {
  slug: "specTable",
  fields: [
    {
      name: "heading",
      type: "text",
      required: true,
    },
    {
      name: "rows",
      type: "array",
      fields: [
        {
          name: "label",
          type: "text",
          required: true,
        },
        {
          name: "value",
          type: "text",
          required: true,
        },
      ],
      minRows: 1,
    },
  ],
  labels: {
    plural: "Specification tables",
    singular: "Specification table",
  },
};
