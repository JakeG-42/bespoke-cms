# Site Functions

Concise living reference for how the current Eltronic Next.js site works.

## App Structure

- Framework: Next.js with App Router.
- Global layout: `src/app/layout.tsx`.
- Global styles: `src/app/globals.css`.
- Product data source: `src/content/products.ts`.
- Public navigation: brand link to `/`, plus `/products`, `/about`, and `/contact`.
- Fonts: `Source_Serif_4` and `Space_Grotesk` are loaded through `next/font/google`.

## Current Routes

- `/`: homepage with hero copy, product-template explanation, and product cards generated from `products`.
- `/products`: product listing page generated from `products`.
- `/products/[slug]`: static product detail pages generated from each product `slug`.
- `/about`: placeholder page for company story, services, credentials, and trust-building content.
- `/contact`: placeholder page for future quote/contact flow.

## Product Data Model

Products are defined in `src/content/products.ts`.

Each product currently has:

- `slug`: URL segment used by `/products/[slug]`.
- `name`: display name.
- `category`: product category label.
- `template`: one of `technical`, `showcase`, or `compact`.
- `summary`: short card/listing copy.
- `description`: product detail intro copy.
- `highlights`: list of product or template highlights.
- `specifications`: list of `{ label, value }` rows shown on detail pages.
- `enquiryPrompt`: detail-page call-to-action heading.

## Product Detail Behavior

- `generateStaticParams()` builds static product pages from the product slugs.
- `generateMetadata()` sets product-specific page title and description.
- Unknown product slugs call `notFound()`.
- The detail page displays category, name, description, template-specific heading, highlights, enquiry prompt, and specifications.
- Template headings are currently mapped in `src/app/products/[slug]/page.tsx`.

## Current Product Templates

- `technical`: intended for specification-heavy products and quote-led enquiries.
- `showcase`: intended for more visual product families, images, examples, and variants.
- `compact`: intended for accessories, add-ons, and simpler product pages.

## Deployment Behavior

- Vercel project: `project-5v5cr`.
- Vercel project metadata is stored locally in `.vercel/project.json`.
- `vercel.json` explicitly declares the framework as Next.js.
- Standard scripts are available through `package.json`: `npm run dev`, `npm run build`, `npm run start`, and `npm run lint`.

## Known Placeholders

- Product content is now seeded from the public `eltronic.co.uk` crawl.
- Product pages show real product copy, source trace links, public WordPress image URLs, specifications, documents where known, and order variants where available.
- The contact page does not yet submit enquiries.
- WordPress migration/plugin work is being considered but is not implemented in the current app.
