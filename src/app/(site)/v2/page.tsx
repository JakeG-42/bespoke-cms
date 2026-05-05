import type { Metadata } from "next";
import config from "@payload-config";
import { getPayload } from "payload";

import { PayloadPageRenderer } from "@/components/payload/payload-page-renderer";
import type { Page, Product } from "@/payload-types";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "New Eltronic",
  robots: {
    index: false,
    follow: false,
  },
};

async function getPayloadHomePage(): Promise<Page | null> {
  try {
    const payload = await getPayload({ config });
    const result = await payload.find({
      collection: "pages",
      depth: 2,
      limit: 1,
      where: {
        and: [
          {
            slug: {
              equals: "home",
            },
          },
          {
            status: {
              equals: "published",
            },
          },
        ],
      },
    });

    return result.docs[0] ?? null;
  } catch (error) {
    console.error("Unable to load Payload v2 home page.", error);
    return null;
  }
}

async function getFeaturedProducts(): Promise<Product[]> {
  try {
    const payload = await getPayload({ config });
    const featured = await payload.find({
      collection: "products",
      depth: 1,
      limit: 6,
      sort: "-updatedAt",
      where: {
        and: [
          {
            status: {
              equals: "published",
            },
          },
          {
            featured: {
              equals: true,
            },
          },
        ],
      },
    });

    if (featured.docs.length) {
      return featured.docs;
    }

    const fallback = await payload.find({
      collection: "products",
      depth: 1,
      limit: 6,
      sort: "-updatedAt",
      where: {
        status: {
          equals: "published",
        },
      },
    });

    return fallback.docs;
  } catch (error) {
    console.error("Unable to load Payload products for v2.", error);
    return [];
  }
}

export default async function PayloadV2Page() {
  const [page, featuredProducts] = await Promise.all([getPayloadHomePage(), getFeaturedProducts()]);

  if (page) {
    return <PayloadPageRenderer featuredProducts={featuredProducts} page={page} />;
  }

  return (
    <main className="page payload-page">
      <section className="panel payload-empty-page">
        <p className="code-kicker">Payload site</p>
        <h1>New Eltronic</h1>
        <p className="lede">
          Create and publish a Payload page with the slug <code>home</code> to control this subdomain.
        </p>
      </section>
    </main>
  );
}
