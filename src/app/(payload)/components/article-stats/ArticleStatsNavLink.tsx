"use client";

import { BarChart3 } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function ArticleStatsNavLink() {
  const pathname = usePathname();
  const articleStatsActive = pathname?.startsWith("/console/article-stats");

  return (
    <section aria-label="Analytics" className="nav-group Analytics console-tools-nav-group">
      <div className="nav-group__toggle">
        <span className="nav-group__label">Analytics</span>
      </div>
      <div className="nav-group__content">
        <Link className={`console-tools-nav-link${articleStatsActive ? " active" : ""}`} href="/console/article-stats">
          <BarChart3 aria-hidden="true" size={17} />
          <span>Article stats</span>
        </Link>
      </div>
    </section>
  );
}
