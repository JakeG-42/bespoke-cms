# Bespoke CMS

White-label CMS, CRM, commerce catalogue and visual page-builder platform.

## Local Development

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Project Shape

- `src/app` contains the public Next.js routes.
- `payload.config.ts` mounts Payload at `/console`.
- `src/content/products.ts` contains neutral demo packages.
- Product pages support `website`, `commerce` and `workflow` templates.
- Keep seed content generic unless a client-specific fork is intentional.
