# Agent Context

This repository is now the Andersen EV Help Centre application. Treat Payload CMS and Puck as the source of truth for public pages, page layout and editable content.

## Current Shape

- Next.js application with Payload CMS mounted at `/console`.
- The public website is Payload/Puck-managed from the root catch-all route.
- Old compatibility routes and the old hand-built public site have been removed.
- Database objects for Payload use the `payload` schema.
- Current content is an Andersen EV help-centre demo. It uses CMS-managed pages, menu records, support tickets and an Andersen-styled theme.

## Product Direction

Build toward a production-ready Help Centre with managed articles, troubleshooting flows, support-ticket capture and an AI helper. Keep new public UI editable through Payload/Puck where practical.

## Content Rules

- Andersen EV naming and support copy is allowed in this repo.
- Do not add private customer data, personal account details, credentials or real support transcripts.
- Help Centre AI safety rule: never give unsafe electrical advice. Escalate wiring, internal charger, RCD, PEN fault, CT clamp, consumer-unit, electrical testing, overheating, burning smell, exposed wiring or repeated tripping issues.
- Prefer reusable Payload collections and Puck components over hard-coded public pages.

## Deployment Notes

- Git remote is configured for this repository.
- Vercel auto-deploys from `main`.
- Do not manually redeploy or cancel deployments unless the user specifically asks.
