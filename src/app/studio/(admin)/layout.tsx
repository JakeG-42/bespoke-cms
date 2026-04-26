import { redirect } from "next/navigation";

import { StudioShell } from "@/components/studio/studio-shell";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { getStorageMode, hasPersistentStorage } from "@/lib/managed-data";

export default async function StudioAdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  if (!(await isAdminAuthenticated())) {
    redirect("/studio/login");
  }

  return (
    <StudioShell storageConfigured={hasPersistentStorage()} storageMode={getStorageMode()}>
      {children}
    </StudioShell>
  );
}
