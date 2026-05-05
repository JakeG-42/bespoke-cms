import type { Metadata } from "next";

import { body, code } from "@/app/fonts";
import "@/payload/builder/builder-preview.css";
import "./new-site.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://app.example.com"),
  title: {
    default: "Bespoke CMS",
    template: "%s | Bespoke CMS",
  },
  description: "The Payload-managed version of the new Bespoke CMS website.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function NewSiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${body.variable} ${code.variable} new-site-body`}>{children}</body>
    </html>
  );
}
