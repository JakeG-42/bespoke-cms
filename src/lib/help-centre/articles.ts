import config from "@payload-config";
import { getPayload, type Payload } from "payload";

import { articleToBuilderData, normalizeBuilderData } from "@/payload/builder/convert";
import {
  applyThemeToBuilderData,
  getBuilderMenus,
  getBuilderThemeSettings,
  getBuilderThemes,
  getPageBuilderTheme,
} from "@/payload/builder/metadata";
import type { BuilderData, BuilderHelpArticle, BuilderHelpCategory } from "@/payload/builder/types";
import type { Page } from "@/payload-types";
import { getHelpArticlePath, getHelpCategoryPath, slugifyHelpArticle } from "./article-routing";

type UnknownRecord = Record<string, unknown>;
const HELP_ARTICLES_COLLECTION = "help-articles" as unknown as "pages";
const HELP_CATEGORIES_COLLECTION = "help-categories" as unknown as "pages";

export type HelpArticle = BuilderHelpArticle & {
  sectionAnchor: string;
  sectionHeading: string;
};

export type HelpCategory = BuilderHelpCategory & {
  articles: HelpArticle[];
  heading: string;
  intro?: string;
};

export type HelpArticlePageData = {
  article: HelpArticle | null;
  categories: HelpCategory[];
  category: HelpCategory | null;
  headerData: BuilderData | null;
  menus: Awaited<ReturnType<typeof getBuilderMenus>>;
  templateData: BuilderData | null;
};

export type HelpCategoryPageData = {
  category: HelpCategory | null;
  headerData: BuilderData | null;
  menus: Awaited<ReturnType<typeof getBuilderMenus>>;
  templateData: BuilderData | null;
};

