CREATE EXTENSION IF NOT EXISTS "pgcrypto";

DO $$
BEGIN
    ALTER TABLE "contacts" ADD COLUMN "idempotency_key" text;
EXCEPTION
    WHEN duplicate_column THEN NULL;
END $$;

UPDATE "contacts"
SET "idempotency_key" = gen_random_uuid()::text
WHERE "idempotency_key" IS NULL;

ALTER TABLE "contacts"
ALTER COLUMN "idempotency_key" SET NOT NULL;

DO $$
BEGIN
    ALTER TABLE "contacts"
    ADD CONSTRAINT "contacts_idempotency_key_unique" UNIQUE ("idempotency_key");
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;
