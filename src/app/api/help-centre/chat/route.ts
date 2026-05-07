import { NextResponse } from "next/server";

import {
  createTicketDraft,
  fallbackAssistantReply,
  HELP_CENTRE_SYSTEM_PROMPT,
  inferIssueCategory,
  isUnsafeElectricalIssue,
} from "@/lib/help-centre/support-rules";
import { fallbackKnowledgeReply, formatKnowledgeContext, getKnowledgeMatches } from "@/lib/help-centre/knowledge-base";
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

  const category = inferIssueCategory(messages);
  const knowledgeMatches = getKnowledgeMatches(messages, category);
  const content = (await generateAssistantText(messages, knowledgeMatches).catch((error) => {
    console.error("Help Centre AI generation failed.", error);
    return fallbackKnowledgeReply(knowledgeMatches) || fallbackAssistantReply(messages);
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

async function generateAssistantText(messages: ChatMessage[], knowledgeMatches: ReturnType<typeof getKnowledgeMatches>) {
  const provider = getAiProvider();
  const knowledgeContext = formatKnowledgeContext(knowledgeMatches);
  const instructions = buildAiInstructions(knowledgeContext);

  if (provider === "gemini") {
    return generateGeminiText(messages, knowledgeMatches, instructions);
  }

  return generateOpenAiText(messages, knowledgeMatches, instructions);
}

async function generateOpenAiText(messages: ChatMessage[], knowledgeMatches: ReturnType<typeof getKnowledgeMatches>, instructions: string) {
  const apiKey = process.env.OPENAI_API_KEY || process.env.OPENAI_KEY || process.env.bespoke_cms;

  if (!apiKey) {
    return fallbackKnowledgeReply(knowledgeMatches) || fallbackAssistantReply(messages);
  }

  const model = process.env.OPENAI_MODEL || "gpt-4.1-mini";
  const response = await fetch("https://api.openai.com/v1/responses", {
    body: JSON.stringify({
      input: messages
        .filter((message) => message.role !== "system")
        .map((message) => ({
          role: message.role === "assistant" ? "assistant" : "user",
          content: message.content,
        })),
      instructions,
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

  return (
    result.output_text ||
    result.output?.flatMap((item) => item.content ?? []).map((item) => item.text ?? "").join("\n").trim() ||
    fallbackKnowledgeReply(knowledgeMatches) ||
    fallbackAssistantReply(messages)
  );
}

async function generateGeminiText(messages: ChatMessage[], knowledgeMatches: ReturnType<typeof getKnowledgeMatches>, instructions: string) {
  const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_AI_API_KEY || process.env.GOOGLE_API_KEY;

  if (!apiKey) {
    return fallbackKnowledgeReply(knowledgeMatches) || fallbackAssistantReply(messages);
  }

  const model = process.env.GEMINI_MODEL || "gemini-3-flash-preview";
  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`, {
    body: JSON.stringify({
      contents: messages
        .filter((message) => message.role !== "system")
        .map((message) => ({
          parts: [{ text: message.content }],
          role: message.role === "assistant" ? "model" : "user",
        })),
      generationConfig: {
        temperature: 0.35,
      },
      system_instruction: {
        parts: [{ text: instructions }],
      },
    }),
    headers: {
      "Content-Type": "application/json",
      "x-goog-api-key": apiKey,
    },
    method: "POST",
  });

  if (!response.ok) {
    throw new Error(`Gemini API returned ${response.status}: ${await response.text()}`);
  }

  const result = (await response.json()) as {
    candidates?: Array<{
      content?: {
        parts?: Array<{
          text?: string;
        }>;
      };
    }>;
  };
  const text = result.candidates?.flatMap((candidate) => candidate.content?.parts ?? []).map((part) => part.text ?? "").join("\n").trim();

  return text || fallbackKnowledgeReply(knowledgeMatches) || fallbackAssistantReply(messages);
}

function getAiProvider() {
  const configuredProvider = process.env.AI_PROVIDER?.trim().toLowerCase();

  if (configuredProvider === "gemini" || configuredProvider === "google") {
    return "gemini";
  }

  if (configuredProvider === "openai") {
    return "openai";
  }

  return process.env.GEMINI_API_KEY || process.env.GOOGLE_AI_API_KEY || process.env.GOOGLE_API_KEY ? "gemini" : "openai";
}

function buildAiInstructions(knowledgeContext: string) {
  return `${HELP_CENTRE_SYSTEM_PROMPT}

Use the Andersen help-centre knowledge base snippets below when they are relevant to the customer's question.

Knowledge base rules:
- Prefer these snippets over general EV charger knowledge.
- If a snippet has an internal review note, do not reveal that internal label to the customer and do not present it as final policy. Say that details can vary and Andersen support can confirm where appropriate.
- Do not reveal internal review-owner notes or review statuses.
- If the snippets do not answer the question, say so briefly and ask a focused follow-up question or offer to create a ticket.
- Keep answers concise and practical.

Matched Andersen help-centre snippets:
${knowledgeContext}`;
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
