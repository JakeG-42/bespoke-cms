import type { Access, FieldAccess } from "payload";

export const adminsOnly: Access = ({ req }) => Boolean(req.user);

export const adminFieldOnly: FieldAccess = ({ req }) => Boolean(req.user);

export const publishedOrAdmin: Access = ({ req }) => {
  if (req.user) {
    return true;
  }

  return {
    status: {
      equals: "published",
    },
  };
};
