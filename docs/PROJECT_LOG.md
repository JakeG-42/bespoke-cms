# Project Log

Concise living log for the Eltronic standalone site/app. Add newest updates at the top.

## Current Status

- Repository: standalone GitHub repo `JakeG-42/eltronic`.
- Active branch: `main`.
- App scaffold: Next.js app using the App Router under `src/app`.
- Deployment: Vercel project `project-5v5cr` is connected and deployed.
- Vercel config: `vercel.json` sets `"framework": "nextjs"` to keep framework detection explicit.
- Product content: initial structured product data lives in `src/content/products.ts`.

## What Has Happened So Far

- Crawled the public `eltronic.co.uk` site for product, contact, homepage and guide/data-sheet content.
- Ported the first real product catalogue into `src/content/products.ts`.
- Started adapting the UI toward the dark code-inspired direction provided by Jake, while keeping it product-led rather than portfolio/CV-led.
- Eltronic was moved into its own standalone GitHub repository at `JakeG-42/eltronic`.
- The local repo is tracking the standalone GitHub remote on `main`.
- A Next.js scaffold was created with public routes, shared layout, global styles, and structured product content.
- Vercel was connected to the project as `project-5v5cr`.
- Deployment is active through Vercel.
- A Vercel framework detection issue was addressed with `vercel.json`.
- Initial product-template support was added through a `template` field in the product data model.

## Future Considerations

- WordPress migration work is being considered for any content that is not publicly crawlable.
- A possible temporary WordPress plugin could provide a controlled JSON/ZIP export from wp-admin.
- Enquiry/contact handling still needs a final decision, such as email, form endpoint, CRM, or lightweight admin inbox.

## Update Notes

- Keep entries factual and brief.
- Prefer linking to code paths when a behavior changes.
- Record deployment/config changes when they affect how the site is built or hosted.
