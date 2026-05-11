import { Menu, X } from "lucide-react";

import type { BuilderMenu } from "@/payload/builder/types";

type SiteFooterProps = {
  internalLinkBasePath?: string;
  menus: BuilderMenu[];
};

function footerHref(url: string | undefined, internalLinkBasePath = "") {
  const href = typeof url === "string" ? url.trim() : "";

  if (!href) {
    return "";
  }

  if (href.startsWith("#") || href.startsWith("//") || /^[a-z][a-z0-9+.-]*:/i.test(href)) {
    return href;
  }

  const basePath = internalLinkBasePath.replace(/\/+$/, "");

  if (!basePath) {
    return href;
  }

  if (href === "/") {
    return basePath;
  }

  if (href === basePath || href.startsWith(`${basePath}/`)) {
    return href;
  }

  return href.startsWith("/") ? `${basePath}${href}` : href;
}

export function SiteFooter({ internalLinkBasePath = "", menus }: SiteFooterProps) {
  const footerMenu = menus.find((menu) => menu.handle === "primary") ?? menus[0] ?? null;
  const footerMenuItems = footerMenu?.items ?? [];

  return (
    <footer className="puck-help-footer">
      <div className="puck-help-footer-inner">
        <a
          aria-label="Trustpilot reviews. Rated Excellent. 4.8 out of 5. Based on 1,976 reviews on Trustpilot. Click to view Trustpilot profile."
          className="puck-help-footer-trustpilot"
          href="https://uk.trustpilot.com/review/andersen-ev.com?utm_medium=trustbox&utm_source=Carousel"
          rel="noopener noreferrer"
          target="_blank"
        >
          <span className="puck-help-footer-trustpilot-score">Excellent</span>
          <span aria-hidden="true" className="puck-help-footer-trustpilot-stars">
            <span>★</span>
            <span>★</span>
            <span>★</span>
            <span>★</span>
            <span>★</span>
          </span>
          <span className="puck-help-footer-trustpilot-reviews">
            Based on <strong>1,976 reviews</strong>
          </span>
          <span className="puck-help-footer-trustpilot-logo">Trustpilot</span>
        </a>
        <a className="puck-help-footer-brand" href={footerHref("/", internalLinkBasePath) || "/"} aria-label="Andersen EV homepage">
          <img
            alt="Andersen EV"
            className="puck-help-footer-logo"
            src="https://andersen-ev.com/cdn/shop/files/Untitled_design_31.png?v=1672740204&width=240"
          />
        </a>
        {footerMenuItems.length ? (
          <div className="puck-help-footer-menu-wrap">
            <nav aria-label={`${footerMenu?.title ?? "Footer menu"} footer`} className="puck-help-footer-menu">
              {footerMenuItems.map((item, index) => (
                <div className="puck-help-footer-menu-column" key={`footer-menu-${item.label}-${index}`}>
                  <a className="puck-help-footer-menu-parent" href={footerHref(item.url, internalLinkBasePath) || "#"}>
                    {item.label}
                  </a>
                  {item.children?.length ? (
                    <div className="puck-help-footer-submenu">
                      {item.children.map((child) => (
                        <a href={footerHref(child.url, internalLinkBasePath) || "#"} key={`footer-submenu-${item.label}-${child.label}-${child.url}`}>
                          {child.label}
                        </a>
                      ))}
                    </div>
                  ) : null}
                </div>
              ))}
            </nav>
            <details className="puck-help-footer-mobile-menu">
              <summary>
                <Menu aria-hidden="true" className="puck-help-footer-mobile-menu-open" size={18} strokeWidth={2.2} />
                <X aria-hidden="true" className="puck-help-footer-mobile-menu-close" size={18} strokeWidth={2.2} />
                <span className="puck-sr-only">Footer menu</span>
              </summary>
              <nav aria-label={`${footerMenu?.title ?? "Footer menu"} mobile footer`} className="puck-help-footer-mobile-menu-panel">
                {footerMenuItems.map((item, index) => (
                  <div className="puck-help-footer-mobile-menu-group" key={`footer-mobile-menu-${item.label}-${index}`}>
                    <a className="puck-help-footer-mobile-menu-parent" href={footerHref(item.url, internalLinkBasePath) || "#"}>
                      {item.label}
                    </a>
                    {item.children?.length ? (
                      <div className="puck-help-footer-mobile-submenu">
                        {item.children.map((child) => (
                          <a href={footerHref(child.url, internalLinkBasePath) || "#"} key={`footer-mobile-submenu-${item.label}-${child.label}-${child.url}`}>
                            {child.label}
                          </a>
                        ))}
                      </div>
                    ) : null}
                  </div>
                ))}
              </nav>
            </details>
          </div>
        ) : null}
        <div className="puck-help-footer-socials" aria-label="Social links">
          <a aria-label="Facebook" href="#">
            <svg aria-hidden="true" viewBox="0 0 24 24">
              <path d="M14.2 8.2V6.6c0-.8.5-1 1-1h1.5V3h-2.2c-2.5 0-3.8 1.5-3.8 4v1.2H8.4V11h2.3v10h3.1V11h2.5l.4-2.8h-2.5z" />
            </svg>
          </a>
          <a aria-label="Instagram" href="#">
            <svg aria-hidden="true" viewBox="0 0 24 24">
              <path d="M7.4 2.8h9.2c2.5 0 4.6 2.1 4.6 4.6v9.2c0 2.5-2.1 4.6-4.6 4.6H7.4c-2.5 0-4.6-2.1-4.6-4.6V7.4c0-2.5 2.1-4.6 4.6-4.6zm0 2A2.6 2.6 0 0 0 4.8 7.4v9.2a2.6 2.6 0 0 0 2.6 2.6h9.2a2.6 2.6 0 0 0 2.6-2.6V7.4a2.6 2.6 0 0 0-2.6-2.6H7.4zm4.6 3.3a3.9 3.9 0 1 1 0 7.8 3.9 3.9 0 0 1 0-7.8zm0 2a1.9 1.9 0 1 0 0 3.8 1.9 1.9 0 0 0 0-3.8zm4.2-2.7a1 1 0 1 1 2 0 1 1 0 0 1-2 0z" />
            </svg>
          </a>
          <a aria-label="YouTube" href="#">
            <svg aria-hidden="true" viewBox="0 0 24 24">
              <path d="M21.6 7.1a3 3 0 0 0-2.1-2.1C17.7 4.5 12 4.5 12 4.5s-5.7 0-7.5.5a3 3 0 0 0-2.1 2.1C1.9 8.9 1.9 12 1.9 12s0 3.1.5 4.9a3 3 0 0 0 2.1 2.1c1.8.5 7.5.5 7.5.5s5.7 0 7.5-.5a3 3 0 0 0 2.1-2.1c.5-1.8.5-4.9.5-4.9s0-3.1-.5-4.9zM9.9 15.2V8.8l5.6 3.2-5.6 3.2z" />
            </svg>
          </a>
          <a aria-label="LinkedIn" href="#">
            <svg aria-hidden="true" viewBox="0 0 24 24">
              <path d="M5.2 8.8h3.2V21H5.2V8.8zM6.8 3a1.9 1.9 0 1 1 0 3.8A1.9 1.9 0 0 1 6.8 3zm4.2 5.8h3.1v1.7h.1c.4-.8 1.5-2 3.2-2 3.4 0 4 2.2 4 5.1V21h-3.2v-6.6c0-1.6 0-3.6-2.2-3.6s-2.5 1.7-2.5 3.5V21H11V8.8z" />
            </svg>
          </a>
        </div>
        <div className="puck-help-footer-payments" aria-label="Payment methods">
          <span aria-label="American Express" className="puck-payment-badge puck-payment-badge-amex">
            AMEX
          </span>
          <span aria-label="Google Pay" className="puck-payment-badge puck-payment-badge-gpay">
            <span>G</span> Pay
          </span>
          <span aria-label="Android Pay" className="puck-payment-badge puck-payment-badge-android">
            Android Pay
          </span>
          <span aria-label="PayPal" className="puck-payment-badge puck-payment-badge-paypal">
            P
          </span>
          <span aria-label="Mastercard" className="puck-payment-badge puck-payment-badge-mastercard">
            <span />
            <span />
          </span>
          <span aria-label="Visa" className="puck-payment-badge puck-payment-badge-visa">
            VISA
          </span>
          <span aria-label="Shop Pay" className="puck-payment-badge puck-payment-badge-shop">
            shop
          </span>
          <span aria-label="UnionPay" className="puck-payment-badge puck-payment-badge-union">
            UnionPay
          </span>
        </div>
        <p>© 2026, Andersen EV. Andersen EV Plc t/a Andersen EV is regulated by the Financial Conduct Authority FRN: 972396</p>
      </div>
    </footer>
  );
}
