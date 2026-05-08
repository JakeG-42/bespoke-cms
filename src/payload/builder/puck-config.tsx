import { isValidElement, type CSSProperties, type ReactNode } from "react";
import type { CustomFieldRender } from "@puckeditor/core";
import { ChevronDown, CircleHelp, HardHat, Headphones, LifeBuoy, PlugZap, Search, Settings, UserRound, Wrench } from "lucide-react";
import Link from "next/link";

import { HelpCentreChat } from "@/components/help-centre/HelpCentreChat";
import { getHelpArticlePath, getHelpCategoryPath } from "@/lib/help-centre/article-routing";
import type {
  BuilderAdvancedStyle,
  BuilderConfig,
  BuilderBorderControls,
  BuilderColorControls,
  BuilderEffectControls,
  BuilderHelpArticleStatus,
  BuilderHelpIcon,
  BuilderHoverEffect,
  BuilderHoverControls,
  BuilderHelpArticle,
  BuilderHelpCategory,
  BuilderMenu,
  BuilderProduct,
  BuilderSectionShadow,
  BuilderRootProps,
  BuilderSectionEffect,
  BuilderSectionWidth,
  BuilderSpacingControls,
  BuilderTypographyControls,
} from "./types";
import andersenHelpFaqContent from "./help-centre-faq-content.json";

const alignmentOptions = [
  { label: "Left", value: "left" },
  { label: "Center", value: "center" },
] as const;

const columnOptions = [
  { label: "2 columns", value: "2" },
  { label: "3 columns", value: "3" },
  { label: "4 columns", value: "4" },
] as const;

const effectOptions = [
  { label: "None", value: "none" },
  { label: "Glow", value: "glow" },
  { label: "Lift", value: "lift" },
  { label: "Border pulse", value: "borderPulse" },
] as const;

const borderStyleOptions = [
  { label: "None", value: "none" },
  { label: "Solid", value: "solid" },
  { label: "Dashed", value: "dashed" },
] as const;

const fontOptions = [
  { label: "Display", value: "display" },
  { label: "Sans", value: "sans" },
  { label: "Technical code", value: "code" },
] as const;

const fontWeightOptions = [
  { label: "Regular", value: "regular" },
  { label: "Medium", value: "medium" },
  { label: "Bold", value: "bold" },
  { label: "Heavy", value: "heavy" },
] as const;

const hoverOptions = [
  { label: "None", value: "none" },
  { label: "Lift", value: "lift" },
  { label: "Glow", value: "glow" },
  { label: "Brighten", value: "brighten" },
  { label: "Scale", value: "scale" },
  { label: "Border colour", value: "border" },
] as const;

const scrollOptions = [
  { label: "None", value: "none" },
  { label: "Fade up", value: "fadeUp" },
  { label: "Slide left", value: "slideLeft" },
  { label: "Scale in", value: "scaleIn" },
] as const;

const shadowOptions = [
  { label: "None", value: "none" },
  { label: "Soft", value: "soft" },
  { label: "Strong", value: "strong" },
] as const;

const widthOptions = [
  { label: "Narrow", value: "narrow" },
  { label: "Default", value: "default" },
  { label: "Wide", value: "wide" },
  { label: "Full width", value: "full" },
] as const;

const menuOrientationOptions = [
  { label: "Horizontal", value: "horizontal" },
  { label: "Vertical", value: "vertical" },
] as const;

const helpCategoryColumnOptions = [
  { label: "2 columns", value: "2" },
  { label: "3 columns", value: "3" },
] as const;

const helpCategoryIconOptions = [
  { label: "Product", value: "product" },
  { label: "Support", value: "support" },
  { label: "Installation", value: "installation" },
  { label: "How do I", value: "howTo" },
  { label: "Troubleshooting", value: "troubleshooting" },
  { label: "Installers", value: "installers" },
  { label: "Getting set up", value: "setup" },
] as const;

const helpCategoryIcons = {
  howTo: CircleHelp,
  installation: Wrench,
  installers: HardHat,
  product: PlugZap,
  setup: Settings,
  support: Headphones,
  troubleshooting: LifeBuoy,
} as const;

type HelpFaqArticle = {
  body?: string;
  sourceUrl?: string;
  status?: BuilderHelpArticleStatus;
  summary?: string;
  title: string;
};

type HelpFaqSection = {
  anchor?: string;
  articles?: HelpFaqArticle[];
  eyebrow?: string;
  heading: string;
  icon?: BuilderHelpIcon;
  intro?: string;
};

const defaultHelpFaqSections = andersenHelpFaqContent.sections as HelpFaqSection[];
const defaultHelpFaqSection = defaultHelpFaqSections[0] ?? {
  anchor: "support",
  articles: [],
  eyebrow: "Support",
  heading: "Help articles",
  icon: "support",
  intro: "Add customer support articles.",
};

const helpArticleStatusOptions = [
  { label: "Ready", value: "ready" },
  { label: "Draft", value: "draft" },
  { label: "Needs confirmation", value: "needsConfirmation" },
] as const;

const defaultHelpCategories = [
  {
    description: "Charger models, features and product details",
    icon: "product",
    title: "Product",
    url: "#product",
  },
  {
    description: "Contact routes, account questions and support options",
    icon: "support",
    title: "Support",
    url: "#support",
  },
  {
    description: "Getting ready, appointments and installation steps",
    icon: "installation",
    title: "Installation",
    url: "#installation",
  },
  {
    description: "Using the app, charging settings and everyday tasks",
    icon: "howTo",
    title: "How do I?",
    url: "#how-do-i",
  },
  {
    description: "Connectivity, charging issues and common fixes",
    icon: "troubleshooting",
    title: "Troubleshooting",
    url: "#troubleshooting",
  },
  {
    description: "Installer resources, setup checks and handover guidance",
    icon: "installers",
    title: "Installers",
    url: "#installers",
  },
] as const;

function rangeField({ fallback, label, max, min, step }: { fallback: number; label: string; max: number; min: number; step: number }) {
  const render: CustomFieldRender<number | undefined> = ({ field, id, onChange, readOnly, value }) => {
    const numberValue = typeof value === "number" && Number.isFinite(value) ? value : fallback;

    return (
      <label className="puck-range-field" htmlFor={id}>
        <span>
          {field.label}
          <strong>{numberValue}%</strong>
        </span>
        <input
          disabled={readOnly}
          id={id}
          max={max}
          min={min}
          onChange={(event) => onChange(Number(event.currentTarget.value))}
          step={step}
          type="range"
          value={numberValue}
        />
      </label>
    );
  };

  return {
    label,
    render,
    type: "custom",
  } as const;
}

function toggleField(label: string) {
  const render: CustomFieldRender<boolean | undefined> = ({ field, id, onChange, readOnly, value }) => {
    const checked = Boolean(value);

    return (
      <label className="puck-toggle-field" htmlFor={id}>
        <span>{field.label}</span>
        <input disabled={readOnly} id={id} onChange={(event) => onChange(event.currentTarget.checked)} type="checkbox" checked={checked} />
      </label>
    );
  };

  return {
    label,
    render,
    type: "custom",
  } as const;
}

const sharedDesignFields = {
  colorControls: {
    label: "Colours",
    objectFields: {
      accentColor: { label: "Accent", placeholder: "#8bd3ff", type: "text" },
      backgroundColor: { label: "Section background", placeholder: "rgba(23, 32, 51, 0.78)", type: "text" },
      surfaceColor: { label: "Cards/media surface", placeholder: "rgba(23, 32, 51, 0.78)", type: "text" },
      textColor: { label: "Text", placeholder: "#f1f5f9", type: "text" },
    },
    type: "object",
  },
  typographyControls: {
    label: "Typography",
    objectFields: {
      fontFamily: { label: "Font", options: fontOptions, type: "select" },
      fontWeight: { label: "Heading weight", options: fontWeightOptions, type: "select" },
      headingSize: { label: "Heading size (rem)", max: 7, min: 0.8, step: 0.1, type: "number" },
      subheadingSize: { label: "Subheading size (rem)", max: 3, min: 0.7, step: 0.05, type: "number" },
      bodySize: { label: "Body size (rem)", max: 2, min: 0.65, step: 0.05, type: "number" },
      eyebrowSize: { label: "Eyebrow size (rem)", max: 1.6, min: 0.55, step: 0.05, type: "number" },
      lineHeight: { label: "Line height", max: 2.2, min: 0.9, step: 0.05, type: "number" },
      textAlign: { label: "Text alignment", options: alignmentOptions, type: "select" },
    },
    type: "object",
  },
  spacingControls: {
    label: "Spacing",
    objectFields: {
      sectionWidth: { label: "Section width", options: widthOptions, type: "select" },
      sectionPaddingTop: { label: "Padding top (rem)", max: 10, min: 0, step: 0.25, type: "number" },
      sectionPaddingBottom: { label: "Padding bottom (rem)", max: 10, min: 0, step: 0.25, type: "number" },
      sectionPaddingX: { label: "Padding sides (rem)", max: 8, min: 0, step: 0.25, type: "number" },
      elementPadding: { label: "Card/CTA padding (rem)", max: 5, min: 0, step: 0.1, type: "number" },
      elementGap: { label: "Gap (rem)", max: 5, min: 0, step: 0.1, type: "number" },
    },
    type: "object",
  },
  borderControls: {
    label: "Borders",
    objectFields: {
      sectionBorderStyle: { label: "Section style", options: borderStyleOptions, type: "select" },
      sectionBorderWidth: { label: "Section width (px)", max: 12, min: 0, step: 1, type: "number" },
      sectionBorderRadius: { label: "Section radius (px)", max: 80, min: 0, step: 1, type: "number" },
      sectionBorderColor: { label: "Section colour", placeholder: "rgba(139, 211, 255, 0.24)", type: "text" },
      elementBorderStyle: { label: "Element style", options: borderStyleOptions, type: "select" },
      elementBorderWidth: { label: "Element width (px)", max: 12, min: 0, step: 1, type: "number" },
      elementBorderRadius: { label: "Element radius (px)", max: 80, min: 0, step: 1, type: "number" },
      elementBorderColor: { label: "Element colour", placeholder: "rgba(139, 211, 255, 0.24)", type: "text" },
    },
    type: "object",
  },
  effectControls: {
    label: "Effects",
    objectFields: {
      effect: { label: "Section effect", options: effectOptions, type: "select" },
      sectionShadow: { label: "Shadow", options: shadowOptions, type: "select" },
      opacity: { label: "Opacity", max: 1, min: 0.2, step: 0.05, type: "number" },
      scrollAnimation: { label: "On scroll", options: scrollOptions, type: "select" },
    },
    type: "object",
  },
  hoverControls: {
    label: "Hover",
    objectFields: {
      hoverEffect: { label: "Effect", options: hoverOptions, type: "select" },
      hoverScaleMode: {
        label: "Scale direction",
        options: [
          { label: "Enlarge", value: "enlarge" },
          { label: "Shrink", value: "shrink" },
        ],
        type: "select",
      },
      hoverScaleAmount: rangeField({ fallback: 2, label: "Scale amount", max: 24, min: 1, step: 1 }),
      hoverBackgroundColor: { label: "Background", placeholder: "rgba(139, 211, 255, 0.12)", type: "text" },
      hoverTextColor: { label: "Text", placeholder: "#ffffff", type: "text" },
      hoverBorderColor: { label: "Border", placeholder: "#8bd3ff", type: "text" },
    },
    type: "object",
  },
} as const;

