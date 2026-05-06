import type { CollectionConfig } from "payload";

import { adminsOnly } from "../access.ts";

export const Menus: CollectionConfig = {
  slug: "menus",
  access: {
    create: adminsOnly,
    delete: adminsOnly,
    read: () => true,
    update: adminsOnly,
  },
  admin: {
    defaultColumns: ["name", "handle", "updatedAt"],
    group: "Theme",
    useAsTitle: "name",
  },
  fields: [
    {
      name: "name",
      type: "text",
      required: true,
    },
    {
      name: "handle",
      type: "text",
      admin: {
        description: "Short key used by the WYSIWYG editor, for example main-menu or footer-links.",
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
    },
    {
      name: "items",
      type: "array",
      admin: {
        description: "Add, remove, rename and reorder the links in this menu.",
      },
      fields: [
        {
          name: "label",
          type: "text",
          required: true,
        },
        {
          name: "url",
          type: "text",
          required: true,
        },
        {
          name: "dropdownItems",
          type: "textarea",
          admin: {
            description: "Optional dropdown links. Add one per line as: Label | /url",
          },
          label: "Dropdown items",
        },
      ],
      label: "Menu items",
    },
  ],
};
