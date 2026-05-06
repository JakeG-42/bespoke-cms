import type { MetadataRoute } from "next";
import config from "@payload-config";
import { getPayload } from "payload";

import { absoluteUrl } from "@/lib/seo";
import { getPagePath } from "@/lib/payload-site";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  try {
    const payload = await getPayload({ config });
    const pages = await payload.find({
      collection: "pages",
      depth: 0,
      limit: 100,
      sort: "slug",
      where: {
        status: {
          equals: "published",
        },
      },
    });

    return pages.docs.map((page) => ({
      url: absoluteUrl(getPagePath(page.slug ?? "home")),
      lastModified: page.updatedAt ? new Date(page.updatedAt) : now,
      changeFrequency: page.slug === "home" ? "weekly" : "monthly",
      priority: page.slug === "home" ? 1 : 0.72,
    }));
  } catch (error) {
    console.error("Unable to generate Help Centre sitemap.", error);

    return [
      {
        url: absoluteUrl("/"),
        lastModified: now,
        changeFrequency: "weekly",
        priority: 1,
      },
    ];
  }
}
