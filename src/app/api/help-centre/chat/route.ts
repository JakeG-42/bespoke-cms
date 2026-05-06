import { NextResponse } from "next/server";

import {
  createTicketDraft,
  fallbackAssistantReply,
  HELP_CENTRE_SYSTEM_PROMPT,
  isUnsafeElectricalIssue,
} from "@/lib/help-centre/support-rules";
import type { ChatMessage, ChatResponse } from "@/lib/help-centre/types";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

type ChatRequestBody = {
  messages?: ChatMessage[];
};

export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as ChatRequestBody;
  const messages = Array.isArray(body.messages) ? body.messages.filter(isChatMessage) : [];

  if (!messages.length) {
    return NextResponse.json({ error: "At least one chat message is required." }, { status: 400 });
  }

  const content = (await generateAssistantText(messages).catch((error) => {
    console.error("Help Centre AI generation failed.", error);
    return fallbackAssistantReply(messages);
  })).trim();
  const nextMessages = [
    ...messages,
    {
      content,
      createdAt: new Date().toISOString(),
      id: crypto.randomUUID(),
      role: "assistant" as const,
    },
  ];
  const ticketDraft = createTicketDraft(nextMessages);
  const response: ChatResponse = {
    message: nextMessages[nextMessages.length - 1],
    shouldEscalate: isUnsafeElectricalIssue(nextMessages) || nextMessages.filter((message) => message.role === "user").length >= 3,
    ticketDraft,
  };

  return NextResponse.json(response);
}

async function generateAssistantText(messages: ChatMessage[]) {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    return fallbackAssistantReply(messages);
  }

  const model = process.env.OPENAI_MODEL || "gpt-5.4-mini";
  const response = await fetch("https://api.openai.com/v1/responses", {
    body: JSON.stringify({
      input: messages
        .filter((message) => message.role !== "system")
        .map((message) => ({
          role: message.role === "assistant" ? "assistant" : "user",
          content: message.content,
        })),
      instructions: HELP_CENTRE_SYSTEM_PROMPT,
      model,
    }),
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    method: "POST",
  });

  if (!response.ok) {
    throw new Error(`OpenAI Responses API returned ${response.status}: ${await response.text()}`);
  }

  const result = (await response.json()) as {
    output?: Array<{
      content?: Array<{
        text?: string;
        type?: string;
      }>;
    }>;
    output_text?: string;
  };

  return result.output_text || result.output?.flatMap((item) => item.content ?? []).map((item) => item.text ?? "").join("\n").trim() || fallbackAssistantReply(messages);
}

function isChatMessage(value: unknown): value is ChatMessage {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const message = value as Partial<ChatMessage>;

  return (
    typeof message.id === "string" &&
    typeof message.content === "string" &&
    typeof message.createdAt === "string" &&
    (message.role === "assistant" || message.role === "system" || message.role === "user")
  );
}
