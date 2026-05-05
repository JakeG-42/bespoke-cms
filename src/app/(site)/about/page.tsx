import Link from "next/link";
import { TechnicalVisual } from "@/components/site/technical-visuals";
import { sectorModules, workflowModules } from "@/content/site";
import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "About",
  description:
    "About the Bespoke CMS white-label platform for content, CRM, commerce and visual page-building workflows.",
  path: "/about",
});

const strengths = [
  {
    code: "product.context",
    title: "We start with the workspace",
    summary:
      "The right product shape depends on content models, users, permissions, workflows and what each client needs to manage.",
  },
  {
    code: "practical.editing",
    title: "Tools become daily workflows",
    summary:
      "Pages, themes, products, enquiries and custom records need to feel coherent in one console, not scattered across separate tools.",
  },
  {
    code: "customer.clarity",
    title: "Complex work made clear",
    summary:
      "Customers should understand the route, the risks and the next decision without having to decode unnecessary technical noise.",
  },
  {
    code: "long.term",
    title: "Built for extension",
    summary:
      "A useful white-label platform can start simple and grow into client-specific CRM, commerce, reporting and automation modules.",
  },
];

const capabilities = [
  "Payload-backed pages, posts, media and menus",
  "Visual builder sections, templates and theme presets",
  "Product catalogues, documents and quote-led CTAs",
  "CRM-style records, enquiries, notes and workflow statuses",
  "Custom CSS, code workspace tools and extension-ready modules",
];

export default function AboutPage() {
  return (
    <main className="page">
      <section className="about-hero section">
        <div>
          <p className="code-kicker">about.platform</p>
          <h1>A white-label CMS that can grow into a business platform.</h1>
          <p className="lede">
            Bespoke CMS brings content editing, visual page building, themes,
            products, enquiries and future CRM workflows into one reusable
            console that can be rebranded for different client projects.
          </p>
          <div className="actions">
            <Link className="button" href="/contact">
              Start a project conversation
            </Link>
            <Link className="button secondary" href="/products">
              Browse products
            </Link>
          </div>
        </div>

        <TechnicalVisual label="Bespoke CMS content and workflow architecture" variant="network" />
      </section>

      <section className="about-intro-grid section">
        <article className="about-statement panel">
          <span className="section-number">why.platform</span>
          <h2>One console for content, design and operational data.</h2>
          <p>
            A CMS only becomes valuable when the content model, visual editor,
            theme system and business records all make sense to the people using
            it. That is the space Bespoke CMS is being built for.
          </p>
          <p>
            The work can involve public pages, product catalogues, custom
            modules, internal records, automation rules or all of them together.
            The aim is the same: keep the product powerful without making daily
            editing feel heavy.
          </p>
        </article>

        <div className="about-proof-grid">
          {strengths.map((item) => (
            <article className="about-proof-card" key={item.code}>
              <span>{item.code}</span>
              <h3>{item.title}</h3>
              <p>{item.summary}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="section-heading">
          <div>
            <span className="section-number">what.we.do</span>
            <h2>Product support across the whole workspace.</h2>
          </div>
          <p>
            A client can start with a website, a catalogue, a CRM workflow or an
            admin problem and grow into the rest of the platform over time.
          </p>
        </div>
        <div className="about-capability-panel">
          <div>
            <h3>Core capability</h3>
            <p>
              Bespoke CMS connects content management, page building and
              structured business data, making it easier to shape client
              workspaces without rebuilding the same admin foundations each time.
            </p>
          </div>
          <ul className="about-capability-list">
            {capabilities.map((capability) => (
              <li key={capability}>{capability}</li>
            ))}
          </ul>
        </div>
      </section>

      <section className="section">
        <div className="section-heading">
          <div>
            <span className="section-number">how.we.work</span>
            <h2>Structured enough for control. Flexible enough for real clients.</h2>
          </div>
          <p>
            Product work rarely moves in perfect straight lines. The platform
            stays easier to extend when modelling, building, previewing and
            publishing are handled deliberately.
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

      <section className="section">
        <div className="split-module reverse">
          <div className="panel about-sector-panel">
            <span className="section-number">where.it.fits</span>
            <h2>Built around practical use cases.</h2>
            <p>
              Client sites, catalogues, internal teams and partner portals all
              need different workflows. The common thread is a clear editing
              experience with room for custom modules.
            </p>
            <div className="tag-row">
              {sectorModules.map((sector) => (
                <span className="tag" key={sector.title}>
                  {sector.title}
                </span>
              ))}
            </div>
            <div className="actions">
              <Link className="button secondary" href="/sectors">
                View sectors
              </Link>
            </div>
          </div>
          <div className="about-quote-card">
            <span>Bespoke CMS approach</span>
            <p>
              Make the technical work robust, and make the customer experience
              clear enough to move forward with confidence.
            </p>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="cta-module about-cta">
          <div>
            <span className="section-number">next.step</span>
            <h2>Bring the product, platform or workflow idea.</h2>
            <p>
              The next step is shaping the reusable CMS, CRM and builder
              foundation into a product that can support real client installs.
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
