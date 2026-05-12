import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "payload"."payload_locked_documents_rels"
      ADD COLUMN IF NOT EXISTS "help_article_analytics_id" integer;

    DO $$
    BEGIN
      IF NOT EXISTS (
        SELECT 1 FROM pg_constraint
        WHERE conname = 'payload_locked_documents_rels_help_article_analytics_fk'
          AND conrelid = 'payload.payload_locked_documents_rels'::regclass
      ) THEN
        ALTER TABLE "payload"."payload_locked_documents_rels"
          ADD CONSTRAINT "payload_locked_documents_rels_help_article_analytics_fk"
          FOREIGN KEY ("help_article_analytics_id")
          REFERENCES "payload"."help_article_analytics"("id")
          ON DELETE cascade ON UPDATE no action;
      END IF;
    END $$;

    CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_help_article_analytics_id_idx"
      ON "payload"."payload_locked_documents_rels" USING btree ("help_article_analytics_id");
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "payload"."payload_locked_documents_rels"
      DROP CONSTRAINT IF EXISTS "payload_locked_documents_rels_help_article_analytics_fk";

    DROP INDEX IF EXISTS "payload"."payload_locked_documents_rels_help_article_analytics_id_idx";

    ALTER TABLE "payload"."payload_locked_documents_rels"
      DROP COLUMN IF EXISTS "help_article_analytics_id";
  `)
}
