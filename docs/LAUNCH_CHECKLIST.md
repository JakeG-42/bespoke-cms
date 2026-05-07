# Launch Checklist

Use this for the Andersen EV Help Centre.

## Before Public Launch

- Set `NEXT_PUBLIC_SITE_URL` to the Help Centre domain.
- Set `PAYLOAD_SECRET` in Vercel for production.
- Optional for the Help Centre AI helper: set `GEMINI_API_KEY` and, if needed, `GEMINI_MODEL`. OpenAI can also be used with `OPENAI_API_KEY`.
- Confirm the Postgres database is connected and `PAYLOAD_DATABASE_SCHEMA=payload`.
- Create the first real Payload admin account in `/console`.
- Confirm support inboxes, ticket workflow and customer-facing contact details.
- Confirm deployment protection and domain routing are set intentionally.

## Content

- Review all demo pages in Payload before public launch.
- Confirm the navigation menu matches the intended Help Centre IA.
- Confirm AI helper copy does not promise warranty approval, refunds, replacements or engineer visits.
- Add approved support articles and safe troubleshooting flows.

## Verification

- Run `npm run lint`.
- Run `npm run build`.
- Check `/`, `/help-centre` and `/console`.
