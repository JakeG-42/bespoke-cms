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
  description: "A Payload-managed website powered by Bespoke CMS.",
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
