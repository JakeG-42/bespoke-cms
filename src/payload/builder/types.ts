import type { Config, Data } from "@puckeditor/core";

export type BuilderSectionEffect = "borderPulse" | "glow" | "lift" | "none";
export type BuilderBorderStyle = "dashed" | "none" | "solid";
export type BuilderFontWeight = "bold" | "heavy" | "medium" | "regular";
export type BuilderHoverEffect = "border" | "brighten" | "glow" | "lift" | "none" | "scale";
export type BuilderHoverScaleMode = "enlarge" | "shrink";
export type BuilderScrollAnimation = "fadeUp" | "none" | "scaleIn" | "slideLeft";
export type BuilderSectionShadow = "none" | "soft" | "strong";
export type BuilderSectionWidth = "default" | "full" | "narrow" | "wide";
export type BuilderTextAlign = "center" | "left";
export type BuilderHelpIcon = "howTo" | "installation" | "installers" | "product" | "setup" | "support" | "troubleshooting";
export type BuilderHelpArticleStatus = "draft" | "needsConfirmation" | "ready";

export type BuilderColorControls = {
  accentColor?: string;
  backgroundColor?: string;
  surfaceColor?: string;
  textColor?: string;
};

export type BuilderTypographyControls = {
  bodySize?: number;
  eyebrowSize?: number;
  fontFamily?: "code" | "display" | "sans";
  fontWeight?: BuilderFontWeight;
  headingSize?: number;
  lineHeight?: number;
  subheadingSize?: number;
  textAlign?: BuilderTextAlign;
};

export type BuilderSpacingControls = {
  elementGap?: number;
  elementPadding?: number;
  sectionPaddingBottom?: number;
  sectionPaddingTop?: number;
  sectionPaddingX?: number;
  sectionWidth?: BuilderSectionWidth;
};

export type BuilderBorderControls = {
  elementBorderColor?: string;
  elementBorderRadius?: number;
  elementBorderStyle?: BuilderBorderStyle;
  elementBorderWidth?: number;
  sectionBorderColor?: string;
  sectionBorderRadius?: number;
  sectionBorderStyle?: BuilderBorderStyle;
  sectionBorderWidth?: number;
};

export type BuilderEffectControls = {
  effect?: BuilderSectionEffect;
  opacity?: number;
  scrollAnimation?: BuilderScrollAnimation;
  sectionShadow?: BuilderSectionShadow;
};

export type BuilderHoverControls = {
  hoverBackgroundColor?: string;
  hoverBorderColor?: string;
  hoverEffect?: BuilderHoverEffect;
  hoverScaleAmount?: number;
  hoverScaleMode?: BuilderHoverScaleMode;
  hoverTextColor?: string;
};

