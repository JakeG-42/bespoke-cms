import type { GlobalConfig } from "payload";

import { adminsOnly, isAdminUser } from "../access.ts";

export const ThemeSettings: GlobalConfig = {
  slug: "theme-settings",
  access: {
    read: () => true,
    update: adminsOnly,
  },
  admin: {
    group: "Theme",
    hidden: ({ user }) => !isAdminUser(user),
  },
  fields: [
    {
      name: "preview",
      type: "ui",
      admin: {
        components: {
          Field: "/components/theme/ThemePreview#ThemeSettingsPreviewField",
        },
      },
      label: "Preview",
    },
    {
      name: "activeTemplate",
      type: "relationship",
      admin: {
        description: "The active whole-website template for the Help Centre.",
      },
      label: "Active website template",
      relationTo: "page-templates",
    },
    {
      name: "activeTheme",
      type: "relationship",
      admin: {
        description: "The default visual theme used when a page does not have its own override.",
      },
      label: "Active theme",
      relationTo: "themes",
    },
  ],
};
