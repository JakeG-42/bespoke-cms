import type { Block } from "payload";

export const ProductGridBlock: Block = {
  slug: "productGrid",
  fields: [
    {
      name: "heading",
      type: "text",
      required: true,
    },
    {
      name: "intro",
      type: "textarea",
    },
    {
      name: "mode",
      type: "select",
      defaultValue: "featured",
      options: [
        {
          label: "Featured products",
          value: "featured",
        },
        {
          label: "Manual selection",
          value: "manual",
        },
      ],
      required: true,
    },
    {
      name: "products",
      type: "relationship",
      admin: {
        condition: (_, siblingData) => siblingData.mode === "manual",
      },
      hasMany: true,
      relationTo: "products",
    },
  ],
  labels: {
    plural: "Product grids",
    singular: "Product grid",
  },
};
