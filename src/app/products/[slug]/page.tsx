import { notFound } from "next/navigation";
import { products } from "@/content/products";

type ProductPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export function generateStaticParams() {
  return products.map((product) => ({
    slug: product.slug,
  }));
}

export async function generateMetadata({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = products.find((item) => item.slug === slug);

  if (!product) {
    return {};
  }

  return {
    title: `${product.name} | Eltronic`,
    description: product.summary,
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = products.find((item) => item.slug === slug);

  if (!product) {
    notFound();
  }

  return (
    <main className="page">
      <article className="detail-layout">
        <div className="stack">
          <p className="eyebrow">{product.category}</p>
          <h1>{product.name}</h1>
          <p className="lede">{product.description}</p>

          <section className="panel">
            <h2>{templateHeading[product.template]}</h2>
            <div className="stack">
              {product.highlights.map((highlight) => (
                <p key={highlight}>{highlight}</p>
              ))}
            </div>
          </section>
        </div>

        <aside className="stack">
          <div className="panel">
            <span className="tag">{product.template}</span>
            <h3>{product.enquiryPrompt}</h3>
            <p>
              This area will become the quote/contact action for each product
              page.
            </p>
          </div>

          <div className="panel">
            <h3>Specifications</h3>
            <dl className="spec-list">
              {product.specifications.map((spec) => (
                <div className="spec-row" key={spec.label}>
                  <dt>{spec.label}</dt>
                  <dd>{spec.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </aside>
      </article>
    </main>
  );
}

const templateHeading = {
  technical: "Technical product structure",
  showcase: "Visual product structure",
  compact: "Compact product structure",
};
