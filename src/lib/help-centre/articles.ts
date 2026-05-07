import config from "@payload-config";
import { getPayload } from "payload";

import {
  applyThemeToBuilderData,
  getBuilderMenus,
  getBuilderThemeSettings,
  getBuilderThemes,
  getPageBuilderTheme,
} from "@/payload/builder/metadata";
import { normalizeBuilderData } from "@/payload/builder/convert";
import type { BuilderData } from "@/payload/builder/types";
import type { Page } from "@/payload-types";
import { getHelpArticlePath, slugifyHelpArticle } from "./article-routing";

type UnknownRecord = Record<string, unknown>;

export type HelpArticle = {
  body: string;
  categorySlug: string;
  path: string;
  sectionAnchor: string;
  sectionHeading: string;
  slug: string;
  sourceUrl?: string;
  summary?: string;
  title: string;
};

export type HelpCategory = {
  articles: HelpArticle[];
  description?: string;
  heading: string;
  icon?: string;
  intro?: string;
  slug: string;
  title: string;
};

export type HelpArticlePageData = {
  article: HelpArticle | null;
  headerData: BuilderData | null;
  menus: Awaited<ReturnType<typeof getBuilderMenus>>;
};

export type HelpCategoryPageData = {
  category: HelpCategory | null;
  headerData: BuilderData | null;
  menus: Awaited<ReturnType<typeof getBuilderMenus>>;
};

async function getHelpCentreBuilderPageData() {
  const payload = await getPayload({ config });
  const [page, menus, themes, themeSettings] = await Promise.all([
    getHelpCentrePage(payload),
    getBuilderMenus(payload),
    getBuilderThemes(payload),
    getBuilderThemeSettings(payload),
  ]);
  const builderData = normalizeBuilderData(page?.builderData);

  if (!page || !builderData) {
    return {
      builderData: null,
      menus,
    };
  }

  const theme = getPageBuilderTheme(page, themes, themeSettings.themeId);
  const themedBuilderData = normalizeBuilderData(applyThemeToBuilderData(builderData, theme)) ?? builderData;

  return {
    builderData: themedBuilderData,
    menus,
  };
}

export async function getHelpArticlePageData(categorySlug: string, articleSlug: string): Promise<HelpArticlePageData> {
  const { builderData, menus } = await getHelpCentreBuilderPageData();

  if (!builderData) {
    return {
      article: null,
      headerData: null,
      menus,
    };
  }

  const articles = extractHelpArticles(builderData);
  const article = articles.find((item) => item.categorySlug === categorySlug && item.slug === articleSlug) ?? null;
  const headerData = extractHeaderBuilderData(builderData);

  return {
    article,
    headerData,
    menus,
  };
}

export async function getHelpCategoryPageData(categorySlug: string): Promise<HelpCategoryPageData> {
  const { builderData, menus } = await getHelpCentreBuilderPageData();

  if (!builderData) {
    return {
      category: null,
      headerData: null,
      menus,
    };
  }

  const categories = extractHelpCategories(builderData);
  const category = categories.find((item) => item.slug === categorySlug) ?? null;
  const headerData = extractHeaderBuilderData(builderData);

  return {
    category,
    headerData,
    menus,
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
      const body = stringValue(article.body);

      return {
        body,
        categorySlug: slugifyHelpArticle(sectionAnchor),
        path: getHelpArticlePath(sectionAnchor, title),
        sectionAnchor,
        sectionHeading,
        slug: slugifyHelpArticle(title),
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

async function getHelpCentrePage(payload: Awaited<ReturnType<typeof getPayload>>): Promise<Page | null> {
  const result = await payload.find({
    collection: "pages",
    depth: 2,
    limit: 1,
    where: {
      and: [
        {
          slug: {
            equals: "help-centre",
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

function isRecord(value: unknown): value is UnknownRecord {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function stringValue(value: unknown, fallback = "") {
  return typeof value === "string" ? value : fallback;
}
