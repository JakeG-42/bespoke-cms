# Andersen EV Help Centre

Payload CMS and Puck-powered Help Centre for Andersen EV support content, visual page building and customer support workflows.

## Local Development

```bash
npm install
npm run dev
```

Open `http://localhost:3000`. The public Help Centre is served from `/`; the admin console is at `/console`.

## Project Shape

- `src/app` contains the public Next.js routes and Payload admin route group.
- `payload.config.ts` mounts Payload at `/console`.
- `src/payload` contains collections, globals, blocks and Puck builder configuration.
- `src/components/help-centre` contains the customer-facing AI helper UI.
- `src/lib/help-centre` contains issue categories, priority rules and ticket-draft types.
- Public content is intended to be edited through Payload and the Puck visual builder.

## Key Routes

- `/`: Payload/Puck-managed public Help Centre.
- `/help-centre`: Help Centre page with AI helper.
- `/console`: Payload admin console.
- `/console/wysiwyg/:id`: Puck visual builder for a Payload page.
