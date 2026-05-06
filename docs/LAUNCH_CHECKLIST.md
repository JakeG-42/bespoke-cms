# Launch Checklist

Use this for the white-label Bespoke CMS product.

## Before Public Launch

- Set `NEXT_PUBLIC_SITE_URL` to the chosen product domain.
- Set `PAYLOAD_SECRET` in Vercel for production.
- Optional for the Help Centre AI helper: set `OPENAI_API_KEY` and, if needed, `OPENAI_MODEL`.
- Confirm the Postgres database is connected and `PAYLOAD_DATABASE_SCHEMA=payload`.
- Create the first real Payload admin account in `/console`.
- Replace placeholder contact details with product-owned inboxes.
- Confirm deployment protection and domain routing are set intentionally.

## Content

- Keep seed content generic.
- Use neutral demo packages only: website, commerce and workflow.
- Do not commit client names, personal emails, copied vendor catalogues or live client domains.

## Verification

- Run `npm run lint`.
- Run `npm run build`.
- Check `/`, `/help-centre`, `/console` and the `/preview` compatibility redirect.
