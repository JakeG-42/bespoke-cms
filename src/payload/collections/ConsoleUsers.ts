import type { CollectionConfig } from "payload";

import { adminFieldOnly, adminsOnly, adminsOrSelf, isAdminUser } from "../access.ts";

export const ConsoleUsers: CollectionConfig = {
  slug: "console-users",
  auth: true,
  access: {
    create: adminsOnly,
    delete: adminsOnly,
    read: adminsOrSelf,
    update: adminsOnly,
  },
  admin: {
    defaultColumns: ["email", "name", "role", "updatedAt"],
    group: "Console",
    hidden: ({ user }) => !isAdminUser(user),
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
        description: "Admins can manage the full console. Editors only see the content areas needed for day-to-day updates.",
      },
      access: {
        create: adminFieldOnly,
        read: adminFieldOnly,
        update: adminFieldOnly,
      },
      defaultValue: "editor",
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
