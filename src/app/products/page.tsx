import Link from "next/link";
import { products } from "@/content/products";

export const metadata = {
  title: "Products | Eltronic",
  description: "Browse Eltronic product showcase pages.",
};

export default function ProductsPage() {
  return (
    <main className="page">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Products</p>
          <h1>Showcase</h1>
        </div>
        <p>
          Placeholder content for now; the structure is ready for your real
          products, images, specs, and page template choices.
        </p>
      </div>

      <div className="product-grid">
        {products.map((product) => (
          <Link
            className="product-card"
            href={`/products/${product.slug}`}
            key={product.slug}
          >
            <span className="tag">{product.category}</span>
            <h3>{product.name}</h3>
            <p>{product.summary}</p>
          </Link>
        ))}
      </div>
    </main>
  );
}