async function getHelpCentrePageData(payload: Payload, slug: string): Promise<Page | null> {
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

async function getSharedHelpData() {
  const payload = await getPayload({ config });
  const [helpCentrePage, categoryTemplatePage, articleTemplatePage, menus, themes, themeSettings] = await Promise.all([
    getHelpCentrePageData(payload, "help-centre"),
    getHelpCentrePageData(payload, "templates/help-category"),
    getHelpCentrePageData(payload, "templates/help-article"),
    getBuilderMenus(payload),
    getBuilderThemes(payload),
    getBuilderThemeSettings(payload),
  ]);

  return {
    articleTemplateData: getThemedBuilderData(articleTemplatePage, themes, themeSettings.themeId),
    categoryTemplateData: getThemedBuilderData(categoryTemplatePage, themes, themeSettings.themeId),
    fallbackBuilderData: getThemedBuilderData(helpCentrePage, themes, themeSettings.themeId),
    menus,
    payload,
  };
}

function getThemedBuilderData(page: Page | null, themes: Awaited<ReturnType<typeof getBuilderThemes>>, activeThemeId?: string) {
  const builderData = normalizeBuilderData(page?.builderData);

  if (!page || !builderData) {
    return null;
  }

  const theme = getPageBuilderTheme(page, themes, activeThemeId);

  return normalizeBuilderData(applyThemeToBuilderData(builderData, theme)) ?? builderData;
}

export async function getHelpArticlePageData(categorySlug: string, articleSlug: string): Promise<HelpArticlePageData> {
  const { articleTemplateData, fallbackBuilderData, menus, payload } = await getSharedHelpData();
  const collectionCategories = await getPublishedHelpCategories(payload);
  const fallbackCategories = fallbackBuilderData ? extractHelpCategories(fallbackBuilderData) : [];
  const categories = collectionCategories.length ? collectionCategories : fallbackCategories;
  const category = categories.find((item) => item.slug === categorySlug) ?? null;
  const article = category?.articles.find((item) => item.slug === articleSlug) ?? null;
  const fallbackArticles = fallbackCategories.flatMap((item) => item.articles);
  const fallbackArticle = fallbackArticles.find((item) => item.categorySlug === categorySlug && item.slug === articleSlug) ?? null;
  const resolvedArticle = article ?? fallbackArticle;
  const resolvedCategory = category ?? fallbackCategories.find((item) => item.slug === categorySlug) ?? null;
  const resolvedArticleWithBuilderData = resolvedArticle
    ? {
        ...resolvedArticle,
        builderData: articleToBuilderData(resolvedArticle),
      }
    : null;

  return {
    article: resolvedArticleWithBuilderData,
    categories,
    category: resolvedCategory,
    headerData: fallbackBuilderData ? extractHeaderBuilderData(fallbackBuilderData) : null,
    menus,
    templateData: articleTemplateData,
  };
}

export async function getHelpCategoryPageData(categorySlug: string): Promise<HelpCategoryPageData> {
  const { categoryTemplateData, fallbackBuilderData, menus, payload } = await getSharedHelpData();
  const category = await getHelpCategoryFromCollection(payload, categorySlug);
  const fallbackCategory = fallbackBuilderData ? extractHelpCategories(fallbackBuilderData).find((item) => item.slug === categorySlug) ?? null : null;

  return {
    category: category ?? fallbackCategory,
    headerData: fallbackBuilderData ? extractHeaderBuilderData(fallbackBuilderData) : null,
    menus,
    templateData: categoryTemplateData,
  };
}

export async function getPublishedHelpKnowledgeArticles(): Promise<HelpArticle[]> {
  const categories = await getPublishedHelpCategories();

  return categories.flatMap((category) => category.articles);
}

export async function getPublishedHelpCategories(payloadOverride?: Payload): Promise<HelpCategory[]> {
  const payload = payloadOverride ?? (await getPayload({ config }));
  const categoryResult = await payload.find({
    collection: HELP_CATEGORIES_COLLECTION,
    depth: 0,
    limit: 100,
    sort: "sortOrder",
    where: {
      status: {
        equals: "published",
      },
    },
  });

  return Promise.all(categoryResult.docs.map((category) => getHelpCategoryWithArticles(payload, category as unknown as UnknownRecord)));
}

async function getHelpCategoryFromCollection(payload: Payload, categorySlug: string): Promise<HelpCategory | null> {
  const result = await payload.find({
    collection: HELP_CATEGORIES_COLLECTION,
    depth: 0,
    limit: 1,
    where: {
      and: [
        {
          slug: {
            equals: categorySlug,
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

  const category = result.docs[0];

  return category ? getHelpCategoryWithArticles(payload, category as unknown as UnknownRecord) : null;
}

async function getHelpCategoryWithArticles(payload: Payload, categoryDoc: UnknownRecord): Promise<HelpCategory> {
  const category = mapCategoryDoc(categoryDoc);
  const articleResult = await payload.find({
    collection: HELP_ARTICLES_COLLECTION,
    depth: 0,
    limit: 200,
    sort: "sortOrder",
    where: {
      and: [
        {
          category: {
            equals: categoryDoc.id,
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

  return {
    ...category,
    articles: articleResult.docs.map((article) => mapArticleDoc(article as unknown as UnknownRecord, category)),
  };
}

function mapCategoryDoc(doc: UnknownRecord): HelpCategory {
  const slug = stringValue(doc.slug, "category");
  const title = stringValue(doc.title, "Help category");
  const description = stringValue(doc.description);

  return {
    articles: [],
    description,
    heading: title,
    id: typeof doc.id === "number" || typeof doc.id === "string" ? doc.id : undefined,
    icon: stringValue(doc.icon),
    intro: description,
    path: getHelpCategoryPath(slug),
    slug,
    title,
  };
}

function mapArticleDoc(doc: UnknownRecord, category: HelpCategory): HelpArticle {
  const title = stringValue(doc.title, "Help article");
  const slug = stringValue(doc.slug, slugifyHelpArticle(title));

  return {
    body: stringValue(doc.body),
    builderData: doc.builderData ? articleToBuilderData(doc) : null,
    categorySlug: category.slug,
    path: getHelpArticlePath(category.slug, slug),
    reviewStatus: stringValue(doc.reviewStatus),
    sectionAnchor: category.slug,
    sectionHeading: category.heading,
    slug,
    sourceUrl: stringValue(doc.sourceUrl),
    summary: stringValue(doc.summary),
    title,
  };
}

export function extractHelpArticles(builderData: BuilderData): HelpArticle[] {
  return builderData.content.flatMap((item) => {
    if (item.type !== "HelpFaqSectionBlock" || !isRecord(item.props)) {
      return [];
    }

    const sectionAnchor = stringValue(item.props.anchor) || slugifyHelpArticle(stringValue(item.props.heading));
    const sectionHeading = stringValue(item.props.heading, "Help articles");
    const articles = Array.isArray(item.props.articles) ? item.props.articles.filter(isRecord) : [];

    return articles.map((article) => {
      const title = stringValue(article.title, "Help article");
      const slug = slugifyHelpArticle(title);
      const body = stringValue(article.body);

      return {
        body,
        builderData: null,
        categorySlug: slugifyHelpArticle(sectionAnchor),
        path: getHelpArticlePath(sectionAnchor, slug),
        reviewStatus: stringValue(article.status),
        sectionAnchor,
        sectionHeading,
        slug,
        sourceUrl: stringValue(article.sourceUrl),
        summary: stringValue(article.summary),
        title,
      };
    });
  });
}

export function extractHelpCategories(builderData: BuilderData): HelpCategory[] {
  const categoryDetails = extractHelpCategoryDetails(builderData);

  return builderData.content.flatMap((item) => {
    if (item.type !== "HelpFaqSectionBlock" || !isRecord(item.props)) {
      return [];
    }

    const sectionAnchor = stringValue(item.props.anchor) || slugifyHelpArticle(stringValue(item.props.heading));
    const slug = slugifyHelpArticle(sectionAnchor);
    const sectionHeading = stringValue(item.props.heading, "Help articles");
    const articles = extractHelpArticles({
      content: [item],
      root: builderData.root,
      zones: {},
    });
    const details = categoryDetails.get(slug);

    return [
      {
        articles,
        description: details?.description,
        heading: sectionHeading,
        icon: details?.icon ?? stringValue(item.props.icon),
        intro: stringValue(item.props.intro),
        path: getHelpCategoryPath(slug),
        slug,
        title: details?.title || stringValue(item.props.eyebrow) || sectionHeading,
      },
    ];
  });
}

function extractHelpCategoryDetails(builderData: BuilderData) {
  const details = new Map<string, { description?: string; icon?: string; title: string }>();

  builderData.content.forEach((item) => {
    if (item.type !== "HelpCategoryGridBlock" || !isRecord(item.props)) {
      return;
    }

    const categories = Array.isArray(item.props.categories) ? item.props.categories.filter(isRecord) : [];

    categories.forEach((category) => {
      const title = stringValue(category.title, "Help topic");
      const slug = getCategorySlugFromBubble(category);

      details.set(slug, {
        description: stringValue(category.description),
        icon: stringValue(category.icon),
        title,
      });
    });
  });

  return details;
}

function getCategorySlugFromBubble(category: UnknownRecord) {
  const url = stringValue(category.url).trim();

  if (url.startsWith("#")) {
    return slugifyHelpArticle(url.slice(1));
  }

  const pathMatch = url.match(/\/help-centre\/([^/?#]+)/);

  if (pathMatch?.[1] && pathMatch[1] !== "articles") {
    return slugifyHelpArticle(pathMatch[1]);
  }

  return slugifyHelpArticle(stringValue(category.title));
}

function extractHeaderBuilderData(builderData: BuilderData): BuilderData | null {
  const header = builderData.content.find((item) => item.type === "SiteHeaderBlock");

  if (!header) {
    return null;
  }

  return {
    content: [header],
    root: builderData.root,
    zones: {},
  };
}

function isRecord(value: unknown): value is UnknownRecord {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function stringValue(value: unknown, fallback = "") {
  return typeof value === "string" ? value : fallback;
}
