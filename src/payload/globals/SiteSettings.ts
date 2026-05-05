import type { GlobalConfig } from "payload";

import { adminsOnly } from "../access.ts";
import { seoFields } from "../fields.ts";

export const SiteSettings: GlobalConfig = {
  slug: "site-settings",
  access: {
    read: () => true,
    update: adminsOnly,
  },
  admin: {
    group: "Settings",
  },
  fields: [
    {
      name: "siteName",
      type: "text",
      defaultValue: "Eltronic",
      required: true,
    },
    {
      name: "strapline",
      type: "text",
    },
    {
      name: "contactEmail",
      type: "email",
      label: "Contact email",
    },
    {
      name: "contactPhone",
      type: "text",
      label: "Contact phone",
    },
    {
      name: "logo",
      type: "upload",
      relationTo: "media",
    },
    seoFields,
  ],
};
