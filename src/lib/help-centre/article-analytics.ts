import { Pool } from "pg";

export type ArticleAnalyticsVote = "helpful" | "notHelpful";

export type ArticleAnalyticsEvent = {
  articlePath: string;
  articleTitle: string;
  browserId: string;
  categorySlug: string;
  seconds?: number;
  type: "time" | "view" | "vote";
  vote?: ArticleAnalyticsVote;
};

export type ArticleStatsRow = {
  articlePath: string;
  articleTitle: string;
  averageSecondsPerView: number;
  categorySlug: string;
  helpfulVotes: number;
  lastViewedAt: string | null;
  notHelpfulVotes: number;
  totalSeconds: number;
  uniqueBrowsers: number;
  views: number;
};

type RawArticleStatsRow = {
  article_path: string;
  article_title: string;
  average_seconds_per_view: string | number | null;
  category_slug: string;
  helpful_votes: string | number | null;
  last_viewed_at: Date | string | null;
  not_helpful_votes: string | number | null;
  total_seconds: string | number | null;
  unique_browsers: string | number | null;
  views: string | number | null;
};

let pool: Pool | null = null;

export async function recordArticleAnalyticsEvent(event: ArticleAnalyticsEvent) {
  const viewIncrement = event.type === "view" ? 1 : 0;
  const seconds = event.type === "time" ? clampSeconds(event.seconds) : 0;
  const vote = event.type === "vote" && event.vote ? event.vote : null;
  const client = getPool();

  await client.query(
    `
      INSERT INTO payload.help_article_analytics (
        article_path,
        article_title,
        category_slug,
        browser_id,
        views,
        total_seconds,
        helpful_vote,
        last_viewed_at
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7::payload.enum_help_article_analytics_helpful_vote, now())
      ON CONFLICT (article_path, browser_id) DO UPDATE SET
        article_title = EXCLUDED.article_title,
        category_slug = EXCLUDED.category_slug,
        views = payload.help_article_analytics.views + EXCLUDED.views,
        total_seconds = payload.help_article_analytics.total_seconds + EXCLUDED.total_seconds,
        helpful_vote = COALESCE(EXCLUDED.helpful_vote, payload.help_article_analytics.helpful_vote),
        last_viewed_at = now(),
        updated_at = now();
    `,
    [
      sanitizeText(event.articlePath, 256),
      sanitizeText(event.articleTitle, 256),
      sanitizeText(event.categorySlug, 96),
      sanitizeText(event.browserId, 128),
      viewIncrement,
      seconds,
      vote,
    ],
  );
}

export async function getArticleStats(): Promise<ArticleStatsRow[]> {
  const client = getPool();
  const result = await client.query<RawArticleStatsRow>(`
    SELECT
      CONCAT('/help-centre/articles/', help_categories.slug, '/', help_articles.slug) AS article_path,
      help_articles.title AS article_title,
      help_categories.slug AS category_slug,
      COALESCE(SUM(help_article_analytics.views), 0) AS views,
      COALESCE(SUM(help_article_analytics.total_seconds), 0) AS total_seconds,
      COUNT(help_article_analytics.id) AS unique_browsers,
      COUNT(help_article_analytics.id) FILTER (WHERE help_article_analytics.helpful_vote = 'helpful') AS helpful_votes,
      COUNT(help_article_analytics.id) FILTER (WHERE help_article_analytics.helpful_vote = 'notHelpful') AS not_helpful_votes,
      MAX(help_article_analytics.last_viewed_at) AS last_viewed_at,
      COALESCE(SUM(help_article_analytics.total_seconds) / NULLIF(SUM(help_article_analytics.views), 0), 0) AS average_seconds_per_view
    FROM payload.help_articles
    INNER JOIN payload.help_categories ON help_categories.id = help_articles.category_id
    LEFT JOIN payload.help_article_analytics
      ON help_article_analytics.article_path = CONCAT('/help-centre/articles/', help_categories.slug, '/', help_articles.slug)
    WHERE help_articles.status = 'published'
    GROUP BY help_articles.id, help_articles.title, help_articles.slug, help_categories.slug
    ORDER BY views DESC, helpful_votes DESC, help_articles.title ASC;
  `);

  return result.rows.map((row) => ({
    articlePath: row.article_path,
    articleTitle: row.article_title,
    averageSecondsPerView: Math.round(toNumber(row.average_seconds_per_view)),
    categorySlug: row.category_slug,
    helpfulVotes: toNumber(row.helpful_votes),
    lastViewedAt: row.last_viewed_at ? new Date(row.last_viewed_at).toISOString() : null,
    notHelpfulVotes: toNumber(row.not_helpful_votes),
    totalSeconds: toNumber(row.total_seconds),
    uniqueBrowsers: toNumber(row.unique_browsers),
    views: toNumber(row.views),
  }));
}

function getPool() {
  if (!pool) {
    const connectionString =
      process.env.PAYLOAD_DATABASE_URL ??
      process.env.DATABASE_URL ??
      process.env.POSTGRES_URL ??
      process.env.DATABASE_URL_UNPOOLED ??
      process.env.POSTGRES_URL_NON_POOLING;

    if (!connectionString) {
      throw new Error("No database connection string configured for article analytics.");
    }

    pool = new Pool({ connectionString });
  }

  return pool;
}

function clampSeconds(value: unknown) {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    return 0;
  }

  return Math.max(0, Math.min(900, Math.round(value)));
}

function sanitizeText(value: string, maxLength: number) {
  return value.trim().slice(0, maxLength);
}

function toNumber(value: number | string | null | undefined) {
  if (typeof value === "number") {
    return Number.isFinite(value) ? value : 0;
  }

  if (typeof value === "string") {
    const parsed = Number(value);

    return Number.isFinite(parsed) ? parsed : 0;
  }

  return 0;
}
