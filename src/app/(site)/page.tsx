import Image from "next/image";
import Link from "next/link";
import { GeneratedVisual } from "@/components/site/generated-visuals";
import { sectorModules, serviceModules, workflowModules } from "@/content/site";
import { getFeaturedProducts, getProducts } from "@/lib/managed-data";

export const dynamic = "force-dynamic";

export default async function Home() {
  const [products, featuredProducts] = await Promise.all([getProducts(), getFeaturedProducts()]);

  return (
    <main className="page">
      <section className="hero">
        <div className="hero-copy">
          <p className="code-kicker">systems.integrator</p>
          <h1 className="hero-title">
            <span className="title-prefix">const partner =</span>
            <span className="title-value gradient-text">Eltronic</span>
            <span className="title-suffix">;</span>
          </h1>
          <p className="lede">
            Intelligent HMI displays, CAN data logging, custom harnesses and
            software integration for mobile and stationary machinery.
          </p>
          <div className="actions">
            <Link className="button" href="/products">
              Browse products
            </Link>
            <Link className="button secondary" href="/contact">
              Start an enquiry
            </Link>
          </div>
        </div>

        <GeneratedVisual label="HMI, CANbus and machine control architecture" variant="display" />
      </section>

      <section className="section">
        <div className="stats-grid">
          <div className="stat-card">
            <strong>{products.length}</strong>
            <span>public products crawled from the current site</span>
          </div>
          <div className="stat-card">
            <strong>3</strong>
            <span>initial product templates: HMI, data logger and module</span>
          </div>
          <div className="stat-card">
            <strong>{sectorModules.length}</strong>
            <span>core sectors carried over from the WordPress homepage</span>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="section-heading">
          <div>
            <span className="section-number">01</span>
            <h2>Machine-ready systems</h2>
          </div>
          <p>
            The old site content points to a clear product story: rugged HMIs,
            CAN data capture and bespoke integration work around specialist
            machinery.
          </p>
        </div>
        <div className="capability-grid">
          {serviceModules.map((capability) => (
            <article className="capability-card panel" key={capability.title}>
              <span className="section-number">{capability.eyebrow}</span>
              <h3>{capability.title}</h3>
              <p>{capability.summary}</p>
            </article>
          ))}
        </div>
        <div className="actions">
          <Link className="button secondary" href="/solutions">
            Explore solutions
          </Link>
        </div>
      </section>

      <section className="section">
        <div className="section-heading">
          <div>
            <span className="section-number">02</span>
            <h2>Featured products</h2>
          </div>
          <p>
            These are powered from structured content now, not WordPress page
            builder blocks.
          </p>
        </div>
        <div className="product-grid">
          {featuredProducts.map((product) => (
            <Link className="product-card" href={`/products/${product.slug}`} key={product.slug}>
              <div className="product-media">
                <Image src={product.image.src} alt={product.image.alt} fill sizes="(max-width: 980px) 100vw, 33vw" />
              </div>
              <div className="product-content">
                <div className="tag-row">
                  <span className="tag">{product.family}</span>
                  <span className="tag warning">{product.template}</span>
                </div>
                <h3>{product.name}</h3>
                <p>{product.summary}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="section-heading">
          <div>
            <span className="section-number">03</span>
            <h2>How projects come together</h2>
          </div>
          <p>
            The new site can explain the integration process instead of only
            listing products.
          </p>
        </div>
        <div className="process-grid">
          {workflowModules.map((step) => (
            <article className="process-card" key={step.step}>
              <strong>{step.step}</strong>
              <h3>{step.title}</h3>
              <p>{step.summary}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="split-module">
          <GeneratedVisual label="Sector map generated from current Eltronic positioning" variant="sectors" />
          <div>
            <span className="section-number">04</span>
            <h2>Application sectors</h2>
            <p className="lede">
              Agriculture, construction, logistics and industrial automation
              are now proper public pathways, not just homepage labels.
            </p>
            <div className="tag-row">
              {sectorModules.map((sector) => (
                <span className="tag" key={sector.title}>
                  {sector.title}
                </span>
              ))}
            </div>
            <div className="actions">
              <Link className="button" href="/sectors">
                View sectors
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
