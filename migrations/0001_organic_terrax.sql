CREATE TYPE "public"."asset_conditions" AS ENUM('good', 'damaged', 'broken');--> statement-breakpoint
CREATE TYPE "public"."asset_statuses" AS ENUM('available', 'busy', 'maintenance', 'decommissioned');--> statement-breakpoint
CREATE TYPE "public"."asset_types" AS ENUM('scanner', 'radio', 'laptop', 'other');--> statement-breakpoint
CREATE TABLE "asset" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "asset_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"name" text NOT NULL,
	"type" "asset_types" NOT NULL,
	"serial_number" text NOT NULL,
	"status" "asset_statuses" DEFAULT 'available' NOT NULL,
	"created_at" timestamp with time zone,
	"updated_at" timestamp with time zone,
	CONSTRAINT "asset_name_unique" UNIQUE("name"),
	CONSTRAINT "asset_serial_number_unique" UNIQUE("serial_number")
);
--> statement-breakpoint
CREATE TABLE "issue" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "issue_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"asset_id" integer NOT NULL,
	"user_id" integer NOT NULL,
	"reported_at" timestamp with time zone,
	"description" text NOT NULL,
	"is_resolved" boolean DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE TABLE "log" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "log_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"asset_id" integer NOT NULL,
	"user_id" integer NOT NULL,
	"checked_out_at" timestamp with time zone,
	"checked_in_at" timestamp with time zone,
	"return_condition" "asset_conditions"
);
--> statement-breakpoint
ALTER TABLE "issue" ADD CONSTRAINT "issue_asset_id_asset_id_fk" FOREIGN KEY ("asset_id") REFERENCES "public"."asset"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "issue" ADD CONSTRAINT "issue_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "log" ADD CONSTRAINT "log_asset_id_asset_id_fk" FOREIGN KEY ("asset_id") REFERENCES "public"."asset"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "log" ADD CONSTRAINT "log_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;