import type { Metadata } from "next";
import config from "@payload-config";
import { getPayload, type Payload } from "payload";

import { PuckBuilderRenderer } from "@/components/payload/puck-builder-renderer";
import {
  applyThemeToBuilderData,
  getBuilderMenus,
  getBuilderThemeSettings,
  getBuilderThemes,
  getPageBuilderTheme,
} from "@/payload/builder/metadata";
import { normalizeBuilderData } from "@/payload/builder/convert";
import type { BuilderMenu, BuilderTheme } from "@/payload/builder/types";
import type { Page } from "@/payload-types";
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

async function loadPayloadSite(slug: string): Promise<{
  menus: BuilderMenu[];
  page: Page | null;
  theme: BuilderTheme;
}> {
  const payload = await getPayload({ config });
  const [page, menus, themes, themeSettings] = await Promise.all([
    getPayloadPage(payload, slug),
    getBuilderMenus(payload),
    getBuilderThemes(payload),
    getBuilderThemeSettings(payload),
  ]);
  const theme = getPageBuilderTheme(page, themes, themeSettings.themeId);

  return {
    menus,
    page,
    theme,
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
  const { menus, page, theme } = await loadPayloadSite(slug);

  if (page && "builderData" in page && page.builderData) {
    const builderData = normalizeBuilderData(page.builderData);
    const themedBuilderData = builderData ? applyThemeToBuilderData(builderData, theme) : page.builderData;

    return (
      <PuckBuilderRenderer
        data={themedBuilderData}
        featuredProducts={[]}
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
