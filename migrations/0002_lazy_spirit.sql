ALTER TABLE "asset" ALTER COLUMN "created_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "asset" ALTER COLUMN "created_at" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "issue" ALTER COLUMN "reported_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "issue" ALTER COLUMN "reported_at" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "log" ALTER COLUMN "checked_out_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "log" ALTER COLUMN "checked_out_at" SET NOT NULL;