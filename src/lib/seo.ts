import type { Metadata } from "next";

const fallbackSiteUrl = "https://app.example.com";

export const siteConfig = {
  name: "Bespoke CMS",
  url: (process.env.NEXT_PUBLIC_SITE_URL || fallbackSiteUrl).replace(/\/+$/, ""),
  description:
    "White-label CMS, CRM and visual page-building platform for reusable client websites and admin workspaces.",
  email: "hello@example.com",
  phone: "+44 00 0000 0000",
  locale: "en_GB",
  keywords: [
    "Bespoke CMS",
    "white-label CMS",
    "visual page builder",
    "Payload CMS",
    "admin console",
    "CRM workspace",
    "commerce catalogue",
    "theme editor",
    "content management",
    "workflow automation",
    "custom admin panel",
  ],
};

export function absoluteUrl(path = "/") {
  if (/^https?:\/\//i.test(path)) {
    return path;
  }

  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return `${siteConfig.url}${cleanPath}`;
}

export function createPageMetadata({
  description,
  path,
  title,
}: {
  description: string;
  path: string;
  title: string;
}): Metadata {
  return {
    metadataBase: new URL(siteConfig.url),
    title,
    description,
    alternates: {
      canonical: absoluteUrl(path),
    },
    keywords: siteConfig.keywords,
    openGraph: {
      title: `${title} | ${siteConfig.name}`,
      description,
      url: absoluteUrl(path),
      siteName: siteConfig.name,
      locale: siteConfig.locale,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | ${siteConfig.name}`,
      description,
    },
  };
}

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteConfig.name,
    url: siteConfig.url,
    email: siteConfig.email,
    telephone: siteConfig.phone,
    description: siteConfig.description,
    areaServed: "Global",
    knowsAbout: siteConfig.keywords,
  };
}

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.name,
    url: siteConfig.url,
    description: siteConfig.description,
  };
}

export function breadcrumbJsonLd(items: Array<{ name: string; path: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}
