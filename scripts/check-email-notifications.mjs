#!/usr/bin/env node

import { existsSync, readFileSync } from "node:fs";

const RESEND_EMAIL_ENDPOINT = "https://api.resend.com/emails";
const DEFAULT_RECIPIENT = "jakub@gajosz.com";
const args = new Set(process.argv.slice(2));
const shouldSend = args.has("--send");

loadEnvFile(".env.local");

const apiKey = process.env.RESEND_API_KEY;
const from = process.env.CONTACT_NOTIFICATION_FROM;
const to = parseRecipientList(process.env.CONTACT_NOTIFICATION_TO ?? DEFAULT_RECIPIENT);

if (!apiKey || !from) {
  console.error("Email notifications are not configured yet.");
  console.error("");
  console.error("Required Vercel env vars:");
  console.error("  RESEND_API_KEY");
  console.error("  CONTACT_NOTIFICATION_FROM");
  console.error("");
  console.error("Optional:");
  console.error("  CONTACT_NOTIFICATION_TO=jakub@gajosz.com");
  process.exit(1);
}

if (!shouldSend) {
  console.log("Email notification env vars are present.");
  console.log(`From: ${from}`);
  console.log(`To: ${to.join(", ")}`);
  console.log("Run `npm run email:check -- --send` to send a real test email.");
  process.exit(0);
}

const response = await fetch(RESEND_EMAIL_ENDPOINT, {
  body: JSON.stringify({
    from,
    html: "<p>Eltronic email notification test from the local checker.</p>",
    subject: "Eltronic email notification test",
    text: "Eltronic email notification test from the local checker.",
    to,
  }),
  headers: {
    Authorization: `Bearer ${apiKey}`,
    "Content-Type": "application/json",
    "Idempotency-Key": `email-check-${Date.now()}`,
  },
  method: "POST",
});

if (!response.ok) {
  console.error("Test email failed.");
  console.error(`${response.status} ${await response.text()}`);
  process.exit(1);
}

console.log("Test email sent.");

function loadEnvFile(filePath) {
  if (!existsSync(filePath)) {
    return;
  }

  for (const line of readFileSync(filePath, "utf8").split(/\r?\n/)) {
    const trimmedLine = line.trim();

    if (!trimmedLine || trimmedLine.startsWith("#")) {
      continue;
    }

    const separatorIndex = trimmedLine.indexOf("=");

    if (separatorIndex === -1) {
      continue;
    }

    const key = trimmedLine.slice(0, separatorIndex).trim();
    const value = trimmedLine
      .slice(separatorIndex + 1)
      .trim()
      .replace(/^["']|["']$/g, "");

    if (key && process.env[key] === undefined) {
      process.env[key] = value;
    }
  }
}

function parseRecipientList(value) {
  return value
    .split(",")
    .map((recipient) => recipient.trim())
    .filter(Boolean);
}