const defaultDesign: Required<BuilderAdvancedStyle> = {
  accentColor: "#8bd3ff",
  backgroundColor: "",
  bodySize: 1,
  elementBorderColor: "",
  elementBorderRadius: 8,
  elementBorderStyle: "solid",
  elementBorderWidth: 1,
  elementGap: 1,
  elementPadding: 1.15,
  effect: "none",
  eyebrowSize: 0.76,
  fontFamily: "display",
  fontWeight: "heavy",
  headingSize: 3.2,
  hoverBackgroundColor: "",
  hoverBorderColor: "",
  hoverEffect: "none",
  hoverScaleAmount: 2,
  hoverScaleMode: "enlarge",
  hoverTextColor: "",
  lineHeight: 1.7,
  opacity: 1,
  scrollAnimation: "none",
  sectionBorderColor: "",
  sectionBorderRadius: 0,
  sectionBorderStyle: "none",
  sectionBorderWidth: 0,
  sectionPaddingBottom: 0,
  sectionPaddingTop: 0,
  sectionPaddingX: 0,
  sectionShadow: "none",
  sectionWidth: "default",
  subheadingSize: 1.12,
  surfaceColor: "",
  textAlign: "left",
  textColor: "",
  borderControls: {
    elementBorderColor: "",
    elementBorderRadius: 8,
    elementBorderStyle: "solid",
    elementBorderWidth: 1,
    sectionBorderColor: "",
    sectionBorderRadius: 0,
    sectionBorderStyle: "none",
    sectionBorderWidth: 0,
  },
  colorControls: {
    accentColor: "#8bd3ff",
    backgroundColor: "",
    surfaceColor: "",
    textColor: "",
  },
  effectControls: {
    effect: "none",
    opacity: 1,
    scrollAnimation: "none",
    sectionShadow: "none",
  },
  hoverControls: {
    hoverBackgroundColor: "",
    hoverBorderColor: "",
    hoverEffect: "none",
    hoverScaleAmount: 2,
    hoverScaleMode: "enlarge",
    hoverTextColor: "",
  },
  spacingControls: {
    elementGap: 1,
    elementPadding: 1.15,
    sectionPaddingBottom: 0,
    sectionPaddingTop: 0,
    sectionPaddingX: 0,
    sectionWidth: "default",
  },
  typographyControls: {
    bodySize: 1,
    eyebrowSize: 0.76,
    fontFamily: "display",
    fontWeight: "heavy",
    headingSize: 3.2,
    lineHeight: 1.7,
    subheadingSize: 1.12,
    textAlign: "left",
  },
};

const fontWeightMap = {
  bold: 700,
  heavy: 850,
  medium: 600,
  regular: 400,
} as const;

const sectionWidthMap: Record<BuilderSectionWidth, string> = {
  default: "1180px",
  full: "100%",
  narrow: "820px",
  wide: "1400px",
};

function mergeControlGroup<T extends object>(value: T | undefined): Partial<T> {
  return typeof value === "object" && value !== null ? value : {};
}

function getDesign(style: BuilderAdvancedStyle = {}) {
  const borders = mergeControlGroup<BuilderBorderControls>(style.borderControls);
  const colors = mergeControlGroup<BuilderColorControls>(style.colorControls);
  const effects = mergeControlGroup<BuilderEffectControls>(style.effectControls);
  const hover = mergeControlGroup<BuilderHoverControls>(style.hoverControls);
  const spacing = mergeControlGroup<BuilderSpacingControls>(style.spacingControls);
  const typography = mergeControlGroup<BuilderTypographyControls>(style.typographyControls);

  return {
    accentColor: colors.accentColor ?? style.accentColor,
    backgroundColor: colors.backgroundColor ?? style.backgroundColor,
    bodySize: typography.bodySize ?? style.bodySize,
    elementBorderColor: borders.elementBorderColor ?? style.elementBorderColor,
    elementBorderRadius: borders.elementBorderRadius ?? style.elementBorderRadius,
    elementBorderStyle: borders.elementBorderStyle ?? style.elementBorderStyle,
    elementBorderWidth: borders.elementBorderWidth ?? style.elementBorderWidth,
    elementGap: spacing.elementGap ?? style.elementGap,
    elementPadding: spacing.elementPadding ?? style.elementPadding,
    effect: effects.effect ?? style.effect,
    eyebrowSize: typography.eyebrowSize ?? style.eyebrowSize,
    fontFamily: typography.fontFamily ?? style.fontFamily,
    fontWeight: typography.fontWeight ?? style.fontWeight,
    headingSize: typography.headingSize ?? style.headingSize,
    hoverBackgroundColor: hover.hoverBackgroundColor ?? style.hoverBackgroundColor,
    hoverBorderColor: hover.hoverBorderColor ?? style.hoverBorderColor,
    hoverEffect: hover.hoverEffect ?? style.hoverEffect,
    hoverScaleAmount: hover.hoverScaleAmount ?? style.hoverScaleAmount,
    hoverScaleMode: hover.hoverScaleMode ?? style.hoverScaleMode,
    hoverTextColor: hover.hoverTextColor ?? style.hoverTextColor,
    lineHeight: typography.lineHeight ?? style.lineHeight,
    opacity: effects.opacity ?? style.opacity,
    scrollAnimation: effects.scrollAnimation ?? style.scrollAnimation,
    sectionBorderColor: borders.sectionBorderColor ?? style.sectionBorderColor,
    sectionBorderRadius: borders.sectionBorderRadius ?? style.sectionBorderRadius,
    sectionBorderStyle: borders.sectionBorderStyle ?? style.sectionBorderStyle,
    sectionBorderWidth: borders.sectionBorderWidth ?? style.sectionBorderWidth,
    sectionPaddingBottom: spacing.sectionPaddingBottom ?? style.sectionPaddingBottom,
    sectionPaddingTop: spacing.sectionPaddingTop ?? style.sectionPaddingTop,
    sectionPaddingX: spacing.sectionPaddingX ?? style.sectionPaddingX,
    sectionShadow: effects.sectionShadow ?? style.sectionShadow,
    sectionWidth: spacing.sectionWidth ?? style.sectionWidth,
    subheadingSize: typography.subheadingSize ?? style.subheadingSize,
    surfaceColor: colors.surfaceColor ?? style.surfaceColor,
    textAlign: typography.textAlign ?? style.textAlign,
    textColor: colors.textColor ?? style.textColor,
  };
}

function cssRem(value: number | undefined) {
  return typeof value === "number" && Number.isFinite(value) ? `${value}rem` : undefined;
}

function cssPx(value: number | undefined) {
  return typeof value === "number" && Number.isFinite(value) ? `${value}px` : undefined;
}

function cssNumber(value: number | undefined) {
  return typeof value === "number" && Number.isFinite(value) ? String(value) : undefined;
}

