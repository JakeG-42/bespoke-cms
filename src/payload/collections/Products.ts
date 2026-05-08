import type { CollectionConfig } from "payload";

import { adminsOnly, publishedOrAdmin } from "../access.ts";
import { seoFields, slugField, statusField } from "../fields.ts";

export const Products: CollectionConfig = {
  slug: "products",
  access: {
    create: adminsOnly,
    delete: adminsOnly,
    read: publishedOrAdmin,
    update: adminsOnly,
  },
  admin: {
    defaultColumns: ["name", "category", "status", "featured", "updatedAt"],
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
    statusField,
    {
      name: "featured",
      type: "checkbox",
      defaultValue: false,
    },
    {
      name: "category",
      type: "relationship",
      relationTo: "product-categories",
    },
    {
      name: "family",
      type: "text",
      required: true,
    },
    {
      name: "template",
      type: "select",
      defaultValue: "website",
      options: [
        {
          label: "Website package",
          value: "website",
        },
        {
          label: "Commerce package",
          value: "commerce",
        },
        {
          label: "Workflow package",
          value: "workflow",
        },
      ],
      required: true,
    },
    {
      name: "summary",
      type: "textarea",
      required: true,
    },
    {
      name: "description",
      type: "richText",
      required: true,
    },
    {
      name: "gallery",
      type: "upload",
      hasMany: true,
      relationTo: "media",
    },
    {
      name: "highlights",
      type: "array",
      fields: [
        {
          name: "text",
          type: "text",
          required: true,
        },
      ],
    },
    {
      name: "specifications",
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
    },
    {
      name: "documents",
      type: "relationship",
      hasMany: true,
      relationTo: "documents",
    },
    {
      name: "variants",
      type: "array",
      fields: [
        {
          name: "name",
          type: "text",
          required: true,
        },
        {
          name: "details",
          type: "textarea",
        },
        {
          name: "sku",
          type: "text",
          label: "SKU",
        },
        {
          name: "articleNumber",
          type: "text",
          label: "Article number",
        },
        {
          name: "price",
          type: "text",
        },
      ],
    },
    {
      name: "enquiryPrompt",
      type: "text",
      defaultValue: "Discuss this product",
      label: "Enquiry prompt",
      required: true,
    },
    seoFields,
  ],
};
