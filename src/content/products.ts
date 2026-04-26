export type ProductTemplate = "technical" | "showcase" | "compact";

export type Product = {
  slug: string;
  name: string;
  category: string;
  template: ProductTemplate;
  summary: string;
  description: string;
  highlights: string[];
  specifications: {
    label: string;
    value: string;
  }[];
  enquiryPrompt: string;
};

export const products: Product[] = [
  {
    slug: "control-interface",
    name: "Control Interface",
    category: "Automation",
    template: "technical",
    summary: "A structured product page for deeper technical information.",
    description:
      "Use this template for products that need specifications, compatibility notes, documents, and a clear quote path.",
    highlights: [
      "Detailed specification table",
      "Engineering-led product copy",
      "Quote-first enquiry flow",
    ],
    specifications: [
      { label: "Template", value: "Technical" },
      { label: "Content type", value: "Structured product data" },
      { label: "Primary CTA", value: "Request a quote" },
    ],
    enquiryPrompt: "Ask about control interface options",
  },
  {
    slug: "display-module",
    name: "Display Module",
    category: "Interfaces",
    template: "showcase",
    summary: "A more visual layout for products that benefit from imagery.",
    description:
      "Use this template where photos, use cases, installation examples, or variants matter more than dense specs.",
    highlights: [
      "Large media-first section",
      "Variant-friendly page structure",
      "Room for case-study style content",
    ],
    specifications: [
      { label: "Template", value: "Showcase" },
      { label: "Best for", value: "Visual product families" },
      { label: "Primary CTA", value: "Discuss a project" },
    ],
    enquiryPrompt: "Discuss display module requirements",
  },
  {
    slug: "signal-accessory",
    name: "Signal Accessory",
    category: "Accessories",
    template: "compact",
    summary: "A shorter product page for simpler supporting items.",
    description:
      "Use this template for accessories, add-ons, or supporting products that only need a clean overview and enquiry route.",
    highlights: [
      "Short-form overview",
      "Fast scanning for customers",
      "Simple related-product pattern",
    ],
    specifications: [
      { label: "Template", value: "Compact" },
      { label: "Best for", value: "Accessories and small products" },
      { label: "Primary CTA", value: "Contact Eltronic" },
    ],
    enquiryPrompt: "Contact us about this accessory",
  },
];
