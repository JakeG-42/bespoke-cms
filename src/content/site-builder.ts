export type SiteThemePreset = "platform" | "halogen" | "graphite" | "clean";
export type SiteBackgroundStyle = "grid" | "soft" | "minimal";
export type SiteVisualDensity = "compact" | "balanced" | "spacious";
export type SiteHeroVisualVariant = "display" | "network" | "sectors" | "data";

export type SiteBuilderTheme = {
  preset: SiteThemePreset;
  accentColor: string;
  secondaryColor: string;
  highlightColor: string;
  backgroundStyle: SiteBackgroundStyle;
  visualDensity: SiteVisualDensity;
};

export type SiteBuilderHero = {
  brand: string;
  titleSuffix: string;
  rolePhrases: string[];
  lede: string;
  primaryCtaLabel: string;
  primaryCtaHref: string;
  secondaryCtaLabel: string;
  secondaryCtaHref: string;
  visualLabel: string;
  visualVariant: SiteHeroVisualVariant;
};

export type SiteBuilderSectionKey = "services" | "products" | "software" | "workflow" | "sectors";

export type SiteBuilderSection = {
  key: SiteBuilderSectionKey;
  label: string;
  enabled: boolean;
  order: number;
  eyebrow: string;
  title: string;
  summary: string;
  ctaLabel?: string;
  ctaHref?: string;
  panelEyebrow?: string;
  panelTitle?: string;
  panelSummary?: string;
};

export type SiteBuilderSettings = {
  theme: SiteBuilderTheme;
  home: {
    hero: SiteBuilderHero;
    sections: SiteBuilderSection[];
  };
};

export const themePresetOptions: Array<{
  key: SiteThemePreset;
  label: string;
  description: string;
}> = [
  {
    key: "platform",
    label: "Platform grid",
    description: "Technical dark grid with bright product-console accents.",
  },
  {
    key: "halogen",
    label: "Halogen",
    description: "Sharper magenta edges with warmer highlights.",
  },
  {
    key: "graphite",
    label: "Graphite lab",
    description: "Quieter product feel with steel blue accents.",
  },
  {
    key: "clean",
    label: "Clean specification",
    description: "More restrained, less glow, focused on readable content.",
  },
];

export const defaultSiteBuilderSettings: SiteBuilderSettings = {
  theme: {
    preset: "platform",
    accentColor: "#8bd3ff",
    secondaryColor: "#b7a3ff",
    highlightColor: "#fbbf24",
    backgroundStyle: "grid",
    visualDensity: "balanced",
  },
  home: {
    hero: {
      brand: "Bespoke CMS",
      titleSuffix: ";",
      rolePhrases: [
        "white-label CMS",
        "visual site builder",
        "CRM workspace",
        "commerce-ready console",
      ],
      lede:
        "A reusable CMS, CRM and visual builder platform for creating branded client workspaces without tying the product to one company.",
      primaryCtaLabel: "Browse packages",
      primaryCtaHref: "/products",
      secondaryCtaLabel: "Open console",
      secondaryCtaHref: "/console",
      visualLabel: "CMS, CRM and page-builder architecture",
      visualVariant: "display",
    },
    sections: [
      {
        key: "services",
        label: "Platform modules",
        enabled: true,
        order: 1,
        eyebrow: "01",
        title: "Reusable CMS and workflow modules",
        summary:
          "Pages, products, posts, menus, media, themes and future CRM modules share one console while staying flexible for each client.",
        ctaLabel: "Explore modules",
        ctaHref: "/solutions",
      },
      {
        key: "products",
        label: "Starter packages",
        enabled: true,
        order: 2,
        eyebrow: "02",
        title: "Starter packages",
        summary: "Neutral demo packages for websites, commerce catalogues and operational workspaces.",
      },
      {
        key: "software",
        label: "Builder CTA",
        enabled: true,
        order: 3,
        eyebrow: "03",
        title: "Content, themes and custom modules in one place",
        summary:
          "Use the console to manage content and page design, then grow the same installation into CRM, reporting and automation tools.",
        ctaLabel: "View platform areas",
        ctaHref: "/software-it",
        panelEyebrow: "platform.builder",
        panelTitle: "A WordPress-style console with product-specific control.",
        panelSummary:
          "Themes, templates, visual-builder blocks, custom CSS and code workspace tools sit beside structured content and future business data.",
      },
      {
        key: "workflow",
        label: "Workflow",
        enabled: true,
        order: 4,
        eyebrow: "04",
        title: "Start with content, grow into operations",
        summary: "The platform can begin as a CMS and expand into dashboards, CRM records and client-specific business workflows.",
      },
      {
        key: "sectors",
        label: "Use cases",
        enabled: true,
        order: 5,
        eyebrow: "05",
        title: "White-label use cases",
        summary:
          "Client sites, product catalogues, internal admin tools and partner portals can reuse the same foundation with different themes.",
        ctaLabel: "View use cases",
        ctaHref: "/sectors",
        panelEyebrow: "05",
        panelTitle: "White-label use cases",
      },
    ],
  },
};
