import type { CollectionConfig } from "payload";

import { adminsOnly, publishedOrAdmin } from "../access.ts";
import { seoFields, slugField, statusField } from "../fields.ts";

const reviewStatusOptions = [
  { label: "Ready", value: "ready" },
  { label: "Draft", value: "draft" },
  { label: "Needs Andersen confirmation", value: "needsConfirmation" },
] as const;

export const HelpArticles: CollectionConfig = {
  slug: "help-articles",
  access: {
    create: adminsOnly,
    delete: adminsOnly,
    read: publishedOrAdmin,
    update: adminsOnly,
  },
  admin: {
    defaultColumns: ["title", "category", "status", "reviewStatus", "sortOrder", "updatedAt"],
    group: "Help Centre",
    useAsTitle: "title",
  },
  labels: {
    plural: "Help articles",
    singular: "Help article",
  },
  fields: [
    {
      name: "title",
      type: "text",
      required: true,
    },
    slugField,
    {
      name: "category",
      type: "relationship",
      admin: {
        description: "Controls which Help Centre bubble/category page this article appears under.",
      },
      relationTo: "help-categories" as unknown as "pages",
      required: true,
    },
    {
      name: "summary",
      type: "textarea",
      required: true,
    },
    {
      name: "body",
      type: "textarea",
      admin: {
        description: "Customer-facing article content. Use blank lines between paragraphs and hyphen lines for lists.",
      },
      required: true,
    },
    {
      name: "sourceUrl",
      type: "text",
      label: "Source URL",
    },
    {
      name: "reviewStatus",
      type: "select",
      admin: {
        description: "Internal editorial status. Published controls public visibility.",
      },
      defaultValue: "draft",
      label: "Review status",
      options: [...reviewStatusOptions],
      required: true,
    },
    {
      name: "sortOrder",
      type: "number",
      admin: {
        description: "Lower numbers appear first within the category.",
      },
      defaultValue: 100,
      label: "Sort order",
      required: true,
    },
    statusField,
    seoFields,
  ],
};
