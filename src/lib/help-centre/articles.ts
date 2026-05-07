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

export type HelpArticlePageData = {
  article: HelpArticle | null;
  headerData: BuilderData | null;
  menus: Awaited<ReturnType<typeof getBuilderMenus>>;
};

export async function getHelpArticlePageData(categorySlug: string, articleSlug: string): Promise<HelpArticlePageData> {
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
      article: null,
      headerData: null,
      menus,
    };
  }

  const theme = getPageBuilderTheme(page, themes, themeSettings.themeId);
  const themedBuilderData = normalizeBuilderData(applyThemeToBuilderData(builderData, theme)) ?? builderData;
  const articles = extractHelpArticles(themedBuilderData);
  const article = articles.find((item) => item.categorySlug === categorySlug && item.slug === articleSlug) ?? null;
  const headerData = extractHeaderBuilderData(themedBuilderData);

  return {
    article,
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
