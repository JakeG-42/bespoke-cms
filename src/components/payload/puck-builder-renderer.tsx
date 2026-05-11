import { Render } from "@puckeditor/core/rsc";

import { normalizeBuilderData } from "@/payload/builder/convert";
import { builderConfig } from "@/payload/builder/puck-config";
import type { BuilderHelpArticle, BuilderHelpCategory, BuilderMenu } from "@/payload/builder/types";
import { SiteFooter } from "./site-footer";

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
  showFooter = true,
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
  showFooter?: boolean;
}) {
  const builderData = normalizeBuilderData(data);

  if (!builderData) {
    return null;
  }

  return (
    <>
      <Render
        config={builderConfig}
        data={builderData}
        metadata={{ helpArticle, helpArticles, helpCategories, helpCategory, hideHelpArticleSections, internalLinkBasePath, menus, routeSlug }}
      />
      {showFooter ? <SiteFooter internalLinkBasePath={internalLinkBasePath} menus={menus} /> : null}
    </>
  );
}
