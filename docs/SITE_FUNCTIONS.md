# Site Functions

Concise reference for the Andersen EV Help Centre application.

## Routes

- `/`: public Help Centre site, rendered from Payload page data and Puck builder data.
- `/help-centre`: Help Centre page with the AI helper block when published in Payload.
- `/console`: Payload CMS console.
- `/console/wysiwyg/:id`: visual page builder for a Payload page.
- `/console-api`: Payload REST API.

## Payload Content

- Pages manage slugs, SEO, structured blocks and hidden Puck `builderData`.
- Help Articles are used for Help Centre article content.
- Menus manage editable navigation data for the Puck header.
- Support tickets store AI-helper escalations and support-team summaries.
- Themes and page templates control whole-site visual direction.
- Code snippets provide scoped custom CSS where a managed override is safer than changing source code.

## Storage

- Payload data uses the configured Postgres database and the `payload` schema.
- Media and documents are managed through Payload collections.

## AI Helper

- The assistant must only suggest safe customer-level troubleshooting.
- It should collect customer details before creating a ticket.
- It should categorise issue type, priority and complexity.
- Electrical/install/hardware safety issues should be escalated instead of diagnosed in detail.
