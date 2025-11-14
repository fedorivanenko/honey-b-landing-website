CREATE TABLE "contacts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"full_name" varchar(255) NOT NULL,
	"email" varchar(255) NOT NULL,
	"organization" varchar(255),
	"message" varchar(2000),
	"idempotency_key" text NOT NULL,
	CONSTRAINT "contacts_idempotency_key_unique" UNIQUE("idempotency_key")
);