export type BuilderAdvancedStyle = {
  accentColor?: string;
  backgroundColor?: string;
  bodySize?: number;
  borderControls?: BuilderBorderControls;
  colorControls?: BuilderColorControls;
  elementBorderColor?: string;
  elementBorderRadius?: number;
  elementBorderStyle?: BuilderBorderStyle;
  elementBorderWidth?: number;
  elementGap?: number;
  elementPadding?: number;
  effect?: BuilderSectionEffect;
  effectControls?: BuilderEffectControls;
  eyebrowSize?: number;
  fontFamily?: "code" | "display" | "sans";
  fontWeight?: BuilderFontWeight;
  headingSize?: number;
  hoverBackgroundColor?: string;
  hoverBorderColor?: string;
  hoverControls?: BuilderHoverControls;
  hoverEffect?: BuilderHoverEffect;
  hoverScaleAmount?: number;
  hoverScaleMode?: BuilderHoverScaleMode;
  hoverTextColor?: string;
  lineHeight?: number;
  opacity?: number;
  scrollAnimation?: BuilderScrollAnimation;
  sectionBorderColor?: string;
  sectionBorderRadius?: number;
  sectionBorderStyle?: BuilderBorderStyle;
  sectionBorderWidth?: number;
  sectionPaddingBottom?: number;
  sectionPaddingTop?: number;
  sectionPaddingX?: number;
  sectionShadow?: BuilderSectionShadow;
  sectionWidth?: BuilderSectionWidth;
  spacingControls?: BuilderSpacingControls;
  subheadingSize?: number;
  surfaceColor?: string;
  textAlign?: BuilderTextAlign;
  textColor?: string;
  typographyControls?: BuilderTypographyControls;
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

export type BuilderHelpCategory = {
  description?: string;
  heading?: string;
  id?: number | string;
  icon?: BuilderHelpIcon | string;
  path: string;
  slug: string;
  title: string;
};

export type BuilderHelpArticle = {
  body: string;
  builderData?: BuilderData | null;
  categorySlug: string;
  path: string;
  reviewStatus?: string;
  sectionAnchor?: string;
  sectionHeading?: string;
  slug: string;
  sourceUrl?: string;
  summary?: string;
  title: string;
};

export type BuilderMenuItem = {
  children?: BuilderMenuItem[];
  label: string;
  url: string;
};

export type BuilderMenu = {
  handle: string;
  items: BuilderMenuItem[];
  title: string;
};

export type BuilderRootProps = {
  accentColor?: string;
  backgroundColor?: string;
  fontFamily?: "code" | "display" | "sans";
  pagePaddingBottom?: number;
  pagePaddingTop?: number;
  pageTitle?: string;
  sectionSpacing?: "compact" | "normal" | "spacious";
  surfaceColor?: string;
  surfaceOpacity?: number;
  themeHandle?: string;
  themeId?: string;
  themeName?: string;
  textColor?: string;
  themePreset?: "andersenEV" | "platformDark" | "precisionLight" | "signalContrast";
};

export type BuilderTheme = {
  description?: string;
  handle: string;
  id: string;
  isDefault?: boolean;
  name: string;
  rootProps: Partial<BuilderRootProps>;
};

export type BuilderPageTemplate = {
  builderData: BuilderData | null;
  description?: string;
  handle: string;
  id: string;
  name: string;
  themeId?: string;
};

export type BuilderThemeSettings = {
  templateId?: string;
  themeId?: string;
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
    heroControls?: {
      contentMaxWidth?: number;
      contentPaddingX?: number;
      cornerRadius?: number;
      imagePosition?: string;
      overlayOpacity?: number;
    };
    imageAlt?: string;
    imageUrl?: string;
    lede?: string;
    primaryLabel?: string;
    primaryUrl?: string;
    secondaryLabel?: string;
    secondaryUrl?: string;
  };
  HelpCentreBlock: BuilderAdvancedStyle & {
    intro?: string;
    title?: string;
  };
  HelpArticleContentBlock: BuilderAdvancedStyle & {
    backLabel?: string;
    body?: string;
    emptyMessage?: string;
    heading?: string;
    sourceLabel?: string;
    sourceUrl?: string;
    showBody?: boolean;
    showBackLink?: boolean;
    showSourceUrl?: boolean;
    summary?: string;
  };
  HelpOtherCategoriesBlock: BuilderAdvancedStyle & {
    columns?: "2" | "3";
    emptyMessage?: string;
    heading?: string;
    intro?: string;
    showCurrentCategory?: boolean;
  };
  HelpRelatedArticlesBlock: BuilderAdvancedStyle & {
    emptyMessage?: string;
    heading?: string;
    intro?: string;
    limit?: number;
    showCategoryLabel?: boolean;
  };
  HelpCategoryArticlesBlock: BuilderAdvancedStyle & {
    backLabel?: string;
    emptyMessage?: string;
    heading?: string;
    intro?: string;
    showBackLink?: boolean;
  };
  HelpCategoryGridBlock: BuilderAdvancedStyle & {
    categories?: {
      description?: string;
      icon?: BuilderHelpIcon;
      title: string;
      url?: string;
    }[];
    columns?: "2" | "3";
    heading?: string;
    intro?: string;
  };
  HelpFaqSectionBlock: BuilderAdvancedStyle & {
    anchor?: string;
    articles?: {
      body?: string;
      sourceUrl?: string;
      status?: BuilderHelpArticleStatus;
      summary?: string;
      title: string;
    }[];
    eyebrow?: string;
    heading: string;
    icon?: BuilderHelpIcon;
    intro?: string;
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
  MenuBlock: BuilderAdvancedStyle & {
    heading?: string;
    menuHandle?: string;
    orientation?: "horizontal" | "vertical";
    showHeading?: boolean;
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
  SectionBlock: BuilderAdvancedStyle & {
    body?: string;
    eyebrow?: string;
    fullWidth?: boolean;
    heading: string;
    primaryLabel?: string;
    primaryUrl?: string;
    secondaryLabel?: string;
    secondaryUrl?: string;
    variant?: "band" | "panel" | "plain";
  };
  SiteHeaderBlock: BuilderAdvancedStyle & {
    brandImageAlt?: string;
    brandImageUrl?: string;
    brandLabel?: string;
    ctaLabel?: string;
    ctaUrl?: string;
    fullWidth?: boolean;
    menuHandle?: string;
    searchUrl?: string;
    showSearchIcon?: boolean;
    showUserIcon?: boolean;
    sticky?: boolean;
    showTopBar?: boolean;
    topBarCountryLabel?: string;
    topBarFlag?: string;
    topBarPhone?: string;
    topBarSalesLabel?: string;
    topBarStatusLabel?: string;
    userUrl?: string;
  };
  SpecTableBlock: BuilderAdvancedStyle & {
    heading: string;
    rows?: {
      label: string;
      value: string;
    }[];
  };
};

export type BuilderCategoryName = "commerce" | "content" | "media" | "navigation" | "structure" | "support";
export type BuilderConfig = Config<BuilderComponents, BuilderRootProps, BuilderCategoryName>;
export type BuilderData = Data<BuilderComponents, BuilderRootProps>;
