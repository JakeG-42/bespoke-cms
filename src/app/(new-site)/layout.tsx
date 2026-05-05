import type { Metadata } from "next";

import { body, code } from "@/app/fonts";
import "@/payload/builder/builder-preview.css";
import "./new-site.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://new.eltronic.co.uk"),
  title: {
    default: "New Eltronic",
    template: "%s | New Eltronic",
  },
  description: "The Payload-managed version of the new Eltronic website.",
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
