import Link from "next/link";
import { products } from "@/content/products";

export default function Home() {
  return (
    <main className="page">
      <section className="hero">
        <div>
          <p className="eyebrow">Product showcase and enquiries</p>
          <h1>Eltronic</h1>
          <p className="lede">
            A fresh Next.js foundation for structured products, flexible page
            templates, quote-led journeys, and a cleaner way to manage the site
            as it grows.
          </p>
          <div className="actions">
            <Link className="button" href="/products">
              View products
            </Link>
            <Link className="button secondary" href="/contact">
              Start an enquiry
            </Link>
          </div>
        </div>
        <div className="product-signal" aria-hidden="true" />
      </section>

      <section>
        <div className="section-heading">
          <h2>Product templates</h2>
          <p>
            Each product can choose a template while still using the same clean
            content model behind the scenes.
          </p>
        </div>
        <div className="product-grid">
          {products.map((product) => (
            <Link
              className="product-card"
              href={`/products/${product.slug}`}
              key={product.slug}
            >
              <span className="tag">{product.template}</span>
              <h3>{product.name}</h3>
              <p>{product.summary}</p>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
