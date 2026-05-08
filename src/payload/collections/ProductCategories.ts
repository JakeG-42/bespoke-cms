import type { CollectionConfig } from "payload";

import { adminsOnly } from "../access.ts";
import { slugField } from "../fields.ts";

export const ProductCategories: CollectionConfig = {
  slug: "product-categories",
  access: {
    create: adminsOnly,
    delete: adminsOnly,
    read: () => true,
    update: adminsOnly,
  },
  admin: {
    defaultColumns: ["name", "slug", "updatedAt"],
    group: "Products",
    hidden: true,
    useAsTitle: "name",
  },
  fields: [
    {
      name: "name",
      type: "text",
      required: true,
    },
    slugField,
    {
      name: "description",
      type: "textarea",
    },
  ],
};
