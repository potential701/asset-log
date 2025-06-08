ALTER TABLE "issue" DROP CONSTRAINT "issue_asset_id_asset_id_fk";
--> statement-breakpoint
ALTER TABLE "log" DROP CONSTRAINT "log_asset_id_asset_id_fk";
--> statement-breakpoint
ALTER TABLE "issue" ADD CONSTRAINT "issue_asset_id_asset_id_fk" FOREIGN KEY ("asset_id") REFERENCES "public"."asset"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "log" ADD CONSTRAINT "log_asset_id_asset_id_fk" FOREIGN KEY ("asset_id") REFERENCES "public"."asset"("id") ON DELETE cascade ON UPDATE no action;