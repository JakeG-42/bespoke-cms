import { Render } from "@puckeditor/core/rsc";

import { normalizeBuilderData } from "@/payload/builder/convert";
import { builderConfig } from "@/payload/builder/puck-config";
import type { BuilderMenu, BuilderProduct } from "@/payload/builder/types";

export function PuckBuilderRenderer({
  customCss,
  data,
  featuredProducts,
  hideHelpArticleSections = false,
  internalLinkBasePath = "",
  menus,
  routeSlug,
}: {
  customCss?: string;
  data: unknown;
  featuredProducts: BuilderProduct[];
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
    <>
      {customCss ? <style data-payload-code-editor dangerouslySetInnerHTML={{ __html: safeStyleCss(customCss) }} /> : null}
      <Render config={builderConfig} data={builderData} metadata={{ featuredProducts, hideHelpArticleSections, internalLinkBasePath, menus, routeSlug }} />
    </>
  );
}

function safeStyleCss(css: string) {
  return css.replace(/<\/style/gi, "<\\/style");
}
