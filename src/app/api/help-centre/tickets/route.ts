import config from "@payload-config";
import { NextResponse } from "next/server";
import { getPayload } from "payload";

import type { TicketDraft } from "@/lib/help-centre/types";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

type TicketRequestBody = {
  ticket?: TicketDraft;
};

export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as TicketRequestBody;
  const ticket = body.ticket;

  if (!ticket) {
    return NextResponse.json({ error: "A ticket draft is required." }, { status: 400 });
  }

  const missing = requiredTicketFields(ticket);

  if (missing.length) {
    return NextResponse.json({ error: `Missing required fields: ${missing.join(", ")}` }, { status: 400 });
  }

  const payload = await getPayload({ config });
  const created = await payload.create({
    collection: "support-tickets",
    data: {
      category: ticket.category,
      complexity: ticket.complexity,
      customer: ticket.customer,
      escalationReason: ticket.escalationReason,
      priority: ticket.priority,
      status: "new",
      summary: ticket.summary,
      title: ticket.title,
      transcript: ticket.transcript,
      troubleshootingStepsTried: ticket.troubleshootingStepsTried.map((step) => ({ step })),
    },
    overrideAccess: true,
  });

  return NextResponse.json({
    id: created.id,
    reference: `HC-${String(created.id).padStart(5, "0")}`,
    status: created.status,
  });
}

function requiredTicketFields(ticket: TicketDraft) {
  const missing: string[] = [];

  if (!ticket.title?.trim()) missing.push("title");
  if (!ticket.summary?.trim()) missing.push("issue description");
  if (!ticket.customer?.name?.trim()) missing.push("customer name");
  if (!ticket.customer?.email?.trim()) missing.push("email");
  if (!ticket.customer?.postcode?.trim()) missing.push("postcode");
  if (!ticket.customer?.chargerModel?.trim()) missing.push("charger model");
  if (!ticket.customer?.serialNumber?.trim()) missing.push("serial number");

  return missing;
}
