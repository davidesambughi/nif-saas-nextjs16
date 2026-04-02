CREATE TYPE "public"."ai_review_status" AS ENUM('pending', 'approved', 'flagged', 'error');--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "deadline_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "order_documents" ADD COLUMN "ai_review_status" "ai_review_status" DEFAULT 'pending' NOT NULL;--> statement-breakpoint
ALTER TABLE "order_documents" ADD COLUMN "ai_review_notes" text;