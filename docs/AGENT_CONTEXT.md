# Agent Context

Read this first when returning to the Eltronic project. This document is written for future AI/code agents, but should stay understandable enough for Jake to audit.

## Purpose

Eltronic is a standalone Next.js replacement for the old WordPress/WooCommerce/Colibri site. It is quote/contact-led, not checkout-led. The admin area is a lightweight custom studio for managing products, assigning product templates and reading contact submissions.

Always verify current code before changing behavior. Treat this document as a map, not a substitute for inspecting files.

## Current Public URLs

- Production site: `https://project-5v5cr.vercel.app`
- Admin portal: `https://project-5v5cr.vercel.app/studio`
- Vercel project: `project-5v5cr`
- GitHub repo: `JakeG-42/eltronic`

## First Files To Inspect

- `src/lib/admin-auth.ts`: admin credential and cookie session logic.
- `src/lib/managed-data.ts`: product/submission storage abstraction.
- `src/app/studio/page.tsx`: admin interface.
- `src/app/studio/actions.ts`: admin server actions.
- `src/app/contact/actions.ts`: public contact form submission action.
- `src/content/products.ts`: seed catalogue from the crawled WordPress site.
- `docs/AI_FUNCTION_MAP.json`: machine-readable feature map.

## Auth Model

Auth is intentionally simple at this stage: one admin login, no database-backed users yet.

- Login page: `src/app/studio/login/page.tsx`.
- Login action: `src/app/studio/login/actions.ts`.
- Auth utility: `src/lib/admin-auth.ts`.
- Studio guard: `src/app/studio/page.tsx` calls `isAdminAuthenticated()`.
- Admin mutations: `src/app/studio/actions.ts` calls `requireAdminAction()` before writes.

### Credential Sources

Credentials can be overridden by environment variables:

- `ELTRONIC_ADMIN_USERNAME`
- `ELTRONIC_ADMIN_PASSWORD`
- `ELTRONIC_ADMIN_SECRET`

Current temporary defaults are:

- login: `admin`
- password: `password`

The defaults are for testing only. Replace them before sharing the admin URL beyond the project team.

### Verification Flow

`verifyAdminCredentials(username, password)` compares the provided username and password against configured values.

- Values are HMAC-signed with SHA-256 using the admin secret.
- Signed values are compared with `timingSafeEqual`.
- This avoids plain string comparison timing leaks, but it is still a simple single-user auth system.
- No user record is currently stored.
- No role or permission model exists yet.

### Session Cookie

Successful login calls `setAdminSession()`.

- Cookie name: `eltronic_admin_session`.
- Cookie value shape: `<issuedAt>.<signature>`.
- Signature: HMAC-SHA256 of `issuedAt`.
- Max age: 7 days.
- Flags: `HttpOnly`, `SameSite=Lax`, `Secure` in production.
- Validation: `isAdminAuthenticated()` checks cookie presence, expiry and signature.

### Future Test Users

If Jake asks to inject test users later, do not bolt a second auth system beside this one. Extend `src/lib/admin-auth.ts` so the rest of the app can keep calling the same functions.

Recommended path:

- Add an `AdminUser` type with `username`, `passwordHash` or `password`, and optional `role`.
- Replace `getAdminUsername()` and `getAdminPassword()` with `getAdminUsers()`.
- Keep `verifyAdminCredentials(username, password)` as the public verification API.
- Make the session payload include a user id or username, then sign the payload instead of only `issuedAt`.
- Keep `isAdminAuthenticated()` available for simple guards.
- Optionally add `getCurrentAdminUser()` if role-aware UI is needed.
- Update `docs/AI_FUNCTION_MAP.json` when the auth model changes.

## Managed Data Model

The managed data layer is in `src/lib/managed-data.ts`.

Storage selection:

- If `KV_REST_API_URL` and `KV_REST_API_TOKEN` exist, use Upstash/Vercel KV through `@upstash/redis`.
- If KV is not configured and writes are allowed locally, use `.data/eltronic-data.json`.
- In production without KV, use seeded products as read-only fallback and block writes.

The `.data/` folder is gitignored because it can contain contact submissions and edited content.

## Product Management

Public catalogue pages read through `getProducts()` and `getProductBySlug()` from `src/lib/managed-data.ts`.

Admin product edits are handled by `saveProductAction()` in `src/app/studio/actions.ts`.

Product form parsing uses `productFromFormData()`:

- Highlights: one item per line.
- Specifications: `Label | Value` per line.
- Documents: `Label | URL` per line.
- Variants: `Name | Details | Article number` per line.

Product templates are currently:

- `hmi`
- `data-logger`
- `module`

If adding a new template, update:

- `ProductTemplate` in `src/content/products.ts`.
- `parseProductTemplate()` in `src/lib/managed-data.ts`.
- The template select in `src/app/studio/page.tsx`.
- `templateLabel` in `src/app/products/[slug]/page.tsx`.
- `docs/AI_FUNCTION_MAP.json`.

## Contact Submissions

The public contact form uses `submitContactFormAction()` in `src/app/contact/actions.ts`.

Submissions are stored through `createContactSubmission()` in `src/lib/managed-data.ts` and displayed in `/studio`.

Statuses:

- `new`
- `reviewed`
- `replied`
- `archived`

There is no email notification yet. A future email/CRM integration should call from `createContactSubmission()` or wrap the contact server action.

## UI System

The public site uses the existing custom CSS in `src/app/globals.css`.

The admin uses Tailwind CSS v4 plus local shadcn-style primitives:

- `src/components/ui/button.tsx`
- `src/components/ui/card.tsx`
- `src/components/ui/input.tsx`
- `src/components/ui/textarea.tsx`
- `src/components/ui/label.tsx`
- `src/components/ui/badge.tsx`
- `src/components/ui/separator.tsx`

Do not install a second component system unless there is a clear reason.

## Deployment

Main branch pushes go to GitHub. Vercel production has been deployed manually with:

```bash
npx vercel --prod --yes
```

Expected production alias:

```text
https://project-5v5cr.vercel.app
```

Before relying on live admin writes, configure persistent KV env vars in Vercel:

- `KV_REST_API_URL`
- `KV_REST_API_TOKEN`

## Agent Maintenance Rules

- Keep `docs/AI_FUNCTION_MAP.json` in sync when adding/changing routes, env vars, auth, storage, or server actions.
- Update `docs/SITE_FUNCTIONS.md` for human-level behavior changes.
- Update `docs/PROJECT_LOG.md` for deployment, architecture and migration milestones.
- Do not commit `.data/`.
- Do not expose real production secrets in docs.
- If in doubt, run `npm run lint` and `npm run build` before handoff.
