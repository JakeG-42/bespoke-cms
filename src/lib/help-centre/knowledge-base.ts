import andersenHelpFaqContent from "@/payload/builder/help-centre-faq-content.json";

import type { ChatMessage, IssueCategory } from "./types";

type RawArticle = {
  body?: string;
  sourceUrl?: string;
  status?: "draft" | "needsConfirmation" | "ready";
  summary?: string;
  title: string;
};

type RawSection = {
  anchor?: string;
  articles?: RawArticle[];
  heading: string;
};

export type HelpKnowledgeArticle = RawArticle & {
  sectionAnchor?: string;
  sectionHeading: string;
};

export type HelpKnowledgeMatch = {
  article: HelpKnowledgeArticle;
  score: number;
};

const sections = andersenHelpFaqContent.sections as RawSection[];

const stopWords = new Set([
  "about",
  "after",
  "again",
  "and",
  "are",
  "can",
  "charger",
  "charging",
  "does",
  "for",
  "from",
  "have",
  "help",
  "how",
  "into",
  "the",
  "this",
  "what",
  "when",
  "where",
  "with",
  "you",
  "your",
]);

const categoryHints: Record<IssueCategory, string[]> = {
  app_issue: ["app", "account", "phone", "password", "schedule", "tariff", "vehicle"],
  cable_plug_issue: ["cable", "plug", "connector", "release", "wind"],
  charging_not_starting: ["charging", "charge", "start", "cable", "plug"],
  charging_speed_load_management: ["slow", "speed", "load", "current", "schedule"],
  general_enquiry: ["support", "contact", "order", "help"],
  installation_issue: ["installation", "survey", "dno", "mpan", "incoming", "supply", "spd"],
  order_delivery_sales: ["order", "payment", "grant", "paypal", "easy", "sales", "rightcharge", "allstar"],
  solar_ct_energy_readings: ["solar", "battery", "ct", "tariff", "energy"],
  warranty_hardware_fault: ["hardware", "fault", "led", "status", "warranty"],
  wifi_connectivity: ["wifi", "wi-fi", "offline", "router", "connectivity", "internet"],
};

export const helpKnowledgeArticles: HelpKnowledgeArticle[] = sections.flatMap((section) =>
  (section.articles ?? []).map((article) => ({
    ...article,
    sectionAnchor: section.anchor,
    sectionHeading: section.heading,
  })),
);

export function getKnowledgeMatches(messages: ChatMessage[], category: IssueCategory, limit = 5): HelpKnowledgeMatch[] {
  const query = conversationQuery(messages, category);
  const queryTokens = tokenize(query);
  const categoryTokens = new Set(categoryHints[category] ?? []);

  return helpKnowledgeArticles
    .map((article) => ({
      article,
      score: scoreArticle(article, query, queryTokens, categoryTokens),
    }))
    .filter((match) => match.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}

export function formatKnowledgeContext(matches: HelpKnowledgeMatch[]) {
  if (!matches.length) {
    return "No matching Andersen help-centre articles were found for the latest customer question.";
  }

  return matches
    .map(({ article }, index) => {
      const statusNote =
        article.status === "needsConfirmation"
          ? "Internal review note: this guidance needs Andersen confirmation before being stated as final policy."
          : article.status === "draft"
            ? "Internal review note: draft help-centre content."
            : "Internal review note: ready.";

      return [
        `Article ${index + 1}: ${article.title}`,
        `Section: ${article.sectionHeading}`,
        statusNote,
        article.summary ? `Summary: ${article.summary}` : "",
        article.body ? `Answer notes:\n${truncate(article.body, 1800)}` : "",
        article.sourceUrl ? `Source URL: ${article.sourceUrl}` : "",
      ]
        .filter(Boolean)
        .join("\n");
    })
    .join("\n\n---\n\n");
}

export function fallbackKnowledgeReply(matches: HelpKnowledgeMatch[]) {
  const article = matches[0]?.article;

  if (!article) {
    return "";
  }

  const statusPrefix =
    article.status === "needsConfirmation"
      ? "Based on the current Andersen help-centre notes, this can vary and Andersen support can confirm the final details. Current guidance is:\n\n"
      : article.status === "draft"
        ? "Based on the current Andersen help-centre notes:\n\n"
        : "";
  const answer = firstUsefulChunks(article.body || article.summary || "", 2);
  const followUp = followUpFromArticle(article);

  return `${statusPrefix}${answer}${followUp ? `\n\n${followUp}` : ""}`.trim();
}

function conversationQuery(messages: ChatMessage[], category: IssueCategory) {
  const userMessages = messages.filter((message) => message.role === "user").slice(-3);
  const categoryTerms = categoryHints[category]?.join(" ") ?? "";

  return `${userMessages.map((message) => message.content).join("\n")}\n${categoryTerms}`;
}

function scoreArticle(article: HelpKnowledgeArticle, query: string, queryTokens: Set<string>, categoryTokens: Set<string>) {
  const title = normalize(article.title);
  const summary = normalize(article.summary ?? "");
  const body = normalize(article.body ?? "");
  const section = normalize(article.sectionHeading);
  const normalizedQuery = normalize(query);
  let score = 0;

  if (title && normalizedQuery.includes(title)) {
    score += 25;
  }

  for (const token of queryTokens) {
    if (title.includes(token)) {
      score += 8;
    }

    if (summary.includes(token)) {
      score += 4;
    }

    if (body.includes(token)) {
      score += 1;
    }

    if (section.includes(token)) {
      score += 3;
    }
  }

  for (const token of categoryTokens) {
    if (title.includes(token)) {
      score += 2;
    }

    if (summary.includes(token) || body.includes(token)) {
      score += 0.5;
    }
  }

  return score;
}

function tokenize(value: string) {
  return new Set(
    normalize(value)
      .split(/[^a-z0-9+]+/)
      .map((token) => token.trim())
      .filter((token) => token.length > 2 && !stopWords.has(token)),
  );
}

function normalize(value: string) {
  return value.toLowerCase().replace(/wi fi/g, "wifi").replace(/wi-fi/g, "wifi");
}

function truncate(value: string, maxLength: number) {
  return value.length > maxLength ? `${value.slice(0, maxLength).trim()}...` : value;
}

function firstUsefulChunks(value: string, count: number) {
  const chunks = value
    .split(/\n{2,}/)
    .map((chunk) => chunk.trim())
    .filter(Boolean)
    .filter((chunk) => !/^needs andersen confirmation/i.test(chunk) && !/^publication warning/i.test(chunk));

  return chunks.slice(0, count).join("\n\n");
}

function followUpFromArticle(article: HelpKnowledgeArticle) {
  if (/contact andersen|contact support|support/i.test(article.body ?? "")) {
    return "If this does not solve it, I can help collect the details needed for Andersen support.";
  }

  if (article.sectionAnchor === "installation") {
    return "Please do not open electrical equipment or attempt wiring checks. Andersen support or a qualified installer should handle anything electrical.";
  }

  return "";
}
