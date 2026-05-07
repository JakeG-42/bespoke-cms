import type { Metadata } from "next";
import config from "@payload-config";
import { getPayload, type Payload, type Where } from "payload";

import { PuckBuilderRenderer } from "@/components/payload/puck-builder-renderer";
import {
  applyThemeToBuilderData,
  getBuilderMenus,
  getBuilderThemeSettings,
  getBuilderThemes,
  getPageBuilderTheme,
  productsToBuilderProducts,
} from "@/payload/builder/metadata";
import { normalizeBuilderData } from "@/payload/builder/convert";
import type { BuilderMenu, BuilderTheme, BuilderThemeSettings } from "@/payload/builder/types";
import type { Page, Product } from "@/payload-types";
import { absoluteUrl } from "@/lib/seo";

type PayloadSiteRenderOptions = {
  emptyLabel?: string;
  indexed?: boolean;
  internalLinkBasePath?: string;
  slug: string;
};

export function getSlugFromSegments(segments: string[] | undefined) {
  return segments?.length ? segments.join("/") : "home";
}

export function getPagePath(slug: string) {
  return slug === "home" ? "/" : `/${slug}`;
}

export function getPagePathFromSegments(segments: string[] | undefined) {
  return getPagePath(getSlugFromSegments(segments));
}

async function getPayloadPage(payload: Payload, slug: string): Promise<Page | null> {
  const result = await payload.find({
    collection: "pages",
    depth: 2,
    limit: 1,
    where: {
      and: [
        {
          slug: {
            equals: slug,
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
}

async function getFeaturedProducts(payload: Payload): Promise<Product[]> {
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
}

function numericId(value: number | string | undefined) {
  if (typeof value === "number") {
    return value;
  }

  return typeof value === "string" && /^\d+$/.test(value) ? Number(value) : undefined;
}

async function getCustomCss(payload: Payload, { pageId, themeId }: { pageId?: number | string; themeId?: number | string }) {
  const orConditions: Where[] = [
    {
      scope: {
        equals: "global",
      },
    },
  ];
  const numericThemeId = numericId(themeId);
  const numericPageId = numericId(pageId);

  if (numericThemeId) {
    orConditions.push({
      and: [
        {
          scope: {
            equals: "theme",
          },
        },
        {
          theme: {
            equals: numericThemeId,
          },
        },
      ],
    });
  }

  if (numericPageId) {
    orConditions.push({
      and: [
        {
          scope: {
            equals: "page",
          },
        },
        {
          page: {
            equals: numericPageId,
          },
        },
      ],
    });
  }

  const result = await payload.find({
    collection: "code-snippets",
    depth: 0,
    limit: 50,
    sort: "priority",
    where: {
      and: [
        {
          status: {
            equals: "active",
          },
        },
        {
          or: orConditions,
        },
      ],
    },
  });

  return result.docs
    .map((snippet) => (snippet.css ? `/* ${snippet.title} */\n${snippet.css}` : ""))
    .filter(Boolean)
    .join("\n\n");
}

async function loadPayloadSite(slug: string): Promise<{
  customCss: string;
  featuredProducts: Product[];
  menus: BuilderMenu[];
  page: Page | null;
  theme: BuilderTheme;
  themeSettings: BuilderThemeSettings;
  themes: BuilderTheme[];
}> {
  const payload = await getPayload({ config });
  const [page, featuredProducts, menus, themes, themeSettings] = await Promise.all([
    getPayloadPage(payload, slug),
    getFeaturedProducts(payload).catch((error) => {
      console.error("Unable to load Payload products for site.", error);
      return [];
    }),
    getBuilderMenus(payload),
    getBuilderThemes(payload),
    getBuilderThemeSettings(payload),
  ]);
  const theme = getPageBuilderTheme(page, themes, themeSettings.themeId);
  const customCss = page ? await getCustomCss(payload, { pageId: page.id, themeId: theme.id }).catch(() => "") : "";

  return {
    customCss,
    featuredProducts,
    menus,
    page,
    theme,
    themeSettings,
    themes,
  };
}

export async function generatePayloadSiteMetadata({
  indexed = true,
  slug,
}: {
  indexed?: boolean;
  slug: string;
}): Promise<Metadata> {
  try {
    const payload = await getPayload({ config });
    const page = await getPayloadPage(payload, slug);
    const title = page?.seo?.title ?? page?.title ?? "Andersen EV Help Centre";
    const description = page?.seo?.description ?? page?.summary ?? "Customer support and troubleshooting content for Andersen EV charger customers.";

    return {
      title,
      description,
      alternates: {
        canonical: absoluteUrl(getPagePath(slug)),
      },
      robots: {
        index: indexed,
        follow: indexed,
      },
    };
  } catch (error) {
    console.error("Unable to generate Help Centre metadata.", error);

    return {
      title: "Andersen EV Help Centre",
      description: "Customer support and troubleshooting content for Andersen EV charger customers.",
      robots: {
        index: false,
        follow: false,
      },
    };
  }
}

export async function PayloadSitePage({
  emptyLabel = "Help Centre page",
  indexed = true,
  internalLinkBasePath = "",
  slug,
}: PayloadSiteRenderOptions) {
  const { customCss, featuredProducts, menus, page, theme } = await loadPayloadSite(slug);

  if (page && "builderData" in page && page.builderData) {
    const builderData = normalizeBuilderData(page.builderData);
    const themedBuilderData = builderData ? applyThemeToBuilderData(builderData, theme) : page.builderData;

    return (
      <PuckBuilderRenderer
        customCss={customCss}
        data={themedBuilderData}
        featuredProducts={productsToBuilderProducts(featuredProducts)}
        hideHelpArticleSections={slug === "help-centre"}
        internalLinkBasePath={internalLinkBasePath}
        menus={menus}
        routeSlug={slug}
      />
    );
  }

  if (page) {
    return (
      <main className="public-site-empty">
        <section className="public-site-empty-panel">
          <p>{emptyLabel}</p>
          <h1>{page.title}</h1>
          <p>Open this page in the WYSIWYG builder and publish visual builder data to control this route.</p>
        </section>
      </main>
    );
  }

  return (
    <main className="public-site-empty">
      <section className="public-site-empty-panel">
        <p>{emptyLabel}</p>
        <h1>Andersen EV Help Centre</h1>
        <p>
          Create and publish a Payload page with the slug <code>{slug}</code> to control this route.
          {indexed ? "" : " This route is hidden from search engines."}
        </p>
      </section>
    </main>
  );
}
