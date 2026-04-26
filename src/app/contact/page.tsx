import { products } from "@/content/products";

export const metadata = {
  title: "Contact | Eltronic",
  description: "Contact Eltronic for product and project enquiries.",
};

export default function ContactPage() {
  return (
    <main className="page">
      <section className="section contact-grid">
        <div>
          <p className="code-kicker">enquiry.create</p>
          <h1>Start the conversation.</h1>
          <p className="lede">
            The current WordPress form asks for name, company, email, message
            and an optional product selection. This is the same intended flow,
            ready to wire to a real form endpoint.
          </p>

          <div className="contact-list">
            <div className="contact-item">
              <span>phone</span>
              <a href="tel:+447935239421">+44(0) 79 3523 9421</a>
            </div>
            <div className="contact-item">
              <span>email</span>
              <a href="mailto:sales@eltronic.co.uk">sales@eltronic.co.uk</a>
            </div>
          </div>
        </div>

        <form className="panel form-grid">
          <input aria-label="Name" placeholder="Name" />
          <input aria-label="Company name" placeholder="Company name" />
          <input aria-label="Email" placeholder="Email" type="email" />
          <select aria-label="Product">
            <option>Please select product (optional)</option>
            {products.map((product) => (
              <option key={product.slug}>{product.name}</option>
            ))}
          </select>
          <textarea aria-label="Message" placeholder="Message" />
          <a className="button" href="mailto:sales@eltronic.co.uk">
            Send by email
          </a>
        </form>
      </section>
    </main>
  );
}
