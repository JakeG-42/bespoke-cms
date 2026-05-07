import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-postgres'

import helpCentreContent from '../payload/builder/help-centre-faq-content.json'

type HelpSection = {
  anchor: string
  articles: {
    body?: string
    sourceUrl?: string
    status?: 'draft' | 'needsConfirmation' | 'ready'
    summary?: string
    title: string
  }[]
  heading: string
  eyebrow?: string
  icon?: string
  intro?: string
}

const sections = helpCentreContent.sections as HelpSection[]

function slugify(value: string | undefined) {
  const slug = (value ?? '')
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 96)

  return slug || 'article'
}

const rootProps = {
  accentColor: '#355b45',
  backgroundColor: '#ffffff',
  fontFamily: 'sans',
  pagePaddingBottom: 0,
  pagePaddingTop: 0,
  sectionSpacing: 'normal',
  surfaceColor: '255, 255, 255',
  surfaceOpacity: 0.95,
  textColor: '#161b18',
  themeHandle: 'andersen-help-centre',
  themeId: 'andersen-help-centre',
  themeName: 'Andersen Help Centre',
  themePreset: 'andersenEV',
}

const headerBlock = {
  type: 'SiteHeaderBlock',
  props: {
    id: 'andersen-template-header',
    brandImageAlt: 'Andersen EV',
    brandImageUrl: 'https://andersen-ev.com/cdn/shop/files/Untitled_design_31.png?v=1672740204&width=240',
    brandLabel: 'ANDERSEN EV',
    ctaLabel: 'COMPARE MODELS',
    ctaUrl: '/charge-points',
    fullWidth: true,
    menuHandle: 'main-navigation',
    searchUrl: '#search',
    showSearchIcon: true,
    showTopBar: false,
    showUserIcon: true,
    sticky: true,
    userUrl: '#account',
  },
}

const categoryTemplateBuilderData = {
  content: [
    headerBlock,
    {
      type: 'HelpCategoryArticlesBlock',
      props: {
        id: 'help-category-articles-template',
        backLabel: 'Back to Help Centre',
        emptyMessage: 'Articles are being prepared for this category.',
        heading: '',
        intro: '',
        sectionWidth: 'wide',
        showBackLink: true,
      },
    },
  ],
  root: {
    props: {
      ...rootProps,
      pageTitle: 'Help category template',
    },
  },
  zones: {},
}

