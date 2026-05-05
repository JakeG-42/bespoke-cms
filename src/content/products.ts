export type ProductTemplate = "website" | "commerce" | "workflow";

export type ProductImage = {
  src: string;
  alt: string;
};

export type ProductSpec = {
  label: string;
  value: string;
};

export type ProductDocument = {
  label: string;
  url: string;
};

export const productModuleDefinitions = [
  {
    key: "gallery",
    label: "Gallery",
    description: "Main product images and thumbnail gallery.",
  },
  {
    key: "highlights",
    label: "Highlights",
    description: "Bulleted selling points or feature notes.",
  },
  {
    key: "specifications",
    label: "Configuration",
    description: "Structured configuration and scope table.",
  },
  {
    key: "documents",
    label: "Documents",
    description: "Downloads, onboarding notes and support links.",
  },
  {
    key: "variants",
    label: "Packages and variants",
    description: "Package options, SKUs, prices and article numbers.",
  },
  {
    key: "enquiry",
    label: "CTA",
    description: "Product-specific enquiry prompt and quote route.",
  },
] as const;

export type ProductModuleKey = (typeof productModuleDefinitions)[number]["key"];
export type ProductModules = Record<ProductModuleKey, boolean>;

export type ProductVariant = {
  name: string;
  details: string;
  sku?: string;
  price?: string;
  articleNumber?: string;
};

export type Product = {
  slug: string;
  name: string;
  category: string;
  family: string;
  template: ProductTemplate;
  sourceUrl: string;
  sku?: string;
  price?: string;
  tags?: string[];
  modules?: ProductModules;
  image: ProductImage;
  images?: ProductImage[];
  summary: string;
  description: string;
  highlights: string[];
  specifications: ProductSpec[];
  documents?: ProductDocument[];
  variants?: ProductVariant[];
  enquiryPrompt: string;
};

const placeholderImages: ProductImage[] = [
  {
    src: "/product-images/placeholders/images-coming-soon-1.svg",
    alt: "Neutral product placeholder preview",
  },
  {
    src: "/product-images/placeholders/images-coming-soon-2.svg",
    alt: "Neutral package placeholder preview",
  },
  {
    src: "/product-images/placeholders/images-coming-soon-3.svg",
    alt: "Neutral workflow placeholder preview",
  },
];

const seedProducts: Product[] = [
  {
    slug: "cms-starter-site",
    name: "CMS Starter Site",
    category: "Website package",
    family: "Content platform",
    template: "website",
    sourceUrl: "/products/cms-starter-site",
    image: placeholderImages[0],
    images: placeholderImages,
    summary:
      "A reusable starter website package with editable pages, menus, media, SEO settings and visual-builder sections.",
    description:
      "CMS Starter Site is a neutral demonstration package for client website builds. It shows how page content, reusable blocks, navigation, theme settings and publishing workflows can be managed from the console without hard-coding a client brand into the application.",
    highlights: [
      "Editable pages, posts, menus and media library",
      "Visual builder sections for hero areas, content, CTAs and layout blocks",
      "Theme selector with reusable whole-site visual presets",
      "Draft and published status controls for safer content updates",
    ],
    specifications: [
      { label: "Content model", value: "Pages, posts, media, menus and site settings" },
      { label: "Builder", value: "Reusable visual blocks with spacing, colour, typography and hover controls" },
      { label: "Publishing", value: "Draft/published workflow with preview-ready routing" },
      { label: "Best for", value: "Brochure sites, service sites, landing pages and lightweight content hubs" },
    ],
    documents: [{ label: "Starter package notes", url: "/contact" }],
    variants: [
      { name: "Starter", details: "Core pages, menus, media and one theme preset.", sku: "CMS-STARTER" },
      { name: "Launch", details: "Starter plus extra page templates and SEO content blocks.", sku: "CMS-LAUNCH" },
    ],
    enquiryPrompt: "Discuss a starter website",
  },
  {
    slug: "commerce-catalogue",
    name: "Commerce Catalogue",
    category: "Commerce package",
    family: "Product workspace",
    template: "commerce",
    sourceUrl: "/products/commerce-catalogue",
    image: placeholderImages[1],
    images: placeholderImages,
    summary:
      "A product-management workspace for reusable catalogues, pricing copy, technical details, assets and quote-led commerce flows.",
    description:
      "Commerce Catalogue is a generic product-content package for teams that need structured items, product pages, downloads, enquiries and reusable commerce sections without committing to one storefront shape from day one.",
    highlights: [
      "Products, categories, package variants and supporting documents",
      "Reusable product blocks that can be placed into landing pages",
      "Quote-led CTAs for services, packages or configurable items",
      "Designed to grow toward checkout, CRM or fulfilment integrations later",
    ],
    specifications: [
      { label: "Records", value: "Products, categories, variants, images and documents" },
      { label: "Page use", value: "Product detail pages, featured product sections and enquiry CTAs" },
      { label: "Workflow", value: "Admin-managed catalogue with reusable public layouts" },
      { label: "Best for", value: "Service packages, digital products, subscriptions and configurable catalogues" },
    ],
    documents: [{ label: "Catalogue setup notes", url: "/contact" }],
    variants: [
      { name: "Catalogue", details: "Structured product content and product-page templates.", sku: "COM-CATALOGUE" },
      { name: "Commerce Plus", details: "Catalogue plus custom enquiry and CRM handoff fields.", sku: "COM-PLUS" },
    ],
    enquiryPrompt: "Plan a catalogue setup",
  },
  {
    slug: "crm-operations-workspace",
    name: "CRM Operations Workspace",
    category: "Operations package",
    family: "CRM and workflow",
    template: "workflow",
    sourceUrl: "/products/crm-operations-workspace",
    image: placeholderImages[2],
    images: placeholderImages,
    summary:
      "A back-office workspace pattern for enquiries, customer records, internal notes, task tracking and operational dashboards.",
    description:
      "CRM Operations Workspace is a neutral seed module for growing the platform beyond content management. It provides a product-style placeholder for future CRM, enquiry, reporting and workflow functionality inside the same console.",
    highlights: [
      "Customer and enquiry management patterns",
      "Internal task, status and owner fields ready for extension",
      "Dashboard-friendly structure for reporting and daily operations",
      "Clear separation between content editing and internal business data",
    ],
    specifications: [
      { label: "Records", value: "Enquiries, customers, notes, tasks and internal statuses" },
      { label: "Automation", value: "Ready for notifications, assignment rules and CRM integrations" },
      { label: "Permissions", value: "Designed for admin, editor and future team-based roles" },
      { label: "Best for", value: "Client portals, enquiry pipelines, service desks and internal CRMs" },
    ],
    documents: [{ label: "Workspace outline", url: "/contact" }],
    variants: [
      { name: "Operations", details: "Core CRM-style fields and internal workflow screens.", sku: "CRM-OPS" },
      { name: "Automation", details: "Operations plus notifications and external integration planning.", sku: "CRM-AUTO" },
    ],
    enquiryPrompt: "Design an operations workspace",
  },
];

export const products: Product[] = seedProducts.map((product) => ({
  ...product,
  images: product.images ?? [product.image],
  modules: {
    documents: true,
    enquiry: true,
    gallery: true,
    highlights: true,
    specifications: true,
    variants: true,
    ...product.modules,
  },
}));

export const productFamilies = Array.from(new Set(products.map((product) => product.family)));

export const featuredProducts = products.filter((product) =>
  ["cms-starter-site", "commerce-catalogue", "crm-operations-workspace"].includes(product.slug),
);

export function findProductBySlug(slug: string) {
  return products.find((product) => product.slug === slug);
}
