import { Render } from "@puckeditor/core/rsc";

import { normalizeBuilderData } from "@/payload/builder/convert";
import { builderConfig } from "@/payload/builder/puck-config";
import type { BuilderProduct } from "@/payload/builder/types";

export function PuckBuilderRenderer({
  data,
  featuredProducts,
}: {
  data: unknown;
  featuredProducts: BuilderProduct[];
}) {
  const builderData = normalizeBuilderData(data);

  if (!builderData) {
    return null;
  }

  return <Render config={builderConfig} data={builderData} metadata={{ featuredProducts }} />;
}
