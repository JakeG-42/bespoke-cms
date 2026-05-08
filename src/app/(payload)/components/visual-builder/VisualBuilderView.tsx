import type { DocumentViewServerProps, Payload } from "payload";

import { getHelpArticlePath, getHelpCategoryPath } from "@/lib/help-centre/article-routing";
import { articleToBuilderData, pageToBuilderData } from "@/payload/builder/convert";
import {
  applyThemeToBuilderData,
  getDefaultBuilderTheme,
  getBuilderMenus,
  getBuilderPageTemplates,
  getBuilderThemeSettings,
  getBuilderThemes,
  getPageBuilderTheme,
} from "@/payload/builder/metadata";
import type { BuilderHelpArticle, BuilderHelpCategory, BuilderProduct } from "@/payload/builder/types";

import { VisualBuilderClient } from "./VisualBuilderClient";

function getPublicSiteUrl() {
  return (process.env.NEXT_PUBLIC_SITE_URL ?? "https://help.andersen-ev.com").replace(/\/+$/, "");
}

function getPreviewUrl(slug: unknown) {
  const path = typeof slug === "string" && slug !== "home" ? `/${slug}` : "/";

  return `${getPublicSiteUrl()}${path}`;
}

function recordValue(value: unknown): Record<string, unknown> | null {
  return typeof value === "object" && value !== null && !Array.isArray(value) ? (value as Record<string, unknown>) : null;
}

function stringValue(value: unknown, fallback = "") {
  return typeof value === "string" ? value : fallback;
}

function getArticleCategory(article: Record<string, unknown>): BuilderHelpCategory {
  const category = recordValue(article.category);
  const slug = stringValue(category?.slug, "support");
  const title = stringValue(category?.title, "Support");
  const description = stringValue(category?.description);

  return {
    description,
    heading: title,
    id: typeof category?.id === "number" || typeof category?.id === "string" ? category.id : undefined,
    icon: stringValue(category?.icon, "support"),
    path: getHelpCategoryPath(slug),
    slug,
    title,
  };
}

function getArticleMeta(article: Record<string, unknown>, category: BuilderHelpCategory): BuilderHelpArticle {
  const title = stringValue(article.title, "Help article");
  const slug = stringValue(article.slug, "article");

  return {
    body: stringValue(article.body),
    builderData: null,
    categorySlug: category.slug,
    path: getHelpArticlePath(category.slug, slug),
    reviewStatus: stringValue(article.reviewStatus),
    sectionAnchor: category.slug,
    sectionHeading: category.heading || category.title,
    slug,
    sourceUrl: stringValue(article.sourceUrl),
    summary: stringValue(article.summary),
    title,
  };
}

async function getFeaturedProducts(payload: Payload): Promise<BuilderProduct[]> {
  try {
    const result = await payload.find({
      collection: "products",
      depth: 0,
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

    return result.docs.map((product) => ({
      family: product.family,
      name: product.name,
      slug: product.slug,
      summary: product.summary,
    }));
  } catch (error) {
    console.error("Unable to load featured products for visual builder.", error);
    return [];
  }
}

export async function VisualBuilderView({ doc, initPageResult }: DocumentViewServerProps) {
  if (!initPageResult.req.user) {
    return (
      <div className="visual-builder-view">
        <div className="visual-builder-toolbar">
          <div>
            <p className="visual-builder-kicker">Andersen EV WYSIWYG</p>
            <h1>Sign in required</h1>
          </div>
        </div>
      </div>
    );
  }

  const page = doc as {
    builderData?: unknown;
    body?: string;
    category?: unknown;
    id?: number | string;
    layout?: Record<string, unknown>[];
    pageTemplate?: { id?: number | string } | number | string;
    slug?: string;
    theme?: { id?: number | string } | number | string;
    title?: string;
  };
  const isHelpArticle = Boolean(page.category) && typeof page.body === "string";
  const slug = page.slug ?? "home";
  const title = page.title ?? "Untitled page";
  const payload = initPageResult.req.payload;
  const [featuredProducts, menus, themes, pageTemplates, themeSettings] = await Promise.all([
    getFeaturedProducts(payload),
    getBuilderMenus(payload),
    getBuilderThemes(payload),
    getBuilderPageTemplates(payload),
    getBuilderThemeSettings(payload),
  ]);

  if (isHelpArticle) {
    const article = page as Record<string, unknown>;
    const category = getArticleCategory(article);
    const articleMeta = getArticleMeta(article, category);
    const activeTheme = themes.find((theme) => theme.id === themeSettings.themeId) ?? getDefaultBuilderTheme(themes);

    return (
      <VisualBuilderClient
        activeTemplateId=""
        activeThemeId={activeTheme.id}
        builderData={applyThemeToBuilderData(articleToBuilderData(article), activeTheme)}
        documentId={String(page.id)}
        documentKind="helpArticle"
        featuredProducts={featuredProducts}
        headerPath={articleMeta.path}
        helpArticle={articleMeta}
        helpArticles={[articleMeta]}
        helpCategory={category}
        menus={menus}
        pageTemplates={pageTemplates}
        previewUrl={`${getPublicSiteUrl()}${articleMeta.path}`}
        showNewPageButton={false}
        themes={themes}
        title={title}
      />
    );
  }

  const activeTheme = getPageBuilderTheme(page, themes, themeSettings.themeId);
  const activeTemplateId =
    typeof page.pageTemplate === "number" || typeof page.pageTemplate === "string" ? String(page.pageTemplate) : String(page.pageTemplate?.id ?? themeSettings.templateId ?? "");

  return (
    <VisualBuilderClient
      activeTemplateId={activeTemplateId}
      activeThemeId={activeTheme.id}
      builderData={applyThemeToBuilderData(pageToBuilderData(page), activeTheme)}
      documentId={String(page.id)}
      documentKind="page"
      featuredProducts={featuredProducts}
      headerPath={slug === "home" ? "/" : `/${slug}`}
      menus={menus}
      pageTemplates={pageTemplates}
      previewUrl={getPreviewUrl(slug)}
      themes={themes}
      title={title}
    />
  );
}
