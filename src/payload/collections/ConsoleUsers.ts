import type { CollectionConfig } from "payload";

export const ConsoleUsers: CollectionConfig = {
  slug: "console-users",
  auth: true,
  access: {
    create: ({ req }) => Boolean(req.user),
    delete: ({ req }) => Boolean(req.user),
    read: ({ req }) => Boolean(req.user),
    update: ({ req }) => Boolean(req.user),
  },
  admin: {
    defaultColumns: ["email", "name", "role", "updatedAt"],
    group: "Console",
    useAsTitle: "email",
  },
  fields: [
    {
      name: "name",
      type: "text",
    },
    {
      name: "role",
      type: "select",
      admin: {
        description: "Use Admin for now. Editor is available for future limited-access accounts.",
      },
      defaultValue: "admin",
      options: [
        {
          label: "Admin",
          value: "admin",
        },
        {
          label: "Editor",
          value: "editor",
        },
      ],
      required: true,
    },
  ],
};
