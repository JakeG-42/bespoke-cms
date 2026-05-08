import { Render } from "@puckeditor/core/rsc";

import { normalizeBuilderData } from "@/payload/builder/convert";
import { builderConfig } from "@/payload/builder/puck-config";
import type { BuilderHelpArticle, BuilderHelpCategory, BuilderMenu } from "@/payload/builder/types";

export function PuckBuilderRenderer({
  data,
  helpArticle,
  helpArticles,
  helpCategories,
  helpCategory,
  hideHelpArticleSections = false,
  internalLinkBasePath = "",
  menus,
  routeSlug,
}: {
  data: unknown;
  helpArticle?: BuilderHelpArticle | null;
  helpArticles?: BuilderHelpArticle[];
  helpCategories?: BuilderHelpCategory[];
  helpCategory?: BuilderHelpCategory | null;
  hideHelpArticleSections?: boolean;
  internalLinkBasePath?: string;
  menus: BuilderMenu[];
  routeSlug?: string;
}) {
  const builderData = normalizeBuilderData(data);

  if (!builderData) {
    return null;
  }

  return (
    <Render
      config={builderConfig}
      data={builderData}
      metadata={{ helpArticle, helpArticles, helpCategories, helpCategory, hideHelpArticleSections, internalLinkBasePath, menus, routeSlug }}
    />
  );
}
