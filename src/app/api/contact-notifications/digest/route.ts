import { NextResponse, type NextRequest } from "next/server";

import { sendContactSubmissionDigest } from "@/lib/email-notifications";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const cronSecret = process.env.CRON_SECRET;

  if (cronSecret) {
    const authorization = request.headers.get("authorization");

    if (authorization !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  const result = await sendContactSubmissionDigest();

  return NextResponse.json({ result });
}
