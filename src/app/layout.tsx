import type { Metadata } from "next";
import { Fira_Code, Tajawal } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const body = Tajawal({
  subsets: ["latin"],
  weight: ["400", "500", "700", "800", "900"],
  variable: "--font-body",
});

const code = Fira_Code({
  subsets: ["latin"],
  variable: "--font-code",
});

export const metadata: Metadata = {
  title: "Eltronic",
  description:
    "Systems integration, HMI displays, CAN data logging and machinery control solutions.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${body.variable} ${code.variable}`}>
        <div className="site-shell">
          <header className="main-header">
            <nav className="nav-container" aria-label="Main navigation">
              <Link className="brand-logo" href="/">
                <span className="logo-bracket">&lt;</span>
                <span className="logo-text">Eltronic</span>
                <span className="logo-bracket">/&gt;</span>
              </Link>
              <div className="nav-menu">
                <Link href="/products">Products</Link>
                <Link href="/about">About</Link>
                <Link href="/contact">Contact</Link>
              </div>
            </nav>
          </header>
          {children}
          <footer className="main-footer">
            <div className="footer-container">
              <p>© 2026 Eltronic</p>
              <div className="footer-links">
                <a href="tel:+447935239421">+44(0) 79 3523 9421</a>
                <a href="mailto:sales@eltronic.co.uk">sales@eltronic.co.uk</a>
              </div>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
