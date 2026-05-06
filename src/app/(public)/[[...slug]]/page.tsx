import { PayloadSitePage, generatePayloadSiteMetadata, getSlugFromSegments } from "@/lib/payload-site";

export const dynamic = "force-dynamic";

type PayloadRootPageProps = {
  params: Promise<{
    slug?: string[];
  }>;
};

export async function generateMetadata({ params }: PayloadRootPageProps) {
  const { slug: segments } = await params;

  return generatePayloadSiteMetadata({
    indexed: true,
    slug: getSlugFromSegments(segments),
  });
}

export default async function PayloadRootPage({ params }: PayloadRootPageProps) {
  const { slug: segments } = await params;

  return <PayloadSitePage internalLinkBasePath="" slug={getSlugFromSegments(segments)} />;
}
