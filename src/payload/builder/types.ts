import type { Config, Data } from "@puckeditor/core";

export type BuilderSectionEffect = "borderPulse" | "glow" | "lift" | "none";
export type BuilderScrollAnimation = "fadeUp" | "none" | "scaleIn" | "slideLeft";
export type BuilderTextAlign = "center" | "left";

export type BuilderAdvancedStyle = {
  accentColor?: string;
  backgroundColor?: string;
  effect?: BuilderSectionEffect;
  fontFamily?: "code" | "display" | "sans";
  opacity?: number;
  scrollAnimation?: BuilderScrollAnimation;
  textAlign?: BuilderTextAlign;
  textColor?: string;
};

export type BuilderLink = {
  label?: string;
  url?: string;
};

export type BuilderProduct = {
  family?: string;
  name: string;
  slug: string;
  summary?: string;
};

export type BuilderRootProps = {
  accentColor?: string;
  backgroundColor?: string;
  fontFamily?: "code" | "display" | "sans";
  pageTitle?: string;
  sectionSpacing?: "compact" | "normal" | "spacious";
  surfaceColor?: string;
  surfaceOpacity?: number;
  textColor?: string;
  themePreset?: "eltronicDark" | "precisionLight" | "signalContrast";
};

export type BuilderComponents = {
  CallToActionBlock: BuilderAdvancedStyle & {
    body?: string;
    eyebrow?: string;
    heading: string;
    primaryLabel?: string;
    primaryUrl?: string;
    secondaryLabel?: string;
    secondaryUrl?: string;
    variant?: "band" | "card" | "fullBleed";
  };
  CardGridBlock: BuilderAdvancedStyle & {
    cards?: {
      body?: string;
      title: string;
      url?: string;
    }[];
    columns?: "2" | "3" | "4";
    heading: string;
    intro?: string;
  };
  DownloadsBlock: BuilderAdvancedStyle & {
    documents?: {
      description?: string;
      title: string;
      url?: string;
    }[];
    heading: string;
  };
  GalleryBlock: BuilderAdvancedStyle & {
    heading?: string;
    images?: {
      alt?: string;
      url: string;
    }[];
  };
  HeroBlock: BuilderAdvancedStyle & {
    eyebrow?: string;
    heading: string;
    imageAlt?: string;
    imageUrl?: string;
    lede?: string;
    primaryLabel?: string;
    primaryUrl?: string;
    secondaryLabel?: string;
    secondaryUrl?: string;
  };
  ImageTextBlock: BuilderAdvancedStyle & {
    body?: string;
    heading: string;
    imageAlt?: string;
    imageSide?: "left" | "right";
    imageUrl?: string;
    linkLabel?: string;
    linkUrl?: string;
  };
  ProductGridBlock: BuilderAdvancedStyle & {
    columns?: "2" | "3" | "4";
    heading: string;
    intro?: string;
    mode?: "featured" | "manual";
  };
  RichTextBlock: BuilderAdvancedStyle & {
    body: string;
  };
  SpecTableBlock: BuilderAdvancedStyle & {
    heading: string;
    rows?: {
      label: string;
      value: string;
    }[];
  };
};

export type BuilderCategoryName = "commerce" | "content" | "media" | "structure";
export type BuilderConfig = Config<BuilderComponents, BuilderRootProps, BuilderCategoryName>;
export type BuilderData = Data<BuilderComponents, BuilderRootProps>;
