const fallbackSiteUrl = "https://help.andersen-ev.com";

export const siteConfig = {
  name: "Andersen EV Help Centre",
  url: (process.env.NEXT_PUBLIC_SITE_URL || fallbackSiteUrl).replace(/\/+$/, ""),
  description: "Customer support, troubleshooting and help-centre content for Andersen EV charger customers.",
  email: "support@andersen-ev.com",
  phone: "+44 1234 916133",
  locale: "en_GB",
  keywords: [
    "Andersen EV",
    "EV charger help centre",
    "EV charger support",
    "home charger troubleshooting",
    "Andersen charger support",
    "electric vehicle charging help",
    "Payload CMS",
    "AI support assistant",
  ],
};

export function absoluteUrl(path = "/") {
  if (/^https?:\/\//i.test(path)) {
    return path;
  }

  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return `${siteConfig.url}${cleanPath}`;
}
