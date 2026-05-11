import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-postgres'

const placeholderBody = `This is a demo article page used as a placeholder until the final Andersen Help Centre content is created. The page exists now so the featured Help Centre buttons can link to editable articles in the console, and the support team can replace this copy when the real content is ready.

For now, this article uses lorem ipsum content to demonstrate the article layout, related articles, categories sidebar and long-form reading experience.

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer posuere, nibh vitae facilisis faucibus, neque sapien lacinia justo, vitae finibus arcu augue sed mi. Suspendisse potenti. Praesent luctus, magna sed laoreet tincidunt, lectus velit commodo erat, in fermentum nibh neque vitae sapien. Donec tempor arcu at sem pretium, non dignissim eros fermentum. Curabitur non augue id mauris feugiat accumsan. Vivamus consequat justo sed massa bibendum, sed ullamcorper mi gravida. Sed at velit vitae purus facilisis convallis.`

const placeholders = [
  {
    categorySlug: 'installation',
    slug: 'installation-what-to-expect',
    sortOrder: 90,
    summary: 'Demo placeholder for the installation journey article.',
    title: 'Installation - what to expect',
  },
  {
    categorySlug: 'how-do-i',
    slug: 'your-first-charge',
    sortOrder: 90,
    summary: 'Demo placeholder for the first charge article.',
    title: 'Your First Charge',
  },
  {
    categorySlug: 'troubleshooting',
    slug: 'charger-is-offline',
    sortOrder: 90,
    summary: 'Demo placeholder for the offline charger troubleshooting article.',
    title: 'Charger is offline',
  },
  {
    categorySlug: 'how-do-i',
    slug: 'how-to-schedule-charging',
    sortOrder: 91,
    summary: 'Demo placeholder for the scheduled charging article.',
    title: 'How to Schedule charging',
  },
] as const

export async function up({ db }: MigrateUpArgs): Promise<void> {
  for (const article of placeholders) {
    await db.execute(sql`
      INSERT INTO "payload"."help_articles" (
        "title",
        "slug",
        "category_id",
        "summary",
        "body",
        "source_url",
        "review_status",
        "sort_order",
        "status"
      )
      VALUES (
        ${article.title},
        ${article.slug},
        (SELECT "id" FROM "payload"."help_categories" WHERE "slug" = ${article.categorySlug} LIMIT 1),
        ${article.summary},
        ${placeholderBody},
        ${null},
        'draft',
        ${article.sortOrder},
        'published'
      )
      ON CONFLICT ("slug") DO UPDATE SET
        "title" = EXCLUDED."title",
        "category_id" = EXCLUDED."category_id",
        "summary" = EXCLUDED."summary",
        "body" = EXCLUDED."body",
        "source_url" = EXCLUDED."source_url",
        "review_status" = EXCLUDED."review_status",
        "sort_order" = EXCLUDED."sort_order",
        "status" = EXCLUDED."status",
        "updated_at" = now();
    `)
  }
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    DELETE FROM "payload"."help_articles"
    WHERE "slug" IN (
      'installation-what-to-expect',
      'your-first-charge',
      'charger-is-offline',
      'how-to-schedule-charging'
    );
  `)
}
