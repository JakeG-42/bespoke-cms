# Agent Context

This repository is the white-label Bespoke CMS product. It is no longer tied to a client company, personal account, old public website, or vendor catalogue.

## Current Shape

- Next.js application with Payload CMS mounted at `/console`.
- The public website is Payload/Puck-managed from the root catch-all route.
- `/preview` and `/v2` are compatibility redirects to the matching root URL.
- Legacy Studio routes and the old hand-built public site have been removed.
- Database objects for Payload use the `payload` schema.
- Current Payload content is an explicitly requested Andersen EV help-centre demo for a customer pitch. It uses CMS-managed pages, menu records, support tickets and an Andersen-styled theme.

## Product Direction

Bespoke CMS is intended to become a reusable CMS, CRM, commerce catalogue and visual page-builder platform. Keep new naming generic unless the user explicitly asks for a client-specific brand.

## Content Rules

- Do not add real client/company/person names to seed content.
- Exception: Andersen EV demo content is allowed because the user explicitly requested it for their customer.
- Use `example.com`, `hello@example.com` and neutral placeholder text in defaults.
- Starter product templates are `website`, `commerce` and `workflow`.
- Public seed products should remain demo packages, not real vendor products.

## Deployment Notes

- Git remote is configured for this repository.
- Vercel project name: `bespoke-cms`.
- Vercel auto-deploys from `main`.
- Do not manually redeploy or cancel deployments unless the user specifically asks.
