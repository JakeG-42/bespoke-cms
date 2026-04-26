import Link from "next/link";

export function SiteShell({ children }: { children: React.ReactNode }) {
  return (
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
            <Link href="/solutions">Solutions</Link>
            <Link href="/sectors">Sectors</Link>
            <Link href="/data-specification">Data</Link>
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
  );
}
