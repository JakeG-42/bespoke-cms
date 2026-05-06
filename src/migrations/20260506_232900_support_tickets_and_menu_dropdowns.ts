import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
  CREATE TYPE "payload"."enum_support_tickets_status" AS ENUM('new', 'in_review', 'waiting_for_customer', 'resolved');
  CREATE TYPE "payload"."enum_support_tickets_category" AS ENUM('wifi_connectivity', 'app_issue', 'charging_not_starting', 'charging_speed_load_management', 'solar_ct_energy_readings', 'cable_plug_issue', 'installation_issue', 'warranty_hardware_fault', 'order_delivery_sales', 'general_enquiry');
  CREATE TYPE "payload"."enum_support_tickets_priority" AS ENUM('low', 'medium', 'high');
  CREATE TYPE "payload"."enum_support_tickets_complexity" AS ENUM('simple', 'medium', 'complex');

  ALTER TABLE "payload"."menus_items" ADD COLUMN "dropdown_items" varchar;

  CREATE TABLE "payload"."support_tickets" (
    "id" serial PRIMARY KEY NOT NULL,
    "title" varchar NOT NULL,
    "status" "payload"."enum_support_tickets_status" DEFAULT 'new' NOT NULL,
    "category" "payload"."enum_support_tickets_category" NOT NULL,
    "priority" "payload"."enum_support_tickets_priority" NOT NULL,
    "complexity" "payload"."enum_support_tickets_complexity" NOT NULL,
    "customer_name" varchar,
    "customer_email" varchar,
    "customer_phone" varchar,
    "customer_postcode" varchar,
    "customer_charger_model" varchar,
    "customer_serial_number" varchar,
    "customer_installer_name" varchar,
    "customer_app_version" varchar,
    "customer_phone_type" varchar,
    "summary" varchar NOT NULL,
    "escalation_reason" varchar,
    "transcript" jsonb,
    "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
    "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );

  CREATE TABLE "payload"."support_tickets_troubleshooting_steps_tried" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "id" varchar PRIMARY KEY NOT NULL,
    "step" varchar NOT NULL
  );

  ALTER TABLE "payload"."payload_locked_documents_rels" ADD COLUMN "support_tickets_id" integer;
  ALTER TABLE "payload"."support_tickets_troubleshooting_steps_tried" ADD CONSTRAINT "support_tickets_troubleshooting_steps_tried_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."support_tickets"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_support_tickets_fk" FOREIGN KEY ("support_tickets_id") REFERENCES "payload"."support_tickets"("id") ON DELETE cascade ON UPDATE no action;

  CREATE INDEX "support_tickets_status_idx" ON "payload"."support_tickets" USING btree ("status");
  CREATE INDEX "support_tickets_category_idx" ON "payload"."support_tickets" USING btree ("category");
  CREATE INDEX "support_tickets_priority_idx" ON "payload"."support_tickets" USING btree ("priority");
  CREATE INDEX "support_tickets_complexity_idx" ON "payload"."support_tickets" USING btree ("complexity");
  CREATE INDEX "support_tickets_updated_at_idx" ON "payload"."support_tickets" USING btree ("updated_at");
  CREATE INDEX "support_tickets_created_at_idx" ON "payload"."support_tickets" USING btree ("created_at");
  CREATE INDEX "support_tickets_troubleshooting_steps_tried_order_idx" ON "payload"."support_tickets_troubleshooting_steps_tried" USING btree ("_order");
  CREATE INDEX "support_tickets_troubleshooting_steps_tried_parent_id_idx" ON "payload"."support_tickets_troubleshooting_steps_tried" USING btree ("_parent_id");
  CREATE INDEX "payload_locked_documents_rels_support_tickets_id_idx" ON "payload"."payload_locked_documents_rels" USING btree ("support_tickets_id");
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
  ALTER TABLE "payload"."payload_locked_documents_rels" DROP CONSTRAINT IF EXISTS "payload_locked_documents_rels_support_tickets_fk";
  ALTER TABLE "payload"."support_tickets_troubleshooting_steps_tried" DROP CONSTRAINT IF EXISTS "support_tickets_troubleshooting_steps_tried_parent_id_fk";

  DROP INDEX IF EXISTS "payload"."payload_locked_documents_rels_support_tickets_id_idx";
  DROP INDEX IF EXISTS "payload"."support_tickets_troubleshooting_steps_tried_parent_id_idx";
  DROP INDEX IF EXISTS "payload"."support_tickets_troubleshooting_steps_tried_order_idx";
  DROP INDEX IF EXISTS "payload"."support_tickets_created_at_idx";
  DROP INDEX IF EXISTS "payload"."support_tickets_updated_at_idx";
  DROP INDEX IF EXISTS "payload"."support_tickets_complexity_idx";
  DROP INDEX IF EXISTS "payload"."support_tickets_priority_idx";
  DROP INDEX IF EXISTS "payload"."support_tickets_category_idx";
  DROP INDEX IF EXISTS "payload"."support_tickets_status_idx";

  ALTER TABLE "payload"."payload_locked_documents_rels" DROP COLUMN IF EXISTS "support_tickets_id";
  DROP TABLE IF EXISTS "payload"."support_tickets_troubleshooting_steps_tried" CASCADE;
  DROP TABLE IF EXISTS "payload"."support_tickets" CASCADE;
  ALTER TABLE "payload"."menus_items" DROP COLUMN IF EXISTS "dropdown_items";

  DROP TYPE IF EXISTS "payload"."enum_support_tickets_complexity";
  DROP TYPE IF EXISTS "payload"."enum_support_tickets_priority";
  DROP TYPE IF EXISTS "payload"."enum_support_tickets_category";
  DROP TYPE IF EXISTS "payload"."enum_support_tickets_status";
  `)
}
