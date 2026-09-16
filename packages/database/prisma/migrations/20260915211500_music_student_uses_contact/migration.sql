-- Every MusicStudent row has been backfilled with a linked Contact
-- (see the app-level backfill run before this migration) — safe to
-- tighten contactId to required and drop the now-duplicated columns.

-- AlterTable
ALTER TABLE "public"."MusicStudent" ALTER COLUMN "contactId" SET NOT NULL;

ALTER TABLE "public"."MusicStudent" DROP COLUMN "firstName";
ALTER TABLE "public"."MusicStudent" DROP COLUMN "lastName";
ALTER TABLE "public"."MusicStudent" DROP COLUMN "email";
ALTER TABLE "public"."MusicStudent" DROP COLUMN "phone";
