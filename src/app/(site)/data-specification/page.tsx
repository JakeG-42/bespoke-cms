import Link from "next/link";
import { GeneratedVisual } from "@/components/site/generated-visuals";
import { resourceModules } from "@/content/site";
import { getProducts } from "@/lib/managed-data";

export const metadata = {
  title: "Data & Specification | Eltronic",
  description:
    "Product data sheets, guides, specification resources and enquiry support for Eltronic products.",
};

export const dynamic = "force-dynamic";

export default async function DataSpecificationPage() {
  const products = await getProducts();
  const documents = products.flatMap((product) =>
    (product.documents ?? []).map((document) => ({
      ...document,
      product: product.name,
    })),
  );

  return (
    <main className="page">
      <section className="hero compact-hero">
        <div className="hero-copy">
          <p className="code-kicker">data.specification</p>
          <h1>Data sheets, guides and product evidence.</h1>
          <p className="lede">
            A new home for the WordPress Data & Specification area, shaped
            around the structured product catalogue and future guides.
          </p>
          <div className="actions">
            <Link className="button" href="/products">
              Match a product
            </Link>
            <Link className="button secondary" href="/contact">
              Ask for specification help
            </Link>
          </div>
        </div>
        <GeneratedVisual label="Generated data and specification image" variant="data" />
      </section>

      <section className="section">
        <div className="module-grid">
          {resourceModules.map((resource) => (
            <article className="feature-module" key={resource.title}>
              <h3>{resource.title}</h3>
              <p>{resource.summary}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="section-heading">
          <div>
            <span className="section-number">documents.index</span>
            <h2>Known product documents</h2>
          </div>
          <p>
            These links are drawn from the structured product data and can be
            improved as more WordPress assets are migrated.
          </p>
        </div>
        <div className="document-grid">
          {documents.length === 0 ? (
            <article className="panel">
              <h3>No documents attached yet</h3>
              <p>Attach document links in Studio and they will appear here.</p>
            </article>
          ) : null}
          {documents.map((document) => (
            <a className="document-card" href={document.url} key={`${document.product}-${document.label}`}>
              <span>{document.product}</span>
              <strong>{document.label}</strong>
              <small>{document.url}</small>
            </a>
          ))}
        </div>
      </section>
    </main>
  );
}