function getSectionStyle(style: BuilderAdvancedStyle = {}) {
  const design = getDesign(style);
  const hoverScaleAmount = typeof design.hoverScaleAmount === "number" && Number.isFinite(design.hoverScaleAmount) ? design.hoverScaleAmount : 2;
  const hoverScale = design.hoverScaleMode === "shrink" ? 1 - hoverScaleAmount / 100 : 1 + hoverScaleAmount / 100;

  return {
    "--builder-accent": design.accentColor || "var(--primary)",
    "--builder-body-size": cssRem(design.bodySize),
    "--builder-element-border-color": design.elementBorderColor || "color-mix(in srgb, var(--builder-accent) 18%, transparent)",
    "--builder-element-border-radius": cssPx(design.elementBorderRadius),
    "--builder-element-border-style": design.elementBorderStyle ?? "solid",
    "--builder-element-border-width": cssPx(design.elementBorderWidth),
    "--builder-element-gap": cssRem(design.elementGap),
    "--builder-element-padding": cssRem(design.elementPadding),
    "--builder-eyebrow-size": cssRem(design.eyebrowSize),
    "--builder-font-weight": design.fontWeight ? fontWeightMap[design.fontWeight] : undefined,
    "--builder-heading-size": cssRem(design.headingSize),
    "--builder-hover-bg": design.hoverBackgroundColor || "color-mix(in srgb, var(--builder-accent) 14%, var(--builder-section-bg))",
    "--builder-hover-border": design.hoverBorderColor || "color-mix(in srgb, var(--builder-accent) 64%, transparent)",
    "--builder-hover-scale": cssNumber(hoverScale),
    "--builder-hover-text": design.hoverTextColor || "var(--builder-section-text)",
    "--builder-line-height": cssNumber(design.lineHeight),
    "--builder-section-border-color": design.sectionBorderColor || "color-mix(in srgb, var(--builder-accent) 24%, transparent)",
    "--builder-section-border-radius": cssPx(design.sectionBorderRadius),
    "--builder-section-border-style": design.sectionBorderStyle ?? "none",
    "--builder-section-border-width": cssPx(design.sectionBorderWidth),
    "--builder-section-bg": design.backgroundColor || "transparent",
    "--builder-section-padding-bottom": cssRem(design.sectionPaddingBottom),
    "--builder-section-padding-top": cssRem(design.sectionPaddingTop),
    "--builder-section-padding-x": cssRem(design.sectionPaddingX),
    "--builder-section-text": design.textColor || "var(--text-primary)",
    "--builder-section-width": sectionWidthMap[design.sectionWidth ?? "default"],
    "--builder-subheading-size": cssRem(design.subheadingSize),
    "--builder-surface-fill": design.surfaceColor || "rgba(var(--builder-surface), var(--builder-surface-opacity))",
    opacity: design.opacity ?? 1,
  } as CSSProperties;
}

function getHeroStyle(
  props: BuilderAdvancedStyle & {
    heroControls?: {
      contentMaxWidth?: number;
      contentPaddingX?: number;
      cornerRadius?: number;
      imagePosition?: string;
      overlayOpacity?: number;
    };
  },
) {
  const heroControls = typeof props.heroControls === "object" && props.heroControls !== null ? props.heroControls : {};

  return {
    ...getSectionStyle(props),
    "--puck-hero-copy-padding-x": cssRem(heroControls.contentPaddingX),
    "--puck-hero-copy-width": cssRem(heroControls.contentMaxWidth),
    "--puck-hero-image-position": heroControls.imagePosition || undefined,
    "--puck-hero-overlay-opacity": cssNumber(heroControls.overlayOpacity),
    "--puck-hero-radius": cssPx(heroControls.cornerRadius),
  } as CSSProperties;
}

function getSectionClassName(style: BuilderAdvancedStyle = {}, className = "") {
  const design = getDesign(style);
  const effect: BuilderSectionEffect = design.effect ?? "none";
  const hoverEffect: BuilderHoverEffect = design.hoverEffect ?? "none";
  const sectionShadow: BuilderSectionShadow = design.sectionShadow ?? "none";
  const sectionWidth: BuilderSectionWidth = design.sectionWidth ?? "default";

  return [
    "puck-section",
    `puck-align-${design.textAlign ?? "left"}`,
    `puck-font-${design.fontFamily ?? "display"}`,
    `puck-effect-${effect}`,
    `puck-hover-${hoverEffect}`,
    `puck-scroll-${design.scrollAnimation ?? "none"}`,
    `puck-shadow-${sectionShadow}`,
    `puck-width-${sectionWidth}`,
    className,
  ]
    .filter(Boolean)
    .join(" ");
}

function textValue(value: unknown, fallback = "") {
  return typeof value === "string" ? value : fallback;
}

function inlineEditableValue(value: unknown): ReactNode | null {
  return isValidElement(value) ? value : null;
}

function getInternalLinkBasePath(metadata: unknown) {
  if (typeof metadata !== "object" || metadata === null || !("internalLinkBasePath" in metadata)) {
    return "";
  }

  const basePath = (metadata as { internalLinkBasePath?: unknown }).internalLinkBasePath;

  return typeof basePath === "string" ? basePath.replace(/\/+$/, "") : "";
}

function previewHref(url: string | undefined, metadata: unknown) {
  const href = textValue(url).trim();

  if (!href) {
    return "";
  }

  if (
    href.startsWith("#") ||
    href.startsWith("//") ||
    /^[a-z][a-z0-9+.-]*:/i.test(href)
  ) {
    return href;
  }

  const basePath = getInternalLinkBasePath(metadata);

  if (!basePath) {
    return href;
  }

  if (href === "/") {
    return basePath;
  }

  if (href === basePath || href.startsWith(`${basePath}/`)) {
    return href;
  }

  if (href.startsWith("/")) {
    return `${basePath}${href}`;
  }

  return href;
}

function arrayValue<T>(value: T[] | unknown): T[] {
  return Array.isArray(value) ? value : [];
}

function shouldHideHelpArticleSections(metadata: unknown) {
  return typeof metadata === "object" && metadata !== null && (metadata as { hideHelpArticleSections?: unknown }).hideHelpArticleSections === true;
}

function helpCategoryHref(category: { title?: string; url?: string }, metadata: unknown) {
  const url = textValue(category.url).trim();

  if (!url || url === "#" || url.startsWith("#")) {
    const categorySlug = url.startsWith("#") ? url.slice(1) : category.title;

    return previewHref(getHelpCategoryPath(categorySlug), metadata) || "#";
  }

  return previewHref(url, metadata) || "#";
}

function BuilderButton({
  link,
  metadata,
  secondary = false,
}: {
  link: { label?: string; url?: string };
  metadata?: unknown;
  secondary?: boolean;
}) {
  if (!link.label || !link.url) {
    return null;
  }

  return (
    <a className={`puck-button ${secondary ? "secondary" : ""}`} href={previewHref(link.url, metadata)}>
      {link.label}
    </a>
  );
}

function BuilderMedia({ alt, url }: { alt?: string; url?: string }) {
  if (!url) {
    return (
      <div className="puck-media-placeholder">
        <span>Visual</span>
      </div>
    );
  }

  // Puck needs to render arbitrary editor-provided image URLs inside its canvas.
  // eslint-disable-next-line @next/next/no-img-element
  return <img alt={alt || ""} className="puck-media" src={url} />;
}

function HelpCategoryIcon({ icon }: { icon?: string }) {
  const Icon = helpCategoryIcons[icon as keyof typeof helpCategoryIcons] ?? CircleHelp;

  return <Icon aria-hidden="true" strokeWidth={1.8} />;
}

function getAnchorId(anchor: string | undefined) {
  const normalized = textValue(anchor).replace(/^#/, "").trim();
  return normalized || undefined;
}

function getFeaturedProducts(metadata: Record<string, unknown>): BuilderProduct[] {
  const products = metadata.featuredProducts;

  if (!Array.isArray(products)) {
    return [];
  }

  return products.filter((product): product is BuilderProduct => {
    return (
      typeof product === "object" &&
      product !== null &&
      "name" in product &&
      "slug" in product &&
      typeof product.name === "string" &&
      typeof product.slug === "string"
    );
  });
}

function getCurrentHelpCategory(metadata: Record<string, unknown>): BuilderHelpCategory | null {
  const category = metadata.helpCategory;

  if (!category || typeof category !== "object" || Array.isArray(category)) {
    return null;
  }

  const value = category as Partial<BuilderHelpCategory>;

  return typeof value.title === "string" && typeof value.slug === "string" && typeof value.path === "string" ? (value as BuilderHelpCategory) : null;
}

function getCurrentHelpArticle(metadata: Record<string, unknown>): BuilderHelpArticle | null {
  const article = metadata.helpArticle;

  if (!article || typeof article !== "object" || Array.isArray(article)) {
    return null;
  }

  const value = article as Partial<BuilderHelpArticle>;

  return typeof value.title === "string" && typeof value.slug === "string" && typeof value.path === "string" ? (value as BuilderHelpArticle) : null;
}

function getHelpArticles(metadata: Record<string, unknown>): BuilderHelpArticle[] {
  const articles = metadata.helpArticles;

  if (!Array.isArray(articles)) {
    return [];
  }

  return articles.filter((article): article is BuilderHelpArticle => {
    if (!article || typeof article !== "object" || Array.isArray(article)) {
      return false;
    }

    const value = article as Partial<BuilderHelpArticle>;

    return typeof value.title === "string" && typeof value.slug === "string" && typeof value.path === "string";
  });
}

function sampleHelpCategory(): BuilderHelpCategory {
  const section = defaultHelpFaqSections[0] ?? defaultHelpFaqSection;
  const slug = textValue(section.anchor, "product");

  return {
    description: textValue(section.intro, "Article cards for this Help Centre category."),
    heading: textValue(section.heading, "Product help"),
    icon: section.icon,
    path: getHelpCategoryPath(slug),
    slug,
    title: textValue(section.eyebrow, textValue(section.heading, "Product")),
  };
}

function sampleHelpArticles(): BuilderHelpArticle[] {
  const section = defaultHelpFaqSections[0] ?? defaultHelpFaqSection;
  const categorySlug = textValue(section.anchor, "product");

  return arrayValue<HelpFaqArticle>(section.articles).slice(0, 6).map((article) => ({
    body: textValue(article.body),
    categorySlug,
    path: getHelpArticlePath(categorySlug, article.title),
    reviewStatus: article.status,
    sectionHeading: textValue(section.heading, "Product help"),
    slug: article.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, ""),
    sourceUrl: textValue(article.sourceUrl),
    summary: textValue(article.summary),
    title: textValue(article.title, "Help article"),
  }));
}

