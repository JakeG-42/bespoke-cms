import type { Access, ClientUser, FieldAccess, PayloadRequest } from "payload";

type UserWithRole = {
  role?: unknown;
};

export function isAdminUser(user: ClientUser | PayloadRequest["user"] | null | undefined) {
  return typeof user === "object" && user !== null && (user as UserWithRole).role === "admin";
}

export function isEditorUser(user: ClientUser | PayloadRequest["user"] | null | undefined) {
  return typeof user === "object" && user !== null && (user as UserWithRole).role === "editor";
}

export function isAuthenticatedUser(user: ClientUser | PayloadRequest["user"] | null | undefined) {
  return Boolean(user);
}

export const adminsOnly: Access = ({ req }) => isAdminUser(req.user);

export const authenticatedOnly: Access = ({ req }) => isAuthenticatedUser(req.user);

export const adminsOrSelf: Access = ({ req }) => {
  if (isAdminUser(req.user)) {
    return true;
  }

  if (req.user?.id) {
    return {
      id: {
        equals: req.user.id,
      },
    };
  }

  return false;
};

export const adminFieldOnly: FieldAccess = ({ req }) => isAdminUser(req.user);

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
