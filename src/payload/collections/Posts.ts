import type { CollectionConfig } from "payload";

import { adminsOnly, publishedOrAdmin } from "../access.ts";
import { pageBlocks } from "../blocks/index.ts";
import { seoFields, slugField, statusField } from "../fields.ts";

export const Posts: CollectionConfig = {
  slug: "posts",
  access: {
    create: adminsOnly,
    delete: adminsOnly,
    read: publishedOrAdmin,
    update: adminsOnly,
  },
  admin: {
    defaultColumns: ["title", "slug", "status", "publishedAt"],
    group: "Content",
    useAsTitle: "title",
  },
  fields: [
    {
      name: "title",
      type: "text",
      required: true,
    },
    slugField,
    {
      name: "summary",
      type: "textarea",
      required: true,
    },
    statusField,
    {
      name: "publishedAt",
      type: "date",
      admin: {
        date: {
          pickerAppearance: "dayAndTime",
        },
      },
      label: "Published at",
    },
    {
      name: "featuredImage",
      type: "upload",
      label: "Featured image",
      relationTo: "media",
    },
    {
      name: "layout",
      type: "blocks",
      blocks: pageBlocks,
      required: true,
    },
    seoFields,
  ],
};
