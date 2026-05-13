import type { Metadata } from "next";
import config from "@payload-config";
import { getPayload, type Payload } from "payload";

import { PuckBuilderRenderer } from "@/components/payload/puck-builder-renderer";
import { SiteFooter } from "@/components/payload/site-footer";
import {
  applyThemeToBuilderData,
  getBuilderMenus,
  getBuilderThemeDefaults,
  getBuilderThemes,
  getPageBuilderTheme,
} from "@/payload/builder/metadata";
import { normalizeBuilderData } from "@/payload/builder/convert";
import type { BuilderMenu, BuilderTheme } from "@/payload/builder/types";
import type { Page } from "@/payload-types";
import { absoluteUrl } from "@/lib/seo";
import { extractHelpCategories, getPublishedHelpCategories } from "@/lib/help-centre/articles";

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
  const [page, menus, themes, themeDefaults] = await Promise.all([
    getPayloadPage(payload, slug),
    getBuilderMenus(payload),
    getBuilderThemes(payload),
    getBuilderThemeDefaults(payload),
  ]);
  const theme = getPageBuilderTheme(page, themes, themeDefaults.themeId);

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
  const basePath = internalLinkBasePath.replace(/\/+$/, "");
  const helpCentreHref = basePath ? `${basePath}/help-centre` : "/help-centre";

  if (page && "builderData" in page && page.builderData) {
    const builderData = normalizeBuilderData(page.builderData);
    const themedBuilderData = builderData ? applyThemeToBuilderData(builderData, theme) : page.builderData;
    let helpCategories: Awaited<ReturnType<typeof getPublishedHelpCategories>> = [];

    if (slug === "help-centre" && builderData) {
      const collectionCategories = await getPublishedHelpCategories().catch((error) => {
        console.error("Unable to load Help Centre articles for search.", error);

        return [];
      });

      helpCategories = collectionCategories.length ? collectionCategories : extractHelpCategories(builderData);
    }

    return (
      <PuckBuilderRenderer
        data={themedBuilderData}
        helpArticles={helpCategories.flatMap((category) => category.articles ?? [])}
        helpCategories={helpCategories}
        hideHelpArticleSections={slug === "help-centre"}
        internalLinkBasePath={internalLinkBasePath}
        menus={menus}
        routeSlug={slug}
      />
    );
  }

  if (page) {
    return (
      <>
        <main className="public-site-empty">
          <section className="public-site-empty-panel">
            <p>{emptyLabel}</p>
            <h1>{page.title}</h1>
            <p>This is a preview route. The usual Andersen page content would be displayed here once the page is connected.</p>
            <div className="public-site-empty-actions" aria-label="Preview page actions">
              <a className="public-site-empty-button public-site-empty-button-primary" href={helpCentreHref}>
                Go to Help Centre
              </a>
            </div>
          </section>
        </main>
        <SiteFooter internalLinkBasePath={internalLinkBasePath} menus={menus} />
      </>
    );
  }

  return (
    <>
      <main className="public-site-empty">
        <section className="public-site-empty-panel">
          <p>{emptyLabel}</p>
          <h1>Andersen EV Help Centre</h1>
          <p>
            This is a preview route for <code>{slug}</code>. The usual Andersen page content would be displayed here once the page is connected.
            {indexed ? "" : " This route is hidden from search engines."}
          </p>
          <div className="public-site-empty-actions" aria-label="Preview page actions">
            <a className="public-site-empty-button public-site-empty-button-primary" href={helpCentreHref}>
              Go to Help Centre
            </a>
          </div>
        </section>
      </main>
      <SiteFooter internalLinkBasePath={internalLinkBasePath} menus={menus} />
    </>
  );
}
