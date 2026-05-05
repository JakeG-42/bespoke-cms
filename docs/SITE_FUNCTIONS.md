# Site Functions

Concise reference for the white-label Bespoke CMS application.

## Routes

- `/`: public starter site.
- `/products`: demo package catalogue.
- `/products/[slug]`: demo package detail page.
- `/solutions`: reusable platform modules.
- `/software-it`: CMS, CRM, commerce and integration areas.
- `/sectors`: white-label use cases.
- `/contact`: enquiry form with anti-spam protection.
- `/console`: Payload CMS console.
- `/console/wysiwyg/:id`: visual page builder for a Payload page.
- `/preview`: Payload-built preview site.
- `/v2`: legacy redirect to `/preview`.
- `/studio`: legacy internal admin tooling.

## Product Templates

Starter products use neutral template values:

- `website`
- `commerce`
- `workflow`

## Storage

- Payload data uses the configured Postgres database and the `payload` schema.
- Legacy managed data can use Postgres, Redis or local `.data/bespoke-cms-data.json`.
- Contact notification defaults should use neutral placeholder recipients unless configured through environment variables.

## Branding

The default product brand is `Bespoke CMS`. Client-specific names, emails, domains or copied vendor catalogues should not be committed to this repo.
