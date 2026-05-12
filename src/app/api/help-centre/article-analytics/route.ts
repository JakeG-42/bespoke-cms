import { NextResponse } from "next/server";

import { recordArticleAnalyticsEvent, type ArticleAnalyticsVote } from "@/lib/help-centre/article-analytics";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

type ArticleAnalyticsRequestBody = {
  articlePath?: string;
  articleTitle?: string;
  browserId?: string;
  categorySlug?: string;
  seconds?: number;
  type?: "time" | "view" | "vote";
  vote?: ArticleAnalyticsVote;
};

export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as ArticleAnalyticsRequestBody;
  const validationError = validateBody(body);

  if (validationError) {
    return NextResponse.json({ error: validationError }, { status: 400 });
  }

  await recordArticleAnalyticsEvent({
    articlePath: body.articlePath ?? "",
    articleTitle: body.articleTitle ?? "",
    browserId: body.browserId ?? "",
    categorySlug: body.categorySlug ?? "",
    seconds: body.seconds,
    type: body.type ?? "view",
    vote: body.vote,
  });

  return NextResponse.json({ ok: true });
}

function validateBody(body: ArticleAnalyticsRequestBody) {
  if (!body.type || !["time", "view", "vote"].includes(body.type)) {
    return "A valid event type is required.";
  }

  if (!body.articlePath?.trim()) {
    return "Article path is required.";
  }

  if (!body.articleTitle?.trim()) {
    return "Article title is required.";
  }

  if (!body.categorySlug?.trim()) {
    return "Category slug is required.";
  }

  if (!body.browserId?.trim()) {
    return "Browser ID is required.";
  }

  if (body.type === "vote" && body.vote !== "helpful" && body.vote !== "notHelpful") {
    return "A valid vote is required.";
  }

  return null;
}