function publicArticleChunks(body: string) {
  return body
    .split(/\n{2,}/)
    .map((chunk) => chunk.trim())
    .filter(Boolean)
    .filter((chunk) => !/^(needs andersen confirmation|publication warning|recommended asset|recommended page note|recommended support detail|migration note|content gaps|suggested review owners)/i.test(chunk));
}

function ArticleBody({ body }: { body: string }) {
  const chunks = publicArticleChunks(body);

  if (!chunks.length) {
    return <p>Article content is being prepared.</p>;
  }

  return (
    <>
      {chunks.map((chunk, index) => {
        const lines = chunk
          .split("\n")
          .map((line) => line.trim())
          .filter(Boolean);
        const isList = lines.length > 1 && lines.every((line) => line.startsWith("- "));

        if (isList) {
          return (
            <ul key={`${chunk.slice(0, 12)}-${index}`}>
              {lines.map((line) => (
                <li key={line}>{line.replace(/^- /, "")}</li>
              ))}
            </ul>
          );
        }

        return <p key={`${chunk.slice(0, 12)}-${index}`}>{lines.join(" ")}</p>;
      })}
    </>
  );
}

function getBuilderMenus(metadata: Record<string, unknown>): BuilderMenu[] {
  const menus = metadata.menus;

  if (!Array.isArray(menus)) {
    return [];
  }

  return menus.filter((menu): menu is BuilderMenu => {
    return (
      typeof menu === "object" &&
      menu !== null &&
      "handle" in menu &&
      "title" in menu &&
      "items" in menu &&
      typeof menu.handle === "string" &&
      typeof menu.title === "string" &&
      Array.isArray(menu.items)
    );
  });
}

function getMenuOptions(metadata: Record<string, unknown>) {
  const menus = getBuilderMenus(metadata);

  if (!menus.length) {
    return [{ label: "Primary navigation", value: "primary" }];
  }

  return menus.map((menu) => ({
    label: menu.title,
    value: menu.handle,
  }));
}

function getMenu(metadata: Record<string, unknown>, handle: string | undefined) {
  const menus = getBuilderMenus(metadata);
  return menus.find((menu) => menu.handle === handle) ?? menus[0] ?? null;
}

function withFullWidth<T extends BuilderAdvancedStyle & { fullWidth?: boolean }>(props: T): T {
  if (!props.fullWidth) {
    return props;
  }

  return {
    ...props,
    sectionWidth: "full",
    spacingControls: {
      ...props.spacingControls,
      sectionWidth: "full",
    },
  };
}

function Root({ children, ...props }: BuilderRootProps & { children: ReactNode }) {
  return (
    <main
      className={`puck-platform-page puck-theme-${props.themePreset ?? "platformDark"} puck-density-${
        props.sectionSpacing ?? "normal"
      } puck-font-${props.fontFamily ?? "display"}`}
      style={
        {
          "--builder-accent": props.accentColor || "#8bd3ff",
          "--builder-bg": props.backgroundColor || "#020617",
          "--builder-page-padding-bottom": cssRem(props.pagePaddingBottom),
          "--builder-page-padding-top": cssRem(props.pagePaddingTop),
          "--builder-surface": props.surfaceColor || "23, 32, 51",
          "--builder-surface-fill": `rgba(${props.surfaceColor || "23, 32, 51"}, ${props.surfaceOpacity ?? 0.78})`,
          "--builder-surface-opacity": String(props.surfaceOpacity ?? 0.78),
          "--builder-text": props.textColor || "#f1f5f9",
        } as CSSProperties
      }
    >
      {children}
    </main>
  );
}

