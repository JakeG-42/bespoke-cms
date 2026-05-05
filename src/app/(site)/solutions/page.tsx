import Link from "next/link";
import { TechnicalVisual } from "@/components/site/technical-visuals";
import { serviceModules, workflowModules } from "@/content/site";
import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "Solutions",
  description:
    "Reusable CMS, CRM, commerce and visual-builder modules for white-label client workspaces.",
  path: "/solutions",
});

export default function SolutionsPage() {
  return (
    <main className="page">
      <section className="hero compact-hero">
        <div className="hero-copy">
          <p className="code-kicker">solutions.stack</p>
          <h1>Reusable modules for content, commerce and operations.</h1>
          <p className="lede">
            Bespoke CMS combines Payload content models, a visual page builder,
            theme editing, product records and workflow-ready data structures in
            one white-label console.
          </p>
          <div className="actions">
            <Link className="button" href="/contact">
              Start a project enquiry
            </Link>
            <Link className="button secondary" href="/products">
              Browse products
            </Link>
          </div>
        </div>
        <TechnicalVisual label="Content and workflow network" variant="network" />
      </section>

      <section className="section">
        <div className="section-heading">
          <div>
            <span className="section-number">01</span>
            <h2>Core solution modules</h2>
          </div>
          <p>
            A practical view of the reusable pieces that sit around every
            successful CMS, CRM or client workspace build.
          </p>
        </div>
        <div className="module-grid">
          {serviceModules.map((service) => (
            <article className="feature-module" key={service.slug}>
              <span className="section-number">{service.eyebrow}</span>
              <h3>{service.title}</h3>
              <p>{service.summary}</p>
              <ul className="mini-list">
                {service.bullets.map((bullet) => (
                  <li key={bullet}>{bullet}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="split-module reverse">
          <TechnicalVisual label="Page-builder interface architecture" variant="display" />
          <div>
            <span className="section-number">02</span>
            <h2>From template choice to working client site.</h2>
            <p className="lede">
              The starter packages give the reusable content patterns. The
              builder connects those records to page templates, theme settings,
              CTAs, preview routes and future workflow modules.
            </p>
            <div className="actions">
              <Link className="button secondary" href="/data-specification">
                View data resources
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="cta-module">
          <div>
            <span className="section-number">software.systems</span>
            <h2>Need the software layer around it too?</h2>
            <p>
              Bespoke CMS can grow from content management into internal
              platforms, API integrations, CRM records and operational
              dashboards that connect the console to daily work.
            </p>
          </div>
          <Link className="button" href="/software-it">
            View Software & Systems
          </Link>
        </div>
      </section>

      <section className="section">
        <div className="section-heading">
          <div>
            <span className="section-number">03</span>
            <h2>Professional delivery, made straightforward</h2>
          </div>
          <p>
            Integration projects have moving parts. The process keeps decisions,
            risks and next steps clear from enquiry through support.
          </p>
        </div>
        <div className="process-grid">
          {workflowModules.map((step) => (
            <article className="process-card" key={step.step} tabIndex={0}>
              <strong>{step.step}</strong>
              <h3>{step.title}</h3>
              <p>{step.summary}</p>
              <small className="process-outcome">
                <span>Outcome</span>
                {step.outcome}
              </small>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
