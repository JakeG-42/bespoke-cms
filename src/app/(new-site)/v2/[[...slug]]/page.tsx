import { redirect } from "next/navigation";

type LegacyV2PageProps = {
  params: Promise<{
    slug?: string[];
  }>;
};

export const dynamic = "force-dynamic";

export default async function LegacyV2Page({ params }: LegacyV2PageProps) {
  const { slug } = await params;
  const path = slug?.length ? `/preview/${slug.join("/")}` : "/preview";

  redirect(path);
}