export const builderConfig: BuilderConfig = {
  categories: {
    commerce: {
      components: ["ProductGridBlock"],
      title: "Commerce",
    },
    content: {
      components: ["SectionBlock", "RichTextBlock", "ImageTextBlock", "CardGridBlock", "SpecTableBlock", "CallToActionBlock"],
      defaultExpanded: true,
      title: "Content",
    },
    media: {
      components: ["GalleryBlock", "DownloadsBlock"],
      title: "Media",
    },
    navigation: {
      components: ["SiteHeaderBlock", "MenuBlock"],
      defaultExpanded: true,
      title: "Navigation",
    },
    structure: {
      components: ["HeroBlock"],
      defaultExpanded: true,
      title: "Structure",
    },
    support: {
      components: ["HelpCategoryGridBlock", "HelpCategoryArticlesBlock", "HelpArticleContentBlock", "HelpFaqSectionBlock", "HelpCentreBlock"],
      defaultExpanded: true,
      title: "Support",
    },
  },
  components: {
    CallToActionBlock: {
      defaultProps: {
        ...defaultDesign,
        accentColor: "#fbbf24",
        body: "Add a clear next step for visitors.",
        colorControls: { ...defaultDesign.colorControls, accentColor: "#fbbf24" },
        effect: "glow",
        effectControls: { ...defaultDesign.effectControls, effect: "glow" },
        elementPadding: 2.6,
        eyebrow: "Ready",
        heading: "Start the conversation",
        primaryLabel: "Contact support",
        primaryUrl: "/contact",
        secondaryLabel: "",
        secondaryUrl: "",
        spacingControls: { ...defaultDesign.spacingControls, elementPadding: 2.6 },
        textAlign: "center",
        typographyControls: { ...defaultDesign.typographyControls, textAlign: "center" },
        variant: "band",
      },
      fields: {
        eyebrow: { contentEditable: true, label: "Eyebrow", type: "text" },
        heading: { contentEditable: true, label: "Heading", type: "text" },
        body: { contentEditable: true, label: "Body", type: "textarea" },
        primaryLabel: { label: "Primary label", type: "text" },
        primaryUrl: { label: "Primary URL", type: "text" },
        secondaryLabel: { label: "Secondary label", type: "text" },
        secondaryUrl: { label: "Secondary URL", type: "text" },
        variant: {
          label: "Layout",
          options: [
            { label: "Band", value: "band" },
            { label: "Card", value: "card" },
            { label: "Full bleed", value: "fullBleed" },
          ],
          type: "select",
        },
        ...sharedDesignFields,
      },
      label: "CTA",
      render: (props) => (
        <section className={getSectionClassName(props, `puck-cta puck-cta-${props.variant ?? "band"}`)} style={getSectionStyle(props)}>
          {props.eyebrow ? <span className="puck-kicker">{props.eyebrow}</span> : null}
          <h2>{props.heading}</h2>
          {props.body ? <p>{props.body}</p> : null}
          <div className="puck-actions">
            <BuilderButton link={{ label: props.primaryLabel, url: props.primaryUrl }} metadata={props.puck.metadata} />
            <BuilderButton link={{ label: props.secondaryLabel, url: props.secondaryUrl }} metadata={props.puck.metadata} secondary />
          </div>
        </section>
      ),
    },
    CardGridBlock: {
      defaultProps: {
        ...defaultDesign,
        cards: [
          {
            body: "Describe the value this block provides.",
            title: "Reusable card",
            url: "",
          },
        ],
        columns: "3",
        heading: "Content grid",
        intro: "Use cards to group related services, benefits, or process steps.",
      },
      fields: {
        heading: { contentEditable: true, label: "Heading", type: "text" },
        intro: { contentEditable: true, label: "Intro", type: "textarea" },
        columns: { label: "Columns", options: columnOptions, type: "select" },
        cards: {
          arrayFields: {
            body: { label: "Body", type: "textarea" },
            title: { label: "Title", type: "text" },
            url: { label: "URL", type: "text" },
          },
          defaultItemProps: {
            body: "Card body",
            title: "New card",
            url: "",
          },
          getItemSummary: (item) => item.title || "Card",
          label: "Cards",
          type: "array",
        },
        ...sharedDesignFields,
      },
      label: "Card grid",
      render: (props) => {
        const cards = arrayValue<NonNullable<typeof props.cards>[number]>(props.cards);

        return (
          <section className={getSectionClassName(props)} style={getSectionStyle(props)}>
            <div className="puck-section-heading">
              <h2>{textValue(props.heading, "Content grid")}</h2>
              {textValue(props.intro) ? <p>{textValue(props.intro)}</p> : null}
            </div>
            <div className={`puck-card-grid puck-columns-${props.columns ?? "3"}`}>
              {cards.map((card, index) => (
                <article className="puck-card" key={`${textValue(card.title, "card")}-${index}`}>
                  <h3>{textValue(card.title, "Card")}</h3>
                  {textValue(card.body) ? <p>{textValue(card.body)}</p> : null}
                  {textValue(card.url) ? <a href={previewHref(card.url, props.puck.metadata)}>View</a> : null}
                </article>
              ))}
            </div>
          </section>
        );
      },
    },
    DownloadsBlock: {
      defaultProps: {
        ...defaultDesign,
        documents: [
          {
            description: "Optional download detail.",
            title: "Document",
            url: "",
          },
        ],
        heading: "Downloads",
      },
      fields: {
        heading: { contentEditable: true, label: "Heading", type: "text" },
        documents: {
          arrayFields: {
            description: { label: "Description", type: "textarea" },
            title: { label: "Title", type: "text" },
            url: { label: "URL", type: "text" },
          },
          defaultItemProps: {
            description: "",
            title: "New document",
            url: "",
          },
          getItemSummary: (item) => item.title || "Document",
          label: "Documents",
          type: "array",
        },
        ...sharedDesignFields,
      },
      label: "Downloads",
      render: (props) => {
        const documents = arrayValue<NonNullable<typeof props.documents>[number]>(props.documents);

        return (
          <section className={getSectionClassName(props)} style={getSectionStyle(props)}>
            <div className="puck-section-heading">
              <h2>{textValue(props.heading, "Downloads")}</h2>
            </div>
            <div className="puck-card-grid puck-columns-3">
              {documents.map((document, index) => (
                <a className="puck-card" href={previewHref(document.url, props.puck.metadata) || "#"} key={`${textValue(document.title, "document")}-${index}`}>
                  <h3>{textValue(document.title, "Document")}</h3>
                  {textValue(document.description) ? <p>{textValue(document.description)}</p> : null}
                </a>
              ))}
            </div>
          </section>
        );
      },
    },
    GalleryBlock: {
      defaultProps: {
        ...defaultDesign,
        heading: "Gallery",
        images: [],
      },
      fields: {
        heading: { contentEditable: true, label: "Heading", type: "text" },
        images: {
          arrayFields: {
            alt: { label: "Alt text", type: "text" },
            url: { label: "Image URL", type: "text" },
          },
          defaultItemProps: {
            alt: "",
            url: "",
          },
          getItemSummary: (item) => item.alt || item.url || "Image",
          label: "Images",
          type: "array",
        },
        ...sharedDesignFields,
      },
      label: "Gallery",
      render: (props) => {
        const images = arrayValue<NonNullable<typeof props.images>[number]>(props.images);

        return (
          <section className={getSectionClassName(props)} style={getSectionStyle(props)}>
            {textValue(props.heading) ? (
              <div className="puck-section-heading">
                <h2>{textValue(props.heading)}</h2>
              </div>
            ) : null}
            <div className="puck-gallery">
              {images.map((image, index) => (
                <BuilderMedia alt={textValue(image.alt)} key={`${textValue(image.url)}-${index}`} url={textValue(image.url)} />
              ))}
            </div>
          </section>
        );
      },
    },
    SiteHeaderBlock: {
      defaultProps: {
        ...defaultDesign,
        brandImageAlt: "",
        brandImageUrl: "",
        brandLabel: "ANDERSEN EV",
        ctaLabel: "Contact",
        ctaUrl: "/contact",
        fullWidth: true,
        menuHandle: "primary",
        searchUrl: "#search",
        sectionPaddingX: 2,
        showSearchIcon: false,
        showTopBar: false,
        showUserIcon: false,
        spacingControls: { ...defaultDesign.spacingControls, sectionPaddingX: 2 },
        sticky: false,
        topBarCountryLabel: "Made in the UK",
        topBarFlag: "🇬🇧",
        topBarPhone: "+44 1234 916133",
        topBarSalesLabel: "Sales",
        topBarStatusLabel: "Online",
        userUrl: "#account",
      },
      fields: {
        brandImageUrl: { label: "Logo URL", type: "text" },
        brandImageAlt: { label: "Logo alt", type: "text" },
        brandLabel: { contentEditable: true, label: "Brand label", type: "text" },
        menuHandle: { label: "Menu", options: [{ label: "Primary navigation", value: "primary" }], type: "select" },
        showSearchIcon: toggleField("Show search icon"),
        searchUrl: { label: "Search URL", type: "text" },
        showUserIcon: toggleField("Show user icon"),
        userUrl: { label: "User URL", type: "text" },
        ctaLabel: { label: "CTA label", type: "text" },
        ctaUrl: { label: "CTA URL", type: "text" },
        fullWidth: toggleField("Full width header"),
        sticky: toggleField("Sticky header"),
        showTopBar: toggleField("Show top bar"),
        topBarFlag: { label: "Top bar flag", type: "text" },
        topBarCountryLabel: { label: "Top bar country text", type: "text" },
        topBarSalesLabel: { label: "Top bar sales label", type: "text" },
        topBarStatusLabel: { label: "Top bar status label", type: "text" },
        topBarPhone: { label: "Top bar phone", type: "text" },
        ...sharedDesignFields,
      },
      label: "Site header",
      resolveFields: (_data, params) => ({
        ...params.fields,
        menuHandle: {
          label: "Menu",
          options: getMenuOptions(params.metadata),
          type: "select",
        },
      }),
      render: (props) => {
        const menu = getMenu(props.puck.metadata, props.menuHandle);
        const headerProps = withFullWidth(props);

        return (
          <div className={`puck-site-header-stack ${props.sticky ? "puck-site-header-stack-sticky" : ""}`}>
            {props.showTopBar ? (
              <div className="puck-site-topbar">
                <div className="puck-site-topbar-center">
                  {textValue(props.topBarFlag) ? <span aria-hidden="true">{props.topBarFlag}</span> : null}
                  <span>{textValue(props.topBarCountryLabel, "Made in the UK")}</span>
                </div>
                <div className="puck-site-topbar-right">
                  <span>{textValue(props.topBarSalesLabel, "Sales")}</span>
                  <span>
                    <span className="puck-site-topbar-status">{textValue(props.topBarStatusLabel, "Online")}</span>
                    <span>{textValue(props.topBarPhone, "+44 1234 916133")}</span>
                  </span>
                </div>
              </div>
            ) : null}
            <header className={getSectionClassName(headerProps, "puck-site-header")} style={getSectionStyle(headerProps)}>
              <Link className="puck-site-brand" href={previewHref("/", props.puck.metadata)}>
                {textValue(props.brandImageUrl) ? (
                  // eslint-disable-next-line @next/next/no-img-element -- Logo URLs are CMS-managed and may be external client assets.
                  <img alt={textValue(props.brandImageAlt, props.brandLabel || "Site logo")} className="puck-site-logo-image" src={textValue(props.brandImageUrl)} />
                ) : (
                  textValue(props.brandLabel, "ANDERSEN EV")
                )}
              </Link>
              <nav aria-label={menu?.title ?? "Site menu"} className="puck-menu puck-menu-horizontal">
                {(menu?.items ?? []).map((item, index) => {
                  const submenuItems = item.children ?? [];

                  return (
                    <div className="puck-menu-item" key={`${item.label}-${index}`}>
                      <a className="puck-menu-trigger" href={previewHref(item.url, props.puck.metadata)}>
                        <span>{item.label}</span>
                        {submenuItems.length ? (
                          <ChevronDown aria-hidden="true" className="puck-menu-chevron" size={13} strokeLinecap="square" strokeLinejoin="miter" strokeWidth={5} />
                        ) : null}
                      </a>
                      {submenuItems.length ? (
                        <div className="puck-menu-dropdown">
                          {submenuItems.map((submenuItem) => (
                            <a href={previewHref(submenuItem.url, props.puck.metadata) || "#"} key={`${submenuItem.label}-${submenuItem.url}`}>
                              {submenuItem.label}
                            </a>
                          ))}
                        </div>
                      ) : null}
                    </div>
                  );
                })}
              </nav>
              <div className="puck-site-actions">
                {props.showSearchIcon ? (
                  <a aria-label="Search" className="puck-site-icon-button" href={previewHref(props.searchUrl, props.puck.metadata)}>
                    <Search aria-hidden="true" size={18} strokeWidth={2} />
                  </a>
                ) : null}
                {props.showUserIcon ? (
                  <a aria-label="Account" className="puck-site-icon-button" href={previewHref(props.userUrl, props.puck.metadata)}>
                    <UserRound aria-hidden="true" size={18} strokeWidth={2} />
                  </a>
                ) : null}
                {props.ctaLabel && props.ctaUrl ? (
                  <a className="puck-header-compare-button" href={previewHref(props.ctaUrl, props.puck.metadata)}>
                    {props.ctaLabel}
                  </a>
                ) : null}
              </div>
            </header>
          </div>
        );
      },
    },
    HeroBlock: {
      defaultProps: {
        ...defaultDesign,
        bodySize: 1.16,
        elementGap: 1.6,
        effect: "glow",
        effectControls: { ...defaultDesign.effectControls, effect: "glow" },
        eyebrow: "Andersen EV",
        headingSize: 5.2,
        heading: "Engineer a more connected operation",
        heroControls: {
          contentMaxWidth: 82,
          contentPaddingX: 5.5,
          cornerRadius: 28,
          imagePosition: "center",
          overlayOpacity: 1,
        },
        imageAlt: "",
        imageUrl: "",
        lede: "Build a clear technical story with reusable visual sections.",
        primaryLabel: "Contact",
        primaryUrl: "/contact",
        secondaryLabel: "View products",
        secondaryUrl: "/products",
        spacingControls: { ...defaultDesign.spacingControls, elementGap: 1.6 },
        typographyControls: { ...defaultDesign.typographyControls, bodySize: 1.16, headingSize: 5.2 },
      },
      fields: {
        eyebrow: { contentEditable: true, label: "Eyebrow", type: "text" },
        heading: { contentEditable: true, label: "Heading", type: "text" },
        lede: { contentEditable: true, label: "Lead text", type: "textarea" },
        heroControls: {
          label: "Hero layout",
          objectFields: {
            contentMaxWidth: { label: "Copy width (rem)", max: 96, min: 20, step: 1, type: "number" },
            contentPaddingX: { label: "Copy side padding (rem)", max: 10, min: 0, step: 0.25, type: "number" },
            cornerRadius: { label: "Corner radius (px)", max: 80, min: 0, step: 1, type: "number" },
            overlayOpacity: { label: "Overlay strength", max: 1, min: 0, step: 0.05, type: "number" },
            imagePosition: { label: "Image position", placeholder: "center, 50% 40%, left center", type: "text" },
          },
          type: "object",
        },
        imageUrl: { label: "Image URL", type: "text" },
        imageAlt: { label: "Image alt", type: "text" },
        primaryLabel: { label: "Primary label", type: "text" },
        primaryUrl: { label: "Primary URL", type: "text" },
        secondaryLabel: { label: "Secondary label", type: "text" },
        secondaryUrl: { label: "Secondary URL", type: "text" },
        ...sharedDesignFields,
      },
      label: "Hero",
      render: (props) => (
        <section className={getSectionClassName(props, "puck-hero")} style={getHeroStyle(props)}>
          <div className="puck-hero-copy">
            {props.eyebrow ? <span className="puck-kicker">{props.eyebrow}</span> : null}
            <h1>{props.heading}</h1>
            {props.lede ? <p>{props.lede}</p> : null}
            <div className="puck-actions">
              <BuilderButton link={{ label: props.primaryLabel, url: props.primaryUrl }} metadata={props.puck.metadata} />
              <BuilderButton link={{ label: props.secondaryLabel, url: props.secondaryUrl }} metadata={props.puck.metadata} secondary />
            </div>
          </div>
          <BuilderMedia alt={props.imageAlt || props.heading} url={props.imageUrl} />
        </section>
      ),
    },
    HelpCentreBlock: {
      defaultProps: {
        ...defaultDesign,
        backgroundColor: "#ffffff",
        colorControls: { ...defaultDesign.colorControls, backgroundColor: "#ffffff", textColor: "#111613" },
        intro: "Troubleshoot common charger, app and connectivity issues. If the helper cannot resolve it safely, it will prepare a support ticket for the team.",
        sectionPaddingBottom: 3,
        sectionPaddingTop: 3,
        sectionWidth: "wide",
        spacingControls: { ...defaultDesign.spacingControls, sectionPaddingBottom: 3, sectionPaddingTop: 3, sectionWidth: "wide" },
        textColor: "#111613",
        title: "Help Centre",
      },
      fields: {
        title: { contentEditable: true, label: "Title", type: "text" },
        intro: { contentEditable: true, label: "Intro", type: "textarea" },
        ...sharedDesignFields,
      },
      label: "Help Centre AI",
      render: (props) => (
        <section className={getSectionClassName(props, "puck-help-centre-section")} style={getSectionStyle(props)}>
          <HelpCentreChat intro={props.intro} title={props.title} />
        </section>
      ),
    },
    HelpCategoryGridBlock: {
      defaultProps: {
        ...defaultDesign,
        backgroundColor: "#ffffff",
        bodySize: 1.05,
        categories: [...defaultHelpCategories],
        colorControls: { ...defaultDesign.colorControls, backgroundColor: "#ffffff", textColor: "#032536", surfaceColor: "#f5f8fa" },
        columns: "2",
        elementBorderRadius: 10,
        elementGap: 1.25,
        elementPadding: 1.85,
        fontFamily: "sans",
        heading: "What can we help with?",
        headingSize: 2.4,
        hoverEffect: "lift",
        intro: "Choose a topic to find setup guides, common fixes and support information.",
        sectionPaddingBottom: 2.5,
        sectionPaddingTop: 1,
        sectionWidth: "wide",
        spacingControls: { ...defaultDesign.spacingControls, elementGap: 1.25, elementPadding: 1.85, sectionPaddingBottom: 2.5, sectionPaddingTop: 1, sectionWidth: "wide" },
        surfaceColor: "#f5f8fa",
        textColor: "#032536",
        typographyControls: { ...defaultDesign.typographyControls, bodySize: 1.05, fontFamily: "sans", headingSize: 2.4 },
      },
      fields: {
        heading: { contentEditable: true, label: "Heading", type: "text" },
        intro: { contentEditable: true, label: "Intro", type: "textarea" },
        columns: { label: "Columns", options: helpCategoryColumnOptions, type: "select" },
        categories: {
          arrayFields: {
            description: { label: "Description", type: "textarea" },
            icon: { label: "Icon", options: helpCategoryIconOptions, type: "select" },
            title: { label: "Title", type: "text" },
            url: { label: "URL", type: "text" },
          },
          defaultItemProps: {
            description: "Short description of this help topic.",
            icon: "support",
            title: "Support topic",
            url: "#",
          },
          getItemSummary: (item) => item.title || "Help topic",
          label: "Bubbles",
          type: "array",
        },
        ...sharedDesignFields,
      },
      label: "Help category bubbles",
      render: (props) => {
        const categories = arrayValue<NonNullable<typeof props.categories>[number]>(props.categories);

        return (
          <section className={getSectionClassName(props, "puck-help-category-section")} style={getSectionStyle(props)}>
            {textValue(props.heading) || textValue(props.intro) ? (
              <div className="puck-help-category-heading">
                {textValue(props.heading) ? <h2>{textValue(props.heading)}</h2> : null}
                {textValue(props.intro) ? <p>{textValue(props.intro)}</p> : null}
              </div>
            ) : null}
            <div className={`puck-help-category-grid puck-help-category-columns-${props.columns ?? "2"}`}>
              {categories.map((category, index) => (
                <a className="puck-help-category-card" href={helpCategoryHref(category, props.puck.metadata)} key={`${textValue(category.title, "topic")}-${index}`}>
                  <span className="puck-help-category-icon">
                    <HelpCategoryIcon icon={category.icon} />
                  </span>
                  <span className="puck-help-category-name">{textValue(category.title, "Support topic")}</span>
                  {textValue(category.description) ? <span className="puck-help-category-description">{textValue(category.description)}</span> : null}
                </a>
              ))}
            </div>
          </section>
        );
      },
    },
    HelpCategoryArticlesBlock: {
      defaultProps: {
        ...defaultDesign,
        backLabel: "Back to Help Centre",
        backgroundColor: "#ffffff",
        bodySize: 1.05,
        colorControls: { ...defaultDesign.colorControls, backgroundColor: "#ffffff", textColor: "#032536", surfaceColor: "#f5f8fa" },
        elementBorderRadius: 28,
        elementGap: 1.25,
        elementPadding: 1.65,
        emptyMessage: "Articles are being prepared for this category.",
        fontFamily: "sans",
        heading: "",
        headingSize: 4.8,
        hoverEffect: "lift",
        intro: "",
        sectionPaddingBottom: 6,
        sectionPaddingTop: 4.5,
        sectionWidth: "wide",
        showBackLink: true,
        spacingControls: { ...defaultDesign.spacingControls, elementGap: 1.25, elementPadding: 1.65, sectionPaddingBottom: 6, sectionPaddingTop: 4.5, sectionWidth: "wide" },
        surfaceColor: "#f5f8fa",
        textColor: "#032536",
        typographyControls: { ...defaultDesign.typographyControls, bodySize: 1.05, fontFamily: "sans", headingSize: 4.8 },
      },
      fields: {
        backLabel: { contentEditable: true, label: "Back link label", type: "text" },
        heading: { contentEditable: true, label: "Heading override", type: "text" },
        intro: { contentEditable: true, label: "Intro override", type: "textarea" },
        emptyMessage: { contentEditable: true, label: "Empty message", type: "textarea" },
        showBackLink: toggleField("Show back link"),
        ...sharedDesignFields,
      },
      label: "Category article cards",
      render: (props) => {
        const metadata = props.puck.metadata as Record<string, unknown>;
        const category = getCurrentHelpCategory(metadata) ?? sampleHelpCategory();
        const articles = getHelpArticles(metadata);
        const cards = articles.length ? articles : sampleHelpArticles();
        const heading = textValue(props.heading) || category.title;
        const intro = textValue(props.intro) || category.description || "";

        return (
          <section className={getSectionClassName(props, "puck-help-category-template")} style={getSectionStyle(props)}>
            {props.showBackLink ? (
              <Link className="help-article-back" href="/help-centre">
                {textValue(props.backLabel, "Back to Help Centre")}
              </Link>
            ) : null}
            <p className="help-article-kicker">Help Centre</p>
            <h1>{heading}</h1>
            {intro ? <p className="help-category-summary">{intro}</p> : null}
            <div className="help-category-article-grid">
              {cards.length ? (
                cards.map((article) => (
                  <Link className="help-category-article-card" href={article.path} key={article.path}>
                    <span className="help-category-article-label">{article.sectionHeading || category.heading || category.title}</span>
                    <strong>{article.title}</strong>
                    {article.summary ? <em>{article.summary}</em> : null}
                    <small>Read article</small>
                  </Link>
                ))
              ) : (
                <p className="help-template-empty">{textValue(props.emptyMessage, "Articles are being prepared for this category.")}</p>
              )}
            </div>
          </section>
        );
      },
    },
    HelpArticleContentBlock: {
      defaultProps: {
        ...defaultDesign,
        backLabel: "Back to category",
        backgroundColor: "#ffffff",
        body: "",
        bodySize: 1.08,
        colorControls: { ...defaultDesign.colorControls, backgroundColor: "#ffffff", textColor: "#032536", surfaceColor: "#ffffff" },
        elementGap: 1,
        emptyMessage: "Article content is being prepared.",
        fontFamily: "sans",
        heading: "",
        headingSize: 4.4,
        sectionPaddingBottom: 6,
        sectionPaddingTop: 4.5,
        sectionWidth: "narrow",
        sourceLabel: "Source reference",
        sourceUrl: "",
        showBody: true,
        showBackLink: true,
        showSourceUrl: true,
        spacingControls: { ...defaultDesign.spacingControls, elementGap: 1, sectionPaddingBottom: 6, sectionPaddingTop: 4.5, sectionWidth: "narrow" },
        summary: "",
        textColor: "#032536",
        typographyControls: { ...defaultDesign.typographyControls, bodySize: 1.08, fontFamily: "sans", headingSize: 4.4 },
      },
      fields: {
        backLabel: { contentEditable: true, label: "Back link label", type: "text" },
        heading: { contentEditable: true, label: "Article title override", type: "text" },
        summary: { contentEditable: true, label: "Summary override", type: "textarea" },
        body: { label: "Article body override", type: "textarea" },
        sourceLabel: { label: "Source link label", type: "text" },
        sourceUrl: { label: "Source URL override", type: "text" },
        emptyMessage: { contentEditable: true, label: "Empty message", type: "textarea" },
        showBody: toggleField("Show article body"),
        showBackLink: toggleField("Show back link"),
        showSourceUrl: toggleField("Show source URL"),
        ...sharedDesignFields,
      },
      label: "Article content",
      render: (props) => {
        const metadata = props.puck.metadata as Record<string, unknown>;
        const category = getCurrentHelpCategory(metadata) ?? sampleHelpCategory();
        const article = getCurrentHelpArticle(metadata) ?? sampleHelpArticles()[0];
        const inlineHeading = inlineEditableValue(props.heading);
        const inlineSummary = inlineEditableValue(props.summary);
        const inlineBody = inlineEditableValue(props.body);
        const heading = textValue(props.heading) || article.title;
        const summary = textValue(props.summary) || article.summary;
        const body = textValue(props.body) || article.body || textValue(props.emptyMessage, "Article content is being prepared.");
        const sourceUrl = textValue(props.sourceUrl) || article.sourceUrl;
        const sourceLabel = textValue(props.sourceLabel, "Source reference");

        return (
          <article className={getSectionClassName(props, "puck-help-article-template")} style={getSectionStyle(props)}>
            {props.showBackLink ? (
              <Link className="help-article-back" href={category.path}>
                {textValue(props.backLabel, `Back to ${category.title}`)}
              </Link>
            ) : null}
            <p className="help-article-kicker">{article.sectionHeading || category.heading || category.title}</p>
            <h1>{inlineHeading ?? heading}</h1>
            {inlineSummary || summary ? <p className="help-article-summary">{inlineSummary ?? summary}</p> : null}
            {props.showBody !== false ? (
              <div className="help-article-body">
                {inlineBody ?? <ArticleBody body={body} />}
              </div>
            ) : null}
            {props.showSourceUrl && sourceUrl ? (
              <a className="help-article-source" href={sourceUrl} rel="noreferrer" target="_blank">
                {sourceLabel}
              </a>
            ) : null}
          </article>
        );
      },
    },
    HelpFaqSectionBlock: {
      defaultProps: {
        ...defaultDesign,
        ...defaultHelpFaqSection,
        backgroundColor: "#ffffff",
        bodySize: 1,
        colorControls: { ...defaultDesign.colorControls, backgroundColor: "#ffffff", textColor: "#032536", surfaceColor: "#f8faf9" },
        elementBorderRadius: 18,
        elementGap: 0.85,
        elementPadding: 1.2,
        fontFamily: "sans",
        headingSize: 2.2,
        hoverEffect: "lift",
        sectionPaddingBottom: 1.75,
        sectionPaddingTop: 1.75,
        sectionWidth: "wide",
        spacingControls: { ...defaultDesign.spacingControls, elementGap: 0.85, elementPadding: 1.2, sectionPaddingBottom: 1.75, sectionPaddingTop: 1.75, sectionWidth: "wide" },
        surfaceColor: "#f8faf9",
        textColor: "#032536",
        typographyControls: { ...defaultDesign.typographyControls, bodySize: 1, fontFamily: "sans", headingSize: 2.2 },
      },
      fields: {
        eyebrow: { contentEditable: true, label: "Eyebrow", type: "text" },
        heading: { contentEditable: true, label: "Heading", type: "text" },
        intro: { contentEditable: true, label: "Intro", type: "textarea" },
        anchor: { label: "Anchor ID", placeholder: "installation", type: "text" },
        icon: { label: "Icon", options: helpCategoryIconOptions, type: "select" },
        articles: {
          arrayFields: {
            title: { label: "Question", type: "text" },
            summary: { label: "Short summary", type: "textarea" },
            body: { label: "Answer", type: "textarea" },
            status: { label: "Status", options: helpArticleStatusOptions, type: "select" },
            sourceUrl: { label: "Source URL", type: "text" },
          },
          defaultItemProps: {
            body: "Add the answer here.",
            sourceUrl: "",
            status: "draft",
            summary: "",
            title: "New help article",
          },
          getItemSummary: (item) => item.title || "Help article",
          label: "Articles",
          type: "array",
        },
        ...sharedDesignFields,
      },
      label: "Help article list",
      render: (props) => {
        if (shouldHideHelpArticleSections(props.puck.metadata)) {
          return <></>;
        }

        const articles = arrayValue<NonNullable<typeof props.articles>[number]>(props.articles);
        const sectionId = getAnchorId(props.anchor);

        return (
          <section className={getSectionClassName(props, "puck-help-faq-section")} id={sectionId} style={getSectionStyle(props)}>
            <div className="puck-help-faq-header">
              <span className="puck-help-faq-icon">
                <HelpCategoryIcon icon={props.icon} />
              </span>
              <div>
                {textValue(props.eyebrow) ? <span className="puck-help-faq-eyebrow">{textValue(props.eyebrow)}</span> : null}
                <h2>{textValue(props.heading, "Help articles")}</h2>
                {textValue(props.intro) ? <p>{textValue(props.intro)}</p> : null}
              </div>
            </div>
            <div className="puck-help-faq-list">
              {articles.map((article, index) => {
                const href = previewHref(getHelpArticlePath(sectionId, article.title), props.puck.metadata) || "#";

                return (
                  <a className="puck-help-article-card" href={href} key={`${textValue(article.title, "article")}-${index}`}>
                    <span>
                      <strong>{textValue(article.title, "Help article")}</strong>
                      {textValue(article.summary) ? <em>{textValue(article.summary)}</em> : null}
                    </span>
                    <small>Read article</small>
                  </a>
                );
              })}
            </div>
          </section>
        );
      },
    },
    ImageTextBlock: {
      defaultProps: {
        ...defaultDesign,
        body: "Pair a short piece of content with an image or technical visual.",
        heading: "Image and text",
        imageAlt: "",
        imageSide: "right",
        imageUrl: "",
        linkLabel: "",
        linkUrl: "",
      },
      fields: {
        heading: { contentEditable: true, label: "Heading", type: "text" },
        body: { contentEditable: true, label: "Body", type: "textarea" },
        imageUrl: { label: "Image URL", type: "text" },
        imageAlt: { label: "Image alt", type: "text" },
        imageSide: {
          label: "Image side",
          options: [
            { label: "Left", value: "left" },
            { label: "Right", value: "right" },
          ],
          type: "select",
        },
        linkLabel: { label: "Link label", type: "text" },
        linkUrl: { label: "Link URL", type: "text" },
        ...sharedDesignFields,
      },
      label: "Image text",
      render: (props) => (
        <section className={getSectionClassName(props)} style={getSectionStyle(props)}>
          <div className={`puck-split ${props.imageSide === "left" ? "image-left" : ""}`}>
            <BuilderMedia alt={props.imageAlt || props.heading} url={props.imageUrl} />
            <div>
              <h2>{props.heading}</h2>
              {props.body ? <p>{props.body}</p> : null}
              <BuilderButton link={{ label: props.linkLabel, url: props.linkUrl }} metadata={props.puck.metadata} secondary />
            </div>
          </div>
        </section>
      ),
    },
    MenuBlock: {
      defaultProps: {
        ...defaultDesign,
        heading: "Menu",
        menuHandle: "primary",
        orientation: "horizontal",
        showHeading: false,
      },
      fields: {
        heading: { contentEditable: true, label: "Heading", type: "text" },
        menuHandle: { label: "Menu", options: [{ label: "Primary navigation", value: "primary" }], type: "select" },
        orientation: { label: "Orientation", options: menuOrientationOptions, type: "select" },
        showHeading: toggleField("Show heading"),
        ...sharedDesignFields,
      },
      label: "Menu",
      resolveFields: (_data, params) => ({
        ...params.fields,
        menuHandle: {
          label: "Menu",
          options: getMenuOptions(params.metadata),
          type: "select",
        },
      }),
      render: (props) => {
        const menu = getMenu(props.puck.metadata, props.menuHandle);
        const items = menu?.items ?? [];

        return (
          <section className={getSectionClassName(props, "puck-menu-section")} style={getSectionStyle(props)}>
            {props.showHeading ? (
              <div className="puck-section-heading">
                <h2>{textValue(props.heading, menu?.title ?? "Menu")}</h2>
              </div>
            ) : null}
            <nav aria-label={menu?.title ?? "Menu"} className={`puck-menu puck-menu-${props.orientation ?? "horizontal"}`}>
              {items.map((item, index) => (
                <a href={previewHref(item.url, props.puck.metadata)} key={`${item.label}-${index}`}>
                  {item.label}
                </a>
              ))}
            </nav>
          </section>
        );
      },
    },
    ProductGridBlock: {
      defaultProps: {
        ...defaultDesign,
        columns: "3",
        heading: "Featured products",
        intro: "Showcase selected charger models or support resources.",
        mode: "featured",
      },
      fields: {
        heading: { contentEditable: true, label: "Heading", type: "text" },
        intro: { contentEditable: true, label: "Intro", type: "textarea" },
        mode: {
          label: "Mode",
          options: [
            { label: "Featured products", value: "featured" },
            { label: "Manual selection", value: "manual" },
          ],
          type: "select",
        },
        columns: { label: "Columns", options: columnOptions, type: "select" },
        ...sharedDesignFields,
      },
      label: "Product grid",
      render: (props) => {
        const products = getFeaturedProducts(props.puck.metadata);
        const cards = products.length
          ? products
          : [
              {
                family: "Product",
                name: "Featured product",
                slug: "products",
                summary: "Set products as featured in Payload to populate this grid.",
              },
            ];

        return (
          <section className={getSectionClassName(props)} style={getSectionStyle(props)}>
            <div className="puck-section-heading">
              <h2>{props.heading}</h2>
              {props.intro ? <p>{props.intro}</p> : null}
            </div>
            <div className={`puck-card-grid puck-columns-${props.columns ?? "3"}`}>
              {cards.map((product) => (
                <a className="puck-card" href={previewHref(`/products/${product.slug}`, props.puck.metadata)} key={product.slug}>
                  <span className="puck-kicker">{product.family || "Product"}</span>
                  <h3>{product.name}</h3>
                  {product.summary ? <p>{product.summary}</p> : null}
                </a>
              ))}
            </div>
          </section>
        );
      },
    },
    SectionBlock: {
      defaultProps: {
        ...defaultDesign,
        backgroundColor: "rgba(23, 32, 51, 0.78)",
        body: "Use this section to introduce a service, product family, process step or key message.",
        borderControls: {
          ...defaultDesign.borderControls,
          sectionBorderColor: "rgba(139, 211, 255, 0.18)",
          sectionBorderRadius: 8,
          sectionBorderStyle: "solid",
          sectionBorderWidth: 1,
        },
        colorControls: { ...defaultDesign.colorControls, backgroundColor: "rgba(23, 32, 51, 0.78)" },
        eyebrow: "New section",
        fullWidth: false,
        heading: "Build a new section",
        primaryLabel: "Primary action",
        primaryUrl: "/contact",
        secondaryLabel: "",
        secondaryUrl: "",
        sectionBorderColor: "rgba(139, 211, 255, 0.18)",
        sectionBorderRadius: 8,
        sectionBorderStyle: "solid",
        sectionBorderWidth: 1,
        variant: "panel",
      },
      fields: {
        eyebrow: { contentEditable: true, label: "Eyebrow", type: "text" },
        heading: { contentEditable: true, label: "Heading", type: "text" },
        body: { contentEditable: true, label: "Leading text", type: "textarea" },
        primaryLabel: { label: "Primary button label", type: "text" },
        primaryUrl: { label: "Primary button URL", type: "text" },
        secondaryLabel: { label: "Secondary button label", type: "text" },
        secondaryUrl: { label: "Secondary button URL", type: "text" },
        fullWidth: toggleField("Full width section"),
        variant: {
          label: "Section style",
          options: [
            { label: "Plain", value: "plain" },
            { label: "Panel", value: "panel" },
            { label: "Band", value: "band" },
          ],
          type: "select",
        },
        ...sharedDesignFields,
      },
      label: "Section",
      render: (props) => {
        const sectionProps = withFullWidth(props);

        return (
          <section className={getSectionClassName(sectionProps, `puck-builder-section puck-builder-section-${props.variant ?? "panel"}`)} style={getSectionStyle(sectionProps)}>
            {textValue(props.eyebrow) ? <span className="puck-kicker">{textValue(props.eyebrow)}</span> : null}
            <h2>{textValue(props.heading, "Build a new section")}</h2>
            {textValue(props.body) ? <p>{textValue(props.body)}</p> : null}
            <div className="puck-actions">
              <BuilderButton link={{ label: props.primaryLabel, url: props.primaryUrl }} metadata={props.puck.metadata} />
              <BuilderButton link={{ label: props.secondaryLabel, url: props.secondaryUrl }} metadata={props.puck.metadata} secondary />
            </div>
          </section>
        );
      },
    },
    RichTextBlock: {
      defaultProps: {
        ...defaultDesign,
        body: "Add body copy here. Keep sections focused and easy to scan.",
        bodySize: 1.08,
        sectionWidth: "narrow",
        spacingControls: { ...defaultDesign.spacingControls, sectionWidth: "narrow" },
        typographyControls: { ...defaultDesign.typographyControls, bodySize: 1.08 },
      },
      fields: {
        body: { contentEditable: true, label: "Body", type: "textarea" },
        ...sharedDesignFields,
      },
      label: "Rich text",
      render: (props) => {
        const inlineBody = inlineEditableValue(props.body);
        const body = textValue(props.body, "Add body copy here.");

        return (
          <section className={getSectionClassName(props, "puck-rich-section")} style={getSectionStyle(props)}>
            <div className="puck-rich-text">
              {inlineBody ??
                body.split("\n").map((paragraph, index) => (
                  <p key={`${paragraph}-${index}`}>{paragraph}</p>
                ))}
            </div>
          </section>
        );
      },
    },
    SpecTableBlock: {
      defaultProps: {
        ...defaultDesign,
        heading: "Specifications",
        rows: [
          {
            label: "Protocol",
            value: "CAN / Ethernet",
          },
        ],
      },
      fields: {
        heading: { contentEditable: true, label: "Heading", type: "text" },
        rows: {
          arrayFields: {
            label: { label: "Label", type: "text" },
            value: { label: "Value", type: "text" },
          },
          defaultItemProps: {
            label: "Specification",
            value: "Value",
          },
          getItemSummary: (item) => item.label || "Row",
          label: "Rows",
          type: "array",
        },
        ...sharedDesignFields,
      },
      label: "Spec table",
      render: (props) => {
        const rows = arrayValue<NonNullable<typeof props.rows>[number]>(props.rows);

        return (
          <section className={getSectionClassName(props)} style={getSectionStyle(props)}>
            <div className="puck-section-heading">
              <h2>{textValue(props.heading, "Specifications")}</h2>
            </div>
            <dl className="puck-spec-table">
              {rows.map((row, index) => (
                <div key={`${textValue(row.label, "row")}-${index}`}>
                  <dt>{textValue(row.label, "Label")}</dt>
                  <dd>{textValue(row.value, "Value")}</dd>
                </div>
              ))}
            </dl>
          </section>
        );
      },
    },
  },
  root: {
    defaultProps: {
      accentColor: "#8bd3ff",
      backgroundColor: "#020617",
      fontFamily: "display",
      pagePaddingBottom: 0,
      pagePaddingTop: 0,
      pageTitle: "Andersen EV Help Centre page",
      sectionSpacing: "normal",
      surfaceColor: "23, 32, 51",
      surfaceOpacity: 0.78,
      textColor: "#f1f5f9",
      themePreset: "platformDark",
    },
    fields: {
      pageTitle: { contentEditable: true, label: "Page title", type: "text" },
      themePreset: {
        label: "Theme",
        options: [
          { label: "Platform dark", value: "platformDark" },
          { label: "Andersen EV", value: "andersenEV" },
          { label: "Precision light", value: "precisionLight" },
          { label: "Signal contrast", value: "signalContrast" },
        ],
        type: "select",
      },
      fontFamily: { label: "Base font", options: fontOptions, type: "select" },
      backgroundColor: { label: "Page background", type: "text" },
      textColor: { label: "Text colour", type: "text" },
      accentColor: { label: "Accent colour", type: "text" },
      pagePaddingTop: { label: "Page top padding (rem)", max: 10, min: 0, step: 0.25, type: "number" },
      pagePaddingBottom: { label: "Page bottom padding (rem)", max: 10, min: 0, step: 0.25, type: "number" },
      surfaceColor: {
        label: "Surface RGB",
        placeholder: "23, 32, 51",
        type: "text",
      },
      surfaceOpacity: {
        label: "Surface opacity",
        max: 1,
        min: 0.2,
        step: 0.05,
        type: "number",
      },
      sectionSpacing: {
        label: "Section spacing",
        options: [
          { label: "Compact", value: "compact" },
          { label: "Normal", value: "normal" },
          { label: "Spacious", value: "spacious" },
        ],
        type: "select",
      },
    },
    render: Root,
  },
};
