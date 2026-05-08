import type { AdminViewServerProps, Payload } from "payload";
import Link from "next/link";

import { getHelpArticlePath, getHelpCategoryPath } from "@/lib/help-centre/article-routing";
import { getPublishedHelpCategories } from "@/lib/help-centre/articles";
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
import type { BuilderHelpArticle, BuilderHelpCategory } from "@/payload/builder/types";

import { VisualBuilderClient } from "./VisualBuilderClient";

function getPublicSiteUrl() {
  return (process.env.NEXT_PUBLIC_SITE_URL ?? "https://help.andersen-ev.com").replace(/\/+$/, "");
}

function getPreviewUrl(slug: unknown) {
  const path = typeof slug === "string" && slug !== "home" ? `/${slug}` : "/";

  return `${getPublicSiteUrl()}${path}`;
}

function getPageId(params: AdminViewServerProps["params"]) {
  const segments = params?.segments;

  return Array.isArray(segments) ? segments[1] : undefined;
}

function getEditorTarget(params: AdminViewServerProps["params"]) {
  const segments = params?.segments;

  if (!Array.isArray(segments)) {
    return { id: undefined, kind: "page" as const };
  }

  if (segments[1] === "help-articles") {
    return { id: segments[2], kind: "helpArticle" as const };
  }

  return { id: getPageId(params), kind: "page" as const };
}

function recordValue(value: unknown): Record<string, unknown> | null {
  return typeof value === "object" && value !== null && !Array.isArray(value) ? (value as Record<string, unknown>) : null;
}

function stringValue(value: unknown, fallback = "") {
  return typeof value === "string" ? value : fallback;
}

function relationId(value: unknown) {
  if (typeof value === "number" || typeof value === "string") {
    return value;
  }

  const record = recordValue(value);

  return typeof record?.id === "number" || typeof record?.id === "string" ? record.id : undefined;
}

async function getArticleCategory(payload: Payload, article: Record<string, unknown>): Promise<BuilderHelpCategory> {
  const categoryRecord = recordValue(article.category);
  const id = relationId(article.category);
  const category =
    categoryRecord ??
    (id
      ? ((await payload.findByID({
          collection: "help-categories" as unknown as "pages",
          depth: 0,
          id,
          overrideAccess: false,
        })) as unknown as Record<string, unknown>)
      : null);
  const slug = stringValue(category?.slug, "support");
  const title = stringValue(category?.title, "Support");
  const description = stringValue(category?.description);

  return {
    description,
    heading: title,
    id: relationId(category),
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

function categoryArticlesForEditor(categories: { articles?: BuilderHelpArticle[]; slug: string }[], category: BuilderHelpCategory, article: BuilderHelpArticle) {
  const categoryArticles = categories.find((item) => item.slug === category.slug)?.articles ?? [];

  return categoryArticles.some((item) => item.slug === article.slug) ? categoryArticles : [article, ...categoryArticles];
}

export async function WysiwygPageView({ initPageResult, params }: AdminViewServerProps) {
  const target = getEditorTarget(params);

  if (!target.id) {
    return (
      <div className="visual-builder-view">
        <div className="visual-builder-toolbar">
          <div>
            <p className="visual-builder-kicker">Andersen EV WYSIWYG</p>
            <h1>Select a page</h1>
            <Link href="/console/collections/pages">Back to pages</Link>
          </div>
        </div>
      </div>
    );
  }

  if (target.kind === "helpArticle") {
    const payload = initPageResult.req.payload;
    const article = (await payload.findByID({
      collection: "help-articles" as unknown as "pages",
      depth: 2,
      id: target.id,
      overrideAccess: false,
      showHiddenFields: true,
    })) as unknown as Record<string, unknown>;
    const category = await getArticleCategory(payload, article);
    const articleMeta = getArticleMeta(article, category);
    const title = articleMeta.title;
    const [menus, themes, pageTemplates, themeSettings, helpCategories] = await Promise.all([
      getBuilderMenus(payload),
      getBuilderThemes(payload),
      getBuilderPageTemplates(payload),
      getBuilderThemeSettings(payload),
      getPublishedHelpCategories(payload),
    ]);
    const activeTheme = themes.find((theme) => theme.id === themeSettings.themeId) ?? getDefaultBuilderTheme(themes);
    const helpArticles = categoryArticlesForEditor(helpCategories, category, articleMeta);
    const categories = helpCategories.some((item) => item.slug === category.slug) ? helpCategories : [category, ...helpCategories];

    return (
      <VisualBuilderClient
        activeTemplateId=""
        activeThemeId={activeTheme.id}
        builderData={applyThemeToBuilderData(articleToBuilderData(article), activeTheme)}
        documentId={String(article.id)}
        documentKind="helpArticle"
        headerPath={articleMeta.path}
        helpArticle={articleMeta}
        helpArticles={helpArticles}
        helpCategories={categories}
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

  const page = await initPageResult.req.payload.findByID({
    collection: "pages",
    depth: 2,
    id: target.id,
    overrideAccess: false,
    showHiddenFields: true,
  });
  const slug = page.slug ?? "home";
  const title = page.title ?? "Untitled page";
  const payload = initPageResult.req.payload;
  const [menus, themes, pageTemplates, themeSettings] = await Promise.all([
    getBuilderMenus(payload),
    getBuilderThemes(payload),
    getBuilderPageTemplates(payload),
    getBuilderThemeSettings(payload),
  ]);
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
      headerPath={slug === "home" ? "/" : `/${slug}`}
      menus={menus}
      pageTemplates={pageTemplates}
      previewUrl={getPreviewUrl(slug)}
      themes={themes}
      title={title}
    />
  );
}
