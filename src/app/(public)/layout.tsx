import type { Metadata } from "next";

import { body, code } from "@/app/fonts";
import { siteConfig } from "@/lib/seo";
import "@/payload/builder/builder-preview.css";
import "./public-site.css";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  icons: {
    apple: "/apple-touch-icon.png",
    icon: "/aevsiteicon.png",
    shortcut: "/aevsiteicon.png",
  },
  title: {
    default: "Andersen EV Help Centre",
    template: "%s | Andersen EV Help Centre",
  },
  description: siteConfig.description,
};

export default function PublicSiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${body.variable} ${code.variable} public-site-body`}>{children}</body>
    </html>
  );
}
