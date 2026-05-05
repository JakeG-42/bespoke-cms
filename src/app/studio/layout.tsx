import type { Metadata } from "next";

import { body, code } from "@/app/fonts";
import { siteConfig } from "@/lib/seo";
import "../globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: "Bespoke Studio",
    template: "%s | Bespoke Studio",
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default function StudioRootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${body.variable} ${code.variable}`}>{children}</body>
    </html>
  );
}
