import config from "@payload-config";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { getPayload } from "payload";

import { isAdminUser } from "@/payload/access";

import { CodeWorkspaceClient } from "./CodeWorkspaceClient";

export async function CodeWorkspaceView() {
  const payload = await getPayload({ config });
  const auth = await payload.auth({ headers: (await headers()) as Headers });

  if (!isAdminUser(auth.user)) {
    redirect("/console");
  }

  return <CodeWorkspaceClient />;
}
