import type { BuilderAdvancedStyle, BuilderData, BuilderRootProps } from "./types";

type UnknownRecord = Record<string, unknown>;

type PageLike = {
  builderData?: unknown;
  layout?: UnknownRecord[];
  slug?: unknown;
  title?: unknown;
};

const backgroundMap: Record<string, string> = {
  contrast: "rgba(2, 6, 23, 0.94)",
  default: "",
  panel: "rgba(23, 32, 51, 0.78)",
  soft: "rgba(139, 211, 255, 0.08)",
};

function isRecord(value: unknown): value is UnknownRecord {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function asString(value: unknown, fallback = "") {
  return typeof value === "string" ? value : fallback;
}

function asNumber(value: unknown, fallback: number) {
  return typeof value === "number" && Number.isFinite(value) ? value : fallback;
}

function asArray(value: unknown): UnknownRecord[] {
  return Array.isArray(value) ? value.filter(isRecord) : [];
}

function relationDoc(value: unknown): UnknownRecord | null {
  return isRecord(value) ? value : null;
}

function relationUrl(value: unknown) {
  return asString(relationDoc(value)?.url);
}

function relationAlt(value: unknown, fallback = "") {
  return asString(relationDoc(value)?.alt, fallback);
}

function linkFields(value: unknown) {
  const link = relationDoc(value);

  return {
    label: asString(link?.label),
    url: asString(link?.url),
  };
}

function blockDesign(block: UnknownRecord): BuilderAdvancedStyle {
  return {
    accentColor: "#8bd3ff",
    backgroundColor: backgroundMap[asString(block.backgroundStyle, "default")] ?? "",
    effect: "none",
    fontFamily: "display",
    opacity: 1,
    scrollAnimation: "none",
    textAlign: asString(block.alignment, "left") === "center" ? "center" : "left",
    textColor: "",
  };
}

function lexicalToText(value: unknown): string {
  if (!isRecord(value)) {
    return "";
  }

  const root = relationDoc(value.root);
  const chunks: string[] = [];

  function walk(node: unknown) {
    if (!isRecord(node)) {
      return;
    }

    if (typeof node.text === "string") {
      chunks.push(node.text);
    }

    if (Array.isArray(node.children)) {
      node.children.forEach(walk);

      if (node.type === "paragraph" || node.type === "heading" || node.type === "listitem") {
        chunks.push("\n");
      }
    }
  }

  walk(root);

  return chunks.join("").replace(/\n{3,}/g, "\n\n").trim();
}

function rootProps(page: PageLike): BuilderRootProps {
  return {
    accentColor: "#8bd3ff",
    backgroundColor: "#020617",
    fontFamily: "display",
    pageTitle: asString(page.title, "New Eltronic page"),
    sectionSpacing: "normal",
    surfaceColor: "23, 32, 51",
    surfaceOpacity: 0.78,
    textColor: "#f1f5f9",
    themePreset: "eltronicDark",
  };
}

export function normalizeBuilderData(value: unknown): BuilderData | null {
  if (!isRecord(value) || !Array.isArray(value.content) || !isRecord(value.root)) {
    return null;
  }

  return {
    content: value.content.filter(isRecord) as BuilderData["content"],
    root: value.root as BuilderData["root"],
    zones: isRecord(value.zones) ? (value.zones as BuilderData["zones"]) : {},
  };
}

export function pageToBuilderData(page: PageLike): BuilderData {
  const existingBuilderData = normalizeBuilderData(page.builderData);

  if (existingBuilderData) {
    return existingBuilderData;
  }

  return {
    content: asArray(page.layout).map((block, index) => {
      const id = asString(block.id, `${asString(block.blockType, "block")}-${index}`);
      const design = blockDesign(block);

      if (block.blockType === "hero") {
        const primaryLink = linkFields(block.primaryLink);
        const secondaryLink = linkFields(block.secondaryLink);

        return {
          props: {
            ...design,
            eyebrow: asString(block.eyebrow),
            heading: asString(block.heading, "Hero heading"),
            id,
            imageAlt: relationAlt(block.image, asString(block.heading)),
            imageUrl: relationUrl(block.image),
            lede: asString(block.lede),
            primaryLabel: primaryLink.label,
            primaryUrl: primaryLink.url,
            secondaryLabel: secondaryLink.label,
            secondaryUrl: secondaryLink.url,
          },
          type: "HeroBlock",
        };
      }

      if (block.blockType === "richText") {
        return {
          props: {
            ...design,
            body: lexicalToText(block.content) || "Rich text",
            id,
          },
          type: "RichTextBlock",
        };
      }

      if (block.blockType === "imageText") {
        const link = linkFields(block.link);

        return {
          props: {
            ...design,
            body: asString(block.body),
            heading: asString(block.heading, "Image text"),
            id,
            imageAlt: relationAlt(block.image, asString(block.heading)),
            imageSide: asString(block.imageSide, "right") === "left" ? "left" : "right",
            imageUrl: relationUrl(block.image),
            linkLabel: link.label,
            linkUrl: link.url,
          },
          type: "ImageTextBlock",
        };
      }

      if (block.blockType === "cardGrid") {
        return {
          props: {
            ...design,
            cards: asArray(block.cards).map((card) => ({
              body: asString(card.body),
              title: asString(card.title, "Card"),
              url: linkFields(card.link).url,
            })),
            columns: asString(block.columns, "3"),
            heading: asString(block.heading, "Card grid"),
            id,
            intro: asString(block.intro),
          },
          type: "CardGridBlock",
        };
      }

      if (block.blockType === "productGrid") {
        return {
          props: {
            ...design,
            columns: asString(block.columns, "3"),
            heading: asString(block.heading, "Products"),
            id,
            intro: asString(block.intro),
            mode: asString(block.mode, "featured") === "manual" ? "manual" : "featured",
          },
          type: "ProductGridBlock",
        };
      }

      if (block.blockType === "gallery") {
        return {
          props: {
            ...design,
            heading: asString(block.heading),
            id,
            images: asArray(block.images).map((image) => ({
              alt: relationAlt(image),
              url: relationUrl(image),
            })),
          },
          type: "GalleryBlock",
        };
      }

      if (block.blockType === "downloads") {
        return {
          props: {
            ...design,
            documents: asArray(block.documents).map((document) => ({
              description: asString(document.description),
              title: asString(document.title, "Document"),
              url: asString(document.url),
            })),
            heading: asString(block.heading, "Downloads"),
            id,
          },
          type: "DownloadsBlock",
        };
      }

      if (block.blockType === "specTable") {
        return {
          props: {
            ...design,
            heading: asString(block.heading, "Specifications"),
            id,
            rows: asArray(block.rows).map((row) => ({
              label: asString(row.label, "Label"),
              value: asString(row.value, "Value"),
            })),
          },
          type: "SpecTableBlock",
        };
      }

      const primaryLink = linkFields(block.primaryLink);

      return {
        props: {
          ...design,
          accentColor: "#fbbf24",
          body: asString(block.body),
          effect: "glow",
          eyebrow: asString(block.eyebrow),
          heading: asString(block.heading, "Call to action"),
          id,
          opacity: asNumber(block.opacity, 1),
          primaryLabel: primaryLink.label,
          primaryUrl: primaryLink.url,
          textAlign: "center",
          variant: "band",
        },
        type: "CallToActionBlock",
      };
    }) as BuilderData["content"],
    root: {
      props: rootProps(page),
    },
    zones: {},
  };
}
