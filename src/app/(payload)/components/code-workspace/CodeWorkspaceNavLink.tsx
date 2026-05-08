"use client";

import { Code2 } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function CodeWorkspaceNavLink() {
  const pathname = usePathname();
  const codeWorkspaceActive = pathname?.startsWith("/console/code-workspace");

  return (
    <section aria-label="Tools" className="nav-group Tools console-tools-nav-group">
      <div className="nav-group__toggle">
        <span className="nav-group__label">Tools</span>
      </div>
      <div className="nav-group__content">
        <Link
          className={`console-tools-nav-link${codeWorkspaceActive ? " active" : ""}`}
          href="/console/code-workspace"
        >
          <Code2 aria-hidden="true" size={17} />
          <span>Code workspace</span>
        </Link>
      </div>
    </section>
  );
}
