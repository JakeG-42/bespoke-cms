import { permanentRedirect } from "next/navigation";

import { getPagePathFromSegments } from "@/lib/payload-site";

type V2RedirectPageProps = {
  params: Promise<{
    slug?: string[];
  }>;
};

export default async function V2RedirectPage({ params }: V2RedirectPageProps) {
  const { slug } = await params;

  permanentRedirect(getPagePathFromSegments(slug));
}
