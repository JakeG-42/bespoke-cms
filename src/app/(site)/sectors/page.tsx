import Link from "next/link";
import { TechnicalVisual } from "@/components/site/technical-visuals";
import { sectorModules } from "@/content/site";
import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "Use cases",
  description:
    "Bespoke CMS use cases for client websites, catalogues, internal teams and white-label platform deployments.",
  path: "/sectors",
});

export default function SectorsPage() {
  return (
    <main className="page">
      <section className="hero compact-hero">
        <div className="hero-copy">
          <p className="code-kicker">sectors.map</p>
          <h1>Use cases for reusable client workspaces.</h1>
          <p className="lede">
            Bespoke CMS is designed for projects where content, page design,
            products, enquiries and business records need to live in one
            configurable console.
          </p>
          <div className="actions">
            <Link className="button" href="/contact">
              Discuss your use case
            </Link>
            <Link className="button secondary" href="/solutions">
              View solutions
            </Link>
          </div>
        </div>
        <TechnicalVisual label="White-label use case map" variant="sectors" />
      </section>

      <section className="section">
        <div className="sector-grid">
          {sectorModules.map((sector) => (
            <article className="sector-card" key={sector.title}>
              <span className="section-number">{sector.code}</span>
              <h2>{sector.title}</h2>
              <p>{sector.summary}</p>
              <div className="tag-row">
                {sector.examples.map((example) => (
                  <span className="tag" key={example}>
                    {example}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="cta-module">
          <div>
            <span className="section-number">sector.quote</span>
            <h2>Not seeing your exact application?</h2>
            <p>
              The starter platform is intentionally flexible. If the project
              needs client-specific content, commerce, CRM records or internal
              workflow tools, it is worth mapping the module shape early.
            </p>
          </div>
          <Link className="button" href="/contact">
            Start an enquiry
          </Link>
        </div>
      </section>
    </main>
  );
}