const articleTemplateBuilderData = {
  content: [
    headerBlock,
    {
      type: 'HelpArticleContentBlock',
      props: {
        id: 'help-article-content-template',
        backLabel: 'Back to category',
        emptyMessage: 'Article content is being prepared.',
        sectionWidth: 'narrow',
        showBackLink: true,
        showSourceUrl: true,
      },
    },
  ],
  root: {
    props: {
      ...rootProps,
      pageTitle: 'Help article template',
    },
  },
  zones: {},
}

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    CREATE TYPE "payload"."enum_help_categories_icon" AS ENUM('product', 'support', 'installation', 'howTo', 'troubleshooting', 'installers', 'setup');
    CREATE TYPE "payload"."enum_help_categories_status" AS ENUM('draft', 'published');
    CREATE TYPE "payload"."enum_help_articles_review_status" AS ENUM('ready', 'draft', 'needsConfirmation');
    CREATE TYPE "payload"."enum_help_articles_status" AS ENUM('draft', 'published');

    CREATE TABLE "payload"."help_categories" (
      "id" serial PRIMARY KEY NOT NULL,
      "title" varchar NOT NULL,
      "slug" varchar NOT NULL,
      "description" varchar NOT NULL,
      "icon" "payload"."enum_help_categories_icon" DEFAULT 'support' NOT NULL,
      "sort_order" numeric DEFAULT 100 NOT NULL,
      "status" "payload"."enum_help_categories_status" DEFAULT 'draft' NOT NULL,
      "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
      "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
    );

    CREATE TABLE "payload"."help_articles" (
      "id" serial PRIMARY KEY NOT NULL,
      "title" varchar NOT NULL,
      "slug" varchar NOT NULL,
      "category_id" integer NOT NULL,
      "summary" varchar NOT NULL,
      "body" varchar NOT NULL,
      "source_url" varchar,
      "review_status" "payload"."enum_help_articles_review_status" DEFAULT 'draft' NOT NULL,
      "sort_order" numeric DEFAULT 100 NOT NULL,
      "status" "payload"."enum_help_articles_status" DEFAULT 'draft' NOT NULL,
      "seo_title" varchar,
      "seo_description" varchar,
      "seo_image_id" integer,
      "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
      "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
    );

    ALTER TABLE "payload"."payload_locked_documents_rels" ADD COLUMN "help_categories_id" integer;
    ALTER TABLE "payload"."payload_locked_documents_rels" ADD COLUMN "help_articles_id" integer;

    ALTER TABLE "payload"."help_articles" ADD CONSTRAINT "help_articles_category_id_help_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "payload"."help_categories"("id") ON DELETE set null ON UPDATE no action;
    ALTER TABLE "payload"."help_articles" ADD CONSTRAINT "help_articles_seo_image_id_media_id_fk" FOREIGN KEY ("seo_image_id") REFERENCES "payload"."media"("id") ON DELETE set null ON UPDATE no action;
    ALTER TABLE "payload"."payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_help_categories_fk" FOREIGN KEY ("help_categories_id") REFERENCES "payload"."help_categories"("id") ON DELETE cascade ON UPDATE no action;
    ALTER TABLE "payload"."payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_help_articles_fk" FOREIGN KEY ("help_articles_id") REFERENCES "payload"."help_articles"("id") ON DELETE cascade ON UPDATE no action;

    CREATE UNIQUE INDEX "help_categories_slug_idx" ON "payload"."help_categories" USING btree ("slug");
    CREATE INDEX "help_categories_status_idx" ON "payload"."help_categories" USING btree ("status");
    CREATE INDEX "help_categories_sort_order_idx" ON "payload"."help_categories" USING btree ("sort_order");
    CREATE INDEX "help_categories_updated_at_idx" ON "payload"."help_categories" USING btree ("updated_at");
    CREATE INDEX "help_categories_created_at_idx" ON "payload"."help_categories" USING btree ("created_at");
    CREATE UNIQUE INDEX "help_articles_slug_idx" ON "payload"."help_articles" USING btree ("slug");
    CREATE INDEX "help_articles_category_idx" ON "payload"."help_articles" USING btree ("category_id");
    CREATE INDEX "help_articles_status_idx" ON "payload"."help_articles" USING btree ("status");
    CREATE INDEX "help_articles_review_status_idx" ON "payload"."help_articles" USING btree ("review_status");
    CREATE INDEX "help_articles_sort_order_idx" ON "payload"."help_articles" USING btree ("sort_order");
    CREATE INDEX "help_articles_seo_seo_image_idx" ON "payload"."help_articles" USING btree ("seo_image_id");
    CREATE INDEX "help_articles_updated_at_idx" ON "payload"."help_articles" USING btree ("updated_at");
    CREATE INDEX "help_articles_created_at_idx" ON "payload"."help_articles" USING btree ("created_at");
    CREATE INDEX "payload_locked_documents_rels_help_categories_id_idx" ON "payload"."payload_locked_documents_rels" USING btree ("help_categories_id");
    CREATE INDEX "payload_locked_documents_rels_help_articles_id_idx" ON "payload"."payload_locked_documents_rels" USING btree ("help_articles_id");
  `)

  for (const [sectionIndex, section] of sections.entries()) {
    await db.execute(sql`
      INSERT INTO "payload"."help_categories" (
        "title",
        "slug",
        "description",
        "icon",
        "sort_order",
        "status"
      )
      VALUES (
        ${section.eyebrow ?? section.heading.replace(/ help$/i, '')},
        ${section.anchor},
        ${section.intro ?? ''},
        CAST(${section.icon ?? 'support'} AS "payload"."enum_help_categories_icon"),
        ${sectionIndex + 1},
        'published'
      )
      ON CONFLICT ("slug") DO UPDATE SET
        "title" = EXCLUDED."title",
        "description" = EXCLUDED."description",
        "icon" = EXCLUDED."icon",
        "sort_order" = EXCLUDED."sort_order",
        "status" = EXCLUDED."status",
        "updated_at" = now();
    `)

    for (const [articleIndex, article] of section.articles.entries()) {
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
          ${slugify(article.title)},
          (SELECT "id" FROM "payload"."help_categories" WHERE "slug" = ${section.anchor} LIMIT 1),
          ${article.summary ?? ''},
          ${article.body ?? ''},
          ${article.sourceUrl ?? null},
          CAST(${article.status ?? 'draft'} AS "payload"."enum_help_articles_review_status"),
          ${(sectionIndex + 1) * 100 + articleIndex + 1},
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

  await db.execute(sql`
    INSERT INTO "payload"."pages" (
      "title",
      "slug",
      "summary",
      "status",
      "theme_id",
      "builder_data"
    )
    VALUES
      (
        'Help Category Template',
        'templates/help-category',
        'Reusable WYSIWYG layout for Help Centre category pages.',
        'published',
        COALESCE(
          (SELECT "id" FROM "payload"."themes" WHERE "handle" = 'andersen-help-centre' LIMIT 1),
          (SELECT "id" FROM "payload"."themes" WHERE "is_default" = true LIMIT 1)
        ),
        CAST(${JSON.stringify(categoryTemplateBuilderData)} AS jsonb)
      ),
      (
        'Help Article Template',
        'templates/help-article',
        'Reusable WYSIWYG layout for Help Centre article pages.',
        'published',
        COALESCE(
          (SELECT "id" FROM "payload"."themes" WHERE "handle" = 'andersen-help-centre' LIMIT 1),
          (SELECT "id" FROM "payload"."themes" WHERE "is_default" = true LIMIT 1)
        ),
        CAST(${JSON.stringify(articleTemplateBuilderData)} AS jsonb)
      )
    ON CONFLICT ("slug") DO UPDATE SET
      "title" = EXCLUDED."title",
      "summary" = EXCLUDED."summary",
      "status" = EXCLUDED."status",
      "theme_id" = EXCLUDED."theme_id",
      "builder_data" = EXCLUDED."builder_data",
      "updated_at" = now();
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    DELETE FROM "payload"."pages" WHERE "slug" IN ('templates/help-category', 'templates/help-article');
    DELETE FROM "payload"."help_articles";
    DELETE FROM "payload"."help_categories";

    ALTER TABLE "payload"."payload_locked_documents_rels" DROP CONSTRAINT IF EXISTS "payload_locked_documents_rels_help_articles_fk";
    ALTER TABLE "payload"."payload_locked_documents_rels" DROP CONSTRAINT IF EXISTS "payload_locked_documents_rels_help_categories_fk";
    ALTER TABLE "payload"."help_articles" DROP CONSTRAINT IF EXISTS "help_articles_seo_image_id_media_id_fk";
    ALTER TABLE "payload"."help_articles" DROP CONSTRAINT IF EXISTS "help_articles_category_id_help_categories_id_fk";

    DROP INDEX IF EXISTS "payload"."payload_locked_documents_rels_help_articles_id_idx";
    DROP INDEX IF EXISTS "payload"."payload_locked_documents_rels_help_categories_id_idx";
    DROP INDEX IF EXISTS "payload"."help_articles_created_at_idx";
    DROP INDEX IF EXISTS "payload"."help_articles_updated_at_idx";
    DROP INDEX IF EXISTS "payload"."help_articles_seo_seo_image_idx";
    DROP INDEX IF EXISTS "payload"."help_articles_sort_order_idx";
    DROP INDEX IF EXISTS "payload"."help_articles_review_status_idx";
    DROP INDEX IF EXISTS "payload"."help_articles_status_idx";
    DROP INDEX IF EXISTS "payload"."help_articles_category_idx";
    DROP INDEX IF EXISTS "payload"."help_articles_slug_idx";
    DROP INDEX IF EXISTS "payload"."help_categories_created_at_idx";
    DROP INDEX IF EXISTS "payload"."help_categories_updated_at_idx";
    DROP INDEX IF EXISTS "payload"."help_categories_sort_order_idx";
    DROP INDEX IF EXISTS "payload"."help_categories_status_idx";
    DROP INDEX IF EXISTS "payload"."help_categories_slug_idx";

    ALTER TABLE "payload"."payload_locked_documents_rels" DROP COLUMN IF EXISTS "help_articles_id";
    ALTER TABLE "payload"."payload_locked_documents_rels" DROP COLUMN IF EXISTS "help_categories_id";
    DROP TABLE IF EXISTS "payload"."help_articles" CASCADE;
    DROP TABLE IF EXISTS "payload"."help_categories" CASCADE;
    DROP TYPE IF EXISTS "payload"."enum_help_articles_status";
    DROP TYPE IF EXISTS "payload"."enum_help_articles_review_status";
    DROP TYPE IF EXISTS "payload"."enum_help_categories_status";
    DROP TYPE IF EXISTS "payload"."enum_help_categories_icon";
  `)
}
