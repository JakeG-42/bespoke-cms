import type { CollectionConfig } from "payload";

import { adminsOnly } from "../access.ts";

export const HelpArticleAnalytics: CollectionConfig = {
  slug: "help-article-analytics",
  access: {
    create: adminsOnly,
    delete: adminsOnly,
    read: adminsOnly,
    update: adminsOnly,
  },
  admin: {
    defaultColumns: ["articleTitle", "views", "helpfulVote", "totalSeconds", "lastViewedAt"],
    group: "Analytics",
    useAsTitle: "articleTitle",
  },
  labels: {
    plural: "Article analytics",
    singular: "Article analytics",
  },
  fields: [
    {
      name: "articlePath",
      type: "text",
      index: true,
      label: "Article path",
      required: true,
    },
    {
      name: "articleTitle",
      type: "text",
      label: "Article title",
      required: true,
    },
    {
      name: "categorySlug",
      type: "text",
      index: true,
      label: "Category slug",
      required: true,
    },
    {
      name: "browserId",
      type: "text",
      admin: {
        description: "Anonymous browser identifier used to avoid duplicate article votes.",
      },
      index: true,
      label: "Browser ID",
      required: true,
    },
    {
      name: "views",
      type: "number",
      defaultValue: 0,
      required: true,
    },
    {
      name: "totalSeconds",
      type: "number",
      defaultValue: 0,
      label: "Total seconds",
      required: true,
    },
    {
      name: "helpfulVote",
      type: "select",
      label: "Helpful vote",
      options: [
        { label: "Helpful", value: "helpful" },
        { label: "Not helpful", value: "notHelpful" },
      ],
    },
    {
      name: "lastViewedAt",
      type: "date",
      label: "Last viewed at",
    },
  ],
};
