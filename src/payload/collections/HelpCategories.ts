import type { CollectionConfig } from "payload";

import { adminsOnly, publishedOrAdmin } from "../access.ts";
import { slugField, statusField } from "../fields.ts";

const iconOptions = [
  { label: "Product", value: "product" },
  { label: "Support", value: "support" },
  { label: "Installation", value: "installation" },
  { label: "How do I", value: "howTo" },
  { label: "Troubleshooting", value: "troubleshooting" },
  { label: "Installers", value: "installers" },
  { label: "Setup", value: "setup" },
] as const;

export const HelpCategories: CollectionConfig = {
  slug: "help-categories",
  access: {
    create: adminsOnly,
    delete: adminsOnly,
    read: publishedOrAdmin,
    update: adminsOnly,
  },
  admin: {
    defaultColumns: ["title", "slug", "status", "sortOrder", "updatedAt"],
    group: "Help Centre",
    useAsTitle: "title",
  },
  labels: {
    plural: "Help categories",
    singular: "Help category",
  },
  fields: [
    {
      name: "title",
      type: "text",
      required: true,
    },
    slugField,
    {
      name: "description",
      type: "textarea",
      required: true,
    },
    {
      name: "icon",
      type: "select",
      defaultValue: "support",
      options: [...iconOptions],
      required: true,
    },
    {
      name: "sortOrder",
      type: "number",
      admin: {
        description: "Lower numbers appear first on Help Centre category pages.",
      },
      defaultValue: 100,
      label: "Sort order",
      required: true,
    },
    statusField,
  ],
};
