import { permanentRedirect } from "next/navigation";

import { getPagePathFromSegments } from "@/lib/payload-site";

type PreviewRedirectPageProps = {
  params: Promise<{
    slug?: string[];
  }>;
};

export default async function PreviewRedirectPage({ params }: PreviewRedirectPageProps) {
  const { slug } = await params;

  permanentRedirect(getPagePathFromSegments(slug));
}
