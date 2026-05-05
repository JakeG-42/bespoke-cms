import type { Field } from "payload";

export const statusField: Field = {
  name: "status",
  type: "select",
  defaultValue: "draft",
  index: true,
  options: [
    {
      label: "Draft",
      value: "draft",
    },
    {
      label: "Published",
      value: "published",
    },
  ],
  required: true,
};

export const slugField: Field = {
  name: "slug",
  type: "text",
  admin: {
    description: "Lowercase URL segment. Use letters, numbers and hyphens.",
  },
  hooks: {
    beforeValidate: [
      ({ value }) =>
        typeof value === "string"
          ? value
              .trim()
              .toLowerCase()
              .replace(/[^a-z0-9]+/g, "-")
              .replace(/(^-|-$)/g, "")
          : value,
    ],
  },
  index: true,
  required: true,
  unique: true,
};

export const seoFields: Field = {
  name: "seo",
  type: "group",
  admin: {
    description: "Optional search/social metadata. Leave blank to use the page title and summary.",
  },
  fields: [
    {
      name: "title",
      type: "text",
      label: "SEO title",
    },
    {
      name: "description",
      type: "textarea",
      label: "SEO description",
      maxLength: 180,
    },
    {
      name: "image",
      type: "upload",
      relationTo: "media",
      label: "Social image",
    },
  ],
};

export function createLinkFields({ required }: { required: boolean }): Field[] {
  return [
    {
      name: "label",
      type: "text",
      required,
    },
    {
      name: "url",
      type: "text",
      required,
    },
  ];
}

export const linkFields = createLinkFields({ required: true });

export const optionalLinkFields = createLinkFields({ required: false });

export const requiredLinkFields = createLinkFields({ required: true });
