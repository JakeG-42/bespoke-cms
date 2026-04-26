import type { Metadata } from "next";
import { Source_Serif_4, Space_Grotesk } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const display = Source_Serif_4({
  subsets: ["latin"],
  variable: "--font-display",
});

const body = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-body",
});

export const metadata: Metadata = {
  title: "Eltronic",
  description: "Product showcase and enquiry website for Eltronic.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${display.variable} ${body.variable}`}>
        <div className="site-shell">
          <header className="site-header">
            <Link className="brand" href="/">
              Eltronic
            </Link>
            <nav className="nav" aria-label="Main navigation">
              <Link href="/products">Products</Link>
              <Link href="/about">About</Link>
              <Link href="/contact">Contact</Link>
            </nav>
          </header>
          {children}
          <footer className="footer">Eltronic product showcase starter.</footer>
        </div>
      </body>
    </html>
  );
}
