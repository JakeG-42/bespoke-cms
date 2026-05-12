import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-postgres'

const unusedTemplateHandles = sql`('signal-landing', 'demo-company-site')`

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    UPDATE "payload"."theme_settings"
    SET
      "active_template_id" = (SELECT "id" FROM "payload"."page_templates" WHERE "handle" = 'andersen-help-centre-page' LIMIT 1),
      "updated_at" = now()
    WHERE "active_template_id" IN (
      SELECT "id" FROM "payload"."page_templates" WHERE "handle" IN ${unusedTemplateHandles}
    );

    UPDATE "payload"."pages"
    SET
      "page_template_id" = (SELECT "id" FROM "payload"."page_templates" WHERE "handle" = 'andersen-help-centre-page' LIMIT 1),
      "updated_at" = now()
    WHERE "page_template_id" IN (
      SELECT "id" FROM "payload"."page_templates" WHERE "handle" IN ${unusedTemplateHandles}
    );

    DELETE FROM "payload"."page_templates"
    WHERE "handle" IN ${unusedTemplateHandles};
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    INSERT INTO "payload"."page_templates" (
      "name",
      "handle",
      "status",
      "description",
      "theme_id",
      "builder_data",
      "updated_at",
      "created_at"
    )
    VALUES
      (
        'Signal Landing',
        'signal-landing',
        'draft',
        'Removed unused starter page template.',
        (SELECT "id" FROM "payload"."themes" WHERE "handle" = 'signal-light' LIMIT 1),
        '{"content":[],"root":{"props":{"pageTitle":"Signal Landing"}},"zones":{}}'::jsonb,
        now(),
        now()
      ),
      (
        'Demo Company Site',
        'demo-company-site',
        'draft',
        'Removed unused demo page template.',
        NULL,
        '{"content":[],"root":{"props":{"pageTitle":"Demo Company Site"}},"zones":{}}'::jsonb,
        now(),
        now()
      )
    ON CONFLICT ("handle") DO NOTHING;
  `)
}
