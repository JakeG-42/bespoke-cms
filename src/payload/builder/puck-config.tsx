import type { CSSProperties, ReactNode } from "react";

import type {
  BuilderAdvancedStyle,
  BuilderConfig,
  BuilderHoverEffect,
  BuilderProduct,
  BuilderSectionShadow,
  BuilderRootProps,
  BuilderSectionEffect,
  BuilderSectionWidth,
} from "./types";

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

const sharedDesignFields = {
  accentColor: {
    label: "Colour: accent",
    placeholder: "#8bd3ff",
    type: "text",
  },
  backgroundColor: {
    label: "Colour: section background",
    placeholder: "rgba(23, 32, 51, 0.78)",
    type: "text",
  },
  surfaceColor: {
    label: "Colour: cards/media surface",
    placeholder: "rgba(23, 32, 51, 0.78)",
    type: "text",
  },
  textColor: {
    label: "Colour: text",
    placeholder: "#f1f5f9",
    type: "text",
  },
  fontFamily: {
    label: "Type: font",
    options: fontOptions,
    type: "select",
  },
  fontWeight: {
    label: "Type: heading weight",
    options: fontWeightOptions,
    type: "select",
  },
  headingSize: {
    label: "Type: heading size (rem)",
    max: 7,
    min: 0.8,
    step: 0.1,
    type: "number",
  },
  subheadingSize: {
    label: "Type: subheading size (rem)",
    max: 3,
    min: 0.7,
    step: 0.05,
    type: "number",
  },
  bodySize: {
    label: "Type: body size (rem)",
    max: 2,
    min: 0.65,
    step: 0.05,
    type: "number",
  },
  eyebrowSize: {
    label: "Type: eyebrow size (rem)",
    max: 1.6,
    min: 0.55,
    step: 0.05,
    type: "number",
  },
  lineHeight: {
    label: "Type: line height",
    max: 2.2,
    min: 0.9,
    step: 0.05,
    type: "number",
  },
  textAlign: {
    label: "Type: text alignment",
    options: alignmentOptions,
    type: "select",
  },
  sectionWidth: {
    label: "Layout: section width",
    options: widthOptions,
    type: "select",
  },
  sectionPaddingTop: {
    label: "Layout: padding top (rem)",
    max: 10,
    min: 0,
    step: 0.25,
    type: "number",
  },
  sectionPaddingBottom: {
    label: "Layout: padding bottom (rem)",
    max: 10,
    min: 0,
    step: 0.25,
    type: "number",
  },
  sectionPaddingX: {
    label: "Layout: padding sides (rem)",
    max: 8,
    min: 0,
    step: 0.25,
    type: "number",
  },
  elementPadding: {
    label: "Layout: card/CTA padding (rem)",
    max: 5,
    min: 0,
    step: 0.1,
    type: "number",
  },
  elementGap: {
    label: "Layout: gap (rem)",
    max: 5,
    min: 0,
    step: 0.1,
    type: "number",
  },
  sectionBorderStyle: {
    label: "Section border: style",
    options: borderStyleOptions,
    type: "select",
  },
  sectionBorderWidth: {
    label: "Section border: width (px)",
    max: 12,
    min: 0,
    step: 1,
    type: "number",
  },
  sectionBorderRadius: {
    label: "Section border: radius (px)",
    max: 80,
    min: 0,
    step: 1,
    type: "number",
  },
  sectionBorderColor: {
    label: "Section border: colour",
    placeholder: "rgba(139, 211, 255, 0.24)",
    type: "text",
  },
  elementBorderStyle: {
    label: "Element border: style",
    options: borderStyleOptions,
    type: "select",
  },
  elementBorderWidth: {
    label: "Element border: width (px)",
    max: 12,
    min: 0,
    step: 1,
    type: "number",
  },
  elementBorderRadius: {
    label: "Element border: radius (px)",
    max: 80,
    min: 0,
    step: 1,
    type: "number",
  },
  elementBorderColor: {
    label: "Element border: colour",
    placeholder: "rgba(139, 211, 255, 0.24)",
    type: "text",
  },
  effect: {
    label: "Effect: section",
    options: effectOptions,
    type: "select",
  },
  sectionShadow: {
    label: "Effect: shadow",
    options: shadowOptions,
    type: "select",
  },
  opacity: {
    label: "Effect: opacity",
    max: 1,
    min: 0.2,
    step: 0.05,
    type: "number",
  },
  scrollAnimation: {
    label: "Effect: on scroll",
    options: scrollOptions,
    type: "select",
  },
  hoverEffect: {
    label: "On hover: effect",
    options: hoverOptions,
    type: "select",
  },
  hoverBackgroundColor: {
    label: "On hover: background",
    placeholder: "rgba(139, 211, 255, 0.12)",
    type: "text",
  },
  hoverTextColor: {
    label: "On hover: text",
    placeholder: "#ffffff",
    type: "text",
  },
  hoverBorderColor: {
    label: "On hover: border",
    placeholder: "#8bd3ff",
    type: "text",
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
  return {
    "--builder-accent": style.accentColor || "var(--primary)",
    "--builder-body-size": cssRem(style.bodySize),
    "--builder-element-border-color": style.elementBorderColor || "color-mix(in srgb, var(--builder-accent) 18%, transparent)",
    "--builder-element-border-radius": cssPx(style.elementBorderRadius),
    "--builder-element-border-style": style.elementBorderStyle ?? "solid",
    "--builder-element-border-width": cssPx(style.elementBorderWidth),
    "--builder-element-gap": cssRem(style.elementGap),
    "--builder-element-padding": cssRem(style.elementPadding),
    "--builder-eyebrow-size": cssRem(style.eyebrowSize),
    "--builder-font-weight": style.fontWeight ? fontWeightMap[style.fontWeight] : undefined,
    "--builder-heading-size": cssRem(style.headingSize),
    "--builder-hover-bg": style.hoverBackgroundColor || "color-mix(in srgb, var(--builder-accent) 14%, var(--builder-section-bg))",
    "--builder-hover-border": style.hoverBorderColor || "color-mix(in srgb, var(--builder-accent) 64%, transparent)",
    "--builder-hover-text": style.hoverTextColor || "var(--builder-section-text)",
    "--builder-line-height": cssNumber(style.lineHeight),
    "--builder-section-border-color": style.sectionBorderColor || "color-mix(in srgb, var(--builder-accent) 24%, transparent)",
    "--builder-section-border-radius": cssPx(style.sectionBorderRadius),
    "--builder-section-border-style": style.sectionBorderStyle ?? "none",
    "--builder-section-border-width": cssPx(style.sectionBorderWidth),
    "--builder-section-bg": style.backgroundColor || "transparent",
    "--builder-section-padding-bottom": cssRem(style.sectionPaddingBottom),
    "--builder-section-padding-top": cssRem(style.sectionPaddingTop),
    "--builder-section-padding-x": cssRem(style.sectionPaddingX),
    "--builder-section-text": style.textColor || "var(--text-primary)",
    "--builder-section-width": sectionWidthMap[style.sectionWidth ?? "default"],
    "--builder-subheading-size": cssRem(style.subheadingSize),
    "--builder-surface-fill": style.surfaceColor || "rgba(var(--builder-surface), var(--builder-surface-opacity))",
    opacity: style.opacity ?? 1,
  } as CSSProperties;
}

function getSectionClassName(style: BuilderAdvancedStyle = {}, className = "") {
  const effect: BuilderSectionEffect = style.effect ?? "none";
  const hoverEffect: BuilderHoverEffect = style.hoverEffect ?? "none";
  const sectionShadow: BuilderSectionShadow = style.sectionShadow ?? "none";
  const sectionWidth: BuilderSectionWidth = style.sectionWidth ?? "default";

  return [
    "puck-section",
    `puck-align-${style.textAlign ?? "left"}`,
    `puck-font-${style.fontFamily ?? "display"}`,
    `puck-effect-${effect}`,
    `puck-hover-${hoverEffect}`,
    `puck-scroll-${style.scrollAnimation ?? "none"}`,
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

function arrayValue<T>(value: T[] | unknown): T[] {
  return Array.isArray(value) ? value : [];
}

function BuilderButton({ link, secondary = false }: { link: { label?: string; url?: string }; secondary?: boolean }) {
  if (!link.label || !link.url) {
    return null;
  }

  return (
    <a className={`puck-button ${secondary ? "secondary" : ""}`} href={link.url}>
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

function Root({ children, ...props }: BuilderRootProps & { children: ReactNode }) {
  return (
    <main
      className={`puck-eltronic-page puck-theme-${props.themePreset ?? "eltronicDark"} puck-density-${
        props.sectionSpacing ?? "normal"
      } puck-font-${props.fontFamily ?? "display"}`}
      style={
        {
          "--builder-accent": props.accentColor || "#8bd3ff",
          "--builder-bg": props.backgroundColor || "#020617",
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
      components: ["RichTextBlock", "ImageTextBlock", "CardGridBlock", "SpecTableBlock", "CallToActionBlock"],
      defaultExpanded: true,
      title: "Content",
    },
    media: {
      components: ["GalleryBlock", "DownloadsBlock"],
      title: "Media",
    },
    structure: {
      components: ["HeroBlock"],
      defaultExpanded: true,
      title: "Structure",
    },
  },
  components: {
    CallToActionBlock: {
      defaultProps: {
        ...defaultDesign,
        accentColor: "#fbbf24",
        body: "Add a clear next step for visitors.",
        effect: "glow",
        elementPadding: 2.6,
        eyebrow: "Ready",
        heading: "Start the conversation",
        primaryLabel: "Contact Eltronic",
        primaryUrl: "/contact",
        secondaryLabel: "",
        secondaryUrl: "",
        textAlign: "center",
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
            <BuilderButton link={{ label: props.primaryLabel, url: props.primaryUrl }} />
            <BuilderButton link={{ label: props.secondaryLabel, url: props.secondaryUrl }} secondary />
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
                  {textValue(card.url) ? <a href={textValue(card.url)}>View</a> : null}
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
                <a className="puck-card" href={textValue(document.url, "#") || "#"} key={`${textValue(document.title, "document")}-${index}`}>
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
    HeroBlock: {
      defaultProps: {
        ...defaultDesign,
        bodySize: 1.16,
        elementGap: 1.6,
        effect: "glow",
        eyebrow: "Eltronic",
        headingSize: 5.2,
        heading: "Engineer a more connected operation",
        imageAlt: "",
        imageUrl: "",
        lede: "Build a clear technical story with reusable visual sections.",
        primaryLabel: "Contact",
        primaryUrl: "/contact",
        secondaryLabel: "View products",
        secondaryUrl: "/products",
      },
      fields: {
        eyebrow: { contentEditable: true, label: "Eyebrow", type: "text" },
        heading: { contentEditable: true, label: "Heading", type: "text" },
        lede: { contentEditable: true, label: "Lead text", type: "textarea" },
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
        <section className={getSectionClassName(props, "puck-hero")} style={getSectionStyle(props)}>
          <div className="puck-hero-copy">
            {props.eyebrow ? <span className="puck-kicker">{props.eyebrow}</span> : null}
            <h1>{props.heading}</h1>
            {props.lede ? <p>{props.lede}</p> : null}
            <div className="puck-actions">
              <BuilderButton link={{ label: props.primaryLabel, url: props.primaryUrl }} />
              <BuilderButton link={{ label: props.secondaryLabel, url: props.secondaryUrl }} secondary />
            </div>
          </div>
          <BuilderMedia alt={props.imageAlt || props.heading} url={props.imageUrl} />
        </section>
      ),
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
              <BuilderButton link={{ label: props.linkLabel, url: props.linkUrl }} secondary />
            </div>
          </div>
        </section>
      ),
    },
    ProductGridBlock: {
      defaultProps: {
        ...defaultDesign,
        columns: "3",
        heading: "Featured products",
        intro: "Showcase selected Eltronic products.",
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
                <a className="puck-card" href={`https://eltronic.co.uk/products/${product.slug}`} key={product.slug}>
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
    RichTextBlock: {
      defaultProps: {
        ...defaultDesign,
        body: "Add body copy here. Keep sections focused and easy to scan.",
        bodySize: 1.08,
        sectionWidth: "narrow",
      },
      fields: {
        body: { contentEditable: true, label: "Body", type: "textarea" },
        ...sharedDesignFields,
      },
      label: "Rich text",
      render: (props) => {
        const body = textValue(props.body, "Add body copy here.");

        return (
          <section className={getSectionClassName(props, "puck-rich-section")} style={getSectionStyle(props)}>
            <div className="puck-rich-text">
              {body.split("\n").map((paragraph, index) => (
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
      pageTitle: "New Eltronic page",
      sectionSpacing: "normal",
      surfaceColor: "23, 32, 51",
      surfaceOpacity: 0.78,
      textColor: "#f1f5f9",
      themePreset: "eltronicDark",
    },
    fields: {
      pageTitle: { contentEditable: true, label: "Page title", type: "text" },
      themePreset: {
        label: "Theme",
        options: [
          { label: "Eltronic dark", value: "eltronicDark" },
          { label: "Precision light", value: "precisionLight" },
          { label: "Signal contrast", value: "signalContrast" },
        ],
        type: "select",
      },
      fontFamily: { label: "Base font", options: fontOptions, type: "select" },
      backgroundColor: { label: "Page background", type: "text" },
      textColor: { label: "Text colour", type: "text" },
      accentColor: { label: "Accent colour", type: "text" },
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
