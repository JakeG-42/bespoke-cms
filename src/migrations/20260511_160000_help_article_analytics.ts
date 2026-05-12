import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    CREATE TYPE "payload"."enum_help_article_analytics_helpful_vote" AS ENUM('helpful', 'notHelpful');

    CREATE TABLE "payload"."help_article_analytics" (
      "id" serial PRIMARY KEY NOT NULL,
      "article_path" varchar NOT NULL,
      "article_title" varchar NOT NULL,
      "category_slug" varchar NOT NULL,
      "browser_id" varchar NOT NULL,
      "views" numeric DEFAULT 0 NOT NULL,
      "total_seconds" numeric DEFAULT 0 NOT NULL,
      "helpful_vote" "payload"."enum_help_article_analytics_helpful_vote",
      "last_viewed_at" timestamp(3) with time zone,
      "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
      "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
    );

    CREATE UNIQUE INDEX "help_article_analytics_article_browser_idx"
      ON "payload"."help_article_analytics" USING btree ("article_path", "browser_id");
    CREATE INDEX "help_article_analytics_article_path_idx" ON "payload"."help_article_analytics" USING btree ("article_path");
    CREATE INDEX "help_article_analytics_category_slug_idx" ON "payload"."help_article_analytics" USING btree ("category_slug");
    CREATE INDEX "help_article_analytics_browser_id_idx" ON "payload"."help_article_analytics" USING btree ("browser_id");
    CREATE INDEX "help_article_analytics_updated_at_idx" ON "payload"."help_article_analytics" USING btree ("updated_at");
    CREATE INDEX "help_article_analytics_created_at_idx" ON "payload"."help_article_analytics" USING btree ("created_at");
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    DROP INDEX IF EXISTS "payload"."help_article_analytics_created_at_idx";
    DROP INDEX IF EXISTS "payload"."help_article_analytics_updated_at_idx";
    DROP INDEX IF EXISTS "payload"."help_article_analytics_browser_id_idx";
    DROP INDEX IF EXISTS "payload"."help_article_analytics_category_slug_idx";
    DROP INDEX IF EXISTS "payload"."help_article_analytics_article_path_idx";
    DROP INDEX IF EXISTS "payload"."help_article_analytics_article_browser_idx";
    DROP TABLE IF EXISTS "payload"."help_article_analytics" CASCADE;
    DROP TYPE IF EXISTS "payload"."enum_help_article_analytics_helpful_vote";
  `)
}
